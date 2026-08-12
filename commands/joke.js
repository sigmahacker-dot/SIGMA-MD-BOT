const axios = require('axios');

module.exports = async function (sock, chatId) {
    try {
        const response = await axios.get('https://icanhazdadjoke.com/', {
            headers: { Accept: 'application/json' }
        });
        const joke = response.data.joke;
        const text = `😂 *𝐒𝐈𝐆𝐌𝐀 𝐉𝐎𝐊𝐄* 😂\n\n${joke}\n\n> © 𝐒𝐈𝐆𝐌𝐀 𝐌𝐃 𝐁𝐎𝐓`;
        await sock.sendMessage(chatId, { text });
    } catch (error) {
        console.error('Error fetching joke:', error);
        await sock.sendMessage(chatId, { text: '❌ Error: Sorry, I could not fetch a joke right now.' });
    }
};
