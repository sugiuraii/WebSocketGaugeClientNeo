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
 
import {ThrottleGaugePanel} from "../../parts/CircularGauges/SemiCircularGaugePanel";
import * as WebFont from "webfontloader";

require("./SemiCircularGaugeTest.html");

window.onload = function()
{
   
    WebFont.load({
        custom: 
        { 
            families: ThrottleGaugePanel.RequestedFontFamily,
            urls: ThrottleGaugePanel.RequestedFontCSSURL 
        },
        active : function(){SemiCircularGaugeTest.preloadTexture();}
    });
}

namespace SemiCircularGaugeTest
{
    export function preloadTexture()
    {
        PIXI.loader.add(ThrottleGaugePanel.RequestedTexturePath);;
        PIXI.loader.load(main);
    }
    function main()
    {
        const app = new PIXI.Application(1366,1366);
        document.body.appendChild(app.view);
        let gaugeArray: ThrottleGaugePanel[] = new Array();
        let index = 0;
        for (let j = 0; j < 6; j++)
        {
            for (let i = 0; i < 6 ; i++)
            {
                gaugeArray.push(new ThrottleGaugePanel());
                gaugeArray[index].pivot = new PIXI.Point(200,200);
                gaugeArray[index].scale.set(0.6, 0.6);
                gaugeArray[index].position = new PIXI.Point(240*i+150,200*j+150);
                gaugeArray[index].Value = 0;
                app.stage.addChild(gaugeArray[index]);
                index++;
            }
        }
        app.ticker.add(() => {
            for (let i = 0; i < gaugeArray.length; i++)
            {
                if (gaugeArray[i].Value + 1 >= 100)
                    gaugeArray[i].Value = 0;
                else           
                    gaugeArray[i].Value += 1;
            }
            });
    }
}

