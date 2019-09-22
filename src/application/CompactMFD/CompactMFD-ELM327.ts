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
// This line is required to bundle font/texture/html files by webpack file-loader (do not delete)
/// <reference path="../../lib/webpackRequire.ts" />

import * as PIXI from "pixi.js";

// Set entry point html file to bundle by webpack
require("./CompactMFD-ELM327.html");

//Import application base class
import {MeterApplicationBase} from "../../lib/MeterAppBase/MeterApplicationBase";

//Import meter parts
import {WaterTempGaugePanel} from "../../parts/CircularGauges/SemiCircularGaugePanel";
import {ThrottleGaugePanel} from "../../parts/CircularGauges/SemiCircularGaugePanel";
import {DigiTachoPanel} from "../../parts/DigiTachoPanel/DigiTachoPanel";
import {BoostGaugePanel} from "../../parts/CircularGauges/FullCircularGaugePanel";

//Import enumuator of parameter code
import {OBDIIParameterCode} from "../../lib/WebSocket/WebSocketCommunication";
import {ReadModeCode} from "../../lib/WebSocket/WebSocketCommunication";


window.onload = function()
{
    const meterapp = new CompactMFD_ELM327(720, 1280);
    meterapp.run();
}

class CompactMFD_ELM327 extends MeterApplicationBase
{
    /**
     * Put code to set up websocket communication.
     */
    protected setWebSocketOptions()
    {
        //Enable ELM327 websocket client
        this.IsELM327WSEnabled = true;
        
        this.registerELM327ParameterCode(OBDIIParameterCode.Engine_Speed, ReadModeCode.SLOWandFAST, true);        
        this.registerELM327ParameterCode(OBDIIParameterCode.Vehicle_Speed, ReadModeCode.SLOWandFAST, true);        
        this.registerELM327ParameterCode(OBDIIParameterCode.Throttle_Opening_Angle, ReadModeCode.SLOWandFAST, true);        
        this.registerELM327ParameterCode(OBDIIParameterCode.Coolant_Temperature, ReadModeCode.SLOW, true); 
        this.registerELM327ParameterCode(OBDIIParameterCode.Manifold_Absolute_Pressure, ReadModeCode.SLOWandFAST, true);       
    }
    /**
     * Put code to register resources (texture image files, fonts) to preload.
     */
    protected setTextureFontPreloadOptions()
    {
        this.registerWebFontFamilyNameToPreload(WaterTempGaugePanel.RequestedFontFamily);
        this.registerWebFontFamilyNameToPreload(DigiTachoPanel.RequestedFontFamily);
        this.registerWebFontFamilyNameToPreload(BoostGaugePanel.RequestedFontFamily);
        this.registerWebFontFamilyNameToPreload(ThrottleGaugePanel.RequestedFontFamily);
    
        this.registerWebFontCSSURLToPreload(WaterTempGaugePanel.RequestedFontCSSURL);
        this.registerWebFontCSSURLToPreload(DigiTachoPanel.RequestedFontCSSURL);
        this.registerWebFontCSSURLToPreload(BoostGaugePanel.RequestedFontCSSURL);
        this.registerWebFontCSSURLToPreload(ThrottleGaugePanel.RequestedFontCSSURL);
        
        this.registerTexturePathToPreload(WaterTempGaugePanel.RequestedTexturePath);
        this.registerTexturePathToPreload(DigiTachoPanel.RequestedTexturePath);
        this.registerTexturePathToPreload(BoostGaugePanel.RequestedTexturePath);
        this.registerTexturePathToPreload(ThrottleGaugePanel.RequestedTexturePath);
    }
    
    /**
     * Put code to setup pixi.js meter panel.
     */
    protected setPIXIMeterPanel()
    {
        // Construct meter panel parts.
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

        // Put meter panel parts to stage.
        this.stage.addChild(digiTachoPanel);
        this.stage.addChild(boostPanel);
        this.stage.addChild(waterTempPanel);
        this.stage.addChild(throttlePanel);
        
        // Define ticker method to update meter view (this ticker method will be called every frame).
        this.ticker.add(() => 
        {
            // Take timestamp of animation frame. (This time stamp is needed to interpolate meter sensor reading).
            const timestamp = PIXI.Ticker.shared.lastTime;
            // Get sensor information from websocket communication objects.
            const tacho = this.ELM327WS.getVal(OBDIIParameterCode.Engine_Speed, timestamp);
            const speed = this.ELM327WS.getVal(OBDIIParameterCode.Vehicle_Speed, timestamp);
            const neutralSw = false;
            const gearPos = this.calculateGearPosition(tacho, speed, neutralSw);
            const boost = this.ELM327WS.getVal(OBDIIParameterCode.Manifold_Absolute_Pressure, timestamp)  * 0.0101972 - 1; //convert kPa to kgf/cm2 and relative pressure   
            const waterTemp = this.ELM327WS.getRawVal(OBDIIParameterCode.Coolant_Temperature);
            const throttle = this.ELM327WS.getVal(OBDIIParameterCode.Throttle_Opening_Angle, timestamp);
            
            // Update meter panel value by sensor data.
            digiTachoPanel.Speed = speed;
            digiTachoPanel.Tacho = tacho;
            digiTachoPanel.GearPos = gearPos;
            waterTempPanel.Value = waterTemp;
            throttlePanel.Value = throttle;
            boostPanel.Value = boost;
       });
    }
}