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
require("./LEDRevMeter-ELM327.html");

//Import application base class
import {MeterApplicationBase} from "../../lib/MeterAppBase/MeterApplicationBase";

//Import meter parts
import {BoostMeter} from "../../parts/AnalogSingleMeter/AnalogSingleMeter";
import {WaterTempMeter} from "../../parts/AnalogSingleMeter/AnalogSingleMeter";
import {LEDTachoMeter} from "../../parts/LEDTachoMeter/LEDTachoMeter";

//Import enumuator of parameter code
import {OBDIIParameterCode} from "../../lib/WebSocket/WebSocketCommunication";
import {ReadModeCode} from "../../lib/WebSocket/WebSocketCommunication";


window.onload = function()
{
    const meterapp = new LEDRevMeter_ELM327(1280, 720);
    meterapp.run();
}

class LEDRevMeter_ELM327 extends MeterApplicationBase
{
    protected setWebSocketOptions()
    {
        //Enable SSM websocket client
        this.IsELM327WSEnabled = true;
        this.IsFUELTRIPWSEnabled = true;
        this.registerELM327ParameterCode(OBDIIParameterCode.Engine_Speed, ReadModeCode.SLOWandFAST);         
        this.registerELM327ParameterCode(OBDIIParameterCode.Vehicle_Speed, ReadModeCode.SLOWandFAST);         
        this.registerELM327ParameterCode(OBDIIParameterCode.Coolant_Temperature, ReadModeCode.SLOW); 
        this.registerELM327ParameterCode(OBDIIParameterCode.Manifold_Absolute_Pressure, ReadModeCode.SLOWandFAST);
    }
    
    protected setTextureFontPreloadOptions()
    {
        this.registerWebFontFamilyNameToPreload(BoostMeter.RequestedFontFamily);    
        this.registerWebFontCSSURLToPreload(BoostMeter.RequestedFontCSSURL);        
        this.registerWebFontFamilyNameToPreload(LEDTachoMeter.RequestedFontFamily);
        this.registerWebFontCSSURLToPreload(LEDTachoMeter.RequestedFontCSSURL);
        this.registerTexturePathToPreload(BoostMeter.RequestedTexturePath);
        this.registerTexturePathToPreload(LEDTachoMeter.RequestedTexturePath);
    }
    
    protected setPIXIMeterPanel()
    {        
        const boostMeter = new BoostMeter();
        boostMeter.position.set(850,0);
        
        const waterTempMeter = new WaterTempMeter();
        waterTempMeter.position.set(0,0);

        const ledRevMeter = new LEDTachoMeter();
        ledRevMeter.position.set(330,110);
                
        this.stage.addChild(boostMeter);
        this.stage.addChild(waterTempMeter);
        this.stage.addChild(ledRevMeter);
        
        this.ticker.add(() => 
        {
            const timestamp = this.ticker.lastTime;
            const boost = this.ELM327WS.getVal(OBDIIParameterCode.Manifold_Absolute_Pressure, timestamp)  * 0.0101972 - 1 //convert kPa to kgf/cm2 and relative pressure;            
            const waterTemp = this.ELM327WS.getRawVal(OBDIIParameterCode.Coolant_Temperature);
            const rev = this.ELM327WS.getVal(OBDIIParameterCode.Engine_Speed, timestamp);
            const speed = this.ELM327WS.getRawVal(OBDIIParameterCode.Vehicle_Speed);
            const totalFuel = this.FUELTRIPWS.getTotalGas();
            const totalTrip = this.FUELTRIPWS.getTotalTrip();
            const totalFuelRate = this.FUELTRIPWS.getTotalGasMilage();
            const neutralSw = false;
            
            const geasPos = this.calculateGearPosition(rev, speed, neutralSw);
            
            boostMeter.Value = boost;
            waterTempMeter.Value = waterTemp;
            ledRevMeter.Tacho = rev;
            ledRevMeter.Speed = speed;
            ledRevMeter.GearPos = geasPos;
            ledRevMeter.Trip = totalTrip;
            ledRevMeter.Fuel = totalFuel;
            ledRevMeter.GasMilage = totalFuelRate;
       });
    }
}