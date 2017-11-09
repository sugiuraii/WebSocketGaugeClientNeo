/* 
 * The MIT License
 *
 * Copyright 2017 kuniaki.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

const waitTime = 1000;
const thumbnailWidth = 400;
const thumbnailHeight = 400;

function getFileUrl(str) {
    const fs = require('fs');
    var pathName = fs.absolute(str).replace(/\\/g, '/');
    // Windows drive letter must be prefixed with a slash
    if (pathName[0] !== "/") {
        pathName = "/" + pathName;
    }
    return encodeURI("file://" + pathName);
};

function createThumbNail(htmlPath, pngPath)
{
    const page = require('webpage').create();
    const fileUrl = getFileUrl(htmlPath);
    page.viewportSize =
    {
        width : thumbnailWidth,
        height : thumbnailHeight
    };
    
    page.open(fileUrl, function() {
    window.setTimeout(function () 
    {
        page.render(pngPath);
    },waitTime);
    });
}

createThumbNail("benchmark/AnalogMeterClusterBenchApp.html", "thumbnails/AnalogMeterClusterBenchApp.png");
createThumbNail("benchmark/DigitalMFDBenchApp.html", "thumbnails/DigitalMFDBenchApp.png");
createThumbNail("application/AnalogMeterClusterApp.html", "thumbnails/AnalogMeterClusterApp.png");
createThumbNail("application/DigitalMFD-ArduinoDemoApp.html", "thumbnails/DigitalMFD-ArduinoDemoApp.png");
createThumbNail("application/DigitalMFD-ELM327DemoApp.html", "thumbnails/DigitalMFD-ELM327DemoApp.png");
createThumbNail("application/DigitalMFD-SSMDemoApp.html", "thumbnails/DigitalMFD-SSMDemoApp.png");
createThumbNail("application/DigitalMFDApp.html", "thumbnails/DigitalMFDApp.png");

//phantom.exit();