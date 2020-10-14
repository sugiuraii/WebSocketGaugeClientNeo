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

//Assign entry point html file to bundle by webpack
require("./CompactMFD-Arduino.html");

//Import application base class
import { MeterApplication } from "../../lib/MeterAppBase/MeterApplication";
import { MeterApplicationOption } from "../../lib/MeterAppBase/options/MeterApplicationOption";

//Import meter parts
import { BoostGaugePanel } from "../../parts/CircularGauges/FullCircularGaugePanel";
import { WaterTempGaugePanel } from "../../parts/CircularGauges/SemiCircularGaugePanel";
import { EngineOilTempGaugePanel } from "../../parts/CircularGauges/SemiCircularGaugePanel";
import { DigiTachoPanel } from "../../parts/DigiTachoPanel/DigiTachoPanel";

//Import enumuator of parameter code
import { ArduinoParameterCode } from "../../lib/WebSocket/WebSocketCommunication";

import { calculateGearPosition } from "../../lib/MeterAppBase/utils/CalculateGearPosition";

window.onload = function () {
    const meterapp = new CompactMFD_Arduino();
    meterapp.Start();
}

class CompactMFD_Arduino {
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

        appOption.WebsocketEnableFlag.Arduino = true;

        appOption.ParameterCode.Arduino.addall([ArduinoParameterCode.Engine_Speed, ArduinoParameterCode.Manifold_Absolute_Pressure, ArduinoParameterCode.Vehicle_Speed, ArduinoParameterCode.Coolant_Temperature, ArduinoParameterCode.Oil_Temperature]);

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

            const engineOilTempPanel = new EngineOilTempGaugePanel();
            engineOilTempPanel.position.set(360, 890);
            engineOilTempPanel.scale.set(0.85);

            stage.addChild(digiTachoPanel);
            stage.addChild(boostPanel);
            stage.addChild(waterTempPanel);
            stage.addChild(engineOilTempPanel);

            app.ticker.add(() => {
                const timestamp = app.ticker.lastTime;
                const tacho = ws.ArduinoWS.getVal(ArduinoParameterCode.Engine_Speed, timestamp);
                const speed = ws.ArduinoWS.getVal(ArduinoParameterCode.Vehicle_Speed, timestamp);
                const neutralSw = false;
                const gearPos = calculateGearPosition(tacho, speed, neutralSw);
                const engineOilTemp = ws.ArduinoWS.getVal(ArduinoParameterCode.Oil_Temperature, timestamp);

                const boost = ws.ArduinoWS.getVal(ArduinoParameterCode.Manifold_Absolute_Pressure, timestamp) * 0.0101972 - 1 //convert kPa to kgf/cm2 and relative pressure;
                const waterTemp = ws.ArduinoWS.getRawVal(ArduinoParameterCode.Coolant_Temperature);

                digiTachoPanel.Speed = speed;
                digiTachoPanel.Tacho = tacho;
                digiTachoPanel.GearPos = gearPos;

                boostPanel.Value = boost;
                waterTempPanel.Value = waterTemp;
                engineOilTempPanel.Value = engineOilTemp;
            });
        };
        const app = new MeterApplication(appOption);
        app.Run();
    }
}