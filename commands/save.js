const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

async function saveCommand(sock, from, msg) {
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    if (!quoted) return await sock.sendMessage(from, { text: "❌ Please reply to a status or message to save it." }, { quoted: msg });

    let type = Object.keys(quoted)[0];
    if (['imageMessage', 'videoMessage', 'audioMessage', 'documentMessage'].includes(type)) {
        try {
            const stream = await downloadContentFromMessage(quoted[type], type.replace('Message', ''));
            let buffer = Buffer.from([]);
            for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
            
            const caption = `✅ *STATUS SAVED BY EVIL HACKER MD*`;
            
            if (type === 'imageMessage') {
                await sock.sendMessage(from, { image: buffer, caption }, { quoted: msg });
            } else if (type === 'videoMessage') {
                await sock.sendMessage(from, { video: buffer, caption }, { quoted: msg });
            } else if (type === 'audioMessage') {
                await sock.sendMessage(from, { audio: buffer, mimetype: quoted[type].mimetype || 'audio/mp4' }, { quoted: msg });
            } else if (type === 'documentMessage') {
                await sock.sendMessage(from, { document: buffer, mimetype: quoted[type].mimetype, fileName: quoted[type].fileName || 'saved_file' }, { quoted: msg });
            }
        } catch (e) {
            await sock.sendMessage(from, { text: "❌ Failed to save media." }, { quoted: msg });
        }
    } else if (type === 'conversation' || type === 'extendedTextMessage') {
        const text = quoted.conversation || quoted.extendedTextMessage.text;
        await sock.sendMessage(from, { text: `📋 *SAVED TEXT:*\n\n${text}` }, { quoted: msg });
    } else {
        await sock.sendMessage(from, { text: "❌ Unsupported message type for saving." }, { quoted: msg });
    }
}

module.exports = saveCommand;
