interface CameraInfo extends InputDeviceInfo {
    trackLabel: string;
    capabilities: DMMoreMediaTrackCapabilities;
    isFront: boolean;
}
interface DMMoreMediaTrackCapabilities extends MediaTrackCapabilities {
    focusMode?: ('continuous' | 'single-shot' | 'manual')[];
    focusDistance?: {
        max?: number;
        min: number;
    };
    zoom?: {
        max: number;
        min: number;
    };
    torch?: true;
}
type CameraZsFunc = (this: Camera, ...argArray: any[]) => void | any;
interface Camera {
    /**
     * The `opened` event is triggered when the camera `open()` from the `paused`/`closed`
     * or when call `requestResolution()` and camera is `opened`.
     */
    addEventListener(type: 'opened', listener: (this: Camera) => void | any): void;
    removeEventListener(type: 'opened', listener: (this: Camera) => void | any): void;
    /** The `closed` event is triggered when camera is `closed`. */
    addEventListener(type: 'closed', listener: (this: Camera) => void | any): void;
    removeEventListener(type: 'closed', listener: (this: Camera) => void | any): void;
}
declare class Camera {
    static _cameraNameMatcher: string[][];
    static _mapDeviceInfo: {
        [deviceId: string]: CameraInfo;
    };
    _coreShell: HTMLElement;
    _video: HTMLVideoElement;
    _coreInnerLayer: HTMLElement;
    _coreOuterLayer: HTMLElement;
    _regionBoxWrapper: HTMLElement;
    _regionBoxMask: HTMLElement;
    _regionBoxBorder: HTMLElement;
    _objectFit: 'contain' | 'cover' | 'fill';
    _uiInlineScript2Blob: boolean;
    _uiInternalCss2Blob: boolean;
    _uiInternalCss2ExistedSheet: boolean;
    _ui?: HTMLElement;
    _pOpen: Promise<void> & {
        isPending: boolean;
        resolve: () => void;
        reject: () => void;
    };
    _getUserMediaTimeout: number;
    _paused: boolean;
    _shouldClose: boolean;
    _cameraChangedWhenPaused: boolean;
    _requestedCamera: CameraPreset | MediaTrackConstraints;
    _requestedResolution: MediaTrackConstraints;
    _regionBox: {
        width?: number;
        height?: number;
        unit: 'view-size' | 'view-min';
        center: {
            x: number;
            y: number;
        };
        maskStyle?: Partial<CSSStyleDeclaration>;
        borderStyle?: Partial<CSSStyleDeclaration>;
        innerUi?: Node | NodeList;
    };
    _eventListeners: {
        [key: string]: Set<Function>;
    };
    static _delayBeforeEnumerateDevices: number;
    static _delayBeforeGetUserMedia: number;
    static _delayBeforeApplyConstraints: number;
    static _countEnsureResolution: number;
    static _arrConstructors: CameraZsFunc[];
    static _arrOnOpen: CameraZsFunc[];
    static _arrBeforeClose: CameraZsFunc[];
    static _arrOnClose: CameraZsFunc[];
    constructor();
    _taskIdIOSResizeProblem: any;
    _updateObjectFit(): void;
    get video(): HTMLVideoElement;
    get track(): MediaStreamTrack;
    get objectFit(): "contain" | "cover" | "fill";
    set objectFit(value: "contain" | "cover" | "fill");
    /**
     * While `ui` can accept various types during assignment, its value will always be an `HTMLElement` upon retrieval.
     */
    get ui(): HTMLElement;
    /**
     * Generally, the `value` can be an `HTMLElement`, `DocumentFragment` or a string of serialized html.
     * This `ui` or one of its descendants, must have class `dm-camera-core-container`.
     * If the `value` already contains the `coreShell`, `coreShell` does not move.
     * Otherwise the `coreShell` of `DMCamera` is appended to the first element that has the class `dm-camera-core-container`.
     *
     * If `value` is a falsy value, `coreShell` is used as `ui`.
     **/
    set ui(value: HTMLElement | DocumentFragment | string | undefined);
    get status(): CameraStatus;
    get requestedCamera(): "back" | "front" | "macro-back" | "quick-back" | "customized-video" | MediaTrackConstraints;
    get requestedResolution(): {
        width: number;
        height: number;
    };
    get currentCamera(): CameraInfo;
    get currentResolution(): {
        width: number;
        height: number;
    };
    /** width 0 ~ 1, height 0 ~ 1, center.x -0.5 ~ 0.5, center.y -0.5 ~ 0.5 */
    get regionBox(): {
        width?: number;
        height?: number;
        unit: "view-size" | "view-min";
        center: {
            x: number;
            y: number;
        };
        maskStyle?: Partial<CSSStyleDeclaration>;
        borderStyle?: Partial<CSSStyleDeclaration>;
        innerUi?: Node | NodeList;
    };
    onOpened: (camera: Camera) => void | any;
    static hasCamera(): Promise<boolean>;
    static hasMacroCamera(): Promise<boolean>;
    static hasFrontCamera(): Promise<boolean>;
    /**
     * tips:
     * Call getDeviceInfos() will ask for camera permission, then open camera and close internally.
     * 2nd time open camera will be a lot faster.
     **/
    static getDeviceInfos(): Promise<Readonly<CameraInfo>[]>;
    static _setCapabilities(deviceInfos: CameraInfo[]): Promise<void>;
    /** `pause()` is an idempotent operation, you can call it repeatedly without error. */
    pause(): Promise<void>;
    /** `close()` is an idempotent operation, you can call it repeatedly without error. */
    close(): Promise<void>;
    /** If call `requestCamera()` when the camera is `opened`, it will call `close()` then re`open()` Internally. */
    requestCamera(cameraPreset: CameraPreset): Promise<void>;
    /** If call `requestCamera()` when the camera is `opened`, it will call `close()` then re`open()` Internally. */
    requestCamera(deviceId: string): Promise<void>;
    /** If call `requestCamera()` when the camera is `opened`, it will call `close()` then re`open()` Internally. */
    requestCamera(deviceInfo: CameraInfo): Promise<void>;
    /** If call `requestCamera()` when the camera is `opened`, it will call `close()` then re`open()` Internally. */
    requestCamera(constraints: MediaTrackConstraints): Promise<void>;
    /**
     * If call `requestCamera()` when the camera is `opened`, it will call `close()` then re`open()` Internally.
     * @param notRequired Let browser choose use what camera.
     * */
    requestCamera(notRequired: null): Promise<void>;
    /**
     * If call `requestCamera()` when the camera is `opened`, it will call `close()` then re`open()` Internally.
     * @param resetToDefault Use SDK's dafault logic.
     * */
    requestCamera(resetToDefault: undefined): Promise<void>;
    /** If call `requestCamera()` when the camera is `opened`, it will call `close()` then re`open()` Internally. */
    requestCamera(camera: string | CameraInfo | MediaTrackConstraints): Promise<void>;
    requestResolution(width: number, height?: number): Promise<void>;
    requestResolution(widthHeightPair: [number, number] | number[]): Promise<void>;
    requestResolution(constraints: {
        width?: ConstrainULong;
        height?: ConstrainULong;
        aspectRatio?: ConstrainDouble;
    }): Promise<void>;
    requestResolution(notRequired: null): Promise<void>;
    requestResolution(resetToDefault: undefined): Promise<void>;
    /**
     * @param config
     * `x`/`y`/`width`/`height` is normally `0 ~ video.videoWidth` or `0 ~ video.videoHeight`,
     * same as [drawImage](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage).
     * If values contain decimals, it will be rounded.
     * Note that the round method takes the effect of `x` into account when rounding `width` to minimize the cumulative error.
     * The same logic applies to `height`.
     */
    getFrame(config?: {
        x?: number;
        y?: number;
        width?: number;
        height?: number;
        reusedContext?: CanvasRenderingContext2D;
    }): HTMLCanvasElement;
    /**
     * @param regionBox width 0 ~ 1, height 0 ~ 1, center.x -0.5 ~ 0.5, center.y -0.5 ~ 0.5
     * TODO: support unit pixel
     */
    setRegionBox(regionBox: {
        width?: number;
        height?: number;
        unit?: 'view-size' | 'view-min';
        center?: {
            x: number;
            y: number;
        };
        maskStyle?: Partial<CSSStyleDeclaration>;
        borderStyle?: Partial<CSSStyleDeclaration>;
        innerUi?: Node | NodeList | DocumentFragment | Node[] | string;
    }): void;
    /**
     * Add a canvas dynamically keep with the same size of the video resolution, as a overlay.
     * You can remove it by `camera.video.parentElement.removeChild(thatCanvas)` or `thatCanvas.remove()`.
     * When you add multiple canvases, you can also use `camera.video.parentElement` to control stack order.
     */
    addCanvas(): HTMLCanvasElement;
    _updateCanvasSize(): void;
    _callOpenedListeners(): void;
    /**
     * Convert video x/y to absolute left/top in `document.body`.
     * So you can easily add a overlay with absolute position.
     * Processing multiple points at once has higher performance than calling multiple times.
     */
    videoXY2AbsoluteLT(points: {
        x: number;
        y: number;
    }[]): {
        left: number;
        top: number;
    }[];
    /**
     * Convert video x/y to fixed left/top in `document.body`.
     * So you can easily add a overlay with fixed position.
     * Processing multiple points at once has higher performance than calling multiple times.
     */
    videoXY2FixedLT(points: {
        x: number;
        y: number;
    }[]): {
        left: number;
        top: number;
    }[];
    /**
     * @param isConsiderRegionBox Default is `false`. Only consider the visible area in the region box.
     * @param rounded Default is `false`. Controls whether the result should be rounded.
     * Note that the round method takes the effect of `x` into account when rounding `width` to minimize the cumulative error.
     * The same logic applies to `height`.
     * @returns
     * `x`/`width` is `0 ~ video.videoWidth`, `y`/`height` is `0 ~ video.videoHeight`.
     */
    getVisibleAreaInVideoXY(config?: {
        isConsiderRegionBox?: boolean;
        rounded?: boolean;
    }): {
        x: number;
        y: number;
        width: number;
        height: number;
    };
}
type CameraStatus = 'closed' | 'opening' | 'opened' | 'paused' | 'closing';
declare const ArrCameraPreset: readonly ["back", "front", "macro-back", "quick-back", "customized-video"];
type CameraPreset = typeof ArrCameraPreset[number];


    interface Camera {
        correctAdvancedConstraint(constraints?: MediaTrackConstraints): MediaTrackConstraints;
    }


    interface Camera {
        _softZoom: {
            zoom: number;
            center: {
                x: number;
                y: number;
            };
        };
        get softZoom(): {
            zoom: number;
            center: {
                x: number;
                y: number;
            };
        };
        _isMirrored: boolean;
        get isMirrored(): boolean;
        set isMirrored(value: boolean);
        maxZoom4GestureWheel: number;
        _lastZoomTime: number;
        _mapZoomTouchs: Map<number, {
            x: number;
            y: number;
        }>;
        _gestureZoomListener: EventListener;
        get enableGestureZoom(): boolean;
        set enableGestureZoom(value: boolean);
        _wheelZoomListener: EventListener;
        get enableWheelZoom(): boolean;
        set enableWheelZoom(value: boolean);
        getZoomRange(): {
            min: number;
            max: number;
        } | undefined;
        setZoom(zoom: number): Promise<void>;
        /**
         * Js software-level zoom.
         * It does not rely on camera device and camera driver support for zoom.
         * @param center
         * zoomed camera center in orignal frame.
         * `x`: -0.5 ~ 0.5, `y`: -0.5 ~ 0.5.
         * @param limit
         * limit `zoom` >= 1.
         * limit the center point position according to `zoom`,
         * so zoomed frame is inside video boundary;
         */
        setSoftZoom(zoom: number, config?: {
            center?: {
                x: number;
                y: number;
            };
            limit?: boolean;
        }): void;
        _changeZoomByWheel(ev: WheelEvent): void;
        _changeZoomByTouch(ev: TouchEvent): void;
        /** The `zoom` event is triggered when zoom updated via a touch gesture or mouse wheel. */
        addEventListener(type: 'zoom', listener: (this: Camera, softZoom?: {
            zoom: number;
            center: {
                x: number;
                y: number;
            };
        }) => void | any): void;
        removeEventListener(type: 'zoom', listener: (this: Camera, softZoom?: {
            zoom: number;
            center: {
                x: number;
                y: number;
            };
        }) => void | any): void;
    }

