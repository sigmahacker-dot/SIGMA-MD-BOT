const settings = require('../settings');

async function ownerCommand(sock, from, msg) {
    const ownerText = `👤 *BOT OWNER:* 𝐒𝐈𝐆𝐌𝐀 𝐎𝐖𝐍𝐄𝐑\n` +
                    `📱 *NUMBER:* +${settings.ownerNumber}\n` +
                    `🔗 *OFFICIAL WHATSAPP CHANNEL:*\n` +
                    `> *https://whatsapp.com/channel/0029Vb8UvxdGU3BTMt5lFN2t*`;
    await sock.sendMessage(from, { text: ownerText }, { quoted: msg });
}

module.exports = ownerCommand;
