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

import * as PIXI from 'pixi.js';

//Import application base class
import { MeterApplication } from "meter-application-common"
import { MeterApplicationOption } from "meter-application-common"

//Import meter parts
import { AnalogMeterCluster } from "@websocketgaugeclientneo/meterparts-analogmetercluster";


//Import enumuator of parameter code
import { AssettoCorsaSHMPhysicsParameterCode, AssettoCorsaSHMNumericalVALCode } from "websocket-gauge-client-communication";

//For including entry point html file in webpack
require("./AnalogMeterCluster-AssettoCorsaSHM.html");

window.onload = function () {
    const meterapp = new AnalogMeterCluster_AssettoCorsaSHM();
    meterapp.Start();
}

class AnalogMeterCluster_AssettoCorsaSHM {
    public Start() {
        const pixiAppOption: Partial<PIXI.IApplicationOptions> = { width: 1100, height: 600 };
        const appOption = new MeterApplicationOption(pixiAppOption);

        appOption.WebSocketCollectionOption.AssettoCorsaWSEnabled = true;

        appOption.SetupPIXIMeterPanel = async (app, ws) => {
            const stage = app.stage;
            const meterCluster = await AnalogMeterCluster.create();
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

            ws.AssettoCorsaWS.PhysicsParameterCodeList.push(AssettoCorsaSHMPhysicsParameterCode.Rpms);
            ws.AssettoCorsaWS.PhysicsParameterCodeList.push(AssettoCorsaSHMPhysicsParameterCode.SpeedKmh);
            ws.AssettoCorsaWS.PhysicsParameterCodeList.push(AssettoCorsaSHMPhysicsParameterCode.ManifoldPressure);
            ws.AssettoCorsaWS.PhysicsParameterCodeList.push(AssettoCorsaSHMPhysicsParameterCode.Gear);
        };

        const app = new MeterApplication(appOption);
        app.Run();
    }
}
