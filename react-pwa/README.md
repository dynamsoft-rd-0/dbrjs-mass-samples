# dbrjs react pwa

modified from https://github.com/Dynamsoft/barcode-reader-javascript-samples/tree/main/frameworks/react

## Key points

* Upgrade to dbrjs > 11.4.2001, it specifically optimized for iOS PWA.
  * and if we detect that the iOS PWA is certain to fail to open the camera during the current session, we will automatically switch to photo mode.
* Use `Suspense, lazy` to lazy load, instead of dynamic add `<script>`.
  * For demonstration, you need click the button to start scanning, instead of auto start scanning when page loaded. You can check F12 network to see how it works.
* No need initLicense `{executeNow: true}`.
* Prefer public CDN instead of self-hosting resources, it might load faster.
  * if you prefer self-hosting resources, please gzip resources to optimize bandwidth.
* Add eruda for debugging.

## Quick run in github.io

https://dynamsoft-rd-0.github.io/dbrjs-mass-samples/react-pwa/build/index.html

## How to download directory of a repo

https://download-directory.github.io/
