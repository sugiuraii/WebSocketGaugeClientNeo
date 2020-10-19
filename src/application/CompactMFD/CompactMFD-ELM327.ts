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

// Set entry point html file to bundle by webpack
require("./CompactMFD-ELM327.html");

//Import application base class
import { MeterApplication } from "../../lib/MeterAppBase/MeterApplication";
import { MeterApplicationOption } from "../../lib/MeterAppBase/options/MeterApplicationOption";

//Import meter parts
import { WaterTempGaugePanel } from "../../parts/CircularGauges/SemiCircularGaugePanel";
import { ThrottleGaugePanel } from "../../parts/CircularGauges/SemiCircularGaugePanel";
import { DigiTachoPanel } from "../../parts/DigiTachoPanel/DigiTachoPanel";
import { BoostGaugePanel } from "../../parts/CircularGauges/FullCircularGaugePanel";

//Import enumuator of parameter code
import { OBDIIParameterCode } from "../../lib/WebSocket/WebSocketCommunication";
import { ReadModeCode } from "../../lib/WebSocket/WebSocketCommunication";

import { calculateGearPosition } from "../../lib/MeterAppBase/utils/CalculateGearPosition";

window.onload = function () {
    const meterapp = new CompactMFD_ELM327();
    meterapp.Start();
}

class CompactMFD_ELM327 {
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

        appOption.WebsocketEnableFlag.ELM327 = true;
        appOption.ParameterCode.ELM327OBDII.addall({ code: OBDIIParameterCode.Engine_Speed, readmode: ReadModeCode.SLOWandFAST });
        appOption.ParameterCode.ELM327OBDII.addall({ code: OBDIIParameterCode.Vehicle_Speed, readmode: ReadModeCode.SLOWandFAST });
        appOption.ParameterCode.ELM327OBDII.addall({ code: OBDIIParameterCode.Throttle_Opening_Angle, readmode: ReadModeCode.SLOWandFAST });
        appOption.ParameterCode.ELM327OBDII.addall({ code: OBDIIParameterCode.Coolant_Temperature, readmode: ReadModeCode.SLOW });
        appOption.ParameterCode.ELM327OBDII.addall({ code: OBDIIParameterCode.Manifold_Absolute_Pressure, readmode: ReadModeCode.SLOWandFAST });

        appOption.SetupPIXIMeterPanel = (app, ws) => {
            // Construct meter panel parts.
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

            // Put meter panel parts to stage.
            stage.addChild(digiTachoPanel);
            stage.addChild(boostPanel);
            stage.addChild(waterTempPanel);
            stage.addChild(throttlePanel);

            // Define ticker method to update meter view (this ticker method will be called every frame).
            app.ticker.add(() => {
                // Take timestamp of animation frame. (This time stamp is needed to interpolate meter sensor reading).
                const timestamp = app.ticker.lastTime;
                // Get sensor information from websocket communication objects.
                const tacho = ws.ELM327WS.getVal(OBDIIParameterCode.Engine_Speed, timestamp);
                const speed = ws.ELM327WS.getVal(OBDIIParameterCode.Vehicle_Speed, timestamp);
                const neutralSw = false;
                const gearPos = calculateGearPosition(tacho, speed, neutralSw);
                const boost = ws.ELM327WS.getVal(OBDIIParameterCode.Manifold_Absolute_Pressure, timestamp) * 0.0101972 - 1; //convert kPa to kgf/cm2 and relative pressure   
                const waterTemp = ws.ELM327WS.getRawVal(OBDIIParameterCode.Coolant_Temperature);
                const throttle = ws.ELM327WS.getVal(OBDIIParameterCode.Throttle_Opening_Angle, timestamp);

                // Update meter panel value by sensor data.
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