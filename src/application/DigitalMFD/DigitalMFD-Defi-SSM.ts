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

//Import application base class
import { MeterApplication } from "../../lib/MeterAppBase/MeterApplication";
import { MeterApplicationOption } from "../../lib/MeterAppBase/options/MeterApplicationOption";

//Import meter parts
import { BoostGaugePanel } from "../../parts/CircularGauges/FullCircularGaugePanel";
import { AirFuelGaugePanel } from "../../parts/CircularGauges/FullCircularGaugePanel";
import { WaterTempGaugePanel } from "../../parts/CircularGauges/SemiCircularGaugePanel";
import { BatteryVoltageGaugePanel } from "../../parts/CircularGauges/SemiCircularGaugePanel";
import { ThrottleGaugePanel } from "../../parts/CircularGauges/SemiCircularGaugePanel";
import { DigiTachoPanel } from "../../parts/DigiTachoPanel/DigiTachoPanel";
import { MilageGraphPanel } from "../../parts/GasMilageGraph/MilageGraph";

//Import enumuator of parameter code
import { DefiParameterCode } from "../../lib/WebSocket/WebSocketCommunication";
import { SSMParameterCode } from "../../lib/WebSocket/WebSocketCommunication";
import { SSMSwitchCode } from "../../lib/WebSocket/WebSocketCommunication";
import { ReadModeCode } from "../../lib/WebSocket/WebSocketCommunication";

import { calculateGearPosition } from "../../lib/MeterAppBase/utils/CalculateGearPosition";
import { SSMSwitchCodeToParameterCode } from "../../lib/WebSocket/private/parameterCode/SSMSwitchCode";

//For including entry point html file in webpack
require("./DigitalMFD-Defi-SSM.html");

window.onload = function () {
    const meterapp = new DigitalMFD_Defi_SSM();
    meterapp.Start();
}

class DigitalMFD_Defi_SSM {
    public Start() {
        const appOption = new MeterApplicationOption();
        appOption.width = 1200;
        appOption.height = 600;
        appOption.PreloadResource.WebFontFamiliyName.addall(BoostGaugePanel.RequestedFontFamily);
        appOption.PreloadResource.WebFontFamiliyName.addall(WaterTempGaugePanel.RequestedFontFamily);
        appOption.PreloadResource.WebFontFamiliyName.addall(DigiTachoPanel.RequestedFontFamily);
        appOption.PreloadResource.WebFontFamiliyName.addall(MilageGraphPanel.RequestedFontFamily);
        appOption.PreloadResource.WebFontCSSURL.addall(BoostGaugePanel.RequestedFontCSSURL);
        appOption.PreloadResource.WebFontCSSURL.addall(WaterTempGaugePanel.RequestedFontCSSURL);
        appOption.PreloadResource.WebFontCSSURL.addall(DigiTachoPanel.RequestedFontCSSURL);
        appOption.PreloadResource.WebFontCSSURL.addall(MilageGraphPanel.RequestedFontCSSURL);
        appOption.PreloadResource.TexturePath.addall(BoostGaugePanel.RequestedTexturePath);
        appOption.PreloadResource.TexturePath.addall(WaterTempGaugePanel.RequestedTexturePath);
        appOption.PreloadResource.TexturePath.addall(DigiTachoPanel.RequestedTexturePath);
        appOption.PreloadResource.TexturePath.addall(MilageGraphPanel.RequestedTexturePath);

        appOption.WebsocketEnableFlag.Defi = true;
        appOption.WebsocketEnableFlag.SSM = true;
        appOption.WebsocketEnableFlag.FUELTRIP = true;
        appOption.FUELTRIPWebsocketOption.FUELTRIPSectSpan = 300;
        appOption.FUELTRIPWebsocketOption.FUELTRIPSectStoreMax = 6;

        appOption.ParameterCode.Defi.addall(DefiParameterCode.Engine_Speed);
        appOption.ParameterCode.Defi.addall(DefiParameterCode.Manifold_Absolute_Pressure);
        appOption.ParameterCode.SSM.addall({ code: SSMParameterCode.Vehicle_Speed, readmode: ReadModeCode.SLOWandFAST });
        appOption.ParameterCode.SSM.addall({ code: SSMParameterCode.Coolant_Temperature, readmode: ReadModeCode.SLOW });
        appOption.ParameterCode.SSM.addall({ code: SSMParameterCode.Battery_Voltage, readmode: ReadModeCode.SLOW });
        appOption.ParameterCode.SSM.addall({ code: SSMParameterCode.Throttle_Opening_Angle, readmode: ReadModeCode.SLOWandFAST });
        appOption.ParameterCode.SSM.addall({ code: SSMParameterCode.Air_Fuel_Sensor_1, readmode: ReadModeCode.SLOWandFAST });
        appOption.ParameterCode.SSM.addall({ code: SSMSwitchCodeToParameterCode(SSMSwitchCode.Neutral_Position_Switch), readmode: ReadModeCode.SLOWandFAST });

        appOption.SetupPIXIMeterPanel = (app, ws) => {

            const stage = app.stage;

            const digiTachoPanel = new DigiTachoPanel();
            digiTachoPanel.position.set(0, 0);

            const milagePanel = new MilageGraphPanel();
            milagePanel.position.set(0, 300);
            milagePanel.scale.set(0.94, 0.94);

            const boostPanel = new BoostGaugePanel();
            boostPanel.position.set(600, 0);
            boostPanel.scale.set(0.751, 0.751);

            const airFuelPanel = new AirFuelGaugePanel();
            airFuelPanel.position.set(600, 310);
            airFuelPanel.scale.set(0.751, 0.751);

            const waterTempPanel = new WaterTempGaugePanel();
            waterTempPanel.position.set(900, 0);
            waterTempPanel.scale.set(0.68);

            const voltagePanel = new BatteryVoltageGaugePanel();
            voltagePanel.position.set(900, 200);
            voltagePanel.scale.set(0.68);

            const throttlePanel = new ThrottleGaugePanel();
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
                const tacho = ws.DefiWS.getVal(DefiParameterCode.Engine_Speed, timestamp);
                const speed = ws.SSMWS.getVal(SSMParameterCode.Vehicle_Speed, timestamp);
                const neutralSw = ws.SSMWS.getSwitchFlag(SSMSwitchCode.Neutral_Position_Switch);
                const gearPos = calculateGearPosition(tacho, speed, neutralSw);

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

                const boost = ws.DefiWS.getVal(DefiParameterCode.Manifold_Absolute_Pressure, timestamp) * 0.0101972 - 1 //convert kPa to kgf/cm2 and relative pressure;
                const airFuelRatio = ws.SSMWS.getVal(SSMParameterCode.Air_Fuel_Sensor_1, timestamp) * 14;
                const waterTemp = ws.SSMWS.getRawVal(SSMParameterCode.Coolant_Temperature);
                const batteryVolt = ws.SSMWS.getRawVal(SSMParameterCode.Battery_Voltage);
                const throttle = ws.SSMWS.getVal(SSMParameterCode.Throttle_Opening_Angle, timestamp);

                digiTachoPanel.Speed = speed;
                digiTachoPanel.Tacho = tacho;
                digiTachoPanel.GearPos = gearPos;

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
        };
        const app = new MeterApplication(appOption);
        app.Run();
    }
}
