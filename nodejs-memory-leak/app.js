// node ./app.js
const express = require('express');
const fs = require('fs');
const http = require('http');
const util = require('util');
const path = require('path');
const multer = require('multer');
const DBR = require('keillion-dynamsoft-javascript-barcode');

//expire in 2022-02-10
DBR.BarcodeReader.productKeys = 't0068MgAAACpEXBhcD4bWoh/rX54MC4LbThO29LVsJM884E6DVnmZTyzI1MY9nhK/zu1bujgxTzqpqOTP3wQr9vOn7JGwp0I=';
(async()=>{
    // create a temp dbr instance, so we can init license
    {
        const tempReaderr = await DBR.BarcodeReader.createInstance();
        await tempReaderr.destroy();
    }

    const app = express();

    const mwUpload = multer({storage: multer.memoryStorage()});
    
    // let countProcessingReq = 0;
    // const middleWareCheckBusy = async(req, res, next)=>{
    //     if(countProcessingReq > 3){
    //         req.status(503).send('Server Busy');
    //         return;
    //     }
    //     ++countProcessingReq;
    //     try{
    //         await next();
    //     }finally{
    //         --countProcessingReq;
    //     }
    // };

    // let promiseDecodeReqInProcessing = null;
    // let funcResolveDecodeReqInProcessing = null; // for express, who can't await `next()`
    // const mwWaitDecodingInQueue = async(req, res, next)=>{
    //     while(promiseDecodeReqInProcessing){
    //         await promiseDecodeReqInProcessing;
    //     }

    //     // // Koa has a more promise-centric design. (>_<) `next()` can't await in express
    //     // promiseDecodeReqInProcessing = (async()=>{
    //     //     await next();
    //     //     promiseDecodeReqInProcessing = null;
    //     // })();

    //     promiseDecodeReqInProcessing = new Promise(r=>{
    //         funcResolveDecodeReqInProcessing = ()=>{
    //             funcResolveDecodeReqInProcessing = null;
    //             promiseDecodeReqInProcessing = null;
    //             r();
    //         };
    //         next();
    //     });

    //     //await promiseDecodeReqInProcessing;
    // };

    // const mwResolveProcessing = ()=>{
    //     funcResolveDecodeReqInProcessing();
    // };

    app.post('/decode', /*mwCheckBusy,mwWaitDecodingInQueue,*/ mwUpload.any(), async(req, res, next) => {
        let reader;
        let txts = [];
        try{
            if(req.files.length){
                reader = await DBR.BarcodeReader.createInstance();
                for(let file of req.files){
                    // const clonedBuf = new Buffer.alloc(file.buffer.length);
                    // file.buffer.copy(clonedBuf);
                    // const results = await reader.decode(clonedBuf);
                    const results = await reader.decode(file.buffer);
                    for(let result of results){
                        txts.push(result.barcodeText);
                    }
                }
            }
        }finally{
            if(reader){
                await reader.destroy();
            }
        }
        res.send(txts);
        next();
    }, /*mwResolveProcessing*/);
    
    // static files
    app.use(express.static(path.join(__dirname, 'public')));
    
    let httpsServer = http.createServer(app);
    
    let httpsPort = 12380;
    httpsServer.listen(httpsPort, () => console.log('Page is available in http://localhost:'+httpsPort+'/'));
    
})();
