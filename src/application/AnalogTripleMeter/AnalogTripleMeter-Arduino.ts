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
/// <reference path="../../lib/webpackRequire.ts" />

import * as PIXI from "pixi.js";

//For including entry point html file in webpack
require("./AnalogTripleMeter-Arduino.html");

//Import application base class
import {MeterApplicationBase} from "../../lib/MeterAppBase/MeterApplicationBase";

//Import meter parts
import {BoostMeter} from "../../parts/AnalogSingleMeter/AnalogSingleMeter";
import {WaterTempMeter} from "../../parts/AnalogSingleMeter/AnalogSingleMeter";
import {OilTempMeter} from "../../parts/AnalogSingleMeter/AnalogSingleMeter";

//Import enumuator of parameter code
import {ArduinoParameterCode} from "../../lib/WebSocket/WebSocketCommunication";

window.onload = function()
{
    const meterapp = new AnalogTripleMeter_Arduino(1280, 720);
    meterapp.run();
}

class AnalogTripleMeter_Arduino extends MeterApplicationBase
{
    protected setWebSocketOptions()
    {
        this.IsArudinoWSEnabled = true;
        this.registerArduinoParameterCode(ArduinoParameterCode.Manifold_Absolute_Pressure, true);         
        this.registerArduinoParameterCode(ArduinoParameterCode.Coolant_Temperature, true); 
        this.registerArduinoParameterCode(ArduinoParameterCode.Oil_Temperature, true);

    }
    
    protected setTextureFontPreloadOptions()
    {
        this.registerWebFontFamilyNameToPreload(BoostMeter.RequestedFontFamily);    
        this.registerWebFontCSSURLToPreload(BoostMeter.RequestedFontCSSURL);        
        this.registerTexturePathToPreload(BoostMeter.RequestedTexturePath);
    }
    
    protected setPIXIMeterPanel()
    {   
        //Centering the top-level container
        this.stage.pivot.set(600, 200);
        this.stage.position.set(this.screen.width/2, this.screen.height/2);
        
        const boostMeter = new BoostMeter();
        boostMeter.position.set(800,0);
        
        const waterTempMeter = new WaterTempMeter();
        waterTempMeter.position.set(0,0);

        const oilTempMeter = new OilTempMeter();
        oilTempMeter.position.set(400,0);
                
        this.stage.addChild(boostMeter);
        this.stage.addChild(waterTempMeter);
        this.stage.addChild(oilTempMeter);
        
        this.ticker.add(() => 
        {
            const timestamp = this.ticker.lastTime;
            const boost = this.ArduinoWS.getVal(ArduinoParameterCode.Manifold_Absolute_Pressure, timestamp)  * 0.0101972 - 1 //convert kPa to kgf/cm2 and relative pressure;
            
            const waterTemp = this.ArduinoWS.getRawVal(ArduinoParameterCode.Coolant_Temperature);
            const oilTemp = this.ArduinoWS.getRawVal(ArduinoParameterCode.Oil_Temperature);
            
            boostMeter.Value = boost;
            waterTempMeter.Value = waterTemp;
            oilTempMeter.Value = oilTemp;
       });
    }
}