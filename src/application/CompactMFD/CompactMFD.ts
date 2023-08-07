/* 
 * The MIT License
 *
 * Copyright 2017 sz2.
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
require("./CompactMFD.html");
import * as PIXI from 'pixi.js';

//Import application base class
import { MeterApplication } from "meter-application-common"
import { MeterApplicationOption } from "meter-application-common"

//Import meter parts
import { DigiTachoPanel } from "parts/DigiTachoPanel/DigiTachoPanel";
import { SemiCircularGaugePanelPresets } from '@websocketgaugeclientneo/meterparts-circularbargauges';
import { FullCircularGaugePanelPresets } from '@websocketgaugeclientneo/meterparts-circularbargauges';

// Import AppSettings.
import * as DefaultAppSettings from  "application/DefaultAppSettings"

window.onload = function () {
    const meterapp = new CompactMFDApp();
    meterapp.Start();
}

class CompactMFDApp {
    public async Start() {
        const pixiAppOption : Partial<PIXI.IApplicationOptions> = {width : 720, height : 1280};
        const appOption = new MeterApplicationOption(pixiAppOption, await DefaultAppSettings.getWebsocketCollectionOption());

        const gearCalculator = await DefaultAppSettings.getGearPositionCalculator();

        appOption.SetupPIXIMeterPanel = async (app, ws) => {
            // Construct meter panel parts.
            const stage = app.stage;
            const digiTachoPanel = await DigiTachoPanel.create();
            digiTachoPanel.position.set(0, 0);
            digiTachoPanel.scale.set(1.15);

            const boostPanel = await FullCircularGaugePanelPresets.BoostGaugePanel();
            boostPanel.position.set(90, 360);
            boostPanel.scale.set(1.3);

            const waterTempPanel = await SemiCircularGaugePanelPresets.WaterTempGaugePanel();
            waterTempPanel.position.set(0, 890);
            waterTempPanel.scale.set(0.85);

            const throttlePanel = await SemiCircularGaugePanelPresets.ThrottleGaugePanel();
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
                const tacho = ws.WSMapper.getValue("Engine_Speed", timestamp);
                const speed = ws.WSMapper.getValue("Vehicle_Speed", timestamp);
                const gearPos = gearCalculator.getGearPosition(tacho, speed);
                const boost = ws.WSMapper.getValue("Manifold_Absolute_Pressure", timestamp) * 0.0101972 - 1; //convert kPa to kgf/cm2 and relative pressure   
                const waterTemp = ws.WSMapper.getValue("Coolant_Temperature");
                const throttle = ws.WSMapper.getValue("Throttle_Opening_Angle", timestamp);

                // Update meter panel value by sensor data.
                digiTachoPanel.Speed = speed;
                digiTachoPanel.Tacho = tacho;
                digiTachoPanel.GearPos = (gearPos === undefined)?"-":gearPos.toString();
                waterTempPanel.Value = waterTemp;
                throttlePanel.Value = throttle;
                boostPanel.Value = boost;
            });

            ws.WSMapper.registerParameterCode("Engine_Speed", "SLOWandFAST");
            ws.WSMapper.registerParameterCode("Vehicle_Speed", "SLOWandFAST");
            ws.WSMapper.registerParameterCode("Throttle_Opening_Angle", "SLOWandFAST");
            ws.WSMapper.registerParameterCode("Coolant_Temperature", "SLOW");
            ws.WSMapper.registerParameterCode("Manifold_Absolute_Pressure", "SLOWandFAST");
        };

        const app = new MeterApplication(appOption);         
        app.Run();
    }
}