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

//Assign entry point html file to bundle by webpack
require("./CompactMFD-Arduino.html");

//Import application base class
import {MeterApplicationBase} from "../../lib/MeterAppBase/MeterApplicationBase";

//Import meter parts
import {BoostGaugePanel} from "../../parts/CircularGauges/FullCircularGaugePanel";
import {WaterTempGaugePanel} from "../../parts/CircularGauges/SemiCircularGaugePanel";
import {EngineOilTempGaugePanel} from "../../parts/CircularGauges/SemiCircularGaugePanel";
import {DigiTachoPanel} from "../../parts/DigiTachoPanel/DigiTachoPanel";

//Import enumuator of parameter code
import {ArduinoParameterCode} from "../../lib/WebSocket/WebSocketCommunication";


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