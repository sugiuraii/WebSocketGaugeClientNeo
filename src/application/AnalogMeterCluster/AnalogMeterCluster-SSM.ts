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
import {SSMParameterCode} from "../../lib/WebSocket/WebSocketCommunication";
import {SSMSwitchCode} from "../../lib/WebSocket/WebSocketCommunication";
import {ReadModeCode} from "../../lib/WebSocket/WebSocketCommunication";

//For including entry point html file in webpack
require("./AnalogMeterCluster-SSM.html");

window.onload = function()
{
    const meterapp = new AnalogMeterCluster_SSM(1100, 600);
    meterapp.run();
}

class AnalogMeterCluster_SSM extends MeterApplicationBase
{
    protected setWebSocketOptions()
    {
        this.IsSSMWSEnabled = true;
        this.IsFUELTRIPWSEnabled = true;
        
        this.registerSSMParameterCode(SSMParameterCode.Engine_Speed, ReadModeCode.SLOWandFAST, true);
        this.registerSSMParameterCode(SSMParameterCode.Manifold_Absolute_Pressure, ReadModeCode.SLOWandFAST, true);
        this.registerSSMParameterCode(SSMParameterCode.Vehicle_Speed, ReadModeCode.SLOWandFAST, true);
        this.registerSSMParameterCode(SSMParameterCode.Coolant_Temperature, ReadModeCode.SLOW, false);
        this.registerSSMParameterCode(SSMSwitchCode.getNumericCodeFromSwitchCode(SSMSwitchCode.Neutral_Position_Switch), ReadModeCode.SLOWandFAST, false);
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
            const timestamp = PIXI.ticker.shared.lastTime;
            const tacho = this.SSMWS.getVal(SSMParameterCode.Engine_Speed, timestamp);
            const boost = this.SSMWS.getVal(SSMParameterCode.Manifold_Absolute_Pressure, timestamp) * 0.0101972 - 1 //convert kPa to kgf/cm2 and relative pressure;
            const speed = this.SSMWS.getVal(SSMParameterCode.Vehicle_Speed,timestamp);
            const waterTemp = this.SSMWS.getRawVal(SSMParameterCode.Coolant_Temperature);
            const trip = this.FUELTRIPWS.getTotalTrip();
            const fuel = this.FUELTRIPWS.getTotalGas();
            const gasMilage = this.FUELTRIPWS.getTotalGasMilage();
            const neutralSw = this.SSMWS.getSwitchFlag(SSMSwitchCode.Neutral_Position_Switch);
            
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
