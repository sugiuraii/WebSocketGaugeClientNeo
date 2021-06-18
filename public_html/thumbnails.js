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

// Creare thuumbnails directory.
var fs = require('fs');
var dir = './thumbnails';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

const puppeteer = require('puppeteer');
const path = require('path');

createThumbNail("benchmark/AnalogMeterClusterBenchApp.html", "thumbnails/AnalogMeterClusterBenchApp.png");
createThumbNail("benchmark/DigitalMFDBenchApp.html", "thumbnails/DigitalMFDBenchApp.png");
createThumbNail("application/AnalogMeterCluster.html", "thumbnails/AnalogMeterCluster.png");
createThumbNail("application/CompactMFD.html", "thumbnails/CompactMFD.png");
createThumbNail("application/DigitalMFD.html", "thumbnails/DigitalMFD.png");
createThumbNail("application/AnalogTripleMeter.html", "thumbnails/AnalogTripleMeter.png");
createThumbNail("application/LEDRevMeter.html", "thumbnails/LEDRevMeter.png");

function createThumbNail(htmlpath, pngpath)
{
    (async () => {
    const browser = await puppeteer.launch({args:['--allow-file-access', '--allow-file-access-from-files', '--headless' ,'--use-gl=swiftshader']});
    const page = await browser.newPage();
    await page.setViewport({ width: 600, height: 400 })
    await page.goto(`file:`+path.join(__dirname, htmlpath));
    await page.waitFor(3000);
    await page.screenshot({path: pngpath});
  
    await browser.close();
    })();
}