interface AdvancedFocusParameters {
    minFocusDistanceLimit?: number;
    maxFocusDistanceLimit?: number;
    firstStepWaitDuration?: number;
    coarseStepWaitDuration?: number;
    switchStepWaitDuration?: number;
    fineStepWaitDuration?: number;
    maxStepCount?: number;
    /** value < 0 means no never */
    backToContinousDuration?: number;
    /** The focus width and height, 0 ~ 1, represents the ratio of the length to the `Math.min(video.videoWidth, video.videoHeight)` */
    focusWH?: number;
    /** From far to near, 0 ~ 1. The closer to 1, the more sensitive but more slow. */
    coarseTuneRate?: number;
    /**
     * 0 ~ 1.
     * When the correct focus is closer, the far focus contrast data is unreliable
     * and requires a certain degree of error tolerance.
     * When closer to 1, it will be more sensitive to contrast changes and may also cause the focus to be too far.
     * When closer to 0, there will be more error tolerance,
     * and it may also cause the focus to be too close and the process to be too slow.
     **/
    coarseTuneTolerance?: number;
    /** From near to far, 1 ~ 1.xx. The closer to 1, the more sensitive but more slow. */
    fineTuneRate?: number;
}
declare namespace Camera {
        function _getImageContrast(data: Uint8Array | Uint8ClampedArray, width: number, height: number): number;
    }
    interface Camera {
        _enableTapToFocus: false | 'simple' | 'experimental-advanced';
        _isFocusing: boolean;
        _tapToFocusListner: EventListener;
        _simpleFocus(): Promise<void>;
        _advancedFocusParameters: AdvancedFocusParameters;
        _advancedFocusTaskId: number;
        _advancedFocus(center?: {
            x: number;
            y: number;
        }, width?: number, height?: number): Promise<void>;
        get enableTapToFocus(): false | "simple" | "experimental-advanced";
        set enableTapToFocus(value: false | 'simple' | 'experimental-advanced');
    }

interface AutoTorchParameters {
    shortDelay: number;
    longDelay: number;
    shortLongDelaySwitchCount: number;
    /** 0 ~ 255 */
    grayThreshold: number;
    maxDarkCount: number;
}

    interface Camera {
        get isSupportTorch(): boolean;
        _isTorchOn: boolean | undefined;
        /** `undefined` means in auto torch mode */
        get isTorchOn(): boolean | undefined;
        turnOnTorch(): Promise<void>;
        turnOffTorch(): Promise<void>;
        _autoTorchParameters: AutoTorchParameters;
        /**
         * Detect how dark the picture and turn on torch automatically.
         * After camera open, it may take a few seconds for picture to be ready.
         * So it's suggested not to `turnAutoTorch()` immediately.
         * Waiting for 3 seconds may bring a better user experience.
         **/
        turnAutoTorch(): void;
        /** The auto torch logic detected that the image was too dark and turn on the torch. */
        addEventListener(type: 'torchAutoOn', listener: (this: Camera) => void | any): void;
        removeEventListener(type: 'torchAutoOn', listener: (this: Camera) => void | any): void;
    }


    interface Camera {
        _shouldCloseWhenHide: boolean;
        _isDuringCloseWhenHide: boolean;
        _isOpenBeforeHide: boolean;
        _maxReopenTry4CloseWhenHide: number;
        get shouldCloseWhenHide(): boolean;
        set shouldCloseWhenHide(value: boolean);
        _closeWhenHide(): Promise<void>;
        _closeWhenHideListener: EventListener;
    }
declare namespace Camera {
        function showFilePicker(inputOptions?: {
            accept?: string;
            multiple: boolean;
            capture?: 'user' | 'environment' | '';
            onchange?: (this: HTMLInputElement, ev: Event) => any;
        }): Promise<File[]>;
        function showFilePicker(inputOptions?: any): Promise<File[]>;
    }

/**
 * Return `Element` if possible, otherwise return `DocumentFragment`.
 */
declare const stringToHtml: (str: string, config?: {
    inlineScript2Blob?: boolean;
    internalCss2Blob: boolean;
    insertInternalCss2ExistedSheet?: boolean;
}) => Node;

declare class FramePipeline {
    camera: Camera;
    _ctx: CanvasRenderingContext2D;
    _data: Uint8Array<ArrayBuffer>;
    _dataTime: number;
    _x: number;
    _y: number;
    _w: number;
    _h: number;
    _type: string;
    maxTimeout: number;
    _pipeTaskId: any;
    isSaveOriginalRgba: boolean;
    /**
     * The `originalRgba` share `ArrayBuffer` with the `data` returned by `getData(..., type: 'rgba')`.
     * So you should be careful when transferring `data` to other thread.
     */
    originalRgba: Uint8ClampedArray<ArrayBuffer>;
    constructor(camera?: Camera);
    _getData(): Uint8Array<ArrayBuffer>;
    /**
     * @param config
     * Each parameter should be kept as stable as possible.
     * If you need to switch between multiple parameters frequently, please create multiple `FramePipeline` instances.
     *
     * `x`, `y`, `width`, `height` will be rounded.
     * Note that the round method takes the effect of `x` into account when rounding `width` to minimize the cumulative error.
     * The same logic applies to `height`.
     */
    getData(config?: {
        x?: number;
        y?: number;
        width?: number;
        height?: number;
        type?: 'rgba' | 'gray';
    }): Uint8Array;
}

declare class Beep {
    _stAudioFree: Set<unknown>;
    _stAudioPlaying: Set<unknown>;
    _timeLastPlay: number;
    _bWarnedMaxTrack: boolean;
    maxPlayingBeep: number;
    beepSoundSource: string;
    beep(): void;
}
/**
 * The function will play the default beep sound.
 * To play different beep sound, you need create another `Beep` instance.
 **/
declare const beep: () => void;
declare const vibrate: (duration?: number) => void;

declare const CameraEnhancerModule: {
    getVersion(): string;
};
declare const CameraEnhancer: typeof Camera;
type CameraEnhancer = Camera;
declare const CameraView: typeof Camera;
type CameraView = Camera;
declare namespace Camera {
        function createInstance(_?: any): Promise<CameraEnhancer>;
        function testCameraAccess(): Promise<{
            ok: boolean;
            message?: string;
        }>;
        let defaultUIElementURL: string;
        let onWarning: any;
    }
    interface Camera {
        isCameraEnhancer: true;
        disposed: boolean;
        dispose(): void;
        _cameraEnhancer: CameraEnhancer;
        _cameraView: CameraView;
        _dceLastDeviceId: any;
        _dceLastResolution: any;
        cameraOpenTimeout: any;
        _bTryAnotherCameraWhenFailToOpen: boolean;
        _bAutoSingleFrameModeWhenIosPwaFail: boolean;
        _oriOpen(): Promise<void>;
        open(): Promise<void | {
            deviceId: string;
            width: number;
            height: number;
        }>;
        _oriUpdateCanvasSize(): void;
        _oriAddCanvas(): HTMLCanvasElement;
        getAllCameras(): Promise<{
            deviceId: string;
            label: string;
        }[]>;
        getAvailableResolutions(): Promise<{
            width: number;
            height: number;
        }[]>;
        getCameraState(): 'opening' | 'open' | 'closed';
        getResolution(): {
            width: number;
            height: number;
        };
        getSelectedCamera(): {
            deviceId: string;
            label: string;
        };
        getVideoSettings(): MediaStreamConstraints;
        _ifSaveLastUsedCamera: boolean;
        get ifSaveLastUsedCamera(): boolean;
        set ifSaveLastUsedCamera(value: boolean);
        get ifSkipCameraInspection(): boolean;
        set ifSkipCameraInspection(value: boolean);
        isOpen(): boolean;
        isPaused(): boolean;
        resume(): Promise<void>;
        selectCamera(device: string | {
            deviceId: string;
            label: string;
        }): Promise<{
            deviceId: string;
            width: number;
            height: number;
        }>;
        setResolution(resolution: {
            width: number;
            height: number;
        }): Promise<{
            deviceId: string;
            width: number;
            height: number;
        }>;
        updateVideoSettings(constraints: MediaStreamConstraints): Promise<void>;
        _dceVideoSrc: string;
        get videoSrc(): string;
        set videoSrc(value: string | null);
        _dceEnhancedFeatures: any;
        _dceAutoZoomRange: {
            min: number;
            max: number;
        };
        disableEnhancedFeatures(feature: any): void;
        enableEnhancedFeatures(feature: any): void;
        getCameraSettings(): MediaTrackSettings;
        getCapabilities(): MediaTrackCapabilities;
        getColorTemperature(): number;
        getExposureCompensation(): number;
        getFrameRate(): number;
        setColorTemperature(value: number): Promise<void>;
        setExposureCompensation(value: number): Promise<void>;
        setFrameRate(value: number): Promise<void>;
        getZoomSettings(): {
            factor: number;
        };
        _oriSetZoom(zoom: number): Promise<void>;
        _dceZoom: number;
        setZoom(settings: {
            factor: number;
        }): Promise<void>;
        resetZoom(): void;
        _dceFocusSettings: any;
        getFocusSettings(): {
            mode: string;
        } | {
            mode: 'manual';
            distance: number;
        } | {
            mode: 'manual';
            area: {
                centerPoint: {
                    x: string;
                    y: string;
                };
                width?: string;
                height?: string;
            };
        };
        setFocus(settings: {
            mode: string;
        } | {
            mode: 'manual';
            distance: number;
        } | {
            mode: 'manual';
            area: {
                centerPoint: {
                    x: string;
                    y: string;
                };
                width?: string;
                height?: string;
            };
        }): Promise<void>;
        setAutoZoomRange(value: {
            min: number;
            max: number;
        }): void;
        getAutoZoomRange(): {
            min: number;
            max: number;
        };
        toggleMirroring(enable: boolean): void;
        _framePipeline: FramePipeline;
        fetchImage(): {
            bytes: Uint8Array;
            width: number;
            height: number;
            stride: number;
            format: any;
            toCanvas(): HTMLCanvasElement;
        };
        getImage(): {
            bytes: Uint8Array;
            width: number;
            height: number;
            stride: number;
            format: any;
            toCanvas(): HTMLCanvasElement;
        };
        _dceScanRegion: {
            x: number;
            y: number;
            width: number;
            height: number;
            isMeasuredInPercentage?: boolean;
        } | {
            left: number;
            top: number;
            right: number;
            bottom: number;
            isMeasuredInPercentage?: boolean;
        };
        getScanRegion(): {
            x: number;
            y: number;
            width: number;
            height: number;
            isMeasuredInPercentage?: boolean;
        } | {
            left: number;
            top: number;
            right: number;
            bottom: number;
            isMeasuredInPercentage?: boolean;
        };
        hasNextImageToFetch(): boolean;
        isBufferEmpty(): boolean;
        startFetching(): void;
        _pixelFormat: number;
        getPixelFormat(): number;
        setPixelFormat(format: number): void;
        _colourChannelUsageType: number;
        setColourChannelUsageType(format: number): void;
        getColourChannelUsageType(): number;
        setScanRegion(region?: {
            x: number;
            y: number;
            width: number;
            height: number;
            isMeasuredInPercentage?: boolean;
        } | {
            left: number;
            top: number;
            right: number;
            bottom: number;
            isMeasuredInPercentage?: boolean;
        }): void;
        stopFetching(): void;
        takePhoto(listener: (dceFrame: {
            bytes: Uint8Array;
            width: number;
            height: number;
            stride: number;
            format: any;
            toCanvas(): HTMLCanvasElement;
        }) => void): Promise<{
            bytes: Uint8Array;
            width: number;
            height: number;
            stride: number;
            format: any;
            toCanvas(): HTMLCanvasElement;
        }>;
        addImageToBuffer: any;
        clearBuffer: any;
        getBufferOverflowProtectionMode: any;
        getImageCount: any;
        getImageFetchInterval: any;
        getMaxImageCount: any;
        hasImage: any;
        setBufferOverflowProtectionMode: any;
        setErrorListener: any;
        setImageFetchInterval: any;
        setMaxImageCount: any;
        setNextImageToReturn: any;
        _dceSettingsBeforeSingleFrameMode: any;
        _singleFrameMode: "disabled" | "camera" | "image";
        _singleFrameModeClickCallback: any;
        _singleFrameModeResultForDcv: DCEFrame;
        _singleFrameModeCvs: HTMLCanvasElement;
        get singleFrameMode(): "disabled" | "camera" | "image";
        set singleFrameMode(value: "disabled" | "camera" | "image");
        setCameraView(view: CameraView): void;
        getCameraView(): CameraView;
        getVideoEl(): HTMLVideoElement;
        convertToPageCoordinates(point: {
            x: number;
            y: number;
        }): {
            x: number;
            y: number;
        };
        convertToClientCoordinates(point: {
            x: number;
            y: number;
        }): {
            x: number;
            y: number;
        };
        convertToScanRegionCoordinates(point: {
            x: number;
            y: number;
        }): {
            x: number;
            y: number;
        };
        convertToContainCoordinates(point: {
            x: number;
            y: number;
        }): {
            x: number;
            y: number;
        };
        _dceEventListeners: {
            [key: string]: Set<Function>;
        };
        on(eventName: string, listener: Function): void;
        off(eventName: string, listener: Function): void;
        _dceMNIsBeepBarcode: boolean;
        _dceMNIsVibrateBarcode: boolean;
        getUIElement(): HTMLElement;
        setUIElement(ui: HTMLDivElement | string): Promise<void>;
        getVideoElement(): HTMLVideoElement;
        setVideoFit(fit: 'contain' | 'cover' | 'fill'): void;
        getVideoFit(): 'contain' | 'cover' | 'fill';
        getVisibleRegionOfVideo(options?: {
            inPixels?: boolean;
        }): {
            x: number;
            y: number;
            width: number;
            height: number;
            isMeasuredInPercentage?: boolean;
        };
        _dceRegionMaskStyle: {
            lineWidth: number;
            strokeStyle: string;
            fillStyle: string;
        };
        setScanRegionMaskStyle(style: {
            lineWidth: number;
            strokeStyle: string;
            fillStyle: string;
        }): void;
        getScanRegionMaskStyle(): {
            lineWidth: number;
            strokeStyle: string;
            fillStyle: string;
        };
        _dceRegionMaskVisible: boolean;
        setScanRegionMaskVisible(visible: boolean): void;
        isScanRegionMaskVisible(): boolean;
        setScanLaserVisible(visible: boolean): void;
        isScanLaserVisible(): boolean;
        setPowerByMessageVisible(visible: boolean): void;
        isPowerByMessageVisible(): boolean;
        _dceTipDuration: number;
        _dceTipMessage: string;
        getTipConfig(): TipConfig;
        setTipConfig(tipConfig: TipConfig): void;
        setTipVisible(visible: boolean): void;
        isTipVisible(): boolean;
        updateTipMessage(message: string): void;
        _drawingLayers: DrawingLayer[];
        createDrawingLayer(): DrawingLayer;
        getDrawingLayer(id: number): DrawingLayer;
        getAllDrawingLayers(): DrawingLayer[];
        clearUserDefinedDrawingLayers(): void;
        deleteUserDefinedDrawingLayer(id: number): void;
        clearAllInnerDrawingItems(_?: boolean): void;
        _capturedResultReceiver: any;
    }
declare function _bufferToCanvas(uint8Array: Uint8Array, width: number, height: number, format: number): HTMLCanvasElement;
declare class Feedback {
    static _beepInstance: Beep;
    static beep(): void;
    static get beepSoundSource(): string;
    static set beepSoundSource(value: string);
    static vibrate(): void;
    static vibrateDuration: number;
}
declare const DrawingStyleManager: {
    STYLE_GREEN_STROKE: any;
    STYLE_GREEN_STROKE_FILL: any;
    STYLE_GREEN_STROKE_TRANSPARENT: any;
    STYLE_BLUE_STROKE: any;
    STYLE_BLUE_STROKE_FILL: any;
    STYLE_BLUE_STROKE_TRANSPARENT: any;
    STYLE_ORANGE_STROKE: any;
    STYLE_ORANGE_STROKE_FILL: any;
    STYLE_ORANGE_STROKE_TRANSPARENT: any;
    STYLE_YELLOW_STROKE: any;
    STYLE_YELLOW_STROKE_FILL: any;
    STYLE_YELLOW_STROKE_TRANSPARENT: any;
    createDrawingStyle(style: any): any;
    getDrawingStyle(id: any): any;
    getAllDrawingStyles(): any[];
    updateDrawingStyle(id: any, style: any): void;
};
declare class DrawingLayer {
    _visible: boolean;
    _dce: CameraView;
    _ctx: CanvasRenderingContext2D;
    _defaultStyle: any;
    _drawingItems: DrawingItem[];
    _mode: 'editor' | 'viewer';
    _editorView: any;
    _renderTask: any;
    _newSelectedDrawingItems: DrawingItem[];
    _newDeselectedDrawingItems: DrawingItem[];
    _selectionChangedTask: any;
    _onSelectionChanged: (newSelectedDrawingItems: DrawingItem[], newDeselectedDrawingItems: DrawingItem[]) => void;
    getId(): this;
    isVisible(): boolean;
    setVisible(value: boolean): void;
    setDefaultStyle(drawingStyleId: any, _1?: any, _2?: any): void;
    addDrawingItems(drawingItems: DrawingItem[]): void;
    removeDrawingItems(drawingItems: DrawingItem[]): void;
    setDrawingItems(drawingItems: DrawingItem[]): void;
    getDrawingItems(filter?: (drawingItem: DrawingItem) => boolean): DrawingItem[];
    hasDrawingItem(drawingItem: DrawingItem): boolean;
    getSelectedDrawingItems(): any;
    clearDrawingItems(): void;
    _delayRenderAll(): void;
    renderAll(): void;
    getMode(): "editor" | "viewer";
    setMode(mode: 'editor' | 'viewer'): Promise<void>;
    _delaySelectionChanged(): void;
    get onSelectionChanged(): (newSelectedDrawingItems: DrawingItem[], newDeselectedDrawingItems: DrawingItem[]) => void;
    set onSelectionChanged(value: (newSelectedDrawingItems: DrawingItem[], newDeselectedDrawingItems: DrawingItem[]) => void);
}
/**
 * Determines if a point is inside a quadrilateral.
 * @param {number[]} point - [x, y] coordinates of the point.
 * @param {number[][]} polygon - Array of points [[x0, y0], [x1, y1], [x2, y2], [x3, y3]].
 * @returns {boolean} - True if the point is inside.
 */
