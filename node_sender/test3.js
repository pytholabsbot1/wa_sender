const express = require('express');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');
const wppconnect = require('@wppconnect-team/wppconnect');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

const configuration = new Configuration({
    apiKey: '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',
});
const openai = new OpenAIApi(configuration);
var client_ = 0;
const db = new sqlite3.Database('messages.db');

db.serialize(() => {
    db.run(
        'CREATE TABLE IF NOT EXISTS messages (fromNumber TEXT, message TEXT, response TEXT, datetime TEXT)'
    );
});

const storeMessage = (fromNumber, message, response) => {
    const datetime = new Date().toISOString();
    db.run(
        'INSERT INTO messages (fromNumber, message, response, datetime) VALUES (?, ?, ?, ?)',
        [fromNumber, message, response, datetime]
    );
};

const getMessages = (fromNumber) => {
    return new Promise((resolve, reject) => {
        db.all(
            'SELECT message, response, datetime FROM messages WHERE fromNumber = ?',
            [fromNumber],
            (error, rows) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(rows);
                }
            }
        );
    });
};

const getChatResponse = async (userMessage) => {
    const systemPrompt = fs.readFileSync('prompt.txt', 'utf-8').trim();
    const chatCompletion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage },
        ],
    });

    console.log(chatCompletion.data);
    return chatCompletion.data.choices[0].message.content;
};

const start = (client) => {
    client.onMessage(async (message) => {
        const { from: fromNumber, body: userMessage } = message;

        try {
            const rows = await getMessages(fromNumber);
            let chat_history = '';
            if (rows.length > 0) {
                chat_history += `User message history:\n\n`;
                rows.forEach((row) => {
                    chat_history += `>> User: ${row.message}\n`;
                    chat_history += `>> Assistant: ${row.response}\n`;
                });
                chat_history += `\n\nBased on message history respond to: ${userMessage}`;
            } else {
                chat_history = userMessage;
            }

            const response = await getChatResponse(chat_history);
            await storeMessage(fromNumber, userMessage, response);

            client
                .sendText(fromNumber, response)
                .then((result) => {
                    console.log('Message sent:');
                })
                .catch((error) => {
                    console.error('Error when sending message:', error);
                });
        } catch (error) {
            console.error('Error:', error);
        }
    });
};

app.post('/warmup', (req, res) => {
    const { mobile } = req.body;
    const msg = `*Welcome to Airport Enclave , Jharsuguda!*

Are you searching for a dream home that combines comfort, luxury, and a connection with nature? I'd love to share more details and answer any questions you may have. Let's discuss your housing needs and find the perfect fit for you! 

Looking forward to sparking a conversation with you soon!`;

    client_.sendVideoAsGif(`${mobile}@c.us`, 'DV.mp4', 'attachment', msg);
    console.log(mobile);
    res.send("done");
});

wppconnect
    .create()
    .then((client) => {
        start(client);
        client_ = client;
        app.listen(8000, () => {
            console.log('Server started on port 8000');
        });
    })
    .catch((error) => {
        console.error('Error initializing Wppconnect client:', error);
    });
