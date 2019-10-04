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

//Import application base class
import {MeterApplicationBase} from "../../lib/MeterAppBase/MeterApplicationBase";

//Import meter parts
import {AnalogMeterCluster} from "../../parts/AnalogMeterCluster/AnalogMeterCluster";

//Import enumuator of parameter code
import {OBDIIParameterCode} from "../../lib/WebSocket/WebSocketCommunication";
import {ReadModeCode} from "../../lib/WebSocket/WebSocketCommunication";

//For including entry point html file in webpack
require("./AnalogMeterCluster-ELM327.html");

window.onload = function()
{
    const meterapp = new AnalogMeterCluster_ELM327(1100, 600);
    meterapp.run();
}

class AnalogMeterCluster_ELM327 extends MeterApplicationBase
{
    protected setWebSocketOptions()
    {
        this.IsELM327WSEnabled = true;
        this.IsFUELTRIPWSEnabled = true;
        
        this.registerELM327ParameterCode(OBDIIParameterCode.Engine_Speed, ReadModeCode.SLOWandFAST, true);
        this.registerELM327ParameterCode(OBDIIParameterCode.Manifold_Absolute_Pressure, ReadModeCode.SLOWandFAST, true);
        this.registerELM327ParameterCode(OBDIIParameterCode.Vehicle_Speed, ReadModeCode.SLOWandFAST, true);
        this.registerELM327ParameterCode(OBDIIParameterCode.Coolant_Temperature, ReadModeCode.SLOW, false);
    }
    
    protected setTextureFontPreloadOptions()
    {
        this.registerWebFontFamilyNameToPreload(AnalogMeterCluster.RequestedFontFamily);
        this.registerWebFontCSSURLToPreload(AnalogMeterCluster.RequestedFontCSSURL);
        this.registerTexturePathToPreload(AnalogMeterCluster.RequestedTexturePath);
    }
    
    protected setPIXIMeterPanel() : void
    {
        const meterCluster = new AnalogMeterCluster();
        this.stage.addChild(meterCluster);

        this.ticker.add(() => {
            const timestamp = this.ticker.lastTime;
            const tacho = this.ELM327WS.getVal(OBDIIParameterCode.Engine_Speed, timestamp);
            const boost = this.ELM327WS.getVal(OBDIIParameterCode.Manifold_Absolute_Pressure, timestamp) * 0.0101972 - 1 //convert kPa to kgf/cm2 and relative pressure;
            const speed = this.ELM327WS.getVal(OBDIIParameterCode.Vehicle_Speed,timestamp);
            const waterTemp = this.ELM327WS.getRawVal(OBDIIParameterCode.Coolant_Temperature);
            const trip = this.FUELTRIPWS.getTotalTrip();
            const fuel = this.FUELTRIPWS.getTotalGas();
            const gasMilage = this.FUELTRIPWS.getTotalGasMilage();
            const neutralSw = false;
            
            const geasPos = this.calculateGearPosition(tacho, speed, neutralSw);
            
            meterCluster.Tacho = tacho;
            meterCluster.Boost = boost; 
            meterCluster.Speed = speed;
            meterCluster.WaterTemp = waterTemp;
            meterCluster.GearPos = geasPos;
            meterCluster.Trip = trip;
            meterCluster.Fuel = fuel;
            meterCluster.GasMilage = gasMilage;
        });
    }
}
