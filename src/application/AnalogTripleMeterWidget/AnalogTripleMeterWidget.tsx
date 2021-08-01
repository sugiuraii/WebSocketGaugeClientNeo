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

//For including entry point html file in webpack
require("./AnalogTripleMeterWidget.html");
import * as PIXI from 'pixi.js';

//Import application base class
import { MeterWidgetApplication } from "../../lib/MeterAppBase/MeterWidgetApplication";
import { MeterApplicationOption } from "../../lib/MeterAppBase/options/MeterApplicationOption";

//Import meter parts
import { AnalogSingleMeter } from "../../parts/AnalogSingleMeter/AnalogSingleMeter";

// Import AppSettings.
import * as DefaultAppSettings from "../DefaultAppSettings"
import { AnalogSingleMeterFactory } from '../../parts/partsFactory/AnalogSingleMeterFactory';

const useVacuumInsteadOfBoost = false;

window.onload = function () {
    const meterapp = new AnalogTripleMeterWidgetApp();
    meterapp.Start();
}

class AnalogTripleMeterWidgetApp {

    public async Start() {
        const pixiAppOption: PIXI.IApplicationOptions = { width: 1280, height: 720 };

        const appOption = new MeterApplicationOption(pixiAppOption, await DefaultAppSettings.getWebsocketCollectionOption());
        appOption.PreloadResource.WebFontFamiliyName.push(...AnalogSingleMeter.RequestedFontFamily);
        appOption.PreloadResource.WebFontCSSURL.push(...AnalogSingleMeter.RequestedFontCSSURL);
        appOption.PreloadResource.TexturePath.push(...AnalogSingleMeter.RequestedTexturePath);
        //appOption.MeteSelectDialogOption.ParameterCodeListToSelect = ["Engine_Speed", "Engine_Load", "Manifold_Absolute_Pressure", "Coolant_Temperature", "Engine_oil_temperature", "Battery_Voltage", "Oil_Pressure", "Mass_Air_Flow", "O2Sensor_1_Air_Fuel_Ratio", "Intake_Air_Temperature"];
        //appOption.MeteSelectDialogOption.DefaultMeterSelectDialogSetting = { ["Left"]: "Engine_Speed", ["Center"]: "Manifold_Absolute_Pressure", ["Right"]: "Coolant_Temperature" };

        appOption.SetupPIXIMeterPanel = (app, ws, meterSetting) => {
            const stage = app.stage;
            //Centering the top-level container
            stage.pivot.set(600, 200);
            stage.position.set(app.screen.width / 2, app.screen.height / 2);

            const analogSingleMeterFactory = new AnalogSingleMeterFactory(useVacuumInsteadOfBoost);
            
            const leftMeterCode = meterSetting["Left"];
            const centerMeterCode = meterSetting["Center"];
            const rightMeterCode = meterSetting["Right"];
    
            const leftMeter = analogSingleMeterFactory.getMeter(leftMeterCode);
            const centerMeter = analogSingleMeterFactory.getMeter(centerMeterCode);
            const rightMeter = analogSingleMeterFactory.getMeter(rightMeterCode);    

            const leftMeterDisplayObject = leftMeter.createDisplayObject();
            const centerMeterDisplayObject = centerMeter.createDisplayObject();
            const rightMeterDisplayObject = rightMeter.createDisplayObject();
            leftMeterDisplayObject.position.set(0, 0);
            centerMeterDisplayObject.position.set(400, 0);
            rightMeterDisplayObject.position.set(800, 0);
            stage.addChild(leftMeterDisplayObject);
            stage.addChild(centerMeterDisplayObject);
            stage.addChild(rightMeterDisplayObject);
            
            app.ticker.add(() => {
                const timestamp = app.ticker.lastTime;

                leftMeterDisplayObject.Value = leftMeter.getValue(timestamp, ws);
                centerMeterDisplayObject.Value = centerMeter.getValue(timestamp, ws);
                rightMeterDisplayObject.Value = rightMeter.getValue(timestamp, ws);
            });

            ws.WSMapper.registerParameterCode(leftMeter.code, leftMeter.readmode);
            ws.WSMapper.registerParameterCode(centerMeter.code, centerMeter.readmode);
            ws.WSMapper.registerParameterCode(rightMeter.code, rightMeter.readmode);
        };

        const app = new MeterWidgetApplication(appOption);
        app.Run();
    }
}