declare function _isPointInPolygon(point: number[], polygon: number[][]): boolean;
/**
 * Calculates the shortest distance from a point to a line segment.
 * @param {number[]} p - The point [x, y]
 * @param {number[][]} segment - The segment [[x1, y1], [x2, y2]]
 * @returns {number} The shortest distance
 */
declare function _distToSegment(p: number[], segment: number[][]): number;
declare class DrawingItem {
    coordinateBase: string;
    drawingLayerId: any;
    drawingStyleId: any;
    mediaType: EnumDrawingItemMediaType;
    _notes: Note[];
    _bSelected: boolean;
    _dceEventListeners: {
        [key: string]: Set<Function>;
    };
    get _ps(): {
        x: number;
        y: number;
    }[];
    getState(): EnumDrawingItemState;
    addNote(note: Note, replace?: boolean): void;
    getNote(name: string): Note;
    getNotes(): Note[];
    hasNote(name: string): boolean;
    updateNote(name: string, content: any, isMergeContent?: boolean): void;
    deleteNote(name: string): void;
    clearNotes(): void;
    _delayRenderAll(): void;
    _setSelected(value: boolean): void;
    on(type: string, listener: Function): void;
    off(type: string, listener: Function): void;
}
declare class LineDrawingItem extends DrawingItem {
    line: {
        startPoint: {
            x: number;
            y: number;
        };
        endPoint: {
            x: number;
            y: number;
        };
    };
    get _ps(): {
        x: number;
        y: number;
    }[];
    constructor(line: {
        startPoint: {
            x: number;
            y: number;
        };
        endPoint: {
            x: number;
            y: number;
        };
    }, drawingStyleId?: any);
    getLine(): {
        startPoint: {
            x: number;
            y: number;
        };
        endPoint: {
            x: number;
            y: number;
        };
    };
    setLine(value: any): void;
}
declare class QuadDrawingItem extends DrawingItem {
    quad: {
        points: {
            x: number;
            y: number;
        }[];
    };
    get _ps(): {
        x: number;
        y: number;
    }[];
    constructor(quad: {
        points: {
            x: number;
            y: number;
        }[];
    }, drawingStyleId?: any);
    getQuad(): {
        points: {
            x: number;
            y: number;
        }[];
    };
    setQuad(value: any): void;
}
declare class RectDrawingItem extends DrawingItem {
    rect: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    get _ps(): {
        x: number;
        y: number;
    }[];
    constructor(rect: {
        x: number;
        y: number;
        width: number;
        height: number;
    }, drawingStyleId?: any);
    getRect(): {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    setRect(value: any): void;
}
declare class TextDrawingItem extends DrawingItem {
    text: string;
    rect: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    get _ps(): {
        x: number;
        y: number;
    }[];
    constructor(text: string, rect: {
        x: number;
        y: number;
        width: number;
        height: number;
    }, drawingStyleId?: any);
    getText(): string;
    setText(value: any): void;
    getRect(): {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    setRect(value: any): void;
}
declare class ImageDrawingItem extends DrawingItem {
    image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement;
    rect: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    maintainAspectRatio: boolean;
    get _ps(): {
        x: number;
        y: number;
    }[];
    constructor(image: {
        bytes: Uint8Array;
        width: number;
        height: number;
        stride: number;
        format: any;
    } | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement, rect: {
        x: number;
        y: number;
        width: number;
        height: number;
    }, maintainAspectRatio: boolean, drawingStyleId?: any);
    getImage(): HTMLVideoElement | HTMLCanvasElement | HTMLImageElement;
    setImage(value: any): void;
    getRect(): {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    setRect(value: any): void;
}

declare enum EnumDrawingItemMediaType {
    /**
     * Represents a rectangle, a basic geometric shape with four sides where opposite sides are equal in length and it has four right angles.
     */
    DIMT_RECTANGLE = 1,
    /**
     * Represents any four-sided figure. This includes squares, rectangles, rhombuses, and more general forms that do not necessarily have right angles or equal sides.
     */
    DIMT_QUADRILATERAL = 2,
    /**
     * Represents a text element. This allows for the inclusion of textual content as a distinct drawing item within the graphic representation.
     */
    DIMT_TEXT = 4,
    /**
     * Represents an arc, which is a portion of the circumference of a circle or an ellipse. Arcs are used to create curved shapes and segments.
     */
    DIMT_ARC = 8,
    /**
     * Represents an image. This enables embedding bitmap images within the drawing context.
     */
    DIMT_IMAGE = 16,
    /**
     * Represents a polygon, which is a plane figure that is described by a finite number of straight line segments connected to form a closed polygonal chain or circuit.
     */
    DIMT_POLYGON = 32,
    /**
     * Represents a line segment. This is the simplest form of a drawing item, defined by two endpoints and the straight path connecting them.
     */
    DIMT_LINE = 64,
    /**
     * Represents a group of drawing items. This allows for the logical grouping of multiple items, treating them as a single entity for manipulation or transformation purposes.
     */
    DIMT_GROUP = 128
}
declare enum EnumDrawingItemState {
    /**
     * DIS_DEFAULT: The default state of a drawing item. This state indicates that the drawing item is in its normal, unselected state.
     */
    DIS_DEFAULT = 1,
    /**
     * DIS_SELECTED: Indicates that the drawing item is currently selected. This state can trigger different behaviors or visual styles, such as highlighting the item to show it is active or the focus of user interaction.
     */
    DIS_SELECTED = 2
}
declare enum EnumEnhancedFeatures {
    /**
     * Enables auto-focus on areas likely to contain barcodes, assisting in their identification and interpretation.
     */
    EF_ENHANCED_FOCUS = 4,
    /**
     * Facilitates automatic zooming in on areas likely to contain barcodes, aiding in their detection and decoding.
     */
    EF_AUTO_ZOOM = 16,
    /**
     * Allows users to tap on a specific item or area in the video feed to focus on, simplifying the interaction for selecting or highlighting important elements.
     */
    EF_TAP_TO_FOCUS = 64
}
declare enum EnumPixelFormat {
    GREY = "grey",
    GREY32 = "grey32",
    RGBA = "rgba",
    RBGA = "rbga",
    GRBA = "grba",
    GBRA = "gbra",
    BRGA = "brga",
    BGRA = "bgra"
}
interface Resolution {
    width: number;
    height: number;
}
interface DCEFrame {
    bytes: Uint8Array;
    width: number;
    height: number;
    stride: number;
    format: any;
    toCanvas(): HTMLCanvasElement;
}
interface DrawingStyle {
    fillStyle?: string;
    lineWidth?: number;
    paintMode?: string;
    strokeStyle?: string;
}
interface PlayCallbackInfo {
    deviceId: string;
    width: number;
    height: number;
}
interface VideoDeviceInfo {
    deviceId: string;
    label: string;
}
interface VideoFrameTag {
    /** The unique identifier of the image. */
    imageId: number;
    /** The type of the image. */
    type: any;
    /** Indicates whether the video frame is cropped. */
    isCropped: boolean;
    /** The region based on which the original frame was cropped. If `isCropped` is false, the region covers the entire original image. */
    cropRegion: any;
    /** The original width of the video frame before any cropping. */
    originalWidth: number;
    /** The original height of the video frame before any cropping. */
    originalHeight: number;
    /** The current width of the video frame after cropping. */
    currentWidth: number;
    /** The current height of the video frame after cropping. */
    currentHeight: number;
    /** The time spent acquiring the frame, in milliseconds. */
    timeSpent: number;
    /** The timestamp marking the completion of the frame acquisition. */
    timeStamp: number;
}
interface TipConfig {
    /** The top left point of the tip message box. */
    topLeftPoint?: any;
    /** The width of the tip message box. */
    width?: number;
    /** The display duration of the tip in milliseconds. */
    duration: number;
    /** The base coordinate system used (e.g., "view" or "image"). */
    coordinateBase?: "view" | "image";
}
interface Note {
    /** The name of the note. */
    name: string;
    /** The content of the note, can be of any type. */
    content: any;
}

declare let KPainter: any;
declare class ImageEditorView {
    _painter: any;
    _oriImage: any;
    _drawingLayers: DrawingLayer[];
    static createInstance(defaultUIElement?: HTMLDivElement): Promise<ImageEditorView>;
    disposed: boolean;
    dispose(): void;
    getUIElement(): HTMLElement;
    setUIElement(uiElement: HTMLDivElement): Promise<void>;
    setOriginalImage(image: {
        bytes: Uint8Array;
        width: number;
        height: number;
        stride: number;
        format: any;
        tag?: any;
    } | HTMLCanvasElement | HTMLImageElement): Promise<void>;
    _updateCvsToPainter(): void;
    _updateFreeTransformWhenInitImgOrItem(): void;
    getOriginalImage(): {
        bytes: Uint8Array;
        width: number;
        height: number;
        stride: number;
        format: any;
        tag?: any;
    } | HTMLCanvasElement | HTMLImageElement;
    _createDrawingLayer(): DrawingLayer;
    createDrawingLayer(): DrawingLayer;
    getDrawingLayer(id: any): DrawingLayer | null;
    getAllDrawingLayers(): DrawingLayer[];
    clearUserDefinedDrawingLayers(): void;
    deleteUserDefinedDrawingLayer(id: number): void;
    getSelectedDrawingItems(): DrawingItem[];
    get _firstLayer(): DrawingLayer;
}

export { Beep, Camera, CameraEnhancer, CameraEnhancerModule, CameraInfo, CameraPreset, CameraStatus, CameraView, CameraZsFunc, DCEFrame, DMMoreMediaTrackCapabilities, DrawingItem, DrawingLayer, DrawingStyle, DrawingStyleManager, EnumDrawingItemMediaType, EnumDrawingItemState, EnumEnhancedFeatures, EnumPixelFormat, Feedback, FramePipeline, ImageDrawingItem, ImageEditorView, KPainter, LineDrawingItem, Note, PlayCallbackInfo, QuadDrawingItem, RectDrawingItem, Resolution, TextDrawingItem, TipConfig, VideoDeviceInfo, VideoFrameTag, _bufferToCanvas, _distToSegment, _isPointInPolygon, beep, stringToHtml, vibrate };
