const axios = require('axios');

module.exports = async (sock, from, msg, isOwner, q, botData, saveBotData) => {
    if (!q) return sock.sendMessage(from, { text: "❌ Please provide a phone number or IP. Example: .lookup 923271054080" }, { quoted: msg });

    const sender = msg.key.participant || msg.key.remoteJid;
    
    // Check credits
    if (!isOwner) {
        if (!botData.userCredits[sender] || botData.userCredits[sender].coins < 10) {
            return sock.sendMessage(from, { text: "❌ You need 10 coins for a lookup. Use .coins check to see balance." }, { quoted: msg });
        }
    }

    try {
        // IP Lookup
        if (q.includes('.') && !q.includes('@')) {
            const res = await axios.get(`http://ip-api.com/json/${q}`);
            const data = res.data;
            if (data.status === 'fail') throw new Error(data.message);

            if (!isOwner) {
                botData.userCredits[sender].coins -= 10;
                saveBotData();
            }

            const text = `🌐 *IP LOOKUP RESULT*\n\n` +
                         `• IP: ${data.query}\n` +
                         `• Country: ${data.country}\n` +
                         `• Region: ${data.regionName}\n` +
                         `• City: ${data.city}\n` +
                         `• ISP: ${data.isp}\n` +
                         `• Org: ${data.org}`;
            return sock.sendMessage(from, { text }, { quoted: msg });
        }

        // Phone Lookup (Basic Info)
        const num = q.replace(/\D/g, '');
        const res = await axios.get(`https://api.siputzx.my.id/api/tools/is-wa?no=${num}`);
        
        if (!isOwner) {
            botData.userCredits[sender].coins -= 10;
            saveBotData();
        }

        const text = `📱 *NUMBER LOOKUP*\n\n` +
                     `• Number: ${num}\n` +
                     `• WhatsApp Status: ${res.data.status ? 'Registered' : 'Not Registered'}\n` +
                     `• Country: ${num.startsWith('92') ? 'Pakistan' : 'International'}\n\n` +
                     `> More detailed database access requires private owner authorization.`;
        
        return sock.sendMessage(from, { text }, { quoted: msg });

    } catch (e) {
        sock.sendMessage(from, { text: "❌ Lookup failed: " + e.message }, { quoted: msg });
    }
};
