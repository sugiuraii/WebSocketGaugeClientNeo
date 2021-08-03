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
require("./AnalogSingleMeterWidget.html");
import * as PIXI from 'pixi.js';

//Import application base class
import { MeterWidgetApplication } from "../../../lib/MeterAppBase/MeterWidgetApplication";
import { MeterApplicationOption } from "../../../lib/MeterAppBase/options/MeterApplicationOption";

//Import meter parts
import { AnalogSingleMeter } from "../../../parts/AnalogSingleMeter/AnalogSingleMeter";

// Import AppSettings.
import * as DefaultAppSettings from "../../DefaultAppSettings"
import { AnalogSingleMeterFactory } from '../../../parts/partsFactory/AnalogSingleMeterFactory';

const useVacuumInsteadOfBoost = false;

window.onload = function () {
    const meterapp = new AnalogSingleMeterWidgetApp();
    meterapp.Start();
}

class AnalogSingleMeterWidgetApp {

    public async Start() {
        const pixiAppOption: PIXI.IApplicationOptions = { width: 410, height: 410 };

        const appOption = new MeterApplicationOption(pixiAppOption, await DefaultAppSettings.getWebsocketCollectionOption());
        appOption.PreloadResource.WebFontFamiliyName.push(...AnalogSingleMeter.RequestedFontFamily);
        appOption.PreloadResource.WebFontCSSURL.push(...AnalogSingleMeter.RequestedFontCSSURL);
        appOption.PreloadResource.TexturePath.push(...AnalogSingleMeter.RequestedTexturePath);

        appOption.SetupPIXIMeterPanel = (app, ws, meterSetting) => {
            const stage = app.stage;
            //Centering the top-level container
            stage.pivot.set(0, 0);
            stage.position.set(0, 0);

            const analogSingleMeterFactory = new AnalogSingleMeterFactory(useVacuumInsteadOfBoost);
            
            const meterCode = meterSetting["Meter1"];
    
            const meter = analogSingleMeterFactory.getMeter(meterCode);

            const meterDisplayObject = meter.createDisplayObject();
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
