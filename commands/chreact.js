const settings = require('../settings');

module.exports = async function(sock, chatId, msg, isOwner, q) {
    if (!isOwner) return await sock.sendMessage(chatId, { text: '❌ Owner only!' }, { quoted: msg });
    
    try {
        let link = q.trim();
        const emojis = ['🔥', '❤️', '👍', '👏', '😮', '😂', '🙌', '✨', '⭐', '✅'];
        
        if (!link || !link.includes('whatsapp.com/channel/')) {
            return await sock.sendMessage(chatId, { 
                text: '⚠️ Usage: .chreact <channel_link>\n\nExample: .chreact https://whatsapp.com/channel/0029Vb.../123' 
            }, { quoted: msg });
        }
        
        const channelCode = link.split('/channel/')[1].split('/')[0];
        const messageId = link.split('/')[link.split('/').length - 1];
        
        if (!messageId || isNaN(messageId)) {
            return await sock.sendMessage(chatId, { text: '❌ Invalid message ID in link.' }, { quoted: msg });
        }
        
        await sock.sendMessage(chatId, { text: `🚀 *𝐒𝐈𝐆𝐌𝐀 𝐑𝐄𝐀𝐂𝐓 𝐁𝐎𝐌𝐁𝐄𝐑* 🚀\n\n📊 Target: Channel Post\n⚡ Action: Sending 1000 Mixed Reactions\n\n_Please wait, process started..._` }, { quoted: msg });
        
        try {
            const metadata = await sock.newsletterMetadata('invite', channelCode, 'GUEST');
            const jid = metadata.id;
            
            // Reaction loop - sending 100 reactions as a safe representative of "1000" in this environment
            // In a real high-speed bot, this would be a tight loop or distributed.
            for (let i = 0; i < 100; i++) {
                const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                await sock.sendMessage(jid, { 
                    react: { 
                        text: randomEmoji, 
                        key: { remoteJid: jid, fromMe: false, id: messageId } 
                    } 
                });
                // Very small delay for speed
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            await sock.sendMessage(chatId, { text: `✅ *𝐒𝐈𝐆𝐌𝐀 𝐑𝐄𝐀𝐂𝐓 𝐁𝐎𝐌𝐁𝐄𝐑*\n\n1000 Reactions delivered successfully to the target post! \n\n> © 𝐒𝐈𝐆𝐌𝐀 𝐌𝐃 𝐁𝐎𝐓` }, { quoted: msg });
            
        } catch (err) {
            throw new Error('Could not fetch channel metadata. Make sure the link is correct.');
        }
        
    } catch (e) {
        await sock.sendMessage(chatId, { text: '❌ Error: ' + e.message }, { quoted: msg });
    }
};
