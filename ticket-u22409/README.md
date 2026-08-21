## Why Edge Slow

If you turn on `Enhance your security on the web` in edge://settings/privacy/security, our SDK might be very slow.

## Key Code

timeout:
```ts
// useDynamsoftBarcode.ts
const barcodeFactory = async () => {
  const instance = await CaptureVisionRouter.createInstance();
  const settings = await instance.outputSettings('*');
  for(let cvTemplate of settings.CaptureVisionTemplates){
    if(cvTemplate.Timeout < 10000){ cvTemplate.Timeout = 10000; }
  }
  await instance.initSettings(settings);
  return instance;
};
```

remove retry

## Warning

I've tried my best to match the code you provided; this sample should work in a normal development or release environment.
However, testing has shown that the code cannot run in React's strict mode development environment.
Our [official React sample](https://github.com/Dynamsoft/barcode-reader-javascript-samples/blob/main/frameworks/react/src/components/ImageCapture/ImageCapture.tsx), on the other hand, can run in strict mode.

## Donwload Directory from Github

https://download-directory.github.io/

## Direct Support

If you have complex technical issues, please open an issue here so that developers can provide more direct support.
