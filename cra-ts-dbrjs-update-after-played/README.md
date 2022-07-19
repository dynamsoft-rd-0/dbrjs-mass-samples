## run directly

https://tst.dynamsoft.com/temp/cra-ts-dbrjs-update-after-played/index.html

## what I change

```ts
// BarcodeScannerComponent.tsx

pScanner: Promise<BarcodeScanner>;

const scanner = await (this.pScanner = BarcodeScanner.createInstance());

if(scanner.isContextDestroyed()){ return; }

// To match React18 strictMode
scanner.getUIElement().remove();
```

# Test device

iPhone13 ios15.5 Safari
