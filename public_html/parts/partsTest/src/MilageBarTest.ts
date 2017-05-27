/* 
 * Copyright (c) 2017, kuniaki
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * * Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

/// <reference path="../../../lib/webpackRequire.ts" />

import {MilageGraphPanel} from "../../GasMilageGraph/MilageGraph";
import * as WebFont from "webfontloader";

require("../MilageBarTest.html");

window.onload = function()
{
    //webSocketGauge.parts.FullCircularGauge.preloadTextures();
    WebFont.load({
        custom: 
        { 
            families: MilageGraphPanel.RequestedFontFamily,
            urls: MilageGraphPanel.RequestedFontCSSURL 
        },    
        active: function () {MilageBarTest.preloadTexture();}
    });
}

namespace MilageBarTest
{
    export function preloadTexture()
    {
        PIXI.loader.add(MilageGraphPanel.RequestedTexturePath);
        PIXI.loader.load(main);
    }
    function main()
    {
        const app = new PIXI.Application(1366,1366);
        document.body.appendChild(app.view);
        let gaugeArray: MilageGraphPanel[] = new Array();
        let index = 0;
        for (let j = 0; j < 6; j++)
        {
            for (let i = 0; i < 6 ; i++)
            {
                gaugeArray.push(new MilageGraphPanel);
                gaugeArray[index].pivot = new PIXI.Point(200,200);
                gaugeArray[index].scale.set(0.6, 0.6);
                gaugeArray[index].position = new PIXI.Point(400*i+150,200*j+150);
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
        app.ticker.add(() => {
            });
    }
}