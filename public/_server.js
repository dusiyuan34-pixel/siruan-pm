const http = require('http');
const fs = require('fs');
const path = require('path');

const root = 'E:\\作品集\\web test\\产品经理\\public';
const port = 3000;

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
};

http.createServer((req, res) => {
  let urlPath = decodeURIComponent((req.url || '/').split('?')[0].split('#')[0]);
  let fp = path.join(root, urlPath === '/' ? 'index.html' : urlPath);
  fs.readFile(fp, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found: ' + req.url);
      return;
    }
    const ext = path.extname(fp).toLowerCase();
    res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(port, () => {
  console.log('Server running at http://localhost:' + port);
});
