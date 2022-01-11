const express = require('express');
const fs = require('fs');
const http = require('http');
const util = require('util');
const path = require('path');
const multer = require('multer');
const DBR = require('keillion-dynamsoft-javascript-barcode');

//expire in 2022-02-10
DBR.BarcodeReader.productKeys = 't0068MgAAACpEXBhcD4bWoh/rX54MC4LbThO29LVsJM884E6DVnmZTyzI1MY9nhK/zu1bujgxTzqpqOTP3wQr9vOn7JGwp0I=';

const app = express();

const upload = multer({storage: multer.memoryStorage()});

app.post('/decode', upload.any(), async(req, res) => {
    let reader;
    let txts = [];
    try{
        if(req.files.length){
            reader = await DBR.BarcodeReader.createInstance();
            for(let file of req.files){
                const results = await reader.decode(file.buffer);
                for(let result of results){
                    txts.push(result.barcodeText);
                }
            }
        }
    }finally{
        if(reader){
            reader.destroy();
        }
    }
    res.send(txts);
});

// static files
app.use(express.static(path.join(__dirname, 'public')));

let httpsServer = http.createServer(app);

let httpsPort = 12380;
httpsServer.listen(httpsPort, () => console.log('Page is available in http://localhost:'+httpsPort+'/'));