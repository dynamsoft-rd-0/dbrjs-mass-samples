import * as React from "react"
//import {} from "../no-use-but-tell-dbrjs-it-is-ssr";

let promiseLoadDbrjs;
let BarcodeReader, BarcodeScanner;
if(typeof document != "undefined"){
  promiseLoadDbrjs = (async()=>{
    ({ BarcodeReader, BarcodeScanner } = await import("dynamsoft-javascript-barcode"));
    BarcodeReader.engineResourcePath = "https://cdn.jsdelivr.net/npm/dynamsoft-javascript-barcode@8.0.0/dist/";
    // Please visit https://www.dynamsoft.com/customer/license/trialLicense to get a trial license
    BarcodeReader.productKeys = "PRODUCT-KEYS";
    // BarcodeReader._bUseFullFeature = true; // Control of loading min wasm or full wasm.
  })();
}

// reader for decoding picture
let reader = null;
// scanner for decoding video
let scanner = null;

// decode input picture
let funcReadFileIpt = event=>{
  // React can't get event.target in async func by default.
  // Thus get event.target in sync part.
  let input = event.target;

  (async ()=>{
      try{
        await promiseLoadDbrjs;
        reader = reader || await BarcodeReader.createInstance();
        let resultsToAlert = [];
        for(let i = 0; i < input.files.length; ++i){
            let file = input.files[i];
            resultsToAlert.push(i + '. ' + file.name + ":");
            let results = await reader.decode(file);
            console.log(results);
            for(let result of results){
                resultsToAlert.push(result.barcodeText);
            }
        }
        alert(resultsToAlert.join('\n'));
      }catch(ex){
        alert(ex.message);
        throw ex;
      }
      input.value = "";
  })();
};

// decode video from camera
let funcShowScanner = async () => {
    try{
        scanner = scanner || await BarcodeScanner.createInstance();
        scanner.onFrameRead = results => {
            if(results.length){
                console.log(results);
            }
        };
        scanner.onUnduplicatedRead = (txt, result) => {
            alert(result.barcodeFormatString + ': ' + txt);
        };
        await scanner.show();
    }catch(ex){
        alert(ex.message);
        throw ex;
    }
};

// markup
const IndexPage = () => {
  return (
    <main>
      Choose image(s) to decode:
      <input onChange={funcReadFileIpt} type="file" multiple accept="image/png,image/jpeg,image/bmp,image/gif"/>
      <br/><br/>
      <button onClick={funcShowScanner}>show scanner</button>
    </main>
  )
}

export default IndexPage
