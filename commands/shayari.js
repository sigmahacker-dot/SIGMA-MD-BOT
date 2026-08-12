const settings = require('../settings');

const shayaris = [
    "Khuda ki mohabbat ko fanaa kaun karega,\nSabhi nek ban gaye to gunaah kaun karega,\nAye khuda mere doston ko salaamat rakhna,\nWarna meri shaadi mein 'Lungi Dance' kaun karega!",
    "Zindagi mein hamesha haste raho,\nHaste rehne se tension dur hoti hai,\nWarna tension se to shakal bhi,\n'Bhalu' jaisi ho jati hai!",
    "Ishq mein hum tumhe kya batayein,\nKis kadar chot khaye hue hain,\nKal maara tha baap ne uske,\nAaj bhai bhi aaye hue hain!",
    "Arz kiya hai...\nLog poochte hain humse ki tum itna kyun haste ho,\nHumne muskura kar kaha...\nHum haste hain taaki duniya ko pata na chale ki hum 'Single' hain!",
    "Dil mein dard, aankhon mein aansu,\nJeib mein paise nahi aur sar pe udhaar,\nYahi hai aaj kal ke aashiq ka haal,\nAur wo kehta hai 'Mujhe hai tumse pyaar'!"
];

module.exports = async function(sock, chatId, msg) {
    const randomShayari = shayaris[Math.floor(Math.random() * shayaris.length)];
    const text = `🎭 *𝐒𝐈𝐆𝐌𝐀 𝐒𝐇𝐀𝐘𝐀𝐑𝐈* 🎭\n\n${randomShayari}\n\n> © 𝐒𝐈𝐆𝐌𝐀 𝐌𝐃 𝐁𝐎𝐓`;
    await sock.sendMessage(chatId, { text }, { quoted: msg });
};
