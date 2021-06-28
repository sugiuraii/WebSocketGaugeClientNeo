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

import * as PIXI from 'pixi.js';

//Import application base class
import { MeterApplication } from "../../lib/MeterAppBase/MeterApplication";
import { MeterApplicationOption } from "../../lib/MeterAppBase/options/MeterApplicationOption";

//Import meter parts
import { AnalogMeterCluster } from "../../parts/AnalogMeterCluster/AnalogMeterCluster";

// Import AppSettings.
import * as DefaultAppSettings from  "../DefaultAppSettings"

//For including entry point html file in webpack
require("./AnalogMeterCluster.html");

window.onload = function () {
    const meterapp = new AnalogMeterClusterApp();
    meterapp.Start();
}

class AnalogMeterClusterApp {
    public async Start() {
        const pixiAppOption : PIXI.IApplicationOptions = {width : 1100, height : 600};
        const appOption = new MeterApplicationOption(pixiAppOption, await DefaultAppSettings.getWebsocketCollectionOption());
        appOption.PreloadResource.WebFontFamiliyName.addall(AnalogMeterCluster.RequestedFontFamily);
        appOption.PreloadResource.WebFontCSSURL.addall(AnalogMeterCluster.RequestedFontCSSURL);
        appOption.PreloadResource.TexturePath.addall(AnalogMeterCluster.RequestedTexturePath);

        const gearCalculator = await DefaultAppSettings.getGearPositionCalculator();

        appOption.SetupPIXIMeterPanel = (app, ws) => {
            const stage = app.stage;
            const meterCluster = new AnalogMeterCluster();
            stage.addChild(meterCluster);

            app.ticker.add(() => {
                const timestamp = app.ticker.lastTime;
                const tacho = ws.WSMapper.getValue("Engine_Speed", timestamp);
                const boost = ws.WSMapper.getValue("Manifold_Absolute_Pressure", timestamp) * 0.0101972 - 1 //convert kPa to kgf/cm2 and relative pressure;
                const speed = ws.WSMapper.getValue("Vehicle_Speed", timestamp);
                const waterTemp = ws.WSMapper.getValue("Coolant_Temperature");
                const trip = ws.FUELTRIPWS.getTotalTrip();
                const fuel = ws.FUELTRIPWS.getTotalGas();
                const gasMilage = ws.FUELTRIPWS.getTotalGasMilage();

                const gearPos = gearCalculator.getGearPosition(tacho, speed);

                meterCluster.Tacho = tacho;
                meterCluster.Boost = boost;
                meterCluster.Speed = speed;
                meterCluster.WaterTemp = waterTemp;
                meterCluster.GearPos = (gearPos === undefined)?"-":gearPos.toString();
                meterCluster.Trip = trip;
                meterCluster.Fuel = fuel;
                meterCluster.GasMilage = gasMilage;
            });
        }

        const app = new MeterApplication(appOption);
        app.WebSocketCollection.WSMapper.registerParameterCode("Engine_Speed", "SLOWandFAST");
        app.WebSocketCollection.WSMapper.registerParameterCode("Manifold_Absolute_Pressure", "SLOWandFAST");
        app.WebSocketCollection.WSMapper.registerParameterCode("Vehicle_Speed", "SLOWandFAST");
        app.WebSocketCollection.WSMapper.registerParameterCode("Coolant_Temperature", "SLOW");
        
        app.Run();
    }
}
