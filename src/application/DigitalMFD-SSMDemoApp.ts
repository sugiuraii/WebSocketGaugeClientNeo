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

import * as PIXI from "pixi.js";

//Import application base class
import {MeterApplicationBase} from "../lib/MeterAppBase/MeterApplicationBase";

//Import meter parts
import {WaterTempGaugePanel} from "../parts/CircularGauges/SemiCircularGaugePanel";
import {ThrottleGaugePanel} from "../parts/CircularGauges/SemiCircularGaugePanel";
import {DigiTachoPanel} from "../parts/DigiTachoPanel/DigiTachoPanel";
import {BoostGaugePanel} from "../parts/CircularGauges/FullCircularGaugePanel";

//Import enumuator of parameter code
import {SSMParameterCode} from "../lib/WebSocket/WebSocketCommunication";
import {SSMSwitchCode} from "../lib/WebSocket/WebSocketCommunication";

import {ReadModeCode} from "../lib/WebSocket/WebSocketCommunication";

//For including entry point html file in webpack
require("./DigitalMFD-SSMDemoApp.html");

window.onload = function()
{
    const meterapp = new DigitalMFD_SSMDemoApp(720, 1280);
    meterapp.run();
}

class DigitalMFD_SSMDemoApp extends MeterApplicationBase
{
    protected setWebSocketOptions()
    {
        //Enable SSM websocket client
        this.IsSSMWSEnabled = true;
        
        this.registerSSMParameterCode(SSMParameterCode.Engine_Speed, ReadModeCode.SLOWandFAST, true);        
        this.registerSSMParameterCode(SSMParameterCode.Vehicle_Speed, ReadModeCode.SLOWandFAST, true);        
        this.registerSSMParameterCode(SSMParameterCode.Throttle_Opening_Angle, ReadModeCode.SLOWandFAST, true);        
        this.registerSSMParameterCode(SSMParameterCode.Coolant_Temperature, ReadModeCode.SLOW, true); 
        this.registerSSMParameterCode(SSMParameterCode.Manifold_Absolute_Pressure, ReadModeCode.SLOWandFAST, true);
        // Neutral position
        this.registerSSMParameterCode(SSMSwitchCode.getNumericCodeFromSwitchCode(SSMSwitchCode.Neutral_Position_Switch), ReadModeCode.SLOWandFAST, false);

    }
    
    protected setTextureFontPreloadOptions()
    {
        this.registerWebFontFamilyNameToPreload(WaterTempGaugePanel.RequestedFontFamily);
        this.registerWebFontFamilyNameToPreload(DigiTachoPanel.RequestedFontFamily);
        this.registerWebFontFamilyNameToPreload(BoostGaugePanel.RequestedFontFamily);
    
        this.registerWebFontCSSURLToPreload(WaterTempGaugePanel.RequestedFontCSSURL);
        this.registerWebFontCSSURLToPreload(DigiTachoPanel.RequestedFontCSSURL);
        this.registerWebFontCSSURLToPreload(BoostGaugePanel.RequestedFontCSSURL);
        
        this.registerTexturePathToPreload(WaterTempGaugePanel.RequestedTexturePath);
        this.registerTexturePathToPreload(DigiTachoPanel.RequestedTexturePath);
        this.registerTexturePathToPreload(BoostGaugePanel.RequestedTexturePath);
    }
    
    protected setPIXIMeterPanel()
    {        
        const digiTachoPanel = new DigiTachoPanel();
        digiTachoPanel.position.set(0,0);
        digiTachoPanel.scale.set(1.15);
        
        const boostPanel = new BoostGaugePanel();
        boostPanel.position.set(90,360);
        boostPanel.scale.set(1.3);                
        
        const waterTempPanel = new WaterTempGaugePanel();
        waterTempPanel.position.set(0,890);
        waterTempPanel.scale.set(0.85);
                
        const throttlePanel = new ThrottleGaugePanel();
        throttlePanel.position.set(360,890);
        throttlePanel.scale.set(0.85);
                
        this.stage.addChild(digiTachoPanel);
        this.stage.addChild(boostPanel);
        this.stage.addChild(waterTempPanel);
        this.stage.addChild(throttlePanel);
        
        this.ticker.add(() => 
        {
            const timestamp = PIXI.ticker.shared.lastTime;
            const tacho = this.SSMWS.getVal(SSMParameterCode.Engine_Speed, timestamp);
            const speed = this.SSMWS.getVal(SSMParameterCode.Vehicle_Speed, timestamp);
            const neutralSw = this.SSMWS.getSwitchFlag(SSMSwitchCode.Neutral_Position_Switch);
            const gearPos = this.calculateGearPosition(tacho, speed, neutralSw);
            const boost = this.SSMWS.getVal(SSMParameterCode.Manifold_Absolute_Pressure, timestamp)  * 0.0101972 - 1 //convert kPa to kgf/cm2 and relative pressure;
            
            const waterTemp = this.SSMWS.getRawVal(SSMParameterCode.Coolant_Temperature);
            const throttle = this.SSMWS.getVal(SSMParameterCode.Throttle_Opening_Angle, timestamp);
            
            digiTachoPanel.Speed = speed;
            digiTachoPanel.Tacho = tacho;
            digiTachoPanel.GearPos = gearPos;
            waterTempPanel.Value = waterTemp;
            throttlePanel.Value = throttle;
            boostPanel.Value = boost;
       });
    }
}