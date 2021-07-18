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
require("./AnalogTripleMeter.html");
import * as PIXI from 'pixi.js';

//Import application base class
import { MeterApplication } from "../../lib/MeterAppBase/MeterApplication";
import { MeterApplicationOption } from "../../lib/MeterAppBase/options/MeterApplicationOption";

//Import meter parts
import { BoostMeter } from "../../parts/AnalogSingleMeter/AnalogSingleMeter";
import { WaterTempMeter } from "../../parts/AnalogSingleMeter/AnalogSingleMeter";
import { OilTempMeter } from "../../parts/AnalogSingleMeter/AnalogSingleMeter";

// Import AppSettings.
import * as DefaultAppSettings from  "../DefaultAppSettings"

window.onload = function () {
    const meterapp = new AnalogTripleMeterApp();
    meterapp.Start();
}

class AnalogTripleMeterApp {
    public async Start() {
        const pixiAppOption : PIXI.IApplicationOptions = {width : 1280, height : 720};

        const appOption = new MeterApplicationOption(pixiAppOption, await DefaultAppSettings.getWebsocketCollectionOption());
        appOption.PreloadResource.WebFontFamiliyName.push(...BoostMeter.RequestedFontFamily);
        appOption.PreloadResource.WebFontCSSURL.push(...BoostMeter.RequestedFontCSSURL);
        appOption.PreloadResource.TexturePath.push(...BoostMeter.RequestedTexturePath);

        appOption.SetupPIXIMeterPanel = (app, ws) => {
            const stage = app.stage;
            //Centering the top-level container
            stage.pivot.set(600, 200);
            stage.position.set(app.screen.width / 2, app.screen.height / 2);

            const boostMeter = new BoostMeter();
            boostMeter.position.set(800, 0);

            const waterTempMeter = new WaterTempMeter();
            waterTempMeter.position.set(0, 0);

            const oilTempMeter = new OilTempMeter();
            oilTempMeter.position.set(400, 0);

            stage.addChild(boostMeter);
            stage.addChild(waterTempMeter);
            stage.addChild(oilTempMeter);

            app.ticker.add(() => {
                const timestamp = app.ticker.lastTime;
                const boost = ws.WSMapper.getValue("Manifold_Absolute_Pressure", timestamp) * 0.0101972 - 1 //convert kPa to kgf/cm2 and relative pressure;

                const waterTemp = ws.WSMapper.getValue("Coolant_Temperature");
                const oilTemp = ws.WSMapper.getValue("Engine_oil_temperature");

                boostMeter.Value = boost;
                waterTempMeter.Value = waterTemp;
                oilTempMeter.Value = oilTemp;
            });

            ws.WSMapper.registerParameterCode("Manifold_Absolute_Pressure", "SLOWandFAST");
            ws.WSMapper.registerParameterCode("Coolant_Temperature", "SLOW");
            ws.WSMapper.registerParameterCode("Engine_oil_temperature", "SLOW");
        };
        const app = new MeterApplication(appOption);
        app.Run();
    }
}
