let dbrBWasmDebug;
let dbrEngineResourcePath;
let dbrVersion;
let dbrProductKeys;

var Module = { // eslint-disable-line
    locateFile: function(path){//(path, prefix)
        if(path == 'libDynamsoftBarcodeReader.wasm'){
            return dbrEngineResourcePath + 'dbr-' + dbrVersion + '.wasm';
        }else{
            return dbrEngineResourcePath + path;
        }
    },
    printErr: console.error, // eslint-disable-line
    onRuntimeInitialized: async function(){
        postMessage({
            type: "log",
            message: "wasm initialized"
        });

        let initCfg = {
            productKeys: dbrProductKeys,
            domain: "https://localhost",
        };
        if(dbrBWasmDebug){
            initCfg.bDebug = true;
        }

        Module.BarcodeReaderWasm.init(JSON.stringify(initCfg));
        postMessage({
            type: "load",
            success: true,
            version: Module.BarcodeReaderWasm.getVersion()
        });
    }
};

//need comment _scriptDir in libDynamsoftBarcodeReader.js
//let _scriptDir = './dbr.worker.js'; // eslint-disable-line

let DBR_MapInstances = new Map();
let nextInstanceID = 0;

onmessage = function(e){
    const data = e.data;
    const taskID = data.id;
    const instanceID = data.instanceID;
    const body = data.body;
    switch(data.type){
    case "loadWasm": {
        dbrEngineResourcePath = data.engineResourcePath;
        dbrVersion = data.version;
        dbrProductKeys = data.productKeys;
        dbrBWasmDebug = data.bWasmDebug;
        self.importScripts(dbrEngineResourcePath + "dbr-" + dbrVersion + ".wasm.js");
        break;
    }
    case "createInstance": {
        const instanceID = nextInstanceID++;
        try{
            let reader = new Module.BarcodeReaderWasm(data.bScanner, instanceID);
            DBR_MapInstances.set(instanceID, reader);
            if(data.bScanner){
                // scanner have special settings
                let settings = reader.getRuntimeSettings();
                settings.localizationModes = [2,0,0,0,0,0,0,0]; // only enable LocalBlock
                settings.deblurLevel = 2;
                reader.updateRuntimeSettings(settings);
            }
        }catch(ex){
            handleErr(ex, taskID);
            break;
        }
        postMessage({
            type: "task",
            id: taskID,
            body: {
                success: true,
                instanceID: instanceID
            }
        });
        break;
    }
    case "destroy": {
        try{
            DBR_MapInstances.get(instanceID).delete();
            DBR_MapInstances.delete(instanceID);
        }catch(ex){
            handleErr(ex, taskID);
            break;
        }
        postMessage({
            type: "task",
            id: taskID,
            body: {
                success: true
            }
        });
        break;
    }
    case "decodeBuffer": {
        let decodeReturn;
        try{
            decodeReturn = JSON.parse(DBR_MapInstances.get(instanceID).decodeBuffer(body.buffer, body.width, body.height, body.stride, body.format));
        }catch(ex){
            handleErr(ex, taskID);
            break;
        }
        postMessage({
            type: "task",
            id: taskID,
            body: {
                success: true,
                decodeReturn: decodeReturn
            }
        });
        break;
    }
    case "getRuntimeSettings": {
        let settings;
        try{
            settings = DBR_MapInstances.get(instanceID).getRuntimeSettings();
        }catch(ex){
            handleErr(ex,taskID);
            break;
        }
        postMessage({
            type: "task",
            id: taskID,
            body: {
                success: true,
                results: settings
            }
        });
        break;
    }
    case "updateRuntimeSettings": {
        try{
            DBR_MapInstances.get(instanceID).updateRuntimeSettings(body.settings);
        }catch(ex){
            handleErr(ex,taskID);
            break;
        }
        postMessage({
            type: "task",
            id: taskID,
            body: {
                success: true
            }
        });
        break;
    }
    case "resetRuntimeSettings": {
        try{
            DBR_MapInstances.get(instanceID).resetRuntimeSettings();
        }catch(ex){
            handleErr(e,taskID);
            break;
        }
        this.postMessage({
            type: "task",
            id: taskID,
            body:{
                success: true
            }
        });
        break;
    }
    case "outputSettingsToString": {
        let settings;
        try{
            settings = DBR_MapInstances.get(instanceID).outputSettingsToString();
        }catch(ex){
            handleErr(ex,taskID);
            break;
        }
        postMessage({
            type: "task",
            id: taskID,
            body: {
                success: true,
                results: settings
            }
        });
        break;
    }
    case "initRuntimeSettingsWithString": {
        try{
            DBR_MapInstances.get(instanceID).initRuntimeSettingsWithString(body.settings);
        }catch(ex){
            handleErr(ex,taskID);
            break;
        }
        postMessage({
            type: "task",
            id: taskID,
            body: {
                success: true
            }
        });
        break;
    }
    default: 
        console.warn("Unmatched task: ", e); // eslint-disable-line
        break;
    }
};

let handleErr = (ex, taskID) => {
    postMessage({
        type: "task",
        id: taskID,
        body: {
            success: false,
            message: ex.message,
            stack: ex.stack
        }
    });
    setTimeout(()=>{
        throw ex;
    },0);
};