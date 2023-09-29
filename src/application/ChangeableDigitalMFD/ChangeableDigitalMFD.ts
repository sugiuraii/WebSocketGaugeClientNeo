/* 
 * The MIT License
 *
 * Copyright 2017 sz2.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of ws software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and ws permission notice shall be included in
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
import { DigiTachoPanel } from "@websocketgaugeclientneo/meterparts-mfdpanel";
import { MilageGraphPanel } from "@websocketgaugeclientneo/meterparts-mfdpanel";

// Import AppSettings.
import * as DefaultAppSettings from "application/DefaultAppSettings"
import { FullCircularGaugePanelFactory } from 'parts/partsFactory/FullCircularGaugePanelFactory';
import { MeterNotAvailableError } from 'parts/partsFactory/MeterNotAvailableError';
import { SemiCircularGaugePanelFactory } from 'parts/partsFactory/SemiCircularGaugePanelFactory';

//For including entry point html file in webpack
require("./ChangeableDigitalMFD.html");

const useVacuumInsteadOfBoost = false;

window.onload = function () {
    const meterapp = new ChangeableDigitalMFDApp();
    meterapp.Start();
}

class ChangeableDigitalMFDApp {
    public async Start() {
        const pixiAppOption: Partial<PIXI.IApplicationOptions> = { width: 1200, height: 600 };
        const appOption = new MeterApplicationOption(pixiAppOption, await DefaultAppSettings.getWebsocketCollectionOption());

        appOption.MeteSelectDialogOption.ParameterCodeListToSelect = ["Engine_Load", "Manifold_Absolute_Pressure", "Coolant_Temperature", "Engine_oil_temperature", "Battery_Voltage", "Mass_Air_Flow", "Throttle_Opening_Angle", "O2Sensor_1_Air_Fuel_Ratio", "Intake_Air_Temperature"];
        appOption.MeteSelectDialogOption.DefaultMeterSelectDialogSetting = { ["LargeTop"]: "Manifold_Absolute_Pressure", ["LargeBottom"]: "O2Sensor_1_Air_Fuel_Ratio", ["SmallTop"]: "Coolant_Temperature", ["SmallMiddle"]: "Battery_Voltage", ["SmallBottom"]: "Throttle_Opening_Angle" };

        const gearCalculator = await DefaultAppSettings.getGearPositionCalculator();

        appOption.SetupPIXIMeterPanel = async (app, ws, meterSetting) => {

            const stage = app.stage;

            const digiTachoPanel = await DigiTachoPanel.create();
            digiTachoPanel.position.set(0, 0);

            const milagePanel = await MilageGraphPanel.create();
            milagePanel.position.set(0, 300);
            milagePanel.scale.set(0.94, 0.94);
            const largeTopMeterCode = meterSetting["LargeTop"];
            const largeBottomMeterCode = meterSetting["LargeBottom"];
            const smallTopMeterCode = meterSetting["SmallTop"];
            const smallMidMeterCode = meterSetting["SmallMiddle"];
            const smallBottomMeterCode = meterSetting["SmallBottom"];

            const largeMeterPanelFactory = new FullCircularGaugePanelFactory(useVacuumInsteadOfBoost);
            const smallMeterPanelFactory = new SemiCircularGaugePanelFactory(useVacuumInsteadOfBoost);
            try {
                const largeTopPanel = largeMeterPanelFactory.getMeter(largeTopMeterCode);
                const largeBottomPanel = largeMeterPanelFactory.getMeter(largeBottomMeterCode);
                const smallTopPanel = smallMeterPanelFactory.getMeter(smallTopMeterCode);
                const smallMidPanel = smallMeterPanelFactory.getMeter(smallMidMeterCode);
                const smallBottomPanel = smallMeterPanelFactory.getMeter(smallBottomMeterCode);

                const largeTopPanelDisplayObj = await largeTopPanel.createDisplayObject();
                const largeBottomPanelDisplayObj = await largeBottomPanel.createDisplayObject();
                const smallTopPanelDisplayObj = await smallTopPanel.createDisplayObject();
                const smallMidPanelDisplayObj = await smallMidPanel.createDisplayObject();
                const smallBottomPanelDisplayObj = await smallBottomPanel.createDisplayObject();

                largeTopPanelDisplayObj.position.set(600, 0);
                largeTopPanelDisplayObj.scale.set(0.751, 0.751);

                largeBottomPanelDisplayObj.position.set(600, 310);
                largeBottomPanelDisplayObj.scale.set(0.751, 0.751);

                smallTopPanelDisplayObj.position.set(900, 0);
                smallTopPanelDisplayObj.scale.set(0.68);

                smallMidPanelDisplayObj.position.set(900, 200);
                smallMidPanelDisplayObj.scale.set(0.68);

                smallBottomPanelDisplayObj.position.set(900, 400);
                smallBottomPanelDisplayObj.scale.set(0.68);

                stage.addChild(digiTachoPanel);
                stage.addChild(milagePanel);
                stage.addChild(largeTopPanelDisplayObj);
                stage.addChild(largeBottomPanelDisplayObj);
                stage.addChild(smallTopPanelDisplayObj);
                stage.addChild(smallMidPanelDisplayObj);
                stage.addChild(smallBottomPanelDisplayObj);

                app.ticker.add(() => {
                    const timestamp = app.ticker.lastTime;
                    const tacho = ws.WSMapper.getValue("Engine_Speed", timestamp);
                    const speed = ws.WSMapper.getValue("Vehicle_Speed", timestamp);
                    const gearPos = gearCalculator.getGearPosition(tacho, speed);

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

                    digiTachoPanel.Speed = speed;
                    digiTachoPanel.Tacho = tacho;
                    digiTachoPanel.GearPos = (gearPos === undefined) ? "-" : gearPos.toString();

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

                    largeTopPanelDisplayObj.Value = largeTopPanel.getValue(timestamp, ws);
                    largeBottomPanelDisplayObj.Value = largeBottomPanel.getValue(timestamp, ws);
                    smallTopPanelDisplayObj.Value = smallTopPanel.getValue(timestamp, ws);
                    smallMidPanelDisplayObj.Value = smallMidPanel.getValue(timestamp, ws);
                    smallBottomPanelDisplayObj.Value = smallBottomPanel.getValue(timestamp, ws);
                });

                ws.WSMapper.registerParameterCode("Engine_Speed", "SLOWandFAST");
                ws.WSMapper.registerParameterCode("Vehicle_Speed", "SLOWandFAST");
                ws.WSMapper.registerParameterCode(largeTopPanel.code, largeTopPanel.readmode);
                ws.WSMapper.registerParameterCode(largeBottomPanel.code, largeBottomPanel.readmode);
                ws.WSMapper.registerParameterCode(smallTopPanel.code, smallTopPanel.readmode);
                ws.WSMapper.registerParameterCode(smallMidPanel.code, smallMidPanel.readmode);
                ws.WSMapper.registerParameterCode(smallBottomPanel.code, smallBottomPanel.readmode);
            }
            catch (e) {
                if (e instanceof MeterNotAvailableError)
                    window.alert(e.message);
                else
                    throw e;
            }
        };

        const app = new MeterApplication(appOption);
        app.Run();
    }
}