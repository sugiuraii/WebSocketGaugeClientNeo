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
require("./LEDRevMeterWidget.html");
import * as PIXI from 'pixi.js';

//Import application base class
import { MeterWidgetApplication } from "meter-application-common"
import { MeterApplicationOption } from "meter-application-common"

//Import meter parts
import { LEDTachoMeter } from "parts/LEDTachoMeter/LEDTachoMeter";

// Import AppSettings.
import * as DefaultAppSettings from  "application/DefaultAppSettings"

window.onload = function () {
    const meterapp = new LEDRevMeterWidgetApp();
    meterapp.Start();
}

class LEDRevMeterWidgetApp {
    public async Start() {
        const pixiAppOption : Partial<PIXI.IApplicationOptions> = {width : 610, height : 600};
        const appOption = new MeterApplicationOption(pixiAppOption, await DefaultAppSettings.getWebsocketCollectionOption());

        const gearCalculator = await DefaultAppSettings.getGearPositionCalculator();
        
        appOption.SetupPIXIMeterPanel = async(app, ws) => {

            const stage = app.stage;

            const ledRevMeter = await LEDTachoMeter.create();
            ledRevMeter.position.set(0, 0);

            stage.addChild(ledRevMeter);

            app.ticker.add(() => {
                const timestamp = app.ticker.lastTime;
                const rev = ws.WSMapper.getValue("Engine_Speed", timestamp);
                const speed = ws.WSMapper.getValue("Vehicle_Speed");
                const totalFuel = ws.FUELTRIPWS.getTotalGas();
                const totalTrip = ws.FUELTRIPWS.getTotalTrip();
                const totalFuelRate = ws.FUELTRIPWS.getTotalGasMilage();

                const gearPos = gearCalculator.getGearPosition(rev, speed);

                ledRevMeter.Tacho = rev;
                ledRevMeter.Speed = speed;
                ledRevMeter.GearPos = (gearPos === undefined)?"-":gearPos.toString();
                ledRevMeter.Trip = totalTrip;
                ledRevMeter.Fuel = totalFuel;
                ledRevMeter.GasMilage = totalFuelRate;
            });

            ws.WSMapper.registerParameterCode("Engine_Speed", "SLOWandFAST");
            ws.WSMapper.registerParameterCode("Vehicle_Speed", "SLOWandFAST");
        };
        const app = new MeterWidgetApplication(appOption);
        app.Run();
    }
}
