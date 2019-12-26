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
import {MeterApplication} from "../../lib/MeterAppBase/MeterApplication";
import {MeterApplicationOption} from "../../lib/MeterAppBase/options/MeterApplicationOption";

//Import meter parts
import {AnalogMeterCluster} from "../../parts/AnalogMeterCluster/AnalogMeterCluster";

//Import enumuator of parameter code
import {OBDIIParameterCode} from "../../lib/WebSocket/WebSocketCommunication";
import {ReadModeCode} from "../../lib/WebSocket/WebSocketCommunication";

import {calculateGearPosition} from "../../lib/MeterAppBase/utils/CalculateGearPosition";

//For including entry point html file in webpack
require("./AnalogMeterCluster-ELM327.html");

window.onload = function()
{
    const meterapp = new AnalogMeterCluster_ELM327();
    meterapp.Start();
}

class AnalogMeterCluster_ELM327
{
    public Start()
    {
        const appOption = new MeterApplicationOption();
        appOption.width = 1100;
        appOption.height = 600;
        appOption.PreloadResource.WebFontFamiliyName.addall(AnalogMeterCluster.RequestedFontFamily);
        appOption.PreloadResource.WebFontCSSURL.addall(AnalogMeterCluster.RequestedFontCSSURL);
        appOption.PreloadResource.TexturePath.addall(AnalogMeterCluster.RequestedTexturePath);

        appOption.WebsocketEnableFlag.ELM327 = true;
        appOption.WebsocketEnableFlag.FUELTRIP = true;

        appOption.ParameterCode.ELM327OBDII.addall({code:OBDIIParameterCode.Engine_Speed, readmode:ReadModeCode.SLOWandFAST});
        appOption.ParameterCode.ELM327OBDII.addall({code:OBDIIParameterCode.Manifold_Absolute_Pressure, readmode:ReadModeCode.SLOWandFAST});
        appOption.ParameterCode.ELM327OBDII.addall({code:OBDIIParameterCode.Vehicle_Speed, readmode:ReadModeCode.SLOWandFAST});
        appOption.ParameterCode.ELM327OBDII.addall({code:OBDIIParameterCode.Coolant_Temperature, readmode:ReadModeCode.SLOW});
        
        appOption.SetupPIXIMeterPanel = (app, ws) =>
        {
            const stage = app.stage;
            const meterCluster = new AnalogMeterCluster();
            stage.addChild(meterCluster);
    
            app.ticker.add(() => {
                const timestamp = app.ticker.lastTime;
                const tacho = ws.ELM327WS.getVal(OBDIIParameterCode.Engine_Speed, timestamp);
                const boost = ws.ELM327WS.getVal(OBDIIParameterCode.Manifold_Absolute_Pressure, timestamp) * 0.0101972 - 1 //convert kPa to kgf/cm2 and relative pressure;
                const speed = ws.ELM327WS.getVal(OBDIIParameterCode.Vehicle_Speed,timestamp);
                const waterTemp = ws.ELM327WS.getRawVal(OBDIIParameterCode.Coolant_Temperature);
                const trip = ws.FUELTRIPWS.getTotalTrip();
                const fuel = ws.FUELTRIPWS.getTotalGas();
                const gasMilage = ws.FUELTRIPWS.getTotalGasMilage();
                const neutralSw = false;
                
                const geasPos = calculateGearPosition(tacho, speed, neutralSw);
                
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
}
