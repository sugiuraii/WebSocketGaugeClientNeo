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
require("./CompactMFD-AssettoCorsaSHM.html");
import * as PIXI from 'pixi.js';

//Import application base class
import { MeterApplication } from "../../../lib/MeterAppBase/MeterApplication";
import { MeterApplicationOption } from "../../../lib/MeterAppBase/options/MeterApplicationOption";

//Import meter parts
import { BoostGaugePanel } from "../../../parts/CircularGauges/FullCircularGaugePanel";
import { WaterTempGaugePanel } from "../../../parts/CircularGauges/SemiCircularGaugePanel";
import { EngineOilTempGaugePanel } from "../../../parts/CircularGauges/SemiCircularGaugePanel";
import { DigiTachoPanel } from "../../../parts/DigiTachoPanel/DigiTachoPanel";

//Import enumuator of parameter code
import { AssettoCorsaSHMPhysicsParameterCode, AssettoCorsaSHMNumericalVALCode } from "../../../lib/WebSocket/WebSocketCommunication";

window.onload = function () {
    const meterapp = new CompactMFD_AssettoCorsaSHM();
    meterapp.Start();
}

class CompactMFD_AssettoCorsaSHM {
    public Start() {
        const pixiAppOption : PIXI.IApplicationOptions = {width : 720, height : 1280};

        const appOption = new MeterApplicationOption(pixiAppOption);
        appOption.PreloadResource.WebFontFamiliyName.addall(WaterTempGaugePanel.RequestedFontFamily);
        appOption.PreloadResource.WebFontFamiliyName.addall(DigiTachoPanel.RequestedFontFamily);
        appOption.PreloadResource.WebFontFamiliyName.addall(BoostGaugePanel.RequestedFontFamily);

        appOption.PreloadResource.WebFontCSSURL.addall(WaterTempGaugePanel.RequestedFontCSSURL);
        appOption.PreloadResource.WebFontCSSURL.addall(DigiTachoPanel.RequestedFontCSSURL);
        appOption.PreloadResource.WebFontCSSURL.addall(BoostGaugePanel.RequestedFontCSSURL);

        appOption.PreloadResource.TexturePath.addall(WaterTempGaugePanel.RequestedTexturePath);
        appOption.PreloadResource.TexturePath.addall(DigiTachoPanel.RequestedTexturePath);
        appOption.PreloadResource.TexturePath.addall(BoostGaugePanel.RequestedTexturePath);

        appOption.WebSocketCollectionOption.AssettoCorsaWSEnabled = true;

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
                const tacho = ws.AssettoCorsaWS.getVal(AssettoCorsaSHMNumericalVALCode.Rpms, timestamp);
                const speed = ws.AssettoCorsaWS.getVal(AssettoCorsaSHMNumericalVALCode.SpeedKmh, timestamp);
                const gearPos = ws.AssettoCorsaWS.getRawVal(AssettoCorsaSHMNumericalVALCode.Gear);
                const engineOilTemp = 110;

                const boost = ws.AssettoCorsaWS.getVal(AssettoCorsaSHMNumericalVALCode.ManifoldPressure, timestamp) * 1.0197;
                //convert bar to kgf/cm2 and relative pressure;
                const waterTemp = 95;

                digiTachoPanel.Speed = speed;
                digiTachoPanel.Tacho = tacho;
                if (gearPos === 0)
                    digiTachoPanel.GearPos = "R";
                else if (gearPos === 1)
                    digiTachoPanel.GearPos = "N";
                else
                    digiTachoPanel.GearPos = (gearPos - 1).toString();

                boostPanel.Value = boost;
                waterTempPanel.Value = waterTemp;
                engineOilTempPanel.Value = engineOilTemp;
            });
        };
        const app = new MeterApplication(appOption);

        app.WebSocketCollection.AssettoCorsaWS.PhysicsParameterCodeList.push(...[AssettoCorsaSHMPhysicsParameterCode.Rpms,
        AssettoCorsaSHMPhysicsParameterCode.SpeedKmh,
        AssettoCorsaSHMPhysicsParameterCode.ManifoldPressure,
        AssettoCorsaSHMPhysicsParameterCode.Gear]);
        app.Run();
    }
}