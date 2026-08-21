import {
  CaptureVisionRouter,
  CoreModule,
  EnumBarcodeFormat,
  LicenseManager,
} from 'dynamsoft-barcode-reader-bundle';
import { useCallback } from 'react';

import { useAsyncCreatedResource } from './useAsyncCreatedResource';
type ReadBarcodes = (input: Blob, barcodeType: EnumBarcodeFormat)=>Promise<string[]>;

CoreModule.engineResourcePaths.rootDirectory = 'https://cdn.jsdelivr.net/npm/';
CoreModule.loadWasm();
LicenseManager.initLicense("DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9");

const barcodeFactory = async () => {
  const instance = await CaptureVisionRouter.createInstance();
  const settings = await instance.outputSettings('*');
  for(let cvTemplate of settings.CaptureVisionTemplates){
    if(cvTemplate.Timeout < 10000){ cvTemplate.Timeout = 10000; }
  }
  await instance.initSettings(settings);
  return instance;
};
const barcodeCleanup = (router: CaptureVisionRouter) => {
  router.dispose();
};

export function useDynamsoftBarcodes() {
  const router = useAsyncCreatedResource(barcodeFactory, barcodeCleanup);

  const readBarcodes = useCallback<ReadBarcodes>(
    async (input: Blob, barcodeType: EnumBarcodeFormat) => {
      const irouter = await router;

      const result = await irouter.capture(input);

      console.log(result); // for debug

      if(!result.decodedBarcodesResult?.barcodeResultItems?.length){
        if(result.errorCode !== 0){
          throw Error(`Barcode reader failed: errorcode: ${result.errorCode}, errorString: ${result.errorString}`);
        }else{
          throw Error('No barcode found');
        }
      }

      const txts = result.decodedBarcodesResult?.barcodeResultItems
        .filter((item) => item.format & barcodeType)
        .map((item) => item.text) ?? [];
      
      if(!txts.length){
        throw Error('Barcode format mismatch');
      }

      return txts;
    },
    [router]
  );

  return { readBarcodes };
}
