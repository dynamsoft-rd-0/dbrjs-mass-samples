import DBR from "dynamsoft-javascript-barcode";
//require('dotenv').config();
//DBR.BarcodeReader.engineResourcePath = "/dynamsoft/dist/";
DBR.BarcodeReader.engineResourcePath = "https://cdn.jsdelivr.net/npm/dynamsoft-javascript-barcode@8.1.2/dist/";
// Please visit https://www.dynamsoft.com/customer/license/trialLicense to get a trial license
//DBR.BarcodeReader.productKeys = process.env.REACT_APP_DYNAMSOFT_SCANNER_KEY;
// DBR.BarcodeReader._bUseFullFeature = true; // Control of loading min wasm or full wasm.
export default DBR;