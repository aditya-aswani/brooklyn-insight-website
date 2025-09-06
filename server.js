const express = require('express');
const path = require('path');
const chokidar = require('chokidar');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname)));

// Serve index.html for all routes (single page app)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// WebSocket connection for live reload
wss.on('connection', (ws) => {
    console.log('Client connected for live reload');
    
    ws.on('close', () => {
        console.log('Client disconnected from live reload');
    });
});

// Watch for file changes
const watcher = chokidar.watch([
    './index.html',
    './css/**/*.css',
    './js/**/*.js'
], {
    ignored: /node_modules/,
    persistent: true
});

watcher.on('change', (path) => {
    console.log(`File ${path} has been changed`);
    
    // Notify all connected clients to reload
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'reload' }));
        }
    });
});

// Start server
server.listen(PORT, () => {
    console.log(`🚀 Brooklyn Sangha website is running at http://localhost:${PORT}`);
    console.log('📁 Serving files from:', __dirname);
    console.log('🔄 Live reload is active - edit your files and see changes instantly!');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('Shutting down server...');
    watcher.close();
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});