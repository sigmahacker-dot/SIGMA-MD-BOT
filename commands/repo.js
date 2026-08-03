const settings = require('../settings'); // اگر settings نہیں تو اس لائن کو ہٹا دو

module.exports = async function(sock, chatId, msg, args) {
    // ── Helper: Branded send (newsletter forward) ──
    const sendMsg = async (text) => {
        return await sock.sendMessage(chatId, {
            text: text,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363207208218980@newsletter",
                    newsletterName: "𝐒𝐈𝐆𝐌𝐀 𝐌𝐃 𝐁𝐎𝐓",
                    serverMessageId: 200
                }
            }
        }, { quoted: msg });
    };

    try {
        // ── Reaction ──
        await sock.sendMessage(chatId, { react: { text: "🔗", key: msg.key } });

        // ── Heavy Box Response ──
        const response = `
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  💀  *𝐒𝐈𝐆𝐌𝐀 𝐌𝐃  —  𝐑𝐄𝐏𝐎𝐒𝐈𝐓𝐎𝐑𝐘*  💀  ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃  🔗 *Official Website*                   ┃
┃  ➤ https://github.com/sigmahacker-dot/SIGMA-MD-BOT ┃
┃  ➤ https://github.com/sigmahacker-dot/SIGMA-MD-BOT ┃
┃  ➤ https://github.com/sigmahacker-dot/SIGMA-MD-BOT ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃  📱 *Pairing Guide*                      ┃
┃  ➤ Type .pair 92XXXXXXXXXX              ┃
┃  ➤ Scan QR or enter code in WhatsApp    ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃  🚀 *Quick Connect*                      ┃
┃  ✨ .pair 923XXXXXXXXX                   ┃
┃  ⚡ Scan • Pair • Enjoy        ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃  👑 *Version*   : ${settings?.version || '3.0'}  ┃
┃  🔐 *Security*  : Premium Encrypted      ┃
┃  ☠️ *Powered by* : SIGMA MD TEAM          ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
        `;

        await sendMsg(response);

    } catch (error) {
        console.error("❌ Repo command error:", error);
        await sendMsg("⚠️ کچھ غلط ہو گیا، براہِ کرم دوبارہ کوشش کریں۔");
    }
};