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
    const meterapp = new AnalogMeterClusterBenchApp(1100, 600);
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
        const meterCluster = new AnalogMeterCluster();
        this.stage.addChild(meterCluster);
        
        const fpsCounter = new FPSCounter();
        fpsCounter.position.set(0,0);
        this.stage.addChild(fpsCounter);
        
        let tacho = 0;
        let speed = 0;
        let gearPos = "1";

        const totalGasMilage = 12.0;
        const totalFuel = 20.0;
        const totalTrip = 356.0;

        let boost = -1.0;
        let waterTemp = 50.0;
                
        this.ticker.add(() => 
        {
            fpsCounter.setFPS(this.ticker.FPS);
            
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