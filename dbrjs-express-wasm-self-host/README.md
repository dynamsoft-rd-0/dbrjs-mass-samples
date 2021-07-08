# How to Run

`yarn install` or `npm install`

`node index.js`

Open the url. Try.


# How this work

## 1

Latest express doesn't need to set `application/wasm` manually. It's already built in.

## 2

Copy dbrjs's dist to a network available place.

## 3

Set `Dynamsoft.DBR.BarcodeReader.engineResourcePath` to your self host one. 

This must be done in `react`, `vue`, `angular`. Can be omitted in raw html.

You can find the similar usage in https://github.com/Dynamsoft/javascript-barcode/blob/master/example/web/react/src/dbr.js

> In dbrjs 7.6 use `Dynamsoft.BarcodeReader.engineResourcePath` instead.