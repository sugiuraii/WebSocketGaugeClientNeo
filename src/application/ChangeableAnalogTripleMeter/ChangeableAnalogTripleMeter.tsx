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

//For including entry point html file in webpack
require("./ChangeableAnalogTripleMeter.html");
import * as PIXI from 'pixi.js';

//Import application base class
import { MeterApplication } from "../../lib/MeterAppBase/MeterApplication";
import { MeterApplicationOption } from "../../lib/MeterAppBase/options/MeterApplicationOption";
import { WebstorageHandler } from '../../lib/MeterAppBase/Webstorage/WebstorageHandler';

//Import meter parts
import { BoostMeter } from "../../parts/AnalogSingleMeter/AnalogSingleMeter";

// Import AppSettings.
import * as DefaultAppSettings from "../DefaultAppSettings"
import { AnalogSingleMeterFactory } from '../partsFactory/AnalogSingleMeterFactory';

window.onload = function () {
    const meterapp = new ChangeableAnalogTripleMeterApp();
    meterapp.Start();
}

class ChangeableAnalogTripleMeterApp {
    private readonly UseVacuumMeterInsteadOfBoost = false;
    private readonly AnalogSingleMeterFactory = new AnalogSingleMeterFactory();

    public async Start() {
        const pixiAppOption: PIXI.IApplicationOptions = { width: 1280, height: 720 };

        const appOption = new MeterApplicationOption(pixiAppOption, await DefaultAppSettings.getWebsocketCollectionOption());
        appOption.PreloadResource.WebFontFamiliyName.addall(BoostMeter.RequestedFontFamily);
        appOption.PreloadResource.WebFontCSSURL.addall(BoostMeter.RequestedFontCSSURL);
        appOption.PreloadResource.TexturePath.addall(BoostMeter.RequestedTexturePath);
        appOption.MeteSelectDialogOption.ParameterCodeListToSelect = ["Engine_Speed", "Manifold_Absolute_Pressure", "Coolant_Temperature", "Engine_oil_temperature", "Battery_Voltage", "Oil_Pressure"];
        appOption.MeteSelectDialogOption.InitialiMeterSelectDialogSetting = [{meterID : "Left", code : "Engine_Speed"}, {meterID : "Center", code : "Manifold_Absolute_Pressure"}, {meterID : "Right", code : "Coolant_Temperature"}];

        const webstoragehandler = new WebstorageHandler();
        const meterSetting = (webstoragehandler.MeterSelectDialogSetting === undefined)?appOption.MeteSelectDialogOption.InitialiMeterSelectDialogSetting:webstoragehandler.MeterSelectDialogSetting;
        const leftMeterSet = meterSetting.find(v => v.meterID === "Left");
        const centerMeterSet = meterSetting.find(v => v.meterID === "Center");
        const rightMeterSet = meterSetting.find(v => v.meterID === "Right");
        
        if(leftMeterSet === undefined || centerMeterSet === undefined || rightMeterSet === undefined)
            throw new Error("Meter code reading is failed.");

        const meter0 = this.AnalogSingleMeterFactory.getMeter(leftMeterSet.code);
        const meter1 = this.AnalogSingleMeterFactory.getMeter(centerMeterSet.code);
        const meter2 = this.AnalogSingleMeterFactory.getMeter(rightMeterSet.code);

        appOption.SetupPIXIMeterPanel = (app, ws) => {
            const stage = app.stage;
            //Centering the top-level container
            stage.pivot.set(600, 200);
            stage.position.set(app.screen.width / 2, app.screen.height / 2);

            const parts0 = meter0.partsConstructor();
            const parts1 = meter1.partsConstructor();
            const parts2 = meter2.partsConstructor();
            parts0.position.set(0, 0);
            parts1.position.set(400, 0);
            parts2.position.set(800, 0);
            stage.addChild(parts0);
            stage.addChild(parts1);
            stage.addChild(parts2);

            app.ticker.add(() => {
                const timestamp = app.ticker.lastTime;

                parts0.Value = meter0.getValFunc(timestamp, ws);
                parts1.Value = meter1.getValFunc(timestamp, ws);
                parts2.Value = meter2.getValFunc(timestamp, ws);
            });
        };

        const app = new MeterApplication(appOption);
        app.WebSocketCollection.WSMapper.registerParameterCode(meter0.code, meter0.readmode);
        app.WebSocketCollection.WSMapper.registerParameterCode(meter1.code, meter1.readmode);
        app.WebSocketCollection.WSMapper.registerParameterCode(meter2.code, meter2.readmode);
        app.Run();
    }
}
