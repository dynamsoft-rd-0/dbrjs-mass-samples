import { EngineResourcePaths, DSImageData } from 'dynamsoft-core';
import * as dynamsoftCore from 'dynamsoft-core';
export { dynamsoftCore as Core };
import { CapturedResult } from 'dynamsoft-capture-vision-router';
import * as dynamsoftCaptureVisionRouter from 'dynamsoft-capture-vision-router';
export { dynamsoftCaptureVisionRouter as CVR };
import { EnumBarcodeFormat, BarcodeResultItem } from 'dynamsoft-barcode-reader';
import * as dynamsoftBarcodeReader from 'dynamsoft-barcode-reader';
export { dynamsoftBarcodeReader as DBR };
import * as dynamsoftLicense from 'dynamsoft-license';
export { dynamsoftLicense as License };
import * as dynamsoftCameraEnhancer from 'dynamsoft-camera-enhancer';
export { dynamsoftCameraEnhancer as DCE };
import * as dynamsoftUtility from 'dynamsoft-utility';
export { dynamsoftUtility as Utility };

declare enum EnumScanMode {
    SM_SINGLE = 0,
    SM_MULTI_UNIQUE = 1
}
declare enum EnumOptimizationMode {
    OM_NONE = 0,
    OM_SPEED = 1,
    OM_COVERAGE = 2,
    OM_BALANCE = 3,
    OM_DPM = 4,
    OM_DENSE = 5
}
declare enum EnumResultStatus {
    RS_SUCCESS = 0,
    RS_CANCELLED = 1,
    RS_FAILED = 2
}

interface BarcodeScannerConfig {
    license?: string;
    /**
     * SM_CONTINUOUS: Only under this mode will a result view be useful.
     * SM_SINGLE: result view is not rendered.
     */
    scanMode?: EnumScanMode;
    templateFilePath?: string;
    utilizedTemplateNames?: UtilizedTemplateNames;
    engineResourcePaths?: EngineResourcePaths;
    barcodeFormats?: Array<EnumBarcodeFormat>;
    duplicateForgetTime?: number;
    /**
     * Specifies an HTML container to hold the Views.
     * A: Specified: Ignore view container for scanner/view.
     * B: Not specified:
     *   1. If no container for either scanner or result view, then auto-create one with full viewport size
     *   2. If container specified for scanner or result view, use these containers
     * SM_CONTINUOUS mode + both views are present in one container (A or B1)
     *   1. Portrait: video up with 50% fixed height; result down with 50% height, hovering toolbar and scrollable result pane
     *   2. Landscape: video left with 50% fixed width; result right with 50% width (scrollable, toolbar down, hovering)
     * SM_SINGLE mode
     *   In single mode, the container is only for the scannerView, no result view rendered
     */
    container?: HTMLElement | string | undefined;
    /**
     * Callback valid only when scanMode is "SM_CONTINUOUS"
     * @param result The barcode result (one at a time);
     */
    onUniqueBarcodeScanned?: (result: BarcodeResultItem) => {};
    showResultView?: boolean;
    showUploadImageButton?: boolean;
    /**
     * The scanner view is just video with a close button
     * The scanner UI has video covered (object-fit: cover;)
     * Only detect barcode within the view
     */
    scannerViewConfig?: ScannerViewConfig;
    /**
     * result view config is only valid when the mode is SM_CONTINUOUS
     */
    resultViewConfig?: ResultViewConfig;
}
interface ScannerViewConfig {
    container?: HTMLElement | string | undefined;
    cameraEnhancerUIPath?: string;
    showCloseButton?: boolean;
}
interface BarcodeResultViewToolbarButtonsConfig {
    clear?: ToolbarButtonConfig;
    done?: ToolbarButtonConfig;
}
interface ResultViewConfig {
    container?: HTMLElement | string | undefined;
    toolbarButtonsConfig?: BarcodeResultViewToolbarButtonsConfig;
}

/**** New ones in DBS JS ****/
/** Start of Shared Ones **/
type ResultStatus = {
    code: EnumResultStatus;
    message?: string;
};
interface ToolbarButtonConfig {
    label: string;
    className?: string;
    isHidden?: boolean;
}
/** End of Shared Ones **/
/** Start of DBS Only Ones **/
interface BarcodeScanResult {
    status: ResultStatus;
    barcodeResults?: Array<BarcodeResultItem>;
    originalImageResult?: DSImageData;
    barcodeImage?: DSImageData;
}
interface UtilizedTemplateNames {
    single: string;
    multi_unique: string;
    image: string;
}

declare class BarcodeScanner {
    #private;
    private _cameraEnhancer;
    private _cameraView;
    private _cvRouter;
    config: BarcodeScannerConfig;
    constructor(config?: BarcodeScannerConfig);
    launch(): Promise<BarcodeScanResult>;
    decode(imageOrFile: Blob | string | DSImageData | HTMLImageElement | HTMLVideoElement | HTMLCanvasElement, templateName?: string): Promise<CapturedResult>;
    dispose(): void;
}

export { BarcodeScanner, EnumOptimizationMode, EnumResultStatus, EnumScanMode };
export type { BarcodeResultViewToolbarButtonsConfig, BarcodeScanResult, BarcodeScannerConfig, ResultStatus, ResultViewConfig, ScannerViewConfig, ToolbarButtonConfig, UtilizedTemplateNames };
