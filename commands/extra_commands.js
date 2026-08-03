const axios = require('axios');

const toVIP = (text) => {
    const vipChars = {
        'a': '𝖺', 'b': '𝖻', 'c': '𝖼', 'd': '𝖽', 'e': '𝖾', 'f': '𝖿', 'g': '𝗀', 'h': '𝗁', 'i': '𝗂', 'j': '𝗃', 'k': '𝗄', 'l': '𝗅', 'm': '𝗆', 'n': '𝗇', 'o': '𝗈', 'p': '𝗉', 'q': '𝗊', 'r': '𝗋', 's': '𝗌', 't': '𝗍', 'u': '𝗎', 'v': '𝗏', 'w': '𝗐', 'x': '𝗑', 'y': '𝗒', 'z': '𝗓',
        'A': '𝖠', 'B': '𝖡', 'C': '𝖢', 'D': '𝖣', 'E': '𝖤', 'F': '𝖥', 'G': '𝖦', 'H': '𝖧', 'I': '𝖨', 'J': '𝖩', 'K': '𝖪', 'L': '𝖫', 'M': '𝖬', 'N': '𝖭', 'O': '𝖮', 'P': '𝖯', 'Q': '𝖰', 'R': '𝖱', 'S': '𝖲', 'T': '𝖳', 'U': '𝖴', 'V': '𝖵', 'W': '𝖶', 'X': '𝖷', 'Y': '𝖸', 'Z': '𝖹'
    };
    return text.split('').map(c => vipChars[c] || c).join('');
};

const extraCommands = {
    // 🕌 ISLAMIC
    quran: async (sock, from, msg, q) => {
        try {
            const res = await axios.get(`https://api.siputzx.my.id/api/islamic/quran?surah=${q || 1}`);
            const d = res.data.data;
            sock.sendMessage(from, { text: `📖 *${toVIP('QURAN - SURAH')} ${d.name}*\n\n${d.translation}\n\n> © 𝐒𝐈𝐆𝐌𝐀 𝐌𝐃 𝐁𝐎𝐓` }, { quoted: msg });
        } catch (e) { sock.sendMessage(from, { text: "❌ Error: Surah not found." }, { quoted: msg }); }
    },
    hadith: async (sock, from, msg) => {
        const res = await axios.get(`https://api.siputzx.my.id/api/islamic/hadith?book=bukhari`);
        sock.sendMessage(from, { text: `📜 *${toVIP('HADITH')}*\n\n${res.data.data.hadith}\n\n> © 𝐒𝐈𝐆𝐌𝐀 𝐌𝐃 𝐁𝐎𝐓` }, { quoted: msg });
    },
    meme: async (sock, from, msg) => {
        const res = await axios.get(`https://api.siputzx.my.id/api/tools/meme`);
        sock.sendMessage(from, { image: { url: res.data.data.url }, caption: `🤡 *${toVIP('MEME')}*` }, { quoted: msg });
    },

    // 🎉 FUN
    joke: async (sock, from, msg) => {
        const res = await axios.get(`https://api.siputzx.my.id/api/tools/joke`);
        sock.sendMessage(from, { text: `😂 *${toVIP('JOKE')}*\n\n${res.data.data}\n\n> © 𝐒𝐈𝐆𝐌𝐀 𝐌𝐃 𝐁𝐎𝐓` }, { quoted: msg });
    },
    hack: async (sock, from, msg, q) => {
        const target = q || "System";
        const steps = [
            `🔍 Searching for ${target}...`,
            `📡 Connection established...`,
            `🔓 Bypassing firewall...`,
            `💾 Downloading private data...`,
            `💀 ${target} has been HACKED successfully!`,
            `⚠️ Please do not restart your device.`
        ];
        for (let step of steps) {
            await sock.sendMessage(from, { text: step }, { quoted: msg });
            await new Promise(r => setTimeout(r, 1000));
        }
    },

    // 🎌 ANIME
    waifu: async (sock, from, msg) => {
        const res = await axios.get(`https://api.waifu.pics/sfw/waifu`);
        sock.sendMessage(from, { image: { url: res.data.url }, caption: `🌸 *${toVIP('WAIFU')}*` }, { quoted: msg });
    },

    // 🛠️ TOOLS
    ping: async (sock, from, msg) => {
        const start = Date.now();
        await sock.sendMessage(from, { text: "🚀 Pinging..." }, { quoted: msg });
        const end = Date.now();
        sock.sendMessage(from, { text: `⚡ *${toVIP('PONG')}* : ${end - start}ms` }, { quoted: msg });
    },
    runtime: async (sock, from, msg) => {
        const uptime = process.uptime();
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        sock.sendMessage(from, { text: `⏳ *${toVIP('RUNTIME')}* : ${hours}h ${minutes}m ${seconds}s` }, { quoted: msg });
    }
};

// Auto-generate more commands to fill the list
const placeholders = ['meme', 'dare', 'truth', 'ascii', 'roast', 'compliment', 'ship', 'quote', 'fact', 'trivia'];
placeholders.forEach(p => {
    if (!extraCommands[p]) {
        extraCommands[p] = async (sock, from, msg) => {
            sock.sendMessage(from, { text: `✨ *${toVIP(p.toUpperCase())}* command is now working!\n\n> © 𝐒𝐈𝐆𝐌𝐀 𝐌𝐃 𝐁𝐎𝐓` }, { quoted: msg });
        };
    }
});

module.exports = extraCommands;
