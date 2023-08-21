const fs = require('fs');
const wppconnect = require('@wppconnect-team/wppconnect');

wppconnect.create().then((client) => start(client)).catch((error) => {
    console.log(error);
});

function start(client) {
    setTimeout(() => {
        fs.readFile('nums.txt', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return;
            }

            const numbers = data.trim().split('\n');

            numbers.forEach((number, index) => {
                const sanitizedNumber = number.trim() + "@c.us";
                // console.log(sanitizedNumber);
                const messageDelay = getRandomDelay(13000, 20000) * index;

                const msg = `
🏠 *Introducing luxurious 3BHK Duplex Villas starting at just 75 lakhs.* 

Spacious rooms, covered parking, and a serene environment await you. Limited-time offer: Become a freehold owner with only 50% payment. 

*Enquire now for exclusive benefits.* 🌟 www.airportenclave.com 🌟`;

                setTimeout(() => {
                    client.sendVideoAsGif(sanitizedNumber, '/home/ubuntu/node_exp/3bhk_ad.mp4', 'attachment', msg).then((result) => {
                        console.log('Sent : ', sanitizedNumber);
                    })
                        .catch((erro) => {
                            console.error('Error when sending: ', sanitizedNumber); //return object error
                        });
                }, messageDelay);



            });
        });
    }, 20000); // 15-second timer (15000 milliseconds)
}


function getRandomDelay(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
