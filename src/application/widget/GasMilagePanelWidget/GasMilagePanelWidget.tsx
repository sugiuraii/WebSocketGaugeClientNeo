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
require("./GasMilagePanelWidget.html");
import * as PIXI from 'pixi.js';

//Import application base class
import { MeterWidgetApplication } from "meter-application-common"
import { MeterApplicationOption } from "meter-application-common"

//Import meter parts
import { MilageGraphPanel } from "@websocketgaugeclientneo/meterparts-mfdpanel";

// Import AppSettings.
import * as DefaultAppSettings from "application/DefaultAppSettings"

window.onload = function () {
    const meterapp = new GasMilagePanelWidgetApp();
    meterapp.Start();
}

class GasMilagePanelWidgetApp {

    public async Start() {
        const pixiAppOption: Partial<PIXI.IApplicationOptions> = { width: 600, height: 300 };

        const appOption = new MeterApplicationOption(pixiAppOption, await DefaultAppSettings.getWebsocketCollectionOption());
        
        appOption.SetupPIXIMeterPanel = async (app, ws) => {
            const stage = app.stage;

            const milagePanel = await MilageGraphPanel.create();
            milagePanel.position.set(0, 0);
            milagePanel.scale.set(0.94, 0.94);

            stage.addChild(milagePanel);

            app.ticker.add(() => {
                const timestamp = app.ticker.lastTime;

                const momentGasMilage = ws.FUELTRIPWS.getMomentGasMilage(timestamp);
                const gasMilage5min: number = ws.FUELTRIPWS.getSectGasMilage(0);
                const gasMilage10min: number = ws.FUELTRIPWS.getSectGasMilage(1);
                const gasMilage15min: number = ws.FUELTRIPWS.getSectGasMilage(2);
                const gasMilage20min: number = ws.FUELTRIPWS.getSectGasMilage(3);
                const gasMilage25min: number = ws.FUELTRIPWS.getSectGasMilage(4);
                const gasMilage30min: number = ws.FUELTRIPWS.getSectGasMilage(5);
                const totalGasMilage = ws.FUELTRIPWS.getTotalGasMilage();
                const totalFuel = ws.FUELTRIPWS.getTotalGas();
                const totalTrip = ws.FUELTRIPWS.getTotalTrip();

                milagePanel.MomentGasMilage = momentGasMilage;
                milagePanel.Trip = totalTrip;
                milagePanel.Fuel = totalFuel;
                milagePanel.GasMilage = totalGasMilage;
                milagePanel.setSectGasMllage("5min", gasMilage5min);
                milagePanel.setSectGasMllage("10min", gasMilage10min);
                milagePanel.setSectGasMllage("15min", gasMilage15min);
                milagePanel.setSectGasMllage("20min", gasMilage20min);
                milagePanel.setSectGasMllage("25min", gasMilage25min);
                milagePanel.setSectGasMllage("30min", gasMilage30min);
            });           
        };

        const app = new MeterWidgetApplication(appOption);
        app.Run();
    }
}
