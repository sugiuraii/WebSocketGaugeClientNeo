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

//For including entry point html file in webpack
require("./LEDRevMeter-SSM.html");

//Import application base class
import {MeterApplicationBase} from "../../lib/MeterAppBase/MeterApplicationBase";

//Import meter parts
import {BoostMeter} from "../../parts/AnalogSingleMeter/AnalogSingleMeter";
import {WaterTempMeter} from "../../parts/AnalogSingleMeter/AnalogSingleMeter";
import {LEDTachoMeter} from "../../parts/LEDTachoMeter/LEDTachoMeter";

//Import enumuator of parameter code
import {SSMParameterCode} from "../../lib/WebSocket/WebSocketCommunication";
import {ReadModeCode} from "../../lib/WebSocket/WebSocketCommunication";


window.onload = function()
{
    const meterapp = new LEDMeter_SSM(1280, 720);
    meterapp.run();
}

class CompactMFD_SSM extends MeterApplicationBase
{
    protected setWebSocketOptions()
    {
        //Enable SSM websocket client
        this.IsSSMWSEnabled = true;
        this.registerSSMParameterCode(SSMParameterCode.Battery_Voltage, ReadModeCode.SLOW, true);         
        this.registerSSMParameterCode(SSMParameterCode.Coolant_Temperature, ReadModeCode.SLOW, true); 
        this.registerSSMParameterCode(SSMParameterCode.Manifold_Absolute_Pressure, ReadModeCode.SLOWandFAST, true);

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

        const batteryVoltageMeter = new BatteryVoltageMeter();
        batteryVoltageMeter.position.set(400,0);
                
        this.stage.addChild(boostMeter);
        this.stage.addChild(waterTempMeter);
        this.stage.addChild(batteryVoltageMeter);
        
        this.ticker.add(() => 
        {
            const timestamp = PIXI.ticker.shared.lastTime;
            const boost = this.SSMWS.getVal(SSMParameterCode.Manifold_Absolute_Pressure, timestamp)  * 0.0101972 - 1 //convert kPa to kgf/cm2 and relative pressure;
            
            const waterTemp = this.SSMWS.getRawVal(SSMParameterCode.Coolant_Temperature);
            const voltage = this.SSMWS.getRawVal(SSMParameterCode.Battery_Voltage);
            
            boostMeter.Value = boost;
            waterTempMeter.Value = waterTemp;
            batteryVoltageMeter.Value = voltage;
       });
    }
}