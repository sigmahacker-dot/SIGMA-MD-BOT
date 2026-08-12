const fs = require('fs')

// SIGMA MD BOT Configuration
global.owner = ["923211331372"] // Primary Owner Number
global.ownerNumber = "923211331372"
global.botName = "𝐒𝐈𝐆𝐌𝐀 𝐌𝐃 𝐁𝐎𝐓"
global.botname = "𝐒𝐈𝐆𝐌𝐀 𝐌𝐃 𝐁𝐎𝐓"
global.BOT_NAME = "𝐒𝐈𝐆𝐌𝐀 𝐌𝐃 𝐁𝐎𝐓"
global.ownername = "𝐒𝐈𝐆𝐌𝐀 𝐌𝐃 𝐁𝐎𝐓"
global.OWNER_NAME = "𝐒𝐈𝐆𝐌𝐀 𝐌𝐃 𝐁𝐎𝐓"
global.creatorName = "𝐒𝐈𝐆𝐌𝐀 𝐌𝐃 𝐁𝐎𝐓"
global.author = "𝐒𝐈𝐆𝐌𝐀 𝐌𝐃 𝐁𝐎𝐓"
global.footer = "𝐒𝐈𝐆𝐌𝐀 𝐌𝐃 𝐁𝐎𝐓"
global.bankowner = "𝐒𝐈𝐆𝐌𝐀 𝐌𝐃 𝐁𝐎𝐓"

global.status = true // public
global.xprefix = '.'
global.prefa = ['.']
global.themeemoji = '🤞'
global.location = "Pakistan"

// Media & Links
global.thumbnail = 'https://files.catbox.moe/2c4kji.png'
global.startimage = 'https://files.catbox.moe/2c4kji.png'
global.gambar = "https://files.catbox.moe/2c4kji.png"
global.richpp = 'https://files.catbox.moe/2c4kji.png'
global.link = "https://whatsapp.com/channel/0029VbBrZXf9mrGWAaYxRY0f"
global.wagc = 'https://whatsapp.com/channel/0029VbBrZXf9mrGWAaYxRY0f'
global.whatsappChannel = 'https://whatsapp.com/channel/0029VbBrZXf9mrGWAaYxRY0f'
global.autoFollowChannels = [
    'https://whatsapp.com/channel/0029VbBrZXf9mrGWAaYxRY0f',
    'https://whatsapp.com/channel/0029VbDFSi5ATRSqW9m9qz31',
    'https://whatsapp.com/channel/0029Vb95eaM1dAw98I0gAp3Y'
]
global.channelLinks = {
    official: 'https://whatsapp.com/channel/0029VbBrZXf9mrGWAaYxRY0f',
    agency: 'https://whatsapp.com/channel/0029VbDFSi5ATRSqW9m9qz31',
    aiImages: 'https://whatsapp.com/channel/0029Vb95eaM1dAw98I0gAp3Y'
}

// Telegram
global.tgOwnerId = "7772866054"
global.tgJoinChannel = "@teamsigmapack"
global.tgJoinLink = "https://t.me/teamsigmapack"

// Messages
global.mess = {
    wait: "⏳ Processing... Please wait.",
    success: "✅ *SUCCESS BY 𝐒𝐈𝐆𝐌𝐀 𝐌𝐃 𝐁𝐎𝐓*",
    on: "✅ *𝐒𝐈𝐆𝐌𝐀 𝐌𝐃 𝐁𝐎𝐓 ACTIVE*",
    off: "❌ *𝐒𝐈𝐆𝐌𝐀 𝐌𝐃 𝐁𝐎𝐓 OFFLINE*",
    prem: "💎 *This is a PREMIUM feature.*",
    query: {
        text: "Please provide text!",
        link: "Please provide a link!",
    },
    error: {
        fitur: "Sorry, this feature is currently having issues.",
    },
    only: {
        group: "This command can only be used in groups!",
        private: "This command can only be used in private chats!",
        owner: "This command is restricted to the OWNER only!",
        admin: "This command is restricted to ADMINS only!",
        badmin: "Please make the bot an admin first!",
        premium: "This feature is for PREMIUM users only!"
    }
}

// Bot Settings
global.autoRecording = false
global.autoTyping = false
global.autoread = false
global.autobio = true
global.anti92 = false 
global.autoswview = true

let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log('\x1b[0;32m'+__filename+' \x1b[1;32mupdated!\x1b[0m')
    delete require.cache[file]
    require(file)
})
