if(typeof global != "undefined" && typeof HTMLCanvasElement=="undefined"){
    global.HTMLCanvasElement = "NO_USE_BUT_TELL_YOU_IT_IS_SSR";
    global.document = {};
    global.navigator = {};
    // todo? still lack lot of APIs
    // give up, we need another solution
}
export {};