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

import { WebsocketObjectCollection } from "../../lib/MeterAppBase/WebsocketObjCollection/WebsocketObjectCollection";
import { WebsocketParameterCode } from "../../lib/MeterAppBase/WebsocketObjCollection/WebsocketParameterCode";
import { ReadModeCode } from "../../lib/WebSocket/WebSocketCommunication";
import { SemiCircularGaugePanelBase } from "../../parts/CircularGauges/private/SemiCircularGaugePanelBase";
import { VacuumGaugePanel, BoostGaugePanel, WaterTempGaugePanel, EngineOilTempGaugePanel, BatteryVoltageGaugePanel, MassAirFlowGaugePanel, ThrottleGaugePanel, AirFuelGaugePanel } from "../../parts/CircularGauges/SemiCircularGaugePanel";

export class SemiCircularGaugePanelFactory {
    private readonly UseVacuumMeterInsteadOfBoost;
    constructor(UseVacuumMeterInsteadOfBoost?: boolean) {
        if (UseVacuumMeterInsteadOfBoost === true)
            this.UseVacuumMeterInsteadOfBoost = true;
        else
            this.UseVacuumMeterInsteadOfBoost = false;
    }

    public getMeter(code: WebsocketParameterCode | undefined): { code: WebsocketParameterCode, partsConstructor: () => SemiCircularGaugePanelBase, readmode: ReadModeCode, getValFunc: (timestamp: number, ws: WebsocketObjectCollection) => number } {
        switch (code) {
            case "Manifold_Absolute_Pressure":
                return { code: code, partsConstructor: () => this.UseVacuumMeterInsteadOfBoost ? new VacuumGaugePanel() : new BoostGaugePanel(), readmode: "SLOWandFAST", getValFunc: (ts, ws) => ws.WSMapper.getValue(code, ts) * 0.0101972 - 1 /* convert kPa to kgf/cm2 and relative pressure */ };
            case "Coolant_Temperature":
                return { code: code, partsConstructor: () => new WaterTempGaugePanel(), readmode: "SLOW", getValFunc: (_, ws) => ws.WSMapper.getValue(code) };
            case "Engine_oil_temperature":
                return { code: code, partsConstructor: () => new EngineOilTempGaugePanel(), readmode: "SLOW", getValFunc: (_, ws) => ws.WSMapper.getValue(code) };
            case "Battery_Voltage":
                return { code: code, partsConstructor: () => new BatteryVoltageGaugePanel(), readmode: "SLOW", getValFunc: (_, ws) => ws.WSMapper.getValue(code) };
            case "Mass_Air_Flow":
                return { code: code, partsConstructor: () => new MassAirFlowGaugePanel(), readmode: "SLOWandFAST", getValFunc: (ts, ws) => ws.WSMapper.getValue(code, ts) };
            case "Throttle_Opening_Angle":
                return { code: code, partsConstructor: () => new ThrottleGaugePanel(), readmode: "SLOWandFAST", getValFunc: (ts, ws) => ws.WSMapper.getValue(code, ts) };
            case "O2Sensor_1_Air_Fuel_Ratio":
                return { code: code, partsConstructor: () => new AirFuelGaugePanel(), readmode: "SLOWandFAST", getValFunc: (ts, ws) => ws.WSMapper.getValue(code, ts) * 14 };
            case undefined:
                throw new Error("getMeter() is failed by undefined code.");
            default:
                throw new Error("Analog single meter is not defined on selected code.");
        }
    }
}