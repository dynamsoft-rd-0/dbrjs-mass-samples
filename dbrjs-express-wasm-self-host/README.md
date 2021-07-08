# How to Run

`yarn install` or `npm install`

`node index.js`

Run the URL and test it.


# Notes

## 1

The latest express doesn't require setting `application/wasm` manually. It is already built in.

## 2

Please make sure you copy the `dist` folder of the Dynamsoft Barcode Reader SDK to a network available location (e.g. the `public` folder in this sample).

## 3

Don't forget to set `Dynamsoft.DBR.BarcodeReader.engineResourcePath` to your self-hosted address. 

This setting is required in framework based project like `react`, `vue`, `angular`.

An example for your reference: https://github.com/Dynamsoft/javascript-barcode/blob/master/example/web/react/src/dbr.js

> If you are running Dynamsoft Barcode Reader JavaScript edition v7.6, please instead use `Dynamsoft.BarcodeReader.engineResourcePath`.