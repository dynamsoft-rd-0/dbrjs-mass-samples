import { BarcodeScanner, TextResult } from 'dynamsoft-javascript-barcode';
import { ScannerPlayCallbackInfo } from 'dynamsoft-javascript-barcode/dist/types/interface/scannerplaycallbackinfo';
import React from 'react';

type BarcodeScannerComponentProps = {
  onFrameRead: (results: TextResult[]) => void;
};

class BarcodeScannerComponent extends React.Component<BarcodeScannerComponentProps, {}> {
  pScanner: Promise<BarcodeScanner>;
  elRef: any;

  constructor(props: BarcodeScannerComponentProps) {
    super(props);
    this.pScanner = null as any as Promise<BarcodeScanner>;
    this.elRef = React.createRef();
    console.log("Scanner constructed!")
  }

  async componentDidMount() {
    try {
      // Initialize singleton once
      const scanner = await (this.pScanner = BarcodeScanner.createInstance());
      
      await this.initVideoSettings();
      

      if(scanner.isContextDestroyed()){ return; }
      this.elRef.current.appendChild(scanner.getUIElement());
      this.elRef.current.style.width = '100%';
      this.elRef.current.style.height = '100%';

      scanner.onFrameRead = this.props.onFrameRead;

      scanner.onPlayed = this.onScannerPlayed.bind(this);

      // Open scanner
      scanner.open().then(open => {
        console.log('Scanner: open')
      });
    } catch (ex) {
      console.error(ex);
    }
  }
  
  shouldComponentUpdate() {
    // Never update UI after mount, dbrjs sdk use native way to bind event, update will remove it.
    return false;
  }
  
  async componentWillUnmount() {
    if (this.pScanner) {
      const scanner = await this.pScanner;
      scanner.getUIElement().remove();
      console.log('this.pScanner.getUIElement().remove();')
      scanner.destroyContext();
      console.log('BarcodeScanner Component Unmount');
    }
  }

  async onScannerPlayed (info: ScannerPlayCallbackInfo) {
    if (!this.pScanner) {
      console.error('Cannot configure barcode scanner, singleton not ready')
      return
    }
    const scanner = await this.pScanner;

    const sideLen = Math.min(info.width,info.height) * 0.4;
    const precentW = Math.round(sideLen/info.width * 100)
    const precentH = Math.round(sideLen/info.height * 100);
    
    const settings = await scanner.getRuntimeSettings();

    settings.region.regionLeft = (100 - precentW) / 2;
    settings.region.regionRight = (100 + precentW) / 2;
    settings.region.regionTop = (100 - precentH) / 2;
    settings.region.regionBottom = (100 + precentH) / 2;
    settings.region.regionMeasuredByPercentage = 1;

    await scanner.updateRuntimeSettings(settings);
  }

  async initVideoSettings() {
    const scanner = await this.pScanner;
    await scanner.updateVideoSettings({
        video: {
          width:      { ideal: 3840 },
          height:     { ideal: 2160 },
          facingMode: { ideal: "environment" }
        }
    });
  }

  // not used?
  async initSettings() {
    const scanner = await this.pScanner;
    
    await scanner.updateVideoSettings({
        video: {
            width: {
              ideal: 3840
            },
            height: {
              ideal: 2160
            },
            facingMode: {
              ideal: "environment"
            }
        }
    });

    let settings = await scanner.getRuntimeSettings();

    settings.localizationModes[0] = 2;
    settings.localizationModes[1] = 8;

    settings.region.regionLeft = 25;
    settings.region.regionTop = 30;
    settings.region.regionRight = 75;
    settings.region.regionBottom = 70;
    settings.region.regionMeasuredByPercentage = 1;

    return scanner.updateRuntimeSettings(settings);
  }

  render() {
    return <div ref={this.elRef}></div>;
  }
}

export default BarcodeScannerComponent;
