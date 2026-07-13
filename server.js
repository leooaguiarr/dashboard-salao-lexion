const http = require('http');
const fs = require('fs');
const path = require('path');

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.json': 'application/json'
};

const server = http.createServer((req, res) => {
    // Prevent directory traversal
    let safeUrl = req.url.split('?')[0];
    if (safeUrl === '/') {
        safeUrl = '/index.html';
    }
    
    const filePath = path.join(__dirname, safeUrl);
    
    fs.stat(filePath, (err, stats) => {
        // Fallback SPA: qualquer rota desconhecida serve o index.html
        // (mesmo comportamento do rewrite configurado no vercel.json)
        const finalPath = (err || !stats.isFile()) ? path.join(__dirname, 'index.html') : filePath;

        const ext = path.extname(finalPath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, { 'Content-Type': contentType });

        const stream = fs.createReadStream(finalPath);
        stream.on('error', (streamErr) => {
            console.error('Stream error:', streamErr);
            // Headers already sent, so just end
            res.end();
        });
        stream.pipe(res);
    });
});

const PORT = 8000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
