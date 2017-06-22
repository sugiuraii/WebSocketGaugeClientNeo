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

//Import enumuator of parameter code
import {OBDIIParameterCode} from "../lib/WebSocket/WebSocketCommunication";
import {ReadModeCode} from "../lib/WebSocket/WebSocketCommunication";

//For including entry point html file in webpack
require("./DigitalMFD-ELM327DemoApp.html");

window.onload = function()
{
    const meterapp = new DigitalMFD_ELM327DemoApp();
    meterapp.run();
}

class DigitalMFD_ELM327DemoApp extends MeterApplicationBase
{
    protected setWebSocketOptions()
    {
        this.IsELM327WSEnabled = true;
        
        this.registerELM327ParameterCode(OBDIIParameterCode.Engine_Speed, ReadModeCode.SLOWandFAST, true);        
        this.registerELM327ParameterCode(OBDIIParameterCode.Vehicle_Speed, ReadModeCode.SLOWandFAST, true);        
        this.registerELM327ParameterCode(OBDIIParameterCode.Throttle_Opening_Angle, ReadModeCode.SLOWandFAST, true);        
        this.registerELM327ParameterCode(OBDIIParameterCode.Coolant_Temperature, ReadModeCode.SLOW, true);        
    }
    
    protected setTextureFontPreloadOptions()
    {
        this.registerWebFontFamilyNameToPreload(WaterTempGaugePanel.RequestedFontFamily);
        this.registerWebFontFamilyNameToPreload(DigiTachoPanel.RequestedFontFamily);
        
        this.registerWebFontCSSURLToPreload(WaterTempGaugePanel.RequestedFontCSSURL);
        this.registerWebFontCSSURLToPreload(DigiTachoPanel.RequestedFontCSSURL);
        
        this.registerTexturePathToPreload(WaterTempGaugePanel.RequestedTexturePath);
        this.registerTexturePathToPreload(DigiTachoPanel.RequestedTexturePath);
    }
    
    protected setPIXIMeterPanel()
    {
        this.pixiApp = new PIXI.Application(1200, 600);
        const app = this.pixiApp;
        document.body.appendChild(app.view);
        app.view.style.width = "100vw";
        app.view.style.touchAction = "auto";
        
        const digiTachoPanel = new DigiTachoPanel();
        digiTachoPanel.position.set(0,0);
                
        const waterTempPanel = new WaterTempGaugePanel();
        waterTempPanel.position.set(600,0);
        waterTempPanel.scale.set(0.68);
                
        const throttlePanel = new ThrottleGaugePanel();
        throttlePanel.position.set(600,200);
        throttlePanel.scale.set(0.68);
        
        app.stage.addChild(digiTachoPanel);
        app.stage.addChild(waterTempPanel);
        app.stage.addChild(throttlePanel);
        
        app.ticker.add(() => 
        {
            const timestamp = PIXI.ticker.shared.lastTime;
            const tacho = this.ELM327WS.getVal(OBDIIParameterCode.Engine_Speed, timestamp);
            const speed = this.ELM327WS.getVal(OBDIIParameterCode.Vehicle_Speed, timestamp);
            const neutralSw = false;
            const gearPos = this.calculateGearPosition(tacho, speed, neutralSw);
            
            const waterTemp = this.ELM327WS.getRawVal(OBDIIParameterCode.Coolant_Temperature);
            const throttle = this.ELM327WS.getVal(OBDIIParameterCode.Throttle_Opening_Angle, timestamp);
            
            digiTachoPanel.Speed = speed;
            digiTachoPanel.Tacho = tacho;
            digiTachoPanel.GearPos = gearPos;
            waterTempPanel.Value = waterTemp;
            throttlePanel.Value = throttle;
       });
    }
}