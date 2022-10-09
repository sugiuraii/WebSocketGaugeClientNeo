/* 
 * The MIT License
 *
 * Copyright 2021 sz2s.
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

import { WebsocketObjectCollection } from "lib/MeterAppBase/WebsocketObjCollection/WebsocketObjectCollection";
import { WebsocketParameterCode } from "lib/MeterAppBase/WebsocketObjCollection/WebsocketParameterCode";
import { ReadModeCode } from "websocket-gauge-client-communication";
import { FullCircularGaugePanel } from "parts/CircularGauges/FullCircularGaugePanel";
import { FullCircularGaugePanelPresets } from "parts/CircularGauges/FullCircularGaugePanelPresets";
import { MeterNotAvailableError } from "./MeterNotAvailableError";

export class FullCircularGaugePanelFactory {
    private readonly UseVacuumMeterInsteadOfBoost;
    constructor(UseVacuumMeterInsteadOfBoost?: boolean) {
        if (UseVacuumMeterInsteadOfBoost === true)
            this.UseVacuumMeterInsteadOfBoost = true;
        else
            this.UseVacuumMeterInsteadOfBoost = false;
    }

    public getMeter(code: WebsocketParameterCode | undefined): { code: WebsocketParameterCode, createDisplayObject: () => Promise<FullCircularGaugePanel>, readmode: ReadModeCode, getValue: (timestamp: number, ws: WebsocketObjectCollection) => number } {
        switch (code) {
            case "Manifold_Absolute_Pressure":
                return { code: code, createDisplayObject: async() => this.UseVacuumMeterInsteadOfBoost ? FullCircularGaugePanelPresets.VacuumGaugePanel() : FullCircularGaugePanelPresets.BoostGaugePanel(), readmode: "SLOWandFAST", getValue: (ts, ws) => ws.WSMapper.getValue(code, ts) * 0.0101972 - 1 /* convert kPa to kgf/cm2 and relative pressure */ };
            case "Coolant_Temperature":
                return { code: code, createDisplayObject: async() => FullCircularGaugePanelPresets.WaterTempGaugePanel(), readmode: "SLOW", getValue: (_, ws) => ws.WSMapper.getValue(code) };
            case "Engine_oil_temperature":
                return { code: code, createDisplayObject: async() => FullCircularGaugePanelPresets.EngineOilTempGaugePanel(), readmode: "SLOW", getValue: (_, ws) => ws.WSMapper.getValue(code) };
            case "Battery_Voltage":
                return { code: code, createDisplayObject: async() => FullCircularGaugePanelPresets.BatteryVoltageGaugePanel(), readmode: "SLOW", getValue: (_, ws) => ws.WSMapper.getValue(code) };
            case "Mass_Air_Flow":
                return { code: code, createDisplayObject: async() => FullCircularGaugePanelPresets.MassAirFlowGaugePanel(), readmode: "SLOWandFAST", getValue: (ts, ws) => ws.WSMapper.getValue(code, ts) / 10 };
            case "O2Sensor_1_Air_Fuel_Ratio":
                return { code: code, createDisplayObject: async() => FullCircularGaugePanelPresets.AirFuelGaugePanel(), readmode: "SLOWandFAST", getValue: (ts, ws) => ws.WSMapper.getValue(code, ts) * 14 };
            case "Engine_Load":
                return { code: code, createDisplayObject: async() => FullCircularGaugePanelPresets.EngineLoadGaugePanel(), readmode: "SLOWandFAST", getValue: (ts, ws) => ws.WSMapper.getValue(code, ts) };
            case "Intake_Air_Temperature":
                return { code: code, createDisplayObject: async() => FullCircularGaugePanelPresets.IntakeAirTemperatureGaugePanel(), readmode: "SLOW", getValue: (_, ws) => ws.WSMapper.getValue(code) };
            case undefined:
                throw new Error("getMeter() is failed by undefined code.");
            default:
                throw new MeterNotAvailableError("FullCircular gauge is not defined on the parameter code of " + code);
        }
    }
}