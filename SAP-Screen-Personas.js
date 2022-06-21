// Maybe not best practice, but it works.
// You can bind the script into
// `Script Bottom` -> right click -> Events -> onClick
(async()=>{
    if("undefined" == typeof Dynamsoft || "undefined" == typeof Dynamsoft.DBR){
        let script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/dynamsoft-javascript-barcode@9.0.2/dist/dbr.js";
        let pWaitScript = new Promise(r=>{ script.onload = r; });
        document.body.appendChild(script);
        await pWaitScript;
        // Specifies a license, you can visit https://www.dynamsoft.com/customer/license/trialLicense?ver=9.0.2&utm_source=github&product=dbr&package=js to get your own trial license good for 30 days. 
        Dynamsoft.DBR.BarcodeScanner.license = 'DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9';
        self.dynamsoft_scanner = await await Dynamsoft.DBR.BarcodeScanner.createInstance();
        let ui = await dynamsoft_scanner.getUIElement();
        ui.style.zIndex = '99999'; // make it not cover by SAP
    }
    let scanner = self.dynamsoft_scanner;
    scanner.onFrameRead = results => {
        if (results.length > 0) console.log(results);
    };
    scanner.onUniqueRead = (txt, result) => {
        alert(txt);
    };
    await scanner.show();
})();
