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
 
/// <reference path="../../lib/webpackRequire.ts" />

import {LEDTachoMeter} from "../../parts/LEDTachoMeter/LEDTachoMeter";
import * as WebFont from "webfontloader";

require("./LEDTachoMeterTest.html");

window.onload = function()
{
    WebFont.load({
        custom: 
        { 
            families: LEDTachoMeter.RequestedFontFamily,
            urls: LEDTachoMeter.RequestedFontCSSURL 
        },
        active : function(){LEDTachoMeterTest.preloadTexture();}
    });
}

namespace LEDTachoMeterTest
{
    export function preloadTexture()
    {
        PIXI.loader.add(LEDTachoMeter.RequestedTexturePath);
        PIXI.loader.load(main);
    }

    function main()
    {
        const app = new PIXI.Application(1366,1366);
        document.body.appendChild(app.view);

        const meter = new LEDTachoMeter();
        app.stage.addChild(meter);

        app.ticker.add(function(){
            meter.Tacho += 100;
            if (meter.Tacho > 9000)
                meter.Tacho = 0;
        });

    }
}
