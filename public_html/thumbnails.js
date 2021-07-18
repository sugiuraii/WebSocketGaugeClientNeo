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
const fs =  require("fs");

// Set target list
const targetList = [
  { htmlPath: "benchmark/AnalogMeterClusterBenchApp.html", pngPath: "thumbnails/AnalogMeterClusterBenchApp.png" },
  { htmlPath: "benchmark/DigitalMFDBenchApp.html", pngPath: "thumbnails/DigitalMFDBenchApp.png" },
  { htmlPath: "application/AnalogMeterCluster.html", pngPath: "thumbnails/AnalogMeterCluster.png" },
  { htmlPath: "application/CompactMFD.html", pngPath: "thumbnails/CompactMFD.png" },
  { htmlPath: "application/DigitalMFD.html", pngPath: "thumbnails/DigitalMFD.png" },
  { htmlPath: "application/AnalogTripleMeter.html", pngPath: "thumbnails/AnalogTripleMeter.png" },
  { htmlPath: "application/LEDRevMeter.html", pngPath: "thumbnails/LEDRevMeter.png" }
];

// Set thumbnail size
const viewport = { width: 600, height: 400 };

// Build local web server by express
const app = express();
const port = 8080;
app.use(express.static('./'));
const http = app.listen(port, () => {
  console.log('Server started on port:' + port);
});

// Creare thuumbnails directory.
const dir = './thumbnails';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

const createSingleThumbNail = async (htmlpath, pngpath) => {
  const browser = await puppeteer.launch({ headless: false, args: ['--allow-file-access', '--allow-file-access-from-files', '--use-gl=swiftshader'] });
  const page = await browser.newPage();
  await page.setViewport(viewport);
  await page.goto("http://127.0.0.1:" + port.toString() + "/" + htmlpath, {waitUntil: 'networkidle2'});
  await page.waitForTimeout(1000);
  await page.screenshot({ path: pngpath });
  await browser.close();
}

const makeThunbnails = async () => {
  for(const target of targetList)
    await createSingleThumbNail(target.htmlPath, target.pngPath);
  http.close();
}

makeThunbnails();
