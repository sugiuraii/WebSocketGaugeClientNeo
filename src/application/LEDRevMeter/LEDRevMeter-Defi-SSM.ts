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
require("./LEDRevMeter-Defi-SSM.html");

//Import application base class
import {MeterApplicationBase} from "../../lib/MeterAppBase/MeterApplicationBase";

//Import meter parts
import {BoostMeter} from "../../parts/AnalogSingleMeter/AnalogSingleMeter";
import {WaterTempMeter} from "../../parts/AnalogSingleMeter/AnalogSingleMeter";
import {LEDTachoMeter} from "../../parts/LEDTachoMeter/LEDTachoMeter";

//Import enumuator of parameter code
import {DefiParameterCode} from "../../lib/WebSocket/WebSocketCommunication";
import {SSMParameterCode} from "../../lib/WebSocket/WebSocketCommunication";
import {SSMSwitchCode} from "../../lib/WebSocket/WebSocketCommunication";
import {ReadModeCode} from "../../lib/WebSocket/WebSocketCommunication";


window.onload = function()
{
    const meterapp = new LEDRevMeter_Defi_SSM(1280, 720);
    meterapp.run();
}

class LEDRevMeter_Defi_SSM extends MeterApplicationBase
{
    protected setWebSocketOptions()
    {
        //Enable SSM websocket client
        this.IsDefiWSEnabled = true;
        this.IsSSMWSEnabled = true;
        this.IsFUELTRIPWSEnabled = true;
        this.registerDefiParameterCode(DefiParameterCode.Engine_Speed, true);         
        this.registerDefiParameterCode(DefiParameterCode.Manifold_Absolute_Pressure, true);
        this.registerSSMParameterCode(SSMParameterCode.Vehicle_Speed, ReadModeCode.SLOWandFAST, false);         
        this.registerSSMParameterCode(SSMParameterCode.Coolant_Temperature, ReadModeCode.SLOW, true); 
        this.registerSSMParameterCode(SSMSwitchCode.getNumericCodeFromSwitchCode(SSMSwitchCode.Neutral_Position_Switch), ReadModeCode.SLOWandFAST, false);
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
            const boost = this.DefiWS.getVal(DefiParameterCode.Manifold_Absolute_Pressure, timestamp)  * 0.0101972 - 1 //convert kPa to kgf/cm2 and relative pressure;            
            const waterTemp = this.SSMWS.getRawVal(SSMParameterCode.Coolant_Temperature);
            const rev = this.DefiWS.getVal(DefiParameterCode.Engine_Speed, timestamp);
            const speed = this.SSMWS.getRawVal(SSMParameterCode.Vehicle_Speed);
            const totalFuel = this.FUELTRIPWS.getTotalGas();
            const totalTrip = this.FUELTRIPWS.getTotalTrip();
            const totalFuelRate = this.FUELTRIPWS.getTotalGasMilage();
            const neutralSw = this.SSMWS.getSwitchFlag(SSMSwitchCode.Neutral_Position_Switch);
            
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