import React, { useEffect, useState, useCallback } from 'react';
import '../../cvr';
import { CameraEnhancer, CameraView } from 'dynamsoft-camera-enhancer';
import { DecodedBarcodesResult } from 'dynamsoft-barcode-reader';
import { CaptureVisionRouter, CapturedResultReceiver } from 'dynamsoft-capture-vision-router';
import { MultiFrameResultCrossFilter } from "dynamsoft-utility";
import { EnumImagePixelFormat } from "dynamsoft-core";
import "./VideoCapture.css";

function VideoRecognizer() {
    const [pRouter, setPRouter] = useState<Promise<CaptureVisionRouter> | null>(null);
    const [cameraEnhancer, setCameraEnhancer] = useState<CameraEnhancer | null>(null);
    const [ui, setUI] = useState<HTMLElement | null>(null);
    const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
    const [bNotSupportTorch, setBNotSupportTorch] = useState<boolean>(false);
    const [bTorch, setBTorch] = useState<boolean>(false);
    const [handleDetectDark, setHandleDetectDark] = useState<number|null>(null);
  
    const handleSwitchCamera = useCallback(async () => {
      console.log('click SwitchCamera');
      let _facingMode:'environment' | 'user' = facingMode === 'environment' ? 'user' : 'environment';
      setFacingMode(_facingMode);
      await cameraEnhancer?.updateVideoSettings({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: { ideal: _facingMode }
        }
      });
    },[]);
  
    const handleSwitchTorch = useCallback(async () => {
      console.log('click SwitchTorch');
      console.log('cameraEnhancer',cameraEnhancer)
      try {
        let _bTorch = !bTorch;
        if (bTorch) {
            console.log(1);
          await cameraEnhancer?.turnOffTorch();
          console.log(2);
        } else {
            console.log(3);
          await cameraEnhancer?.turnOnTorch();
          console.log(4);
        }
        setBTorch(_bTorch);
      } catch (ex) {
        console.error(ex);
        console.warn('torch is not supported.');
        setBNotSupportTorch(true);
        (ui!.shadowRoot!.querySelector('.mydbr-switch-torch') as HTMLElement).style.display = 'none';
      }
    },[]);
  
    const handleResultReceiver = useCallback((result: DecodedBarcodesResult) => {
      if (result.barcodeResultItems.length > 0) {
        for (let item of result.barcodeResultItems) {
          console.log(`${item.formatString}: ${item.text}`);
        }
      }
    },[]);
  
    const autoTurnOnFlashWhenDark = useCallback(() => {

      let _handleDetectDark = setInterval(async () => {
        if (bNotSupportTorch || bTorch || !cameraEnhancer?.isOpen()) {
          clearInterval(handleDetectDark!);
          setHandleDetectDark(null);
          return;
        }
  
        const image = cameraEnhancer?.fetchImage();
        if (!image || !image.width || !image.height) return;
  
        let grayValue = 0;
        if (image.format === EnumImagePixelFormat.IPF_GRAYSCALED) {
          grayValue = image.bytes.reduce((sum, byte) => sum + byte, 0) / image.bytes.length;
        } else if (image.format === EnumImagePixelFormat.IPF_ABGR_8888) {
          for (let i = 0; i < image.bytes.length; i += 4) {
            grayValue += image.bytes[i] + image.bytes[i + 1] + image.bytes[i + 2];
          }
          grayValue /= image.bytes.length * 3;
        } else {
          console.error('Unknown image pixel type');
          return;
        }
  
        console.log('grayValue: ' + grayValue);
        if (grayValue < 20) {
          console.log('Try auto turn on torch');
          try {
            await cameraEnhancer?.turnOnTorch();
            setBTorch(true);
          } catch (ex) {
            console.error(ex);
            console.warn('torch is not supported.');
            setBNotSupportTorch(true);
            (ui!.shadowRoot!.querySelector('.mydbr-switch-torch') as HTMLElement).style.display = 'none';
          }
        }
      }, 2000);
      setHandleDetectDark(_handleDetectDark as any as number);
    }, []);
  
    const handleScan = async () => {
      if (pRouter) return;
  
      let _pRouter = CaptureVisionRouter.createInstance();
      setPRouter(_pRouter);
      let router = await _pRouter;
  
      let view = await CameraView.createInstance('./myUI.html');
      let _cameraEnhancer = await CameraEnhancer.createInstance(view);
      setCameraEnhancer(_cameraEnhancer);
  
      let newUi = view.getUIElement();
      newUi.shadowRoot?.querySelector('.mydbr-switch-camera')?.addEventListener('click', handleSwitchCamera);
      newUi.shadowRoot?.querySelector('.mydbr-switch-torch')?.addEventListener('click', handleSwitchTorch);
      setUI(newUi);
      document.body.append(newUi);
      router.setInput(_cameraEnhancer);
  
      router.addResultReceiver({ onDecodedBarcodesReceived: handleResultReceiver });
  
      let filter = new MultiFrameResultCrossFilter();
      filter.enableResultCrossVerification("barcode", true);
      filter.enableResultDeduplication("barcode", true);
      await router.addResultFilter(filter);
  
      await _cameraEnhancer!.open();
      await router.startCapturing("ReadSingleBarcode");

      autoTurnOnFlashWhenDark();
    };

    useEffect(()=>{
      // destroy things
      return ()=>{(async()=>{
        if(null != handleDetectDark){ 
          clearInterval(handleDetectDark); 
          setHandleDetectDark(null);
        }
        if(pRouter){
          let router = await pRouter;
          router.dispose();
        }
        if(cameraEnhancer){
          cameraEnhancer.dispose();
        }
      })()};
    },[]);
  
    return (
      <button id="btn-scan" onClick={handleScan}>
        Scan
      </button>
    );
}

export default VideoRecognizer;
