/**
 * SIGMA MD BOT - CORE
 * Enhanced with Web Dashboard and Telegram Pairing
 */

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const figlet = require('figlet');
const startpairing = require('./pair');

const PORT = process.env.PORT || 8080;
const PAIRING_DIR = './kingbadboitimewisher/pairing/';

// Serve static files
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Socket.io Handlers
io.on('connection', (socket) => {
    console.log(chalk.blue('🌐 New web client connected'));

    socket.on('pair-request', async (data) => {
        const { number } = data;
        const formattedNumber = number.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
        console.log(chalk.cyan(`🔗 Web pairing request for: ${formattedNumber}`));
        
        try {
            await startpairing(formattedNumber);
        } catch (error) {
            socket.emit('pair-error', error.message);
        }
    });

    socket.on('disconnect', () => {
        console.log(chalk.gray('🌐 Web client disconnected'));
    });
});

// Listen for global pairing events
if (global.pairEvents) {
    global.pairEvents.on('code', (data) => {
        io.emit('pairing-code', data.code);
    });

    global.pairEvents.on('connected', (data) => {
        io.emit('connection-status', { connected: true, number: data.number });
    });
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const autoLoadPairs = async () => {
    console.log(chalk.cyan('🔄 Auto-loading all paired users...'));
    
    if (!fs.existsSync(PAIRING_DIR)) {
        console.log(chalk.red('❌ Pairing directory not found.'));
        return;
    }

    const pairedUsers = fs.readdirSync(PAIRING_DIR, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
        .filter(name => name.endsWith('@s.whatsapp.net'));

    if (pairedUsers.length === 0) {
        console.log(chalk.yellow('ℹ️  No paired users found.'));
        return;
    }

    console.log(chalk.green(`✅ Found ${pairedUsers.length} paired users. Starting connections...`));
    
    for (let i = 0; i < pairedUsers.length; i++) {
        const userNumber = pairedUsers[i];
        try {
            console.log(chalk.blue(`🔄 Connecting user ${i + 1}/${pairedUsers.length}: ${userNumber}`));
            await startpairing(userNumber);
            await delay(3000);
        } catch (error) {
            console.log(chalk.red(`❌ Failed for ${userNumber}: ${error.message}`));
        }
    }
};

const initializeBot = async () => {
    console.clear();
    console.log(chalk.green(figlet.textSync('SIGMA MD', { font: 'Standard' })));
    
    console.log(chalk.yellow('\n═══════════════════════════════════════════════'));
    console.log(chalk.green('   𝐒𝐈𝐆𝐌𝐀 𝐌𝐃 𝐁𝐎𝐓 𝐏𝐀𝐈𝐑𝐈𝐍𝐆 𝐒𝐘𝐒𝐓𝐄𝐌       '));
    console.log(chalk.yellow('═══════════════════════════════════════════════\n'));

    // Start Web Server
    http.listen(PORT, () => {
        console.log(chalk.green(`🚀 Web Dashboard running on port ${PORT}`));
    });

    // Load Telegram Bot
    try {
        console.log(chalk.blue('📱 Loading Telegram pairing system...'));
        require('./bot');
        console.log(chalk.green('✅ Telegram bot loaded successfully!'));
    } catch (error) {
        console.log(chalk.red('❌ Failed to load Telegram bot:', error.message));
    }

    // Auto-load existing sessions
    await autoLoadPairs();
    
    console.log(chalk.green('✅ 𝐒𝐈𝐆𝐌𝐀 𝐌𝐃 system is fully operational!\n'));
};

// Error handlers
process.on('unhandledRejection', (reason) => {
    console.log(chalk.red('\n⚠️  Unhandled Rejection:'), reason);
});

process.on('uncaughtException', (error) => {
    console.log(chalk.red('\n❌ Uncaught Exception:'), error.message);
});

initializeBot().catch(console.error);
