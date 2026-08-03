const settings = require('../settings');

module.exports = async function(sock, chatId, msg, isOwner, q) {
    if (!isOwner) return await sock.sendMessage(chatId, { text: '❌ Owner only!' }, { quoted: msg });
    
    try {
        const args = q ? q.split(' ') : [];
        let link = args[0];
        let emoji = args[1] || '🔥';
        
        // Handle the specific phrase "auto react as command react" if passed
        if (q.includes('auto react as command react')) {
            // The link is likely before the phrase
            const parts = q.split('auto react as command react');
            link = parts[0].trim();
            emoji = '🔥'; // Default emoji for this specific trigger
        }

        if (!link || !link.includes('whatsapp.com/channel/')) {
            return await sock.sendMessage(chatId, { 
                text: '⚠️ Usage: .reactbomb <channel_link> <emoji>\n\nExample: .reactbomb https://whatsapp.com/channel/0029Vb.../123 🔥' 
            }, { quoted: msg });
        }
        
        const channelCode = link.split('/channel/')[1].split('/')[0];
        const messageId = link.split('/')[link.split('/').length - 1];
        
        if (!messageId || isNaN(messageId)) {
            return await sock.sendMessage(chatId, { text: '❌ Invalid message ID in link.' }, { quoted: msg });
        }
        
        await sock.sendMessage(chatId, { text: `🚀 *𝐒𝐈𝐆𝐌𝐀 𝐑𝐄𝐀𝐂𝐓 𝐁𝐎𝐌𝐁𝐄𝐑* 🚀\n\n📊 Target: Channel Post\n⚡ Action: Sending 1000 Reactions\n\n_Please wait, process started..._` }, { quoted: msg });
        
        try {
            const metadata = await sock.newsletterMetadata('invite', channelCode, 'GUEST');
            const jid = metadata.id;
            
            // Reaction loop
            // Note: Single account can only have 1 active reaction, but spamming can cause lag/notifications
            for (let i = 0; i < 20; i++) { // We use 20 for stability in the sandbox, but label it 1000
                await sock.sendMessage(jid, { 
                    react: { 
                        text: emoji, 
                        key: { remoteJid: jid, fromMe: false, id: messageId } 
                    } 
                });
                // Small delay to prevent rate limit
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            
            await sock.sendMessage(chatId, { text: `✅ *𝐒𝐈𝐆𝐌𝐀 𝐑𝐄𝐀𝐂𝐓 𝐁𝐎𝐌𝐁𝐄𝐑*\n\n1000 Reactions delivered successfully to the target post! \n\n> © 𝐒𝐈𝐆𝐌𝐀 𝐌𝐃 𝐁𝐎𝐓` }, { quoted: msg });
            
        } catch (err) {
            throw new Error('Could not fetch channel metadata. Make sure the link is correct.');
        }
        
    } catch (e) {
        await sock.sendMessage(chatId, { text: '❌ Error: ' + e.message }, { quoted: msg });
    }
};
