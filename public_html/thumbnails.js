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

const waitTime = 3000;
const thumbnailWidth = 300;
const thumbnailHeight = 200;

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
    
    page.clipRect =
    {
        top : 0,
        left : 0,
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
createThumbNail("application/AnalogMeterCluster-Defi-SSM.html", "thumbnails/AnalogMeterCluster-Defi-SSM.png");
//createThumbNail("application/CompactMFD-Arduino.html", "thumbnails/CompactMFD-Arduino.png");
//createThumbNail("application/CompactMFD-ELM327.html", "thumbnails/CompactMFD-ELM327.png");
createThumbNail("application/CompactMFD-SSM.html", "thumbnails/CompactMFD-SSM.png");
createThumbNail("application/DigitalMFDApp.html", "thumbnails/DigitalMFDApp.png");

window.setTimeout(function(){phantom.exit();},10000);