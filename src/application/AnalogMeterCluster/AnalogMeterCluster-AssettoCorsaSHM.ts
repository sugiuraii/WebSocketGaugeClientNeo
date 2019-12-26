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

// This is required to webpack font/texture/html files 
/// <reference path="../../lib/webpackRequire.ts" />

import * as PIXI from "pixi.js";

//Import application base class
import { MeterApplication } from "../../lib/MeterAppBase/MeterApplication";
import { MeterApplicationOption } from "../../lib/MeterAppBase/options/MeterApplicationOption";

//Import meter parts
import { AnalogMeterCluster } from "../../parts/AnalogMeterCluster/AnalogMeterCluster";


//Import enumuator of parameter code
import { AssettoCorsaSHMPhysicsParameterCode, AssettoCorsaSHMNumericalVALCode } from "../../lib/WebSocket/WebSocketCommunication";

//For including entry point html file in webpack
require("./AnalogMeterCluster-AssettoCorsaSHM.html");

window.onload = function () {
    const meterapp = new AnalogMeterCluster_AssettoCorsaSHM();
    meterapp.Start();
}

class AnalogMeterCluster_AssettoCorsaSHM {
    public Start() {
        const appOption = new MeterApplicationOption();
        appOption.width = 1100;
        appOption.height = 600;
        appOption.PreloadResource.WebFontFamiliyName.addall(AnalogMeterCluster.RequestedFontFamily);
        appOption.PreloadResource.WebFontCSSURL.addall(AnalogMeterCluster.RequestedFontCSSURL);
        appOption.PreloadResource.TexturePath.addall(AnalogMeterCluster.RequestedTexturePath);

        appOption.WebsocketEnableFlag.AssettoCorsaSHM = true;
        appOption.ParameterCode.AssettoCorsaPhysics.addall(AssettoCorsaSHMPhysicsParameterCode.Rpms);
        appOption.ParameterCode.AssettoCorsaPhysics.addall(AssettoCorsaSHMPhysicsParameterCode.SpeedKmh);
        appOption.ParameterCode.AssettoCorsaPhysics.addall(AssettoCorsaSHMPhysicsParameterCode.ManifoldPressure);
        appOption.ParameterCode.AssettoCorsaPhysics.addall(AssettoCorsaSHMPhysicsParameterCode.Gear);

        appOption.SetupPIXIMeterPanel = (app, ws) => {
            const stage = app.stage;
            const meterCluster = new AnalogMeterCluster();
            stage.addChild(meterCluster);

            app.ticker.add(() => {
                const timestamp = app.ticker.lastTime;
                const tacho = ws.AssettoCorsaWS.getVal(AssettoCorsaSHMNumericalVALCode.Rpms, timestamp);
                const boost = ws.AssettoCorsaWS.getVal(AssettoCorsaSHMNumericalVALCode.ManifoldPressure, timestamp) * 1.01972 //convert kPa to kgf/cm2 and relative pressure;
                const speed = ws.AssettoCorsaWS.getVal(AssettoCorsaSHMNumericalVALCode.SpeedKmh, timestamp);
                const waterTemp = 95;
                const trip = 100;
                const fuel = 20;
                const gasMilage = 10;

                const gearPos = ws.AssettoCorsaWS.getRawVal(AssettoCorsaSHMNumericalVALCode.Gear);

                meterCluster.Tacho = tacho;
                meterCluster.Boost = boost;
                meterCluster.Speed = speed;
                meterCluster.WaterTemp = waterTemp;

                if (gearPos === 0)
                    meterCluster.GearPos = "R";
                else if (gearPos === 1)
                    meterCluster.GearPos = "N";
                else
                    meterCluster.GearPos = (gearPos - 1).toString();

                meterCluster.Trip = trip;
                meterCluster.Fuel = fuel;
                meterCluster.GasMilage = gasMilage;
            });
        }
        const app = new MeterApplication(appOption);
        app.Run();
    }
}
