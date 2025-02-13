import React from "react";
import "../../dynamsoft.config"; // import side effects. The license, engineResourcePath, so on.
import { CameraEnhancer, CameraView } from "dynamsoft-camera-enhancer";
import { CaptureVisionRouter } from "dynamsoft-capture-vision-router";
import "./VideoCapture.css";
import { DSImageData, EnumCapturedResultItemType, OriginalImageResultItem } from "dynamsoft-core";
import { ImageManager } from "dynamsoft-utility";

interface VideoCaptureProps {
  setResult: (value: string) => void
}
class VideoCapture extends React.Component<VideoCaptureProps> {
  cameraViewContainer: React.RefObject<HTMLDivElement> = React.createRef();

  cvRouter?: CaptureVisionRouter;
  cameraEnhancer?: CameraEnhancer;
  image: DSImageData | null = null;
  imageManager: ImageManager | null = null

  async componentDidMount() {
    try {
      // Create a `CameraEnhancer` instance for camera control and a `CameraView` instance for UI control.
      const cameraView = await CameraView.createInstance("./sbux_dce.ui.html");
      cameraView.setVideoFit("cover");
      this.cameraEnhancer = await CameraEnhancer.createInstance(cameraView);

      // Get default UI and append it to DOM.
      this.cameraViewContainer.current!.append(cameraView.getUIElement());

      // Create a `CaptureVisionRouter` instance and set `CameraEnhancer` instance as its image source.
      this.cvRouter = await CaptureVisionRouter.createInstance();
      this.cvRouter.setInput(this.cameraEnhancer);
      this.imageManager = new ImageManager();

      await this.cvRouter.initSettings("./sbux_template.json");
      
      //make the camera user-facing
      await this.cameraEnhancer.updateVideoSettings({
        video: {
          facingMode:{
            ideal: 'user'
          }
        }
      });

      //set the resolution to highest
      await this.cameraEnhancer.setResolution({width:1920, height:1080});

      const settings = await this.cvRouter.getSimplifiedSettings("ReadSingleBarcode");
      settings.capturedResultItemTypes = EnumCapturedResultItemType.CRIT_ORIGINAL_IMAGE | EnumCapturedResultItemType.CRIT_BARCODE;
      await this.cvRouter.updateSettings("ReadSingleBarcode", settings);

      // Define a callback for results.
      this.cvRouter.addResultReceiver({
        onCapturedResultReceived: (result) => {
          //This is where a POST call can be made with the barcode results. 
          this.image = (result.items.filter((item)=>{
            return item.type === 1;
          })[0] as OriginalImageResultItem).imageData;
          if (!result.barcodeResultItems) {
            return;
          };
          
          let _resultText = "";
          // console.log(result);
          for (let item of result.barcodeResultItems) {
            _resultText += `${item.formatString}: ${item.text}\n\n`;
          }
          
          this.props.setResult(_resultText)
        },
      });

      this.cameraEnhancer.setScanRegion({ x: 20, y: 20, width: 60, height: 60, isMeasuredInPercentage: true });
      
      // Open camera and start scanning single barcode.
      await this.cameraEnhancer.open();
      await this.cameraEnhancer.setZoom({factor: 1.2});
      cameraView.setScanLaserVisible(false);
 
      await this.cvRouter.startCapturing("ReadSingleBarcode");
    } catch (ex: any) {
      alert(ex.message || ex);
    }
  }

  getImage = () => {
    if(this.image) {
      this.imageManager?.saveToFile(this.image, "test.png", true);
    }
  }

  render() {
    return (
      <div>
        <div ref={this.cameraViewContainer} style={{  width: "100%", height: "70vh" }}></div>
        <button onClick={this.getImage}>get image</button>
      </div>
    );
  }
}

export default VideoCapture;
