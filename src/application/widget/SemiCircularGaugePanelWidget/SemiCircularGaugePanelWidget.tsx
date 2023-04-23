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
require("./SemiCircularGaugePanelWidget.html");
import * as PIXI from 'pixi.js';

//Import application base class
import { MeterWidgetApplication } from "lib/MeterAppBase/MeterWidgetApplication";
import { MeterApplicationOption } from "lib/MeterAppBase/options/MeterApplicationOption";

//Import meter parts
import { SemiCircularGaugePanel } from 'parts/CircularGauges/SemiCircularGaugePanel';
import { SemiCircularGaugePanelFactory } from 'parts/partsFactory/SemiCircularGaugePanelFactory';

// Import AppSettings.
import * as DefaultAppSettings from "application/DefaultAppSettings"

const useVacuumInsteadOfBoost = false;

window.onload = function () {
    const meterapp = new SemiCircularGaugePanelWidgetApp();
    meterapp.Start();
}

class SemiCircularGaugePanelWidgetApp {

    public async Start() {
        const pixiAppOption: Partial<PIXI.IApplicationOptions> = { width: 405, height: 300 };

        const appOption = new MeterApplicationOption(pixiAppOption, await DefaultAppSettings.getWebsocketCollectionOption());
        appOption.MeteSelectDialogOption.ParameterCodeListToSelect = ["Engine_Load", "Manifold_Absolute_Pressure", "Coolant_Temperature", "Engine_oil_temperature", "Battery_Voltage", "Mass_Air_Flow", "Throttle_Opening_Angle", "O2Sensor_1_Air_Fuel_Ratio", "Intake_Air_Temperature"];
        appOption.MeteSelectDialogOption.DefaultMeterSelectDialogSetting = { ["Meter1"]: "Manifold_Absolute_Pressure"};

        appOption.SetupPIXIMeterPanel = async (app, ws, meterSetting) => {
            const stage = app.stage;
            //Centering the top-level container
            stage.pivot.set(0, 0);
            stage.position.set(0, 0);

            const analogSingleMeterFactory = new SemiCircularGaugePanelFactory(useVacuumInsteadOfBoost);
            
            const meterCode = meterSetting["Meter1"];
    
            const meter = analogSingleMeterFactory.getMeter(meterCode);

            const meterDisplayObject = await meter.createDisplayObject();
            meterDisplayObject.position.set(0, 0);
            stage.addChild(meterDisplayObject);
            
            app.ticker.add(() => {
                const timestamp = app.ticker.lastTime;

                meterDisplayObject.Value = meter.getValue(timestamp, ws);
            });

            ws.WSMapper.registerParameterCode(meter.code, meter.readmode);
        };

        const app = new MeterWidgetApplication(appOption);
        app.Run();
    }
}
