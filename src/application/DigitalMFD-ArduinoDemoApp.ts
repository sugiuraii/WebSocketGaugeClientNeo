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

import * as PIXI from "pixi.js";

//Import application base class
import {MeterApplicationBase} from "../lib/MeterAppBase/MeterApplicationBase";

//Import meter parts
import {BoostGaugePanel} from "../parts/CircularGauges/FullCircularGaugePanel";
import {WaterTempGaugePanel} from "../parts/CircularGauges/SemiCircularGaugePanel";
import {EngineOilTempGaugePanel} from "../parts/CircularGauges/SemiCircularGaugePanel";
import {DigiTachoPanel} from "../parts/DigiTachoPanel/DigiTachoPanel";

//Import enumuator of parameter code
import {ArduinoParameterCode} from "../lib/WebSocket/WebSocketCommunication";

//For including entry point html file in webpack
require("./DigitalMFD-ArduinoDemoApp.html");

window.onload = function()
{
    const meterapp = new DigitalMFD_ArduinoDemoApp(720, 1280);
    meterapp.run();
}

class DigitalMFD_ArduinoDemoApp extends MeterApplicationBase
{
    protected setWebSocketOptions()
    {
        //Enable Arduino websocket clent
        this.IsArudinoWSEnabled = true;
        
        this.registerArduinoParameterCode(ArduinoParameterCode.Engine_Speed, true);
        this.registerArduinoParameterCode(ArduinoParameterCode.Manifold_Absolute_Pressure, true);
        this.registerArduinoParameterCode(ArduinoParameterCode.Vehicle_Speed, true);
        this.registerArduinoParameterCode(ArduinoParameterCode.Coolant_Temperature, true); 
        this.registerArduinoParameterCode(ArduinoParameterCode.Oil_Temperature, true);       
    }
    
    protected setTextureFontPreloadOptions()
    {
        this.registerWebFontFamilyNameToPreload(BoostGaugePanel.RequestedFontFamily);
        this.registerWebFontFamilyNameToPreload(WaterTempGaugePanel.RequestedFontFamily);
        this.registerWebFontFamilyNameToPreload(DigiTachoPanel.RequestedFontFamily);
        
        this.registerWebFontCSSURLToPreload(BoostGaugePanel.RequestedFontCSSURL);
        this.registerWebFontCSSURLToPreload(WaterTempGaugePanel.RequestedFontCSSURL);
        this.registerWebFontCSSURLToPreload(DigiTachoPanel.RequestedFontCSSURL);
        
        this.registerTexturePathToPreload(BoostGaugePanel.RequestedTexturePath);
        this.registerTexturePathToPreload(WaterTempGaugePanel.RequestedTexturePath);
        this.registerTexturePathToPreload(DigiTachoPanel.RequestedTexturePath);
    }
    
    protected setPIXIMeterPanel()
    {        
        const digiTachoPanel = new DigiTachoPanel();
        digiTachoPanel.position.set(0,0);
        digiTachoPanel.scale.set(1.15);
                
        const boostPanel = new BoostGaugePanel();
        boostPanel.position.set(90, 360);
        boostPanel.scale.set(1.3);
                
        const waterTempPanel = new WaterTempGaugePanel();
        waterTempPanel.position.set(0,890);
        waterTempPanel.scale.set(0.85);
        
        const engineOilTempPanel = new EngineOilTempGaugePanel();
        engineOilTempPanel.position.set(360,890);
        engineOilTempPanel.scale.set(0.85);
                
        this.stage.addChild(digiTachoPanel);
        this.stage.addChild(boostPanel);
        this.stage.addChild(waterTempPanel);
        this.stage.addChild(engineOilTempPanel);
                
        this.ticker.add(() => 
        {
            const timestamp = PIXI.ticker.shared.lastTime;
            const tacho = this.ArduinoWS.getVal(ArduinoParameterCode.Engine_Speed, timestamp);
            const speed = this.ArduinoWS.getVal(ArduinoParameterCode.Vehicle_Speed, timestamp);
            const neutralSw = false;
            const gearPos = this.calculateGearPosition(tacho, speed, neutralSw);
            const engineOilTemp = this.ArduinoWS.getVal(ArduinoParameterCode.Oil_Temperature, timestamp);
                        
            const boost = this.ArduinoWS.getVal(ArduinoParameterCode.Manifold_Absolute_Pressure, timestamp) * 0.0101972 - 1 //convert kPa to kgf/cm2 and relative pressure;
            const waterTemp = this.ArduinoWS.getRawVal(ArduinoParameterCode.Coolant_Temperature);
            
            digiTachoPanel.Speed = speed;
            digiTachoPanel.Tacho = tacho;
            digiTachoPanel.GearPos = gearPos;
                        
            boostPanel.Value = boost;
            waterTempPanel.Value = waterTemp;
            engineOilTempPanel.Value = engineOilTemp;
       });
    }
}