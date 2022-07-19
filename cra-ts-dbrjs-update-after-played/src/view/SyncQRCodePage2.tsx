import "../config/barcode-scanner.config"
import { BarcodeScanner, TextResult } from 'dynamsoft-javascript-barcode';
import BarcodeScannerComponent from '../components/BarcodeScannerComponent';
import { useEffect, useState, useRef } from 'react';

export const SyncQRCodePage2 = () => {
  const [libraryLoaded, setLibraryLoaded] = useState(false);

  useEffect(() => {
    const loadScanner = async () => {
      try {
        //Load the library on page load to speed things up.
        await BarcodeScanner.loadWasm();
        setLibraryLoaded(true);
        console.log('WASM Loaded!')
      } catch (ex) {
        console.error('Error loading BarcodeScanner', ex);
      }
    };

    loadScanner();
    return () => {};
  }, []);

  // const videoOverlay = () => <div className="qrOverlay">Scan the next QR</div>;

  const onScannerResult = async (results: TextResult[]) => {
    for (let index = 0; index < results.length; index++) {
      const element = results[index];
      const scannedCode = element.barcodeText;

      alert(scannedCode);
    }
  };

  return (
    <div id="UIElement" style={{width:"100vw",height:"100vh"}}>
      {libraryLoaded ? <BarcodeScannerComponent onFrameRead={onScannerResult} />: ""}
    </div>
  );
};
