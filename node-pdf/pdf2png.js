// Modify from https://github.com/mozilla/pdf.js/blob/master/examples/node/pdf2png/pdf2png.js
// todo: need more error handling 

/* Copyright 2017 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var Canvas = require("canvas");
var assert = require("assert").strict;
var pdfjsLib = require("pdfjs-dist/es5/build/pdf.js");

function NodeCanvasFactory() {}
NodeCanvasFactory.prototype = {
    create: function NodeCanvasFactory_create(width, height) {
        assert(width > 0 && height > 0, "Invalid canvas size");
        var canvas = Canvas.createCanvas(width, height);
        var context = canvas.getContext("2d");
        return {
            canvas,
            context,
        };
    },

    reset: function NodeCanvasFactory_reset(canvasAndContext, width, height) {
        assert(canvasAndContext.canvas, "Canvas is not specified");
        assert(width > 0 && height > 0, "Invalid canvas size");
        canvasAndContext.canvas.width = width;
        canvasAndContext.canvas.height = height;
    },

    destroy: function NodeCanvasFactory_destroy(canvasAndContext) {
        assert(canvasAndContext.canvas, "Canvas is not specified");

        // Zeroing the width and height cause Firefox to release graphics
        // resources immediately, which can greatly reduce memory consumption.
        canvasAndContext.canvas.width = 0;
        canvasAndContext.canvas.height = 0;
        canvasAndContext.canvas = null;
        canvasAndContext.context = null;
    },
};

// Some PDFs need external cmaps.
var CMAP_URL = "../../../node_modules/pdfjs-dist/cmaps/";
var CMAP_PACKED = true;

let pdf2png = async(data)=>{
    // Load the PDF file.
    let loadingTask = pdfjsLib.getDocument({
        data,
        cMapUrl: CMAP_URL,
        cMapPacked: CMAP_PACKED,
    });
    let pdfDocument = await new Promise((resolve, reject)=>{
        loadingTask.promise.then(resolve).catch(reject);
    });
    let imgs = [];
    for(let i = 0; i < pdfDocument.numPages; ++i){
        let img = await new Promise((resolve)=>{
            // Get the first page.
            pdfDocument.getPage(1).then(function (page) {
                // Render the page on a Node canvas with 100% scale.
                var viewport = page.getViewport({ scale: 1.0 });
                var canvasFactory = new NodeCanvasFactory();
                var canvasAndContext = canvasFactory.create(
                    viewport.width,
                    viewport.height
                );
                var renderContext = {
                    canvasContext: canvasAndContext.context,
                    viewport,
                    canvasFactory,
                };
        
                var renderTask = page.render(renderContext);
                renderTask.promise.then(function () {
                    // Convert the canvas to an image buffer.
                    var image = canvasAndContext.canvas.toBuffer();
                    resolve(image);
                });
            });
        });
        imgs.push(img);
    }
    return imgs;
};


module.exports = pdf2png;
