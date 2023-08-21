const express = require('express');
const app = express();
const fetch = require('node-fetch');
const venom = require('@wppconnect-team/wppconnect');

let client; // Initialize client variable

// Initialize the Venom client
venom
    .create()
    .then((clientInstance) => {
        client = clientInstance;
        console.log('---- client initialized');
    })
    .catch((error) => {
        console.error('Error initializing Venom client:', error);
    });

// Middleware to parse JSON request body
app.use(express.json());

// Route to handle the /send_wa endpoint
app.post('/send_wa', (req, res) => {
    const { num, msg_chain } = req.body;

    // Function to send WhatsApp messages

    for (const message of msg_chain) {
        try {
            if (message.type === 'text') {
                client.sendText(num, message.msg);
            } else if (message.type === 'video') {
                client.sendVideoAsGif(num, message.attach, 'attachment', message.msg);
            }
            console.log(`Message sent to ${num}:`, message);
        } catch (error) {
            console.error(`Error sending message to ${num}:`, error);
        }
    }



    res.send('WhatsApp messages will be sent shortly');
});

// Start the server
const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Example POST request after 5 seconds of app startup
setTimeout(() => {
    const sampleData = {
        num: '918094011162@c.us',
        msg_chain: [
            {
                type: 'text',
                msg: 'This is sample text',
                attach: ''
            },
            {
                type: 'video',
                msg: '*Airport Enclave, Jharsuguda * is the most Prestigious Residential project of Western Odisha.',
                attach: '/home/ubuntu/node_exp/De.mp4'
            }
        ]
    };

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(sampleData)
    };

    fetch('http://localhost:5000/send_wa', requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error('Error sending sample POST request:', error));
}, 30000);
