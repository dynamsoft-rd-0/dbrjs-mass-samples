const express = require('express');
const fs = require('fs-extra');
const https = require('https');
const path = require('path');

if(!fs.existsSync('public/dynamsoft-javascript-barcode')){
    fs.copySync('node_modules/dynamsoft-javascript-barcode','public/dynamsoft-javascript-barcode');
}

const app = express();

// static files
app.use(express.static(path.join(__dirname, 'public')));

let httpsServer = https.createServer({
    key: fs.readFileSync(path.join(__dirname, 'pem/ryans-key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'pem/ryans-cert.pem'))
}, app);

let httpsPort = 4443;
httpsServer.listen(httpsPort, () => console.log('Page is available in https://localhost:'+httpsPort+'/'));
