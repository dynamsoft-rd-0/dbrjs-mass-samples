import React, { useCallback, useState } from "react";
import { EnumBarcodeFormat } from "dynamsoft-barcode-reader-bundle";
import "./ImageCapture.css";
import { useDynamsoftBarcodes } from '../../hooks/useDynamsoftBarcode'

function ImageCapture() {
  let [resultText, setResultText] = useState("");

  const { readBarcodes } = useDynamsoftBarcodes();

  const captureImage = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    let files = [...(e.target.files as any as File[])];
    e.target.value = ""; // reset input
    setResultText("decoding...");

    let _resultText = "";
    for (let file of files) {
      try {
        const txts = await readBarcodes(file, 
          EnumBarcodeFormat.BF_CODE_128 | 
          EnumBarcodeFormat.BF_CODE_39 | 
          EnumBarcodeFormat.BF_CODE_39_EXTENDED | 
          EnumBarcodeFormat.BF_QR_CODE |
          EnumBarcodeFormat.BF_DATAMATRIX
        );

        // Print file name if there's multiple files
        if (files.length > 1) {
          _resultText += `\n${file.name}:\n`;
        }
        for (let txt of txts) {
          _resultText += txt + "\n"
        }
        // If no items are found, display that no barcode was detected
        if (!txts.length) {
          _resultText += "No barcode found\n";
        };
      } catch (ex: any) {
        let errMsg = ex.message || ex;
        console.error(ex);
        _resultText += errMsg + '\n';
      }

      setResultText(_resultText);
    }
  }, [readBarcodes]);

  return (
    <div className="image-capture-container">
      <div className="input-container">
        <input type="file" multiple accept=".jpg,.jpeg,.icon,.gif,.svg,.webp,.png,.bmp" onChange={captureImage} />
      </div>
      <div className="results">{resultText}</div>
    </div>
  );
}

export default ImageCapture;
