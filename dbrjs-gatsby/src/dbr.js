import DBR from "../node_modules/keillion-dynamsoft-javascript-barcode/dist/dbr.browser.mjs";
if(DBR.BarcodeReader){ // not SSR
    DBR.BarcodeReader.engineResourcePath = "https://cdn.jsdelivr.net/npm/keillion-dynamsoft-javascript-barcode@0.20210123145106.0/dist/";
    // Please visit https://www.dynamsoft.com/customer/license/trialLicense to get a trial license
    DBR.BarcodeReader.productKeys = "PRODUCT-KEYS";
    // DBR.BarcodeReader._bUseFullFeature = true; // Control of loading min wasm or full wasm.
}
export default DBR;
