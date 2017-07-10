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
    const meterapp = new DigitalMFD_SSMDemoApp();
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
        this.pixiApp = new PIXI.Application(720, 1280);
        const app = this.pixiApp;
        document.body.appendChild(app.view);
        app.view.style.width = "100vw";
        app.view.style.touchAction = "auto";
        
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
        

        
        app.stage.addChild(digiTachoPanel);
        app.stage.addChild(boostPanel);
        app.stage.addChild(waterTempPanel);
        app.stage.addChild(throttlePanel);
        
        app.ticker.add(() => 
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