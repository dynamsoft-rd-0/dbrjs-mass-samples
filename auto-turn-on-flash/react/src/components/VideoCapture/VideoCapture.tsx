import React, { useEffect, useRef, useState, useCallback, MutableRefObject } from 'react';
import '../../cvr';
import { CameraEnhancer, CameraView } from 'dynamsoft-camera-enhancer';
import { DecodedBarcodesResult } from 'dynamsoft-barcode-reader';
import { CaptureVisionRouter, CapturedResultReceiver } from 'dynamsoft-capture-vision-router';
import { MultiFrameResultCrossFilter } from "dynamsoft-utility";
import { EnumImagePixelFormat } from "dynamsoft-core";

const strErrorDistoryed = 'videoCapture component destoryed';

function VideoRecognizer() {

  const rfElContainer:MutableRefObject<HTMLDivElement|null> = useRef(null);

  useEffect(()=>{
    if(!rfElContainer.current){return;}

    let resolveInit:()=>void;
    let pInit:Promise<void> = new Promise(r=>{resolveInit=r});
    let bDestoryed = false;

    let cvr:CaptureVisionRouter;
    let view:CameraView;
    let cameraEnhancer:CameraEnhancer;

    let facingMode:'environment'|'user' = 'environment';
    let bNotSupportTorch = false;
    let bTorch = false;

    let taskDetectDrak:ReturnType<typeof setInterval>|null;
    (async()=>{
      try{
        cvr = await CaptureVisionRouter.createInstance();
        view = await CameraView.createInstance('./myUI.html');
        cameraEnhancer = await CameraEnhancer.createInstance(view);
        let ui = view.getUIElement();
        // switch camera
        ui!.shadowRoot!.querySelector('.mydbr-switch-camera')!.addEventListener('click',async()=>{
          facingMode = 'environment' === facingMode ? 'user' : 'environment';
          await cameraEnhancer.updateVideoSettings({video: {width: {ideal: 1280},height: {ideal: 720},facingMode: {ideal: facingMode}}});
        });
        // switch torch
        ui!.shadowRoot!.querySelector('.mydbr-switch-torch')!.addEventListener('click',async()=>{
          try{
            if(bTorch){
                await cameraEnhancer.turnOffTorch();
            }else{
                await cameraEnhancer.turnOnTorch();
            }
            bTorch = !bTorch;
          }catch(ex){
            console.error(ex);
            console.warn('torch is not supported.');
            bNotSupportTorch = true;
            (ui!.shadowRoot!.querySelector('.mydbr-switch-torch') as HTMLElement).style.display = 'none';
          }
        });
        
        // check if conponent still existed
        if(bDestoryed){ throw Error(strErrorDistoryed); }
        rfElContainer.current!.append(ui);
        cvr.setInput(cameraEnhancer);

        cvr.addResultReceiver({ onDecodedBarcodesReceived: (result) => {
          if (result.barcodeResultItems.length > 0) {
            for (let item of result.barcodeResultItems) {
              console.log(`${item.formatString}: ${item.text}`);
            }
          }
        }});

        let filter = new MultiFrameResultCrossFilter();
        filter.enableResultCrossVerification("barcode", true);
        filter.enableResultDeduplication("barcode", true);
        await cvr.addResultFilter(filter);

        if(bDestoryed){ throw Error(strErrorDistoryed); }
        await cameraEnhancer!.open();
        if(bDestoryed){ throw Error(strErrorDistoryed); }
        await cvr.startCapturing("ReadSingleBarcode");
        if(bDestoryed){ throw Error(strErrorDistoryed); }
        
        // detect dark every 2s
        taskDetectDrak = setInterval(async()=>{

          if(bNotSupportTorch){
            clearInterval(taskDetectDrak!);
            taskDetectDrak = null;
            return;
          }

          if(bTorch || !cameraEnhancer.isOpen()){ return; }

          let image = cameraEnhancer.fetchImage();
          if(!image || !image.width || !image.height){ return; }

          let timeStart = Date.now();
          let grayValue = 0;
          if(EnumImagePixelFormat.IPF_GRAYSCALED === image.format){
            for(let i = 0; i < image.bytes.length; ++i){
              grayValue += image.bytes[i];
            }
            grayValue /= image.bytes.length;
          }else if(EnumImagePixelFormat.IPF_ABGR_8888 === image.format){
            for(let i = 0; i < image.bytes.length; i+=4){
              grayValue += image.bytes[i];
              grayValue += image.bytes[i+1];
              grayValue += image.bytes[i+2];
            }
            grayValue /= image.bytes.length / 4 * 3;
          }else{
            console.error('Unknown image pixel type');
            return;
          }
          console.log('gray cal cost '+(Date.now()-timeStart)+'ms');

          console.log('grayValue: '+grayValue);
          if(grayValue < 20){ // 0~255, pls have a test
            console.log('Try auto turn on torch');
            try{
              await cameraEnhancer.turnOnTorch();
              bTorch = true;
            }catch(ex){
              console.error(ex);
              console.warn('torch is not supported.');
              bNotSupportTorch = true;
              (ui!.shadowRoot!.querySelector('.mydbr-switch-torch') as HTMLElement).style.display = 'none';
            }
          }
        }, 2000);

      }catch(ex){
        
        if((ex as Error)?.message === strErrorDistoryed){
          console.log(strErrorDistoryed);
        }else{
          console.error(ex);
        }
      }

      // distroy function will wait pInit
      resolveInit!();
    })();

    // destory function
    return ()=>{
      bDestoryed = true;
      (async()=>{
        await pInit;
        cvr?.dispose();
        cameraEnhancer?.dispose();
        if(null !== taskDetectDrak){ clearInterval(taskDetectDrak); }
      })();
    }
  },[rfElContainer]);
  
  // warning: don't add any other elements to this div, 
  // so the CameraView(not mounted by react) will not be break.
  return <div ref={rfElContainer} style={{width:'100vw',height:'70vh'}}></div>;
}

export default VideoRecognizer;
