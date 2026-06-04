# dbrjs react pwa

modified from https://github.com/Dynamsoft/barcode-reader-javascript-samples/tree/main/frameworks/react

## Key points

* Upgrade to dbrjs > 11.4.2001, it specifically optimized for iOS PWA.
  * and if we detect that the iOS PWA is certain to fail to open the camera during the current session, we will automatically switch to photo mode.
* Use `Suspense, lazy` to lazy load, instead of dynamic add `<script>`.
* No need initLicense `{executeNow: true}`.

## Quick run in github.io

https://dynamsoft-rd-0.github.io/dbrjs-mass-samples/react-pwa/build/index.html
