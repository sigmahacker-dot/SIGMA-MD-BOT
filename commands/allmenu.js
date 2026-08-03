const settings = require('../settings');

async function allMenu(sock, from, msg, session, commands, categoryFilter = null) {
    const toVIP = (text) => {
        const vipChars = {
            'a': '𝖺', 'b': '𝖻', 'c': '𝖼', 'd': '𝖽', 'e': '𝖾', 'f': '𝖿', 'g': '𝗀', 'h': '𝗁', 'i': '𝗂', 'j': '𝗃', 'k': '𝗄', 'l': '𝗅', 'm': '𝗆', 'n': '𝗇', 'o': '𝗈', 'p': '𝗉', 'q': '𝗊', 'r': '𝗋', 's': '𝗌', 't': '𝗍', 'u': '𝗎', 'v': '𝗏', 'w': '𝗐', 'x': '𝗑', 'y': '𝗒', 'z': '𝗓',
            'A': '𝖠', 'B': '𝖡', 'C': '𝖢', 'D': '𝖣', 'E': '𝖤', 'F': '𝖥', 'G': '𝖦', 'H': '𝖧', 'I': '𝖨', 'J': '𝖩', 'K': '𝖪', 'L': '𝖫', 'M': '𝖬', 'N': '𝖭', 'O': '𝖮', 'P': '𝖯', 'Q': '𝖰', 'R': '𝖱', 'S': '𝖲', 'T': '𝖳', 'U': '𝖴', 'V': '𝖵', 'W': '𝖶', 'X': '𝖷', 'Y': '𝖸', 'Z': '𝖹'
        };
        return text.split('').map(c => vipChars[c] || c).join('');
    };

    const categories = {
        'OWNER': ['public', 'private', 'mode', 'owner', 'setname', 'block', 'unblock', 'bcgc', 'bcall', 'restart', 'shutdown', 'nuke', 'clear', 'backup', 'restore', 'clone', 'addsudo', 'delsudo', 'listsudo', 'setprefix', 'broadcast', 'self', 'autostatus', 'autoseen', 'autolike', 'autobio'],
        'GROUP': ['kick', 'add', 'promote', 'demote', 'mute', 'unmute', 'tagall', 'hidetag', 'grouplink', 'groupinfo', 'join', 'leave', 'setdesc', 'setppgc', 'getbio', 'getdp', 'accept', 'poll', 'everyonemsg', 'listonline', 'tagme', 'mention', 'kickoffline', 'snipe', 'editmsg', 'react', 'send', 'forward', 'save', 'welcome', 'goodbye', 'setwelcome', 'setgoodbye', 'antilink', 'antidelete', 'antiviewonce', 'antifake', 'antispam', 'antibug', 'anticall', 'antistatus'],
        'AI': ['ai', 'chatbot', 'gali', 'chatgpt', 'gemini', 'llama', 'deepseek', 'flux', 'pixart', 'dalle', 'bingai', 'blackbox', 'imagine', 'midjourney', 'simi', 'brainly', 'math'],
        'DOWNLOAD': ['song', 'video', 'insta', 'tiktok', 'facebook', 'youtube', 'pinterest', 'twitter', 'reddit', 'spotify', 'mf', 'apk', 'gdrive', 'ytdl', 'ytmp3', 'ytmp4', 'gitclone', 'threads', 'snapchat', 'capcut', 'terabox'],
        'TOOL': ['ping', 'dp', 'vv', 'translate', 'base64', 'qr', 'shorturl', 'calc', 'weather', 'github', 'ipinfo', 'tempmail', 'fakeinfo', 'binlookup', 'whois', 'dnslookup', 'portscan', 'screenshot', 'define', 'google', 'wiki', 'yts', 'playstore', 'npm', 'sticker', 'toimg', 'tomp3', 'tts', 'blur', 'invert', 'crop', 'flip', 'grayscale', 'removebg', 'enlarge', 'runtime', 'uptime', 'serverinfo', 'speedtest', 'device', 'pdf', 'ocr', 'remini', 'enhance', 'upscale', 'find', 'location', 'time', 'search'],
        'FUN': ['joke', 'meme', 'dare', 'truth', 'ascii', 'roast', 'compliment', 'ship', 'emojimix', 'character', 'quote', 'fact', 'trivia', 'coinflip', 'roll', 'riddle', 'wouldyourather', 'hack', 'report', 'spam', 'smsbomb', 'callbomb', 'crash', 'freeze', 'lag', 'bug', 'locspam', 'vcardspam', 'buttonspam', 'pollspam', 'contactspam', 'flirt', 'insult', 'pickup', 'tictactoe', '8ball', 'chess', 'hangman'],
        'ISLAMIC': ['quran', 'hadith', 'prayer', 'qibla', 'asmaulhusna', 'surah', 'ayat', 'tafsir', 'dua', 'azkar'],
        'ANIME': ['anime', 'manga', 'waifu', 'neko', 'shinobu', 'megumin', 'bully', 'cuddle', 'cry', 'hug', 'awoo', 'kiss', 'lick', 'pat', 'smug', 'bonk', 'yeet', 'blush', 'smile', 'wave', 'highfive', 'handhold', 'nom', 'bite', 'slap', 'kill', 'happy', 'wink', 'poke', 'dance', 'cringe'],
        'LOGO': ['neon', 'glitch', 'gold', '3dtext', 'fire', 'water', 'galaxy', 'marvel', 'avengers', 'transformer', 'blackpink', 'gradient', 'luxury', 'royal', 'metal', 'steel', 'chrome', 'glossy'],
        'PREMIUM': ['genimage', 'lookup', 'premium_ai', 'high_speed_ping', 'auto_reply_v2', 'secret_command']
    };

    const catEmojis = {
        'OWNER': '👑', 'GROUP': '👥', 'AI': '🤖', 'DOWNLOAD': '⬇️', 'TOOL': '🛠️', 'FUN': '🎉', 'ISLAMIC': '🕌', 'ANIME': '🎌', 'LOGO': '🏢', 'PREMIUM': '💎'
    };

    let menuTitle = categoryFilter ? `${catEmojis[categoryFilter]} ${categoryFilter} PANEL` : '𝐒𝐈𝐆𝐌𝐀 𝐌𝐃 𝐁𝐎𝐓';
    
    const header = `╭───  『 *${toVIP(menuTitle)}* 』  ───╮
│
│  💀 *USER:* ${msg.pushName || 'User'}
│  ⚡ *SPEED:* Ultra Fast
│  📊 *COMMANDS:* 400+
│  👑 *OWNER:* ${settings.ownerName}
│
╰───────────────────────────╯\n\n`;

    let body = '';
    const catsToDisplay = categoryFilter ? { [categoryFilter]: categories[categoryFilter] } : categories;

    for (const [category, cmds] of Object.entries(catsToDisplay)) {
        body += `╭───「 *${catEmojis[category]} ${toVIP(category)}* 」\n`;
        cmds.forEach((cmd) => {
            body += `│  🚀 .${toVIP(cmd)}\n`;
        });
        body += `╰───────────────────\n\n`;
    }

    // Link should be on a new line and formatted to be blue/clickable
    const footer = `\n> © 𝐏𝐎𝐖𝐄𝐑𝐄𝐃 𝐁𝐘 𝐒𝐈𝐆𝐌𝐀 𝐌𝐃 𝐁𝐎𝐓\n\n*🔗 Channel Link:* \n${settings.whatsappChannel}`;

    const fullMenu = header + body + footer;

    try {
        await sock.sendMessage(from, { 
            image: { url: settings.startimage }, 
            caption: fullMenu 
        }, { quoted: msg });
    } catch (e) {
        await sock.sendMessage(from, { text: fullMenu }, { quoted: msg });
    }
}

module.exports = allMenu;
