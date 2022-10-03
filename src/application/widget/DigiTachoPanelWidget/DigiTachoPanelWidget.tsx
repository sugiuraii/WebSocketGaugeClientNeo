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
require("./DigiTachoPanelWidget.html");
import * as PIXI from 'pixi.js';

//Import application base class
import { MeterWidgetApplication } from "lib/MeterAppBase/MeterWidgetApplication";
import { MeterApplicationOption } from "lib/MeterAppBase/options/MeterApplicationOption";

//Import meter parts
import { DigiTachoPanel } from "parts/DigiTachoPanel/DigiTachoPanel";

// Import AppSettings.
import * as DefaultAppSettings from "application/DefaultAppSettings"

window.onload = function () {
    const meterapp = new DigiTachoPanelWidgetApp();
    meterapp.Start();
}

class DigiTachoPanelWidgetApp {

    public async Start() {
        const pixiAppOption: PIXI.IApplicationOptions = { width: 600, height: 300 };

        const appOption = new MeterApplicationOption(pixiAppOption, await DefaultAppSettings.getWebsocketCollectionOption());

        const gearCalculator = await DefaultAppSettings.getGearPositionCalculator();
        
        appOption.SetupPIXIMeterPanel = async (app, ws) => {
            const stage = app.stage;
            //Centering the top-level container
            stage.pivot.set(0, 0);
            stage.position.set(0, 0);
    
            const meter = await DigiTachoPanel.create();
            meter.position.set(0, 0);
            stage.addChild(meter);
            
            app.ticker.add(() => {
                const timestamp = app.ticker.lastTime;
                const tacho = ws.WSMapper.getValue("Engine_Speed", timestamp);
                const speed = ws.WSMapper.getValue("Vehicle_Speed", timestamp);
                const gearPos = gearCalculator.getGearPosition(tacho, speed);

                meter.Tacho = tacho;
                meter.Speed = speed;
                meter.GearPos = (gearPos === undefined)?"-":gearPos.toString();
            });

            ws.WSMapper.registerParameterCode("Engine_Speed", "SLOWandFAST");
            ws.WSMapper.registerParameterCode("Vehicle_Speed", "SLOWandFAST");
        };

        const app = new MeterWidgetApplication(appOption);
        app.Run();
    }
}
