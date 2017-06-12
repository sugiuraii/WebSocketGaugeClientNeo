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
// This is required to webpack font/texture/html files
/// <reference path="../lib/webpackRequire.ts" />

//Import application base class
import {MeterApplicationBase} from "../lib/MeterAppBase/MeterApplicationBase";

//Import meter parts
import {AnalogMeterCluster} from "../parts/AnalogMeterCluster/AnalogMeterCluster";

import {FPSCounter} from "../parts/FPSIndicator/FPSCounter";

//For including entry point html file in webpack
require("./AnalogMeterClusterBenchApp.html");

window.onload = function()
{
    const meterapp = new AnalogMeterClusterBenchApp();
    meterapp.run();
}

class AnalogMeterClusterBenchApp extends MeterApplicationBase
{
    protected setWebSocketOptions()
    {
        //For graphic benchmark. Do nothing for websocket.
    }
    
    protected setTextureFontPreloadOptions()
    {
        this.registerWebFontFamilyNameToPreload(AnalogMeterCluster.RequestedFontFamily);
        this.registerWebFontCSSURLToPreload(AnalogMeterCluster.RequestedFontCSSURL);
        this.registerTexturePathToPreload(AnalogMeterCluster.RequestedTexturePath);
        
        this.registerTexturePathToPreload(FPSCounter.RequestedTexturePath);
    }
    
    protected setPIXIMeterPanel()
    {
        this.pixiApp = new PIXI.Application(1100,600);
        const app = this.pixiApp;
        document.body.appendChild(app.view);
        app.view.style.height = "100vh";

        const meterCluster = new AnalogMeterCluster();
        app.stage.addChild(meterCluster);
        
        const fpsCounter = new FPSCounter();
        fpsCounter.position.set(0,0);
        app.stage.addChild(fpsCounter);
        
        let tacho = 0;
        let speed = 0;
        let gearPos = "1";

        const totalGasMilage = 12.0;
        const totalFuel = 20.0;
        const totalTrip = 356.0;

        let boost = -1.0;
        let waterTemp = 50.0;
        
        app.ticker.add(() => 
        {
            fpsCounter.setFPS(app.ticker.FPS);
            
            if(tacho > 9000)
                tacho = 0;
            else
                tacho += 200;
            
            if(speed > 280)
                speed = 0;
            else
                speed += 0.5;
            
            if(boost > 2.0)
                boost = -1.0;
            else
                boost += 0.05;
            
            if (waterTemp > 140)
                waterTemp = 50;
            else
                waterTemp += 0.1;
            gearPos = this.calculateGearPosition(tacho, speed, false);
            
            meterCluster.Tacho = tacho;
            meterCluster.Speed = speed;
            meterCluster.Boost = boost;
            meterCluster.WaterTemp = waterTemp;
            meterCluster.GasMilage = totalGasMilage;
            meterCluster.Trip = totalTrip;
            meterCluster.Fuel = totalFuel;
            meterCluster.GearPos = gearPos;
       });
    }
}