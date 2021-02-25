/* eslint-disable no-console */

//let DBR = require('dynamsoft-javascript-barcode/dist/dbr.js'); // This line can work in node 14
let DBR = require('keillion-dynamsoft-javascript-barcode/dist/dbr.js'); // dbrjs has issue in node 15, so put the dev version here. We will release a new version to fix it soon.
let pdf2png = require('./pdf2png.js');

// Please visit https://www.dynamsoft.com/customer/license/trialLicense to get trial license.
DBR.BarcodeReader.productKeys = 't0068MgAAAH7EmUc9TB11eMaE2RF3ZjAWLk++7z27Od7yVPIe5Dy6cEH620R+kkAbWFX4Mfrw/hRHEvoVzsdPpiKmxcpip04='; 

(async()=>{
    let reader = await DBR.BarcodeReader.createInstance();
    let fs = require('fs');
    let buffer = fs.readFileSync(__dirname + '/MultiPage.pdf');
    // https://en.wikipedia.org/wiki/List_of_file_signatures
    if(buffer.byteLength > 5 && 0 == buffer.compare(Buffer.from('255044462d','hex'), 0, 5, 0, 5)){
        // buffer is pdf
        let imgs = await pdf2png(buffer);
        for(let img of imgs){
            for(let result of await reader.decode(img)){
                console.log(result.barcodeText);
            }
        }
    }else{
        // buffer is not pdf
        for(let result of await reader.decode(buffer)){
            console.log(result.barcodeText);
        }
    }
    await reader.destroy();
    
    // Since the worker keep alive, you can call
    await DBR.BarcodeReader._dbrWorker.terminate();
    // when you need to exit this process.
    // Or call
    process.exit();
    // directly.
})();