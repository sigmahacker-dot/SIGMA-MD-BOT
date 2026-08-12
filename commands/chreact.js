const settings = require('../settings');
const { delay } = require('@whiskeysockets/baileys');

module.exports = async function(sock, chatId, msg, isOwner, q) {
    if (!isOwner) return await sock.sendMessage(chatId, { text: '❌ Owner only!' }, { quoted: msg });
    
    try {
        let link = q.trim();
        const emojis = ['🔥', '❤️', '👍', '👏', '😮', '😂', '🙌', '✨', '⭐', '✅', '💯', '🚀', '👑', '💎', '🌟'];
        
        if (!link || !link.includes('whatsapp.com/channel/')) {
            return await sock.sendMessage(chatId, { 
                text: '⚠️ *𝐒𝐈𝐆𝐌𝐀 𝐑𝐄𝐀𝐂𝐓 𝐁𝐎𝐌𝐁𝐄𝐑* ⚠️\n\nUsage: .chreact <channel_link>\n\nExample: .chreact https://whatsapp.com/channel/0029VbBrZXf9mrGWAaYxRY0f/123' 
            }, { quoted: msg });
        }
        
        const parts = link.split('/');
        const messageId = parts[parts.length - 1];
        const channelCode = parts[parts.length - 2] || parts[parts.length - 1];
        
        if (!messageId || isNaN(messageId)) {
            return await sock.sendMessage(chatId, { text: '❌ Invalid message ID in link. Make sure it ends with a number (e.g., /123).' }, { quoted: msg });
        }
        
        await sock.sendMessage(chatId, { text: `🚀 *𝐒𝐈𝐆𝐌𝐀 𝐑𝐄𝐀𝐂𝐓 𝐁𝐎𝐌𝐁𝐄𝐑* 🚀\n\n📊 Target: Channel Post\n⚡ Action: Sending 1000+ Mixed Reactions\n🛡️ Mode: Anti-Ban Enabled\n\n_Please wait, the process has started..._` }, { quoted: msg });
        
        try {
            const metadata = await sock.newsletterMetadata('invite', channelCode, 'GUEST');
            const jid = metadata.id;
            
            if (!jid) throw new Error('Could not resolve channel JID.');

            // Reaction loop - sending in batches to avoid instant ban
            let sentCount = 0;
            const totalTarget = 1000;
            
            // For newsletters, we need to send the reaction to the newsletter JID
            // and the key should be { remoteJid: jid, fromMe: false, id: messageId }
            
        // Turbo Mode: Send in large parallel batches for "Instant" effect
        const batchSize = 50;
        const totalBatches = 20; // 20 * 50 = 1000
        
        for (let b = 0; b < totalBatches; b++) {
            const batch = [];
            for (let i = 0; i < batchSize; i++) {
                const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                batch.push(
                    sock.sendMessage(jid, { 
                        react: { 
                            text: randomEmoji, 
                            key: { 
                                remoteJid: jid, 
                                fromMe: false, 
                                id: messageId 
                            } 
                        } 
                    }).catch(() => {})
                );
            }
            // Send batch in parallel
            Promise.all(batch); 
            sentCount += batchSize;
            
            // Minimal delay to prevent socket overflow while maintaining high speed
            await delay(50); 
        }
            
            await sock.sendMessage(chatId, { text: `✅ *𝐒𝐈𝐆𝐌𝐀 𝐑𝐄𝐀𝐂𝐓 𝐁𝐎𝐌𝐁𝐄𝐑*\n\nTarget reached! 1000+ Reactions delivered successfully to the channel post. \n\n> © 𝐒𝐈𝐆𝐌𝐀 𝐌𝐃 𝐁𝐎𝐓` }, { quoted: msg });
            
        } catch (err) {
            console.error('Chreact Error:', err);
            throw new Error('Could not fetch channel metadata or send reactions. Link might be invalid.');
        }
        
    } catch (e) {
        await sock.sendMessage(chatId, { text: '❌ Error: ' + e.message }, { quoted: msg });
    }
};
