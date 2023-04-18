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

import * as PIXI from 'pixi.js';
import {MilageGraphPanel} from "parts/GasMilageGraph/MilageGraph";

require("./MilageBarTest.html");

window.onload = function()
{
    main();
}

async function main()
{
    const app = new PIXI.Application<HTMLCanvasElement>({height:1366,width:1366});
    document.body.appendChild(app.view);
    const gaugeArray: MilageGraphPanel[] = [];
    let index = 0;
    for (let j = 0; j < 6; j++)
    {
        for (let i = 0; i < 6 ; i++)
        {
            gaugeArray.push(await MilageGraphPanel.create());
            gaugeArray[index].pivot.set(200,200);
            gaugeArray[index].scale.set(0.6, 0.6);
            gaugeArray[index].position.set(400*i+150,200*j+150);
            gaugeArray[index].Trip = 130.0;
            gaugeArray[index].MomentGasMilage = 20.0;
            gaugeArray[index].Fuel = 35.0;
            gaugeArray[index].GasMilage = 23.5;
            gaugeArray[index].setSectGasMllage("5min", 12.0);
            gaugeArray[index].setSectGasMllage("25min", 7.0);
            app.stage.addChild(gaugeArray[index]);
            index++;
        }
    }
}