const http = require('http');
const https = require('https');
var fs = require('fs');
require('dotenv').config()

const app = require('./app');

process.env.TZ = 'Asia/Calcutta';
const port = process.env.APPID;
const sPort= process.env.S_PORT 
const IP = process.env.IP || '127.0.0.1';


var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');
let credentials = {key: privateKey, cert: certificate};

const server = http.createServer(app);
const secureServer = https.createServer(credentials,app);


server.listen(port, () => {
    console.log(`Fablo listening at http://${IP}:${port}`)
});

secureServer.listen(sPort, () => {
    console.log(`Fablo listening securely at https://${IP}:${sPort}`);
})