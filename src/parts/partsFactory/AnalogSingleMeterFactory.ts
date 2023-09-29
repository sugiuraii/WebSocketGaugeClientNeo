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

import { WebsocketServiceCollection } from "websocket-gauge-client-communication-service"
import { WebsocketParameterCode } from "websocket-gauge-client-communication-service"
import { ReadModeCode } from "websocket-gauge-client-communication";
import { AnalogSingleMeter } from "@websocketgaugeclientneo/meterparts-analogsinglemeter";
import { AnalogSingleMeterPresets } from "@websocketgaugeclientneo/meterparts-analogsinglemeter";

export class AnalogSingleMeterFactory {
    private readonly UseVacuumMeterInsteadOfBoost;
    constructor(UseVacuumMeterInsteadOfBoost?: boolean) {
        if (UseVacuumMeterInsteadOfBoost === true)
            this.UseVacuumMeterInsteadOfBoost = true;
        else
            this.UseVacuumMeterInsteadOfBoost = false;
    }

    public getMeter(code: WebsocketParameterCode | undefined): { code: WebsocketParameterCode, createDisplayObject: () => Promise<AnalogSingleMeter>, readmode: ReadModeCode, getValue: (timestamp: number, ws: WebsocketServiceCollection) => number } {
        switch (code) {
            case "Engine_Speed":
                return { code: code, createDisplayObject: async () => AnalogSingleMeterPresets.RevMeter(), readmode: "SLOWandFAST", getValue: (ts, ws) => ws.WSMapper.getValue(code, ts) };
            case "Manifold_Absolute_Pressure":
                return { code: code, createDisplayObject: async () => this.UseVacuumMeterInsteadOfBoost ? AnalogSingleMeterPresets.VacuumMeter() : AnalogSingleMeterPresets.BoostMeter(), readmode: "SLOWandFAST", getValue: (ts, ws) => ws.WSMapper.getValue(code, ts) * 0.0101972 - 1 /* convert kPa to kgf/cm2 and relative pressure */ };
            case "Coolant_Temperature":
                return { code: code, createDisplayObject: async () => AnalogSingleMeterPresets.WaterTempMeter(), readmode: "SLOW", getValue: (_, ws) => ws.WSMapper.getValue(code) };
            case "Engine_oil_temperature":
                return { code: code, createDisplayObject: async () => AnalogSingleMeterPresets.OilTempMeter(), readmode: "SLOW", getValue: (_, ws) => ws.WSMapper.getValue(code) };
            case "Battery_Voltage":
                return { code: code, createDisplayObject: async () => AnalogSingleMeterPresets.BatteryVoltageMeter(), readmode: "SLOW", getValue: (_, ws) => ws.WSMapper.getValue(code) };
            case "Oil_Pressure":
                return { code: code, createDisplayObject: async () => AnalogSingleMeterPresets.OilPressureMeter(), readmode: "SLOWandFAST", getValue: (ts, ws) => ws.WSMapper.getValue(code, ts) };
            case "O2Sensor_1_Air_Fuel_Ratio":
                return { code: code, createDisplayObject: async () => AnalogSingleMeterPresets.AirFuelRatioMeter(), readmode: "SLOWandFAST", getValue: (ts, ws) => ws.WSMapper.getValue(code, ts) * 14 };
            case "Mass_Air_Flow":
                return { code: code, createDisplayObject: async () => AnalogSingleMeterPresets.MassAirFlowMeter(), readmode: "SLOWandFAST", getValue: (ts, ws) => ws.WSMapper.getValue(code, ts) / 10 }; // Convert g/s -> x10g/s
            case "Engine_Load":
                return { code: code, createDisplayObject: async () => AnalogSingleMeterPresets.EngineLoadMeter(), readmode: "SLOWandFAST", getValue: (ts, ws) => ws.WSMapper.getValue(code, ts) };
            case "Intake_Air_Temperature":
                return { code: code, createDisplayObject: async () => AnalogSingleMeterPresets.IntakeAirTemperatureMeter(), readmode: "SLOW", getValue: (_, ws) => ws.WSMapper.getValue(code) };
            case undefined:
                throw new Error("getMeter() is failed by undefined code.");
            default:
                throw new Error("Analog single meter is not defined on selected code.");
        }
    }
}