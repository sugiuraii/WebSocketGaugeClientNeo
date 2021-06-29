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
import { WebsocketObjectCollection } from '../../lib/MeterAppBase/WebsocketObjCollection/WebsocketObjectCollection';
import { WebsocketParameterCode } from '../../lib/MeterAppBase/WebsocketObjCollection/WebsocketParameterCode';
import { ReadModeCode } from '../../lib/WebSocket/WebSocketCommunication';

//Import meter parts
import { AnalogSingleMeter, BatteryVoltageMeter, BoostMeter, RevMeter, VacuumMeter, WaterTempMeter, OilTempMeter, OilPressureMeter } from "../../parts/AnalogSingleMeter/AnalogSingleMeter";

// Import AppSettings.
import * as DefaultAppSettings from  "../DefaultAppSettings"

window.onload = function () {
    const meterapp = new ChangeableAnalogTripleMeterApp();
    meterapp.Start();
}

class ChangeableAnalogTripleMeterApp {
    private readonly UseVacuumMeterInsteadOfBoost = false;
    private readonly ParameterCodeListToUse : WebsocketParameterCode[] = ["Engine_Speed", "Manifold_Absolute_Pressure", "Coolant_Temperature"];
    
    private getMeter(code : WebsocketParameterCode) : {meter : AnalogSingleMeter, readmode: ReadModeCode, getValFunc : (timestamp : number, ws : WebsocketObjectCollection) => number}
    {
        switch(code)
        {
            case "Engine_Speed":
                return {meter : new RevMeter(), readmode : "SLOWandFAST", getValFunc : (ts, ws) => ws.WSMapper.getValue(code, ts)};
            case "Manifold_Absolute_Pressure" : 
                return {meter : this.UseVacuumMeterInsteadOfBoost?new VacuumMeter(): new BoostMeter(), readmode : "SLOWandFAST", getValFunc :(ts, ws) => ws.WSMapper.getValue(code, ts)};
            case "Coolant_Temperature" :
                return {meter : new WaterTempMeter(), readmode : "SLOW", getValFunc : (ts, ws) => ws.WSMapper.getValue(code, ts)};
            case "Engine_oil_temperature" :
                return {meter : new OilTempMeter(), readmode : "SLOW", getValFunc : (ts, ws) => ws.WSMapper.getValue(code, ts)};
            case "Battery_Voltage" :
                return {meter : new BatteryVoltageMeter(), readmode : "SLOW", getValFunc : (ts, ws) => ws.WSMapper.getValue(code, ts)};
            case "Oil_Pressure" :
                return {meter : new OilPressureMeter(), readmode : "SLOWandFAST", getValFunc : (ts, ws) => ws.WSMapper.getValue(code, ts)};
            default :
                throw new Error("Analog single meter is not defined on selected code.");
        }
    }
    
    public async Start() {
        const pixiAppOption : PIXI.IApplicationOptions = {width : 1280, height : 720};

        const appOption = new MeterApplicationOption(pixiAppOption, await DefaultAppSettings.getWebsocketCollectionOption());
        appOption.PreloadResource.WebFontFamiliyName.addall(BoostMeter.RequestedFontFamily);
        appOption.PreloadResource.WebFontCSSURL.addall(BoostMeter.RequestedFontCSSURL);
        appOption.PreloadResource.TexturePath.addall(BoostMeter.RequestedTexturePath);

        appOption.SetupPIXIMeterPanel = (app, ws) => {
            const stage = app.stage;
            //Centering the top-level container
            stage.pivot.set(600, 200);
            stage.position.set(app.screen.width / 2, app.screen.height / 2);

            const meter1 = this.getMeter(this.ParameterCodeListToUse[0]);
            meter1.position.set(0, 0);

            const meter2 = this.getMeter(this.ParameterCodeListToUse[1]);
            meter2.position.set(400, 0);

            const meter3 = this.getMeter(this.ParameterCodeListToUse[3]);
            meter3.position.set(800, 0);

            stage.addChild(meter1);
            stage.addChild(meter2);
            stage.addChild(meter3);

            app.ticker.add(() => {
                const timestamp = app.ticker.lastTime;
                const boost = ws.WSMapper.getValue("Manifold_Absolute_Pressure", timestamp) * 0.0101972 - 1 //convert kPa to kgf/cm2 and relative pressure;

                const waterTemp = ws.WSMapper.getValue("Coolant_Temperature");
                const oilTemp = ws.WSMapper.getValue("Engine_oil_temperature");

                meter1.Value = boost;
                meter2.Value = waterTemp;
                meter3.Value = oilTemp;
            });
        };
        const app = new MeterApplication(appOption);
        app.WebSocketCollection.WSMapper.registerParameterCode("Manifold_Absolute_Pressure", "SLOWandFAST");
        app.WebSocketCollection.WSMapper.registerParameterCode("Coolant_Temperature", "SLOW");
        app.WebSocketCollection.WSMapper.registerParameterCode("Engine_oil_temperature", "SLOW");
        app.Run();
    }
}
