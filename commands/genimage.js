const axios = require('axios');

module.exports = async (sock, from, msg, isOwner, q, botData, saveBotData) => {
    if (!q) return sock.sendMessage(from, { text: "❌ Please provide a prompt. Example: .genimage a cool robot" }, { quoted: msg });

    const sender = msg.key.participant || msg.key.remoteJid;
    
    // Check credits
    if (!isOwner) {
        if (!botData.userCredits[sender] || botData.userCredits[sender].coins < 20) {
            return sock.sendMessage(from, { text: "❌ This is a premium command. You need 20 coins to generate an image. Use .coins check to see balance." }, { quoted: msg });
        }
    }

    await sock.sendMessage(from, { text: "🎨 Generating your image... Please wait." }, { quoted: msg });

    try {
        const apiUrl = `https://api.siputzx.my.id/api/ai/flux-sh?prompt=${encodeURIComponent(q)}`;
        
        // Deduct coins only after successful request initiation (or at the end)
        if (!isOwner) {
            botData.userCredits[sender].coins -= 20;
            saveBotData();
        }

        await sock.sendMessage(from, { 
            image: { url: apiUrl }, 
            caption: `✅ *Image Generated Successfully*\n\nPrompt: ${q}\nCost: 20 Coins` 
        }, { quoted: msg });

    } catch (e) {
        console.error(e);
        sock.sendMessage(from, { text: "❌ Error generating image: " + e.message }, { quoted: msg });
    }
};
