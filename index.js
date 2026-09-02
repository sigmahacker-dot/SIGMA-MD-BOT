/**
 * Travel With Rawi - private WhatsApp travel desk
 * Pairing dashboard and persistent session loader
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
// On Railway, mount a Volume at /data and set SESSION_DIR=/data/sessions.
const PAIRING_DIR = process.env.SESSION_DIR || path.join(__dirname, 'kingbadboitimewisher', 'pairing');
const VISITOR_DB = path.join(__dirname, 'database', 'dashboard_visitors.json');
const visitorSessions = new Map();
const visitorData = new Map();

function loadVisitorData() {
    try {
        if (!fs.existsSync(path.dirname(VISITOR_DB))) fs.mkdirSync(path.dirname(VISITOR_DB), { recursive: true });
        if (fs.existsSync(VISITOR_DB)) {
            const parsed = JSON.parse(fs.readFileSync(VISITOR_DB, 'utf8'));
            Object.entries(parsed).forEach(([id, value]) => visitorData.set(id, value));
        }
    } catch (error) {
        console.log(chalk.yellow('⚠️ Visitor database unavailable:', error.message));
    }
}

function saveVisitorData() {
    try {
        fs.writeFileSync(VISITOR_DB, JSON.stringify(Object.fromEntries(visitorData), null, 2));
    } catch (error) {
        console.log(chalk.yellow('⚠️ Visitor database save failed:', error.message));
    }
}

function getPairedCount() {
    if (!fs.existsSync(PAIRING_DIR)) return 0;
    return fs.readdirSync(PAIRING_DIR, { withFileTypes: true })
        .filter(entry => entry.isDirectory() && entry.name.endsWith('@s.whatsapp.net'))
        .filter(entry => fs.existsSync(path.join(PAIRING_DIR, entry.name, 'creds.json'))).length;
}

function emitStats() {
    const cutoff = Date.now() - 120000;
    const activeVisitors = [...visitorData.values()].filter(item => Number(item.lastSeen) >= cutoff).length;
    io.emit('stats', {
        activeSockets: io.sockets.sockets.size,
        activeVisitors,
        totalVisitors: visitorData.size,
        pairedUsers: getPairedCount(),
        serverTime: Date.now()
    });
}

loadVisitorData();

// Serve static files
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Socket.io Handlers
io.on('connection', (socket) => {
    console.log(chalk.blue('🌐 New web client connected'));
    const fallbackVisitorId = `socket_${socket.id}`;
    const touchVisitor = (visitorId) => {
        const id = String(visitorId || fallbackVisitorId).slice(0, 120);
        visitorSessions.set(socket.id, id);
        visitorData.set(id, { lastSeen: Date.now() });
        if (visitorData.size % 5 === 0) saveVisitorData();
        emitStats();
    };
    touchVisitor(fallbackVisitorId);

    socket.on('set-user', (data) => {
        const visitorId = typeof data === 'string' ? data : data?.userId;
        touchVisitor(visitorId || fallbackVisitorId);
    });

    socket.on('heartbeat', () => {
        touchVisitor(visitorSessions.get(socket.id) || fallbackVisitorId);
    });

    socket.on('pair-request', async (data) => {
        touchVisitor(visitorSessions.get(socket.id) || fallbackVisitorId);
        const { number } = data || {};
        if (!number || String(number).replace(/\D/g, '').length < 10) {
            socket.emit('pair-error', 'Enter a valid phone number with country code.');
            return;
        }
        const formattedNumber = number.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
        console.log(chalk.cyan(`🔗 Web pairing request for: ${formattedNumber}`));
        
        socket.data.pairNumber = formattedNumber;
        try {
            await startpairing(formattedNumber);
        } catch (error) {
            socket.emit('pair-error', error.message);
        }
    });

    socket.on('disconnect', () => {
        visitorSessions.delete(socket.id);
        saveVisitorData();
        emitStats();
        console.log(chalk.gray('🌐 Web client disconnected'));
    });
});

setInterval(emitStats, 5000);

// Listen for global pairing events
if (global.pairEvents) {
    global.pairEvents.on('code', (data) => {
        const target = [...io.sockets.sockets.values()].find((socket) => socket.data.pairNumber === data.number);
        if (target) target.emit('pairing-code', data.code);
    });

    global.pairEvents.on('connected', (data) => {
        const target = [...io.sockets.sockets.values()].find((socket) => socket.data.pairNumber === data.number);
        if (target) target.emit('connection-status', { connected: true, number: data.number });
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
    console.log(chalk.green(figlet.textSync('RAWI TRAVEL', { font: 'Standard' })));
    
    console.log(chalk.yellow('\n═══════════════════════════════════════════════'));
    console.log(chalk.green('   TRAVEL WITH RAWI · PRIVATE PAIRING SYSTEM   '));
    console.log(chalk.yellow('═══════════════════════════════════════════════\n'));

    // Start Web Server
    http.listen(PORT, () => {
        console.log(chalk.green(`🚀 Web Dashboard running on port ${PORT}`));
    });

    // Load Telegram Bot
    try {
        console.log(chalk.blue('📱 Loading optional staff pairing service...'));
        require('./bot');
        console.log(chalk.green('✅ Staff pairing service loaded successfully!'));
    } catch (error) {
        console.log(chalk.red('❌ Failed to load Telegram bot:', error.message));
    }

    // Auto-load existing sessions
    await autoLoadPairs();
    
    console.log(chalk.green('✅ Travel With Rawi private desk is fully operational!\n'));
};

// Error handlers
process.on('unhandledRejection', (reason) => {
    console.log(chalk.red('\n⚠️  Unhandled Rejection:'), reason);
});

process.on('uncaughtException', (error) => {
    console.log(chalk.red('\n❌ Uncaught Exception:'), error.message);
});

initializeBot().catch(console.error);
