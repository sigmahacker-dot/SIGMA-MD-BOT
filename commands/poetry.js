const axios = require('axios');
const settings = require('../settings');

const poetries = [
    "Wo aaye ghar mein hamare khuda ki kudrat hai,\nKabhi hum unko, kabhi apne ghar ko dekhte hain.",
    "Hazaaron khwahishein aisi ki har khwahish pe dam nikle,\nBahut nikle mere armaan, lekin phir bhi kam nikle.",
    "Dil-e-nadaan tujhe hua kya hai,\nAakhir is dard ki dawa kya hai.",
    "Hum ko un se wafa ki hai umeed,\nJo nahi jaante wafa kya hai.",
    "Ishq ne Ghalib nikamma kar diya,\nWarna hum bhi aadmi the kaam ke."
];

module.exports = async function(sock, chatId, msg) {
    const randomPoetry = poetries[Math.floor(Math.random() * poetries.length)];
    const text = `📜 *𝐒𝐈𝐆𝐌𝐀 𝐏𝐎𝐄𝐓𝐑𝐘* 📜\n\n${randomPoetry}\n\n> © 𝐒𝐈𝐆𝐌𝐀 𝐌𝐃 𝐁𝐎𝐓`;
    await sock.sendMessage(chatId, { text }, { quoted: msg });
};
