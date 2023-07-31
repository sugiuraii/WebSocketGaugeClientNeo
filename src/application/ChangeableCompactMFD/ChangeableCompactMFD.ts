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
require("./ChangeableCompactMFD.html");
import * as PIXI from 'pixi.js';

//Import application base class
import { MeterApplication } from "meter-application-common"
import { MeterApplicationOption } from "meter-application-common"

//Import meter parts
import { DigiTachoPanel } from "parts/DigiTachoPanel/DigiTachoPanel";

// Import AppSettings.
import * as DefaultAppSettings from  "application/DefaultAppSettings"

import { FullCircularGaugePanelFactory } from 'parts/partsFactory/FullCircularGaugePanelFactory';
import { MeterNotAvailableError } from 'parts/partsFactory/MeterNotAvailableError';
import { SemiCircularGaugePanelFactory } from 'parts/partsFactory/SemiCircularGaugePanelFactory';

const useVacuumInsteadOfBoost = false;

window.onload = function () {
    const meterapp = new ChangeableCompactMFDApp();
    meterapp.Start();
}

class ChangeableCompactMFDApp {
    public async Start() {
        const pixiAppOption : Partial<PIXI.IApplicationOptions> = {width : 720, height : 1280};
        const appOption = new MeterApplicationOption(pixiAppOption, await DefaultAppSettings.getWebsocketCollectionOption());

        appOption.MeteSelectDialogOption.ParameterCodeListToSelect = ["Engine_Load", "Manifold_Absolute_Pressure", "Coolant_Temperature", "Engine_oil_temperature", "Battery_Voltage", "Mass_Air_Flow", "Throttle_Opening_Angle", "O2Sensor_1_Air_Fuel_Ratio", "Intake_Air_Temperature"];
        appOption.MeteSelectDialogOption.DefaultMeterSelectDialogSetting = { ["LargeMeter"]: "Manifold_Absolute_Pressure", ["SmallLeftMeter"]: "Coolant_Temperature", ["SmallRightMeter"]: "Battery_Voltage"};

        const gearCalculator = await DefaultAppSettings.getGearPositionCalculator();

        appOption.SetupPIXIMeterPanel = async (app, ws, meterSetting) => {

            const stage = app.stage;

            const digiTachoPanel = await DigiTachoPanel.create();
            digiTachoPanel.position.set(0, 0);
            digiTachoPanel.scale.set(1.15);

            const largeCenterMeterCode = meterSetting["LargeMeter"];
            const smallLeftMeterCode = meterSetting["SmallLeftMeter"];
            const smallRightMeterCode = meterSetting["SmallRightMeter"];

            const largeMeterPanelFactory = new FullCircularGaugePanelFactory(useVacuumInsteadOfBoost);
            const smallMeterPanelFactory = new SemiCircularGaugePanelFactory(useVacuumInsteadOfBoost);
            
            try
            {
                const centerLargeMeter = largeMeterPanelFactory.getMeter(largeCenterMeterCode);
                const smallLeftMeter = smallMeterPanelFactory.getMeter(smallLeftMeterCode);
                const smallRightMeter = smallMeterPanelFactory.getMeter(smallRightMeterCode);

                const centerLargeMeterDisplayObj = await centerLargeMeter.createDisplayObject();
                centerLargeMeterDisplayObj.position.set(90, 360);
                centerLargeMeterDisplayObj.scale.set(1.3);

                const smallLeftMeterDisplayObj = await smallLeftMeter.createDisplayObject();
                smallLeftMeterDisplayObj.position.set(0, 890);
                smallLeftMeterDisplayObj.scale.set(0.85);

                const smallRightMeterDisplayObj = await smallRightMeter.createDisplayObject();
                smallRightMeterDisplayObj.position.set(360, 890);
                smallRightMeterDisplayObj.scale.set(0.85);

                // Put meter panel parts to stage.
                stage.addChild(digiTachoPanel);
                stage.addChild(centerLargeMeterDisplayObj);
                stage.addChild(smallLeftMeterDisplayObj);
                stage.addChild(smallRightMeterDisplayObj);

                // Define ticker method to update meter view (this ticker method will be called every frame).
                app.ticker.add(() => {
                    // Take timestamp of animation frame. (This time stamp is needed to interpolate meter sensor reading).
                    const timestamp = app.ticker.lastTime;
                    // Get sensor information from websocket communication objects.
                    const tacho = ws.WSMapper.getValue("Engine_Speed", timestamp);
                    const speed = ws.WSMapper.getValue("Vehicle_Speed", timestamp);
                    const gearPos = gearCalculator.getGearPosition(tacho, speed);

                    // Update meter panel value by sensor data.
                    digiTachoPanel.Speed = speed;
                    digiTachoPanel.Tacho = tacho;
                    digiTachoPanel.GearPos = (gearPos === undefined)?"-":gearPos.toString();

                    centerLargeMeterDisplayObj.Value = centerLargeMeter.getValue(timestamp, ws);
                    smallLeftMeterDisplayObj.Value = smallLeftMeter.getValue(timestamp, ws);
                    smallRightMeterDisplayObj.Value = smallRightMeter.getValue(timestamp, ws);
                });

                ws.WSMapper.registerParameterCode("Engine_Speed", "SLOWandFAST");
                ws.WSMapper.registerParameterCode("Vehicle_Speed", "SLOWandFAST");
                ws.WSMapper.registerParameterCode(centerLargeMeter.code, centerLargeMeter.readmode);
                ws.WSMapper.registerParameterCode(smallLeftMeter.code, smallLeftMeter.readmode);
                ws.WSMapper.registerParameterCode(smallRightMeter.code, smallRightMeter.readmode);
            }
            catch(e)
            {
                if(e instanceof MeterNotAvailableError)
                    window.alert(e.message);
                else
                    throw e;
            }
        };

        const app = new MeterApplication(appOption);         
        app.Run();
    }
}