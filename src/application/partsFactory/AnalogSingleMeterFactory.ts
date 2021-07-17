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
import { AnalogSingleMeter, BatteryVoltageMeter, BoostMeter, OilPressureMeter, OilTempMeter, RevMeter, VacuumMeter, WaterTempMeter } from "../../parts/AnalogSingleMeter/AnalogSingleMeter";

export class AnalogSingleMeterFactory
{
    private readonly UseVacuumMeterInsteadOfBoost;
    constructor(UseVacuumMeterInsteadOfBoost? : boolean)
    {
        if(UseVacuumMeterInsteadOfBoost === true)
            this.UseVacuumMeterInsteadOfBoost = true;
        else
            this.UseVacuumMeterInsteadOfBoost = false;
    }

    public getMeter(code: WebsocketParameterCode | undefined): { code : WebsocketParameterCode, partsConstructor: () => AnalogSingleMeter, readmode: ReadModeCode, getValFunc: (timestamp: number, ws: WebsocketObjectCollection) => number } {
        switch (code) {
            case "Engine_Speed":
                return { code : code, partsConstructor: () => new RevMeter(), readmode: "SLOWandFAST", getValFunc: (ts, ws) => ws.WSMapper.getValue(code, ts) };
            case "Manifold_Absolute_Pressure":
                return { code : code,  partsConstructor: () => this.UseVacuumMeterInsteadOfBoost ? new VacuumMeter() : new BoostMeter(), readmode: "SLOWandFAST", getValFunc: (ts, ws) => ws.WSMapper.getValue(code, ts) * 0.0101972 - 1 /* convert kPa to kgf/cm2 and relative pressure */ };
            case "Coolant_Temperature":
                return { code : code,  partsConstructor: () => new WaterTempMeter(), readmode: "SLOW", getValFunc: (_, ws) => ws.WSMapper.getValue(code) };
            case "Engine_oil_temperature":
                return { code : code,  partsConstructor: () => new OilTempMeter(), readmode: "SLOW", getValFunc: (_, ws) => ws.WSMapper.getValue(code) };
            case "Battery_Voltage":
                return { code : code,  partsConstructor: () => new BatteryVoltageMeter(), readmode: "SLOW", getValFunc: (_, ws) => ws.WSMapper.getValue(code) };
            case "Oil_Pressure":
                return { code : code,  partsConstructor: () => new OilPressureMeter(), readmode: "SLOWandFAST", getValFunc: (ts, ws) => ws.WSMapper.getValue(code, ts) };
            case undefined:
                throw new Error("getMeter() is failed by undefined code.");
            default:
                throw new Error("Analog single meter is not defined on selected code.");
        }
    }
}