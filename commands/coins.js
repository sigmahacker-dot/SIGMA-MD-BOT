const settings = require('../settings');
const fs = require('fs-extra');

module.exports = async (sock, from, msg, args, botData, saveBotData) => {
    const sender = msg.key.participant || msg.key.remoteJid;
    const isOwner = sender.includes(settings.ownerNumber) || sender.includes(process.env.OWNER_NUMBER);
    
    if (!botData.userCredits) botData.userCredits = {};

    const cmd = args[0]?.toLowerCase();

    if (cmd === 'add' && isOwner) {
        const target = args[1]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
        const amount = parseInt(args[2]);
        if (!target || isNaN(amount)) return sock.sendMessage(from, { text: "❌ Usage: .coins add <number> <amount>" }, { quoted: msg });
        
        if (!botData.userCredits[target]) botData.userCredits[target] = { coins: 0, premium: false };
        botData.userCredits[target].coins += amount;
        saveBotData();
        
        return sock.sendMessage(from, { text: `✅ Added ${amount} coins to ${args[1]}. Total: ${botData.userCredits[target].coins}` }, { quoted: msg });
    }

    if (cmd === 'check') {
        const credits = botData.userCredits[sender] || { coins: 0, premium: false };
        return sock.sendMessage(from, { 
            text: `💰 *YOUR WALLET*\n\n` +
                  `User: @${sender.split('@')[0]}\n` +
                  `Coins: ${credits.coins}\n` +
                  `Status: ${credits.premium ? 'PREMIUM' : 'FREE'}\n\n` +
                  `> Buy coins: 100 coins = ₹300\n` +
                  `> Contact owner to buy.`,
            mentions: [sender]
        }, { quoted: msg });
    }

    if (cmd === 'buy') {
        return sock.sendMessage(from, { 
            text: `💳 *COIN PRICING*\n\n` +
                  `• 100 Coins = ₹300\n` +
                  `• 500 Coins = ₹1200 (Save ₹300)\n` +
                  `• Premium Package = ₹1000/Month\n\n` +
                  `*How to buy?*\n` +
                  `Send a message to the owner: wa.me/${settings.ownerNumber}`,
        }, { quoted: msg });
    }

    return sock.sendMessage(from, { 
        text: `💰 *COIN SYSTEM*\n\n` +
              `.coins check - View your balance\n` +
              `.coins buy - View pricing\n` +
              `${isOwner ? '.coins add <num> <amt> - Add coins (Owner Only)' : ''}`
    }, { quoted: msg });
};
