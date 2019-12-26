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
require("./LEDRevMeter-ELM327.html");

//Import application base class
import { MeterApplication } from "../../lib/MeterAppBase/MeterApplication";
import { MeterApplicationOption } from "../../lib/MeterAppBase/options/MeterApplicationOption";

//Import meter parts
import {BoostMeter} from "../../parts/AnalogSingleMeter/AnalogSingleMeter";
import {WaterTempMeter} from "../../parts/AnalogSingleMeter/AnalogSingleMeter";
import {LEDTachoMeter} from "../../parts/LEDTachoMeter/LEDTachoMeter";

//Import enumuator of parameter code
import {OBDIIParameterCode} from "../../lib/WebSocket/WebSocketCommunication";
import {ReadModeCode} from "../../lib/WebSocket/WebSocketCommunication";

import { calculateGearPosition } from "../../lib/MeterAppBase/utils/CalculateGearPosition";

window.onload = function()
{
    const meterapp = new LEDRevMeter_ELM327();
    meterapp.Start();
}

class LEDRevMeter_ELM327
{
    public Start() {
        const appOption = new MeterApplicationOption();
        appOption.width = 1280;
        appOption.height = 720;

        appOption.PreloadResource.WebFontFamiliyName.addall(BoostMeter.RequestedFontFamily);
        appOption.PreloadResource.WebFontFamiliyName.addall(LEDTachoMeter.RequestedFontFamily);
        appOption.PreloadResource.WebFontCSSURL.addall(BoostMeter.RequestedFontCSSURL);
        appOption.PreloadResource.WebFontCSSURL.addall(LEDTachoMeter.RequestedFontCSSURL);
        appOption.PreloadResource.TexturePath.addall(BoostMeter.RequestedTexturePath);
        appOption.PreloadResource.TexturePath.addall(LEDTachoMeter.RequestedTexturePath);

        appOption.WebsocketEnableFlag.ELM327 = true;
        appOption.WebsocketEnableFlag.FUELTRIP = true;

        appOption.ParameterCode.ELM327OBDII.addall({ code: OBDIIParameterCode.Engine_Speed, readmode: ReadModeCode.SLOWandFAST });
        appOption.ParameterCode.ELM327OBDII.addall({ code: OBDIIParameterCode.Manifold_Absolute_Pressure, readmode: ReadModeCode.SLOWandFAST });
        appOption.ParameterCode.ELM327OBDII.addall({ code: OBDIIParameterCode.Vehicle_Speed, readmode: ReadModeCode.SLOWandFAST });
        appOption.ParameterCode.ELM327OBDII.addall({ code: OBDIIParameterCode.Coolant_Temperature, readmode: ReadModeCode.SLOW });

        appOption.SetupPIXIMeterPanel = (app, ws) => {

            const stage = app.stage;

            const boostMeter = new BoostMeter();
            boostMeter.position.set(850,0);
            
            const waterTempMeter = new WaterTempMeter();
            waterTempMeter.position.set(0,0);
    
            const ledRevMeter = new LEDTachoMeter();
            ledRevMeter.position.set(330,110);
                    
            stage.addChild(boostMeter);
            stage.addChild(waterTempMeter);
            stage.addChild(ledRevMeter);
            
            app.ticker.add(() => 
            {
                const timestamp = app.ticker.lastTime;
                const boost = ws.ELM327WS.getVal(OBDIIParameterCode.Manifold_Absolute_Pressure, timestamp)  * 0.0101972 - 1 //convert kPa to kgf/cm2 and relative pressure;            
                const waterTemp = ws.ELM327WS.getRawVal(OBDIIParameterCode.Coolant_Temperature);
                const rev = ws.ELM327WS.getVal(OBDIIParameterCode.Engine_Speed, timestamp);
                const speed = ws.ELM327WS.getRawVal(OBDIIParameterCode.Vehicle_Speed);
                const totalFuel = ws.FUELTRIPWS.getTotalGas();
                const totalTrip = ws.FUELTRIPWS.getTotalTrip();
                const totalFuelRate = ws.FUELTRIPWS.getTotalGasMilage();
                const neutralSw = false;
                
                const geasPos = calculateGearPosition(rev, speed, neutralSw);
                
                boostMeter.Value = boost;
                waterTempMeter.Value = waterTemp;
                ledRevMeter.Tacho = rev;
                ledRevMeter.Speed = speed;
                ledRevMeter.GearPos = geasPos;
                ledRevMeter.Trip = totalTrip;
                ledRevMeter.Fuel = totalFuel;
                ledRevMeter.GasMilage = totalFuelRate;
           });
        };
        const app = new MeterApplication(appOption);
        app.Run();
    }
}
        