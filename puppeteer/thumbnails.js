/* 
 * The MIT License
 *
 * Copyright 2017 sz2.
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

const puppeteer = require("puppeteer");
const express = require("express");
const fs = require("fs");
const path = require("path");
const baseDir = path.join(path.relative(path.resolve(), "../"), "public_html");
const thumbnailDir = path.join(baseDir, "thumbnails");
const getPNGPath = (fileName) => path.join(thumbnailDir, fileName)

// Set target list
const targetList = [
  { htmlPath: "benchmark/AnalogMeterClusterBenchApp.html", pngPath: getPNGPath("AnalogMeterClusterBenchApp.png") },
  { htmlPath: "benchmark/DigitalMFDBenchApp.html", pngPath: getPNGPath("DigitalMFDBenchApp.png") },
  { htmlPath: "application/AnalogMeterCluster.html", pngPath: getPNGPath("AnalogMeterCluster.png") },
  { htmlPath: "application/CompactMFD.html", pngPath: getPNGPath("CompactMFD.png") },
  { htmlPath: "application/DigitalMFD.html", pngPath: getPNGPath("DigitalMFD.png") },
  { htmlPath: "application/AnalogTripleMeter.html", pngPath: getPNGPath("AnalogTripleMeter.png") },
  { htmlPath: "application/LEDRevMeter.html", pngPath: getPNGPath("LEDRevMeter.png") },

  { htmlPath: "application/AnalogMeterClusterWidget.html", pngPath: getPNGPath("AnalogMeterClusterWidget.png") },
  { htmlPath: "application/AnalogSingleMeterWidget.html", pngPath: getPNGPath("AnalogSingleMeterWidget.png") },
  { htmlPath: "application/DigiTachoPanelWidget.html", pngPath: getPNGPath("DigiTachoPanelWidget.png") },
  { htmlPath: "application/SemiCircularGaugePanelWidget.html", pngPath: getPNGPath("SemiCircularGaugePanelWidget.png") },
  { htmlPath: "application/FullCircularGaugePanelWidget.html", pngPath: getPNGPath("FullCircularGaugePanelWidget.png") },
  { htmlPath: "application/LEDRevMeterWidget.html", pngPath: getPNGPath("LEDRevMeterWidget.png") },
  { htmlPath: "application/GasMilagePanelWidget.html", pngPath: getPNGPath("GasMilagePanelWidget.png") }
];

// Set thumbnail size
const viewport = { width: 600, height: 400 };

// set number of concurrent jobs
const numConcurrentJobs = 16;

// Build local web server by express
const app = express();
const port = 8080;
//app.use(express.static('./'));
app.use(express.static(baseDir));
const http = app.listen(port, () => {
  console.log('Server started on port:' + port);
});

// Creare thuumbnails directory.
if (!fs.existsSync(thumbnailDir)) {
  fs.mkdirSync(thumbnailDir);
}

const createSingleThumbNail = async (htmlpath, pngpath) => {
  const browser = await puppeteer.launch({ headless: false, args: ['--allow-file-access', '--allow-file-access-from-files', '--use-gl=swiftshader'] });
  const page = await browser.newPage();
  await page.setViewport(viewport);
  await page.goto("http://127.0.0.1:" + port.toString() + "/" + htmlpath, { waitUntil: 'networkidle2' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: pngpath });
  await browser.close();
}


const makeThunbnails = async () => {
  const promises = [];
  for (let i = 0; i < targetList.length; i += numConcurrentJobs) {
    for (let j = i; j < i + numConcurrentJobs; j++) {
      if (j < targetList.length) {
        const target = targetList[j];
        promises.push(createSingleThumbNail(target.htmlPath, target.pngPath));
      }
    }
    for (const promise of promises) {
      await promise;
    }
  }
  http.close();
}

require('events').EventEmitter.defaultMaxListeners = numConcurrentJobs + 1;
makeThunbnails();
