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
import { MeterApplication } from "lib/MeterAppBase/MeterApplication";
import { MeterApplicationOption } from "lib/MeterAppBase/options/MeterApplicationOption";

//Import meter parts
import { DigiTachoPanel } from "parts/DigiTachoPanel/DigiTachoPanel";
import { FullCircularGaugePanelPresets } from "parts/CircularGauges/FullCircularGaugePanelPresets";
import { SemiCircularGaugePanelPresets } from "parts/CircularGauges/SemiCircularGaugePanelPresets";
import { MilageGraphPanel } from "parts/GasMilageGraph/MilageGraph";

// Import AppSettings.
import * as DefaultAppSettings from  "application/DefaultAppSettings"

//For including entry point html file in webpack
require("./DigitalMFD.html");

window.onload = function () {
    const meterapp = new DigitalMFDApp();
    meterapp.Start();
}

class DigitalMFDApp {
    public async  Start() {
        const pixiAppOption : PIXI.IApplicationOptions = {width : 1200, height : 600};
        const appOption = new MeterApplicationOption(pixiAppOption, await DefaultAppSettings.getWebsocketCollectionOption());

        const gearCalculator = await DefaultAppSettings.getGearPositionCalculator();

        appOption.SetupPIXIMeterPanel = async (app, ws) => {

            const stage = app.stage;

            const digiTachoPanel = await DigiTachoPanel.create();
            digiTachoPanel.position.set(0, 0);

            const milagePanel = await MilageGraphPanel.create();
            milagePanel.position.set(0, 300);
            milagePanel.scale.set(0.94, 0.94);

            const boostPanel = await FullCircularGaugePanelPresets.BoostGaugePanel();
            boostPanel.position.set(600, 0);
            boostPanel.scale.set(0.751, 0.751);

            const airFuelPanel = await FullCircularGaugePanelPresets.AirFuelGaugePanel();
            airFuelPanel.position.set(600, 310);
            airFuelPanel.scale.set(0.751, 0.751);

            const waterTempPanel = await SemiCircularGaugePanelPresets.WaterTempGaugePanel();
            waterTempPanel.position.set(900, 0);
            waterTempPanel.scale.set(0.68);

            const voltagePanel = await SemiCircularGaugePanelPresets.BatteryVoltageGaugePanel();
            voltagePanel.position.set(900, 200);
            voltagePanel.scale.set(0.68);

            const throttlePanel = await SemiCircularGaugePanelPresets.ThrottleGaugePanel();
            throttlePanel.position.set(900, 400);
            throttlePanel.scale.set(0.68);

            stage.addChild(digiTachoPanel);
            stage.addChild(milagePanel);
            stage.addChild(boostPanel);
            stage.addChild(airFuelPanel);
            stage.addChild(waterTempPanel);
            stage.addChild(voltagePanel);
            stage.addChild(throttlePanel);

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

                const boost = ws.WSMapper.getValue("Manifold_Absolute_Pressure", timestamp) * 0.0101972 - 1 //convert kPa to kgf/cm2 and relative pressure;
                const airFuelRatio = ws.WSMapper.getValue("O2Sensor_1_Air_Fuel_Ratio", timestamp) * 14;
                const waterTemp = ws.WSMapper.getValue("Coolant_Temperature");
                const batteryVolt = ws.WSMapper.getValue("Battery_Voltage");
                const throttle = ws.WSMapper.getValue("Throttle_Opening_Angle", timestamp);

                digiTachoPanel.Speed = speed;
                digiTachoPanel.Tacho = tacho;
                digiTachoPanel.GearPos = (gearPos === undefined)?"-":gearPos.toString();

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

                boostPanel.Value = boost;
                airFuelPanel.Value = airFuelRatio;
                waterTempPanel.Value = waterTemp;
                voltagePanel.Value = batteryVolt;
                throttlePanel.Value = throttle;
            });
            
            ws.WSMapper.registerParameterCode("Engine_Speed", "SLOWandFAST");
            ws.WSMapper.registerParameterCode("Manifold_Absolute_Pressure", "SLOWandFAST");
            ws.WSMapper.registerParameterCode("Vehicle_Speed", "SLOWandFAST");
            ws.WSMapper.registerParameterCode("Coolant_Temperature", "SLOW");
            ws.WSMapper.registerParameterCode("Battery_Voltage", "SLOW");
            ws.WSMapper.registerParameterCode("Throttle_Opening_Angle", "SLOWandFAST");
            ws.WSMapper.registerParameterCode("O2Sensor_1_Air_Fuel_Ratio", "SLOWandFAST");
        };
        const app = new MeterApplication(appOption);
        app.Run();
    }
}