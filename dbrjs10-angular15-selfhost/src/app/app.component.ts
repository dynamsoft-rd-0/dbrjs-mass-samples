import { Component } from '@angular/core';

/** ================ only quick test ================ */
import { CoreModule } from 'dynamsoft-core';
import { LicenseManager } from 'dynamsoft-license';
import 'dynamsoft-barcode-reader';
import { CameraEnhancer, CameraView } from 'dynamsoft-camera-enhancer';
import { CaptureVisionRouter } from 'dynamsoft-capture-vision-router';
import { MultiFrameResultCrossFilter } from 'dynamsoft-utility';

// !!!!!!!!!!!!!!!!!!NOTICE THIS LINE!!!!!!!!!!!!!!!!!!!!!!!!
CoreModule.engineResourcePaths.rootDirectory = 'dynamsoft-assets/';
LicenseManager.initLicense('DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9');

(async() => {
  try{

    let cvRouter = await CaptureVisionRouter.createInstance();

    let cameraView = await CameraView.createInstance();
    let cameraEnhancer = await CameraEnhancer.createInstance(cameraView);
    let ui = cameraView.getUIElement();
    Object.assign(ui.style, {position: 'fix', top: '0', left: '0', width: '100%', height: '90vh'})
    document.body.append(ui);
    cvRouter.setInput(cameraEnhancer);

    cvRouter.addResultReceiver({ onCapturedResultReceived: (result) => {
      console.log(result);
    }});

    let filter = new MultiFrameResultCrossFilter();
    filter.enableResultCrossVerification("barcode", true);
    filter.enableResultDeduplication("barcode", true);
    await cvRouter.addResultFilter(filter);

    await cameraEnhancer.open();
    await cvRouter.startCapturing("ReadSingleBarcode");
  }catch(ex){
    console.error(ex);
  }
  
})();






@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'dbrjs10-angular15';
}
