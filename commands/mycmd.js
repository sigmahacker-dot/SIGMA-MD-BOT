module.exports = async function(sock, chatId, msg) {
    const text = `*\u1F4DC Your Command Stats*\n\n` +
        `Total commands used: Tracking...\n` +
        `Favorite command: .menu\n` +
        `Session active: Yes\n\n` +
        `_Keep using 𝐒𝐈𝐆𝐌𝐀 𝐌𝐃 𝐁𝐎𝐓!_`;
    
    await sock.sendMessage(chatId, { text }, { quoted: msg });
};
