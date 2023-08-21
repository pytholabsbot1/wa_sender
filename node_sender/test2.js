const { Configuration, OpenAIApi } = require("openai");
const wppconnect = require('@wppconnect-team/wppconnect');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const configuration = new Configuration({
    apiKey: "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",
});
const openai = new OpenAIApi(configuration);

const db = new sqlite3.Database('messages.db');

db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS messages (fromNumber TEXT, message TEXT, response TEXT, datetime TEXT)');
});

const storeMessage = (fromNumber, message, response) => {
    const datetime = new Date().toISOString();
    db.run('INSERT INTO messages (fromNumber, message, response, datetime) VALUES (?, ?, ?, ?)', [fromNumber, message, response, datetime]);
};

const getMessages = (fromNumber) => {
    return new Promise((resolve, reject) => {
        db.all('SELECT message, response, datetime FROM messages WHERE fromNumber = ?', [fromNumber], (error, rows) => {
            if (error) {
                reject(error);
            } else {
                resolve(rows);
            }
        });
    });
};

const getChatResponse = async (userMessage) => {
    const systemPrompt = fs.readFileSync('prompt.txt', 'utf-8').trim();
    const chatCompletion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
        ],
    });

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
                    // chat_history += `From: ${fromNumber}, Message: ${row.message}, Date: ${row.datetime}\n`;
                    chat_history += `>> User: ${row.message}\n`;
                    chat_history += `>> Assitant: ${row.response}\n`;
                });
                chat_history += `\n\nBased on message history respond to :${userMessage}`;
            } else {
                chat_history = userMessage;
            }

            // console.log(chat_history);
            const response = await getChatResponse(chat_history);
            await storeMessage(fromNumber, userMessage, response);

            client.sendText(fromNumber, response)
                .then((result) => {
                    console.log('sent bete....');
                })
                .catch((error) => {
                    console.error('Error when sending:', error);
                });
        } catch (error) {
            console.error('Error:', error);
        }
    });
};

wppconnect
    .create()
    .then(start)
    .catch((error) => {
        console.error('Error initializing Wppconnect client:', error);
    });
