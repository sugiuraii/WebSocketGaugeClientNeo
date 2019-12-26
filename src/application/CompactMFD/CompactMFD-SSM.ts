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
require("./CompactMFD-SSM.html");

//Import application base class
import { MeterApplication } from "../../lib/MeterAppBase/MeterApplication";
import { MeterApplicationOption } from "../../lib/MeterAppBase/options/MeterApplicationOption";

//Import meter parts
import { WaterTempGaugePanel } from "../../parts/CircularGauges/SemiCircularGaugePanel";
import { ThrottleGaugePanel } from "../../parts/CircularGauges/SemiCircularGaugePanel";
import { DigiTachoPanel } from "../../parts/DigiTachoPanel/DigiTachoPanel";
import { BoostGaugePanel } from "../../parts/CircularGauges/FullCircularGaugePanel";

//Import enumuator of parameter code
import { SSMParameterCode } from "../../lib/WebSocket/WebSocketCommunication";
import { SSMSwitchCode } from "../../lib/WebSocket/WebSocketCommunication";

import { ReadModeCode } from "../../lib/WebSocket/WebSocketCommunication";

import { calculateGearPosition } from "../../lib/MeterAppBase/utils/CalculateGearPosition";

window.onload = function () {
    const meterapp = new CompactMFD_SSM();
    meterapp.Start();
}

class CompactMFD_SSM {
    public Start() {
        const appOption = new MeterApplicationOption();
        appOption.width = 720;
        appOption.height = 1280;
        appOption.PreloadResource.WebFontFamiliyName.addall(WaterTempGaugePanel.RequestedFontFamily);
        appOption.PreloadResource.WebFontFamiliyName.addall(DigiTachoPanel.RequestedFontFamily);
        appOption.PreloadResource.WebFontFamiliyName.addall(BoostGaugePanel.RequestedFontFamily);

        appOption.PreloadResource.WebFontCSSURL.addall(WaterTempGaugePanel.RequestedFontCSSURL);
        appOption.PreloadResource.WebFontCSSURL.addall(DigiTachoPanel.RequestedFontCSSURL);
        appOption.PreloadResource.WebFontCSSURL.addall(BoostGaugePanel.RequestedFontCSSURL);

        appOption.PreloadResource.TexturePath.addall(WaterTempGaugePanel.RequestedTexturePath);
        appOption.PreloadResource.TexturePath.addall(DigiTachoPanel.RequestedTexturePath);
        appOption.PreloadResource.TexturePath.addall(BoostGaugePanel.RequestedTexturePath);

        appOption.WebsocketEnableFlag.SSM = true;

        appOption.ParameterCode.SSM.addall({ code: SSMParameterCode.Engine_Speed, readmode: ReadModeCode.SLOWandFAST });
        appOption.ParameterCode.SSM.addall({ code: SSMParameterCode.Manifold_Absolute_Pressure, readmode: ReadModeCode.SLOWandFAST });
        appOption.ParameterCode.SSM.addall({ code: SSMParameterCode.Vehicle_Speed, readmode: ReadModeCode.SLOWandFAST });
        appOption.ParameterCode.SSM.addall({ code: SSMParameterCode.Throttle_Opening_Angle, readmode: ReadModeCode.SLOWandFAST });
        appOption.ParameterCode.SSM.addall({ code: SSMParameterCode.Coolant_Temperature, readmode: ReadModeCode.SLOW });
        appOption.ParameterCode.SSM.addall({ code: SSMSwitchCode.getNumericCodeFromSwitchCode(SSMSwitchCode.Neutral_Position_Switch), readmode: ReadModeCode.SLOWandFAST });

        appOption.SetupPIXIMeterPanel = (app, ws) => {
            const stage = app.stage;
            const digiTachoPanel = new DigiTachoPanel();
            digiTachoPanel.position.set(0, 0);
            digiTachoPanel.scale.set(1.15);

            const boostPanel = new BoostGaugePanel();
            boostPanel.position.set(90, 360);
            boostPanel.scale.set(1.3);

            const waterTempPanel = new WaterTempGaugePanel();
            waterTempPanel.position.set(0, 890);
            waterTempPanel.scale.set(0.85);

            const throttlePanel = new ThrottleGaugePanel();
            throttlePanel.position.set(360, 890);
            throttlePanel.scale.set(0.85);

            stage.addChild(digiTachoPanel);
            stage.addChild(boostPanel);
            stage.addChild(waterTempPanel);
            stage.addChild(throttlePanel);

            app.ticker.add(() => {
                const timestamp = app.ticker.lastTime;
                const tacho = ws.SSMWS.getVal(SSMParameterCode.Engine_Speed, timestamp);
                const speed = ws.SSMWS.getVal(SSMParameterCode.Vehicle_Speed, timestamp);
                const neutralSw = ws.SSMWS.getSwitchFlag(SSMSwitchCode.Neutral_Position_Switch);
                const gearPos = calculateGearPosition(tacho, speed, neutralSw);
                const boost = ws.SSMWS.getVal(SSMParameterCode.Manifold_Absolute_Pressure, timestamp) * 0.0101972 - 1 //convert kPa to kgf/cm2 and relative pressure;

                const waterTemp = ws.SSMWS.getRawVal(SSMParameterCode.Coolant_Temperature);
                const throttle = ws.SSMWS.getVal(SSMParameterCode.Throttle_Opening_Angle, timestamp);

                digiTachoPanel.Speed = speed;
                digiTachoPanel.Tacho = tacho;
                digiTachoPanel.GearPos = gearPos;
                waterTempPanel.Value = waterTemp;
                throttlePanel.Value = throttle;
                boostPanel.Value = boost;
            });
        };
        const app = new MeterApplication(appOption);
        app.Run();
    }
}