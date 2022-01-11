// node ./test.js

const DBR = require('keillion-dynamsoft-javascript-barcode');
//expire in 2022-02-10
DBR.BarcodeReader.productKeys = 't0068MgAAACpEXBhcD4bWoh/rX54MC4LbThO29LVsJM884E6DVnmZTyzI1MY9nhK/zu1bujgxTzqpqOTP3wQr9vOn7JGwp0I=';

(async()=>{
    const reader = await DBR.BarcodeReader.createInstance();
    const results = await reader.decode('https://demo.dynamsoft.com/barcode-reader/img/AllSupportedBarcodeTypes.png');
    for(let result of results){
        console.log(result.barcodeText);
    }
    reader.destroy();
    
    // Since the worker keep alive, you can call
    await DBR.BarcodeReader._dbrWorker.terminate();
})();