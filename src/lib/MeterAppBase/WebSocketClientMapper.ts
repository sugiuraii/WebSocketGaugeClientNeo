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
import { OBDIIParameterCode, ReadModeCode } from "../WebSocket/WebSocketCommunication";
import { WebsocketObjectCollection } from "./WebSocketObjectCollection";

export type WebsocketClientMapEntry= {CodeRegisterFunction: (ws: WebsocketObjectCollection, readmode: ReadModeCode) => void, ValueGetFunction: (ws: WebsocketObjectCollection, timeStamp?: number) => number};

export class WebsocketClientMapper<T> 
{
    private readonly webSocketCollection : WebsocketObjectCollection;
    private readonly map = new Map<T, WebsocketClientMapEntry>();

    constructor(webSocketCollection : WebsocketObjectCollection, map: Map<T, WebsocketClientMapEntry>)
    {
        this.webSocketCollection = webSocketCollection;
        this.map = map;
    }

    public registerParameterCode(code : T, readmode: ReadModeCode) : void
    {
        const mapItem = this.map.get(code);
        if(mapItem !== undefined)
            mapItem.CodeRegisterFunction(this.webSocketCollection, readmode);
        else
            throw ReferenceError("Code of " + code + " is not registered websocket client map.");
    }

    public getValue(code : T, timeStamp? : number) : number
    {
        const mapItem = this.map.get(code);
        if(mapItem !== undefined)
            return mapItem.ValueGetFunction(this.webSocketCollection, timeStamp);
        else
            throw ReferenceError("Code of " + code + " is not registered websocket client map.");
    }
}

export type WebsocketParameterCode = 
    "Engine_Load" |
    "Coolant_Temperature" |
    "Air_Fuel_Correction_1" |
    "Air_Fuel_Learning_1" |
    "Air_Fuel_Correction_2" |
    "Air_Fuel_Learning_2" |
    "Fuel_Tank_Pressure" |
    "Manifold_Absolute_Pressure" |
    "Engine_Speed" |
    "Vehicle_Speed" |
    "Ignition_Timing" |
    "Intake_Air_Temperature" |
    "Mass_Air_Flow" |
    "Throttle_Opening_Angle" |
    "Run_time_since_engine_start" |
    "Distance_traveled_with_MIL_on" |
    "Fuel_Rail_Pressure" |
    "Fuel_Rail_Pressure_diesel" |
    "Commanded_EGR" |
    "EGR_Error" |
    "Commanded_evaporative_purge" |
    "Fuel_Level_Input" |
    "Number_of_warmups_since_codes_cleared" |
    "Distance_traveled_since_codes_cleared" |
    "Evap_System_Vapor_Pressure" |
    "Atmospheric_Pressure" |
    "Catalyst_TemperatureBank_1_Sensor_1" |
    "Catalyst_TemperatureBank_2_Sensor_1" |
    "Catalyst_TemperatureBank_1_Sensor_2" |
    "Catalyst_TemperatureBank_2_Sensor_2" |
    "Battery_Voltage" |
    "Absolute_load_value" |
    "Command_equivalence_ratio" |
    "Relative_throttle_position" |
    "Ambient_air_temperature" |
    "Absolute_throttle_position_B" |
    "Absolute_throttle_position_C" |
    "Accelerator_pedal_position_D" |
    "Accelerator_pedal_position_E" |
    "Accelerator_pedal_position_F" |
    "Commanded_throttle_actuator" |
    "Time_run_with_MIL_on" |
    "Time_since_trouble_codes_cleared" |
    "Ethanol_fuel_percent" |
    "O2Sensor_1_Air_Fuel_Correction" |
    "O2Sensor_2_Air_Fuel_Correction" |
    "O2Sensor_3_Air_Fuel_Correction" |
    "O2Sensor_4_Air_Fuel_Correction" |
    "O2Sensor_5_Air_Fuel_Correction" |
    "O2Sensor_6_Air_Fuel_Correction" |
    "O2Sensor_7_Air_Fuel_Correction" |
    "O2Sensor_8_Air_Fuel_Correction" |
    "O2Sensor_1_Air_Fuel_Ratio" |
    "O2Sensor_2_Air_Fuel_Ratio" |
    "O2Sensor_3_Air_Fuel_Ratio" |
    "O2Sensor_4_Air_Fuel_Ratio" |
    "O2Sensor_5_Air_Fuel_Ratio" |
    "O2Sensor_6_Air_Fuel_Ratio" |
    "O2Sensor_7_Air_Fuel_Ratio" |
    "O2Sensor_8_Air_Fuel_Ratio" |
    "Evap_system_vapor_pressure" |
    "Fuel_rail_absolute_pressure" |
    "Relative_accelerator_pedal_position" |
    "Hybrid_battery_pack_remaining_life" |
    "Engine_oil_temperature" |
    "Fuel_injection_timing" |
    "Engine_fuel_rate" |
    "Driver_demand_engine_percent_torque" |
    "Actual_engine_percent_torque" |
    "Engine_reference_torque";

export const DefaultELM327Map = new Map<WebsocketParameterCode, WebsocketClientMapEntry> ([
    ["Engine_Load", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.Engine_Load, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Engine_Load, t)}],
    ["Coolant_Temperature", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.Coolant_Temperature, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Coolant_Temperature, t)}],
    ["Air_Fuel_Correction_1", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.Air_Fuel_Correction_1, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Air_Fuel_Correction_1, t)}],
    ["Air_Fuel_Learning_1", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.Air_Fuel_Learning_1, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Air_Fuel_Learning_1, t)}],
    ["Air_Fuel_Correction_2", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.Air_Fuel_Correction_2, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Air_Fuel_Correction_2, t)}],
    ["Air_Fuel_Learning_2", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.Air_Fuel_Learning_2, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Air_Fuel_Learning_2, t)}],
    ["Fuel_Tank_Pressure", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.Fuel_Tank_Pressure, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Fuel_Tank_Pressure, t)}],
    ["Manifold_Absolute_Pressure", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.Manifold_Absolute_Pressure, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Manifold_Absolute_Pressure, t)}],
    ["Engine_Speed", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.Engine_Speed, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Engine_Speed, t)}],
    ["Vehicle_Speed", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.Vehicle_Speed, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Vehicle_Speed, t)}],
    ["Ignition_Timing", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.Ignition_Timing, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Ignition_Timing, t)}],
    ["Intake_Air_Temperature", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.Intake_Air_Temperature, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Intake_Air_Temperature, t)}],
    ["Mass_Air_Flow", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.Mass_Air_Flow, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Mass_Air_Flow, t)}],
    ["Throttle_Opening_Angle", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.Throttle_Opening_Angle, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Throttle_Opening_Angle, t)}],
    ["Run_time_since_engine_start", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.Run_time_since_engine_start, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Run_time_since_engine_start, t)}],
    ["Distance_traveled_with_MIL_on", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.Distance_traveled_with_MIL_on, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Distance_traveled_with_MIL_on, t)}],
    ["Fuel_Rail_Pressure", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.Fuel_Rail_Pressure, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Fuel_Rail_Pressure, t)}],
    ["Fuel_Rail_Pressure_diesel", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.Fuel_Rail_Pressure_diesel, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Fuel_Rail_Pressure_diesel, t)}],
    ["Commanded_EGR", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.Commanded_EGR, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Commanded_EGR, t)}],
    ["EGR_Error", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.EGR_Error, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.EGR_Error, t)}],
    ["Commanded_evaporative_purge", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.Commanded_evaporative_purge, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Commanded_evaporative_purge, t)}],
    ["Fuel_Level_Input", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.Fuel_Level_Input, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Fuel_Level_Input, t)}],
    ["Number_of_warmups_since_codes_cleared", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.Number_of_warmups_since_codes_cleared, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Number_of_warmups_since_codes_cleared, t)}],
    ["Distance_traveled_since_codes_cleared", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.Distance_traveled_since_codes_cleared, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Distance_traveled_since_codes_cleared, t)}],
    ["Evap_System_Vapor_Pressure", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.Evap_System_Vapor_Pressure, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Evap_System_Vapor_Pressure, t)}],
    ["Atmospheric_Pressure", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.Atmospheric_Pressure, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Atmospheric_Pressure, t)}],
    ["Catalyst_TemperatureBank_1_Sensor_1", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.Catalyst_TemperatureBank_1_Sensor_1, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Catalyst_TemperatureBank_1_Sensor_1, t)}],
    ["Catalyst_TemperatureBank_2_Sensor_1", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.Catalyst_TemperatureBank_2_Sensor_1, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Catalyst_TemperatureBank_2_Sensor_1, t)}],
    ["Catalyst_TemperatureBank_1_Sensor_2", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.Catalyst_TemperatureBank_1_Sensor_2, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Catalyst_TemperatureBank_1_Sensor_2, t)}],
    ["Catalyst_TemperatureBank_2_Sensor_2", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.Catalyst_TemperatureBank_2_Sensor_2, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Catalyst_TemperatureBank_2_Sensor_2, t)}],
    ["Battery_Voltage", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.Battery_Voltage, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Battery_Voltage, t)}],
    ["Absolute_load_value", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.Absolute_load_value, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Absolute_load_value, t)}],
    ["Command_equivalence_ratio", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.Command_equivalence_ratio, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Command_equivalence_ratio, t)}],
    ["Relative_throttle_position", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.Relative_throttle_position, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Relative_throttle_position, t)}],
    ["Ambient_air_temperature", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.Ambient_air_temperature, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Ambient_air_temperature, t)}],
    ["Absolute_throttle_position_B", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.Absolute_throttle_position_B, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Absolute_throttle_position_B, t)}],
    ["Absolute_throttle_position_C", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.Absolute_throttle_position_C, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Absolute_throttle_position_C, t)}],
    ["Accelerator_pedal_position_D", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.Accelerator_pedal_position_D, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Accelerator_pedal_position_D, t)}],
    ["Accelerator_pedal_position_E", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.Accelerator_pedal_position_E, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Accelerator_pedal_position_E, t)}],
    ["Accelerator_pedal_position_F", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.Accelerator_pedal_position_F, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Accelerator_pedal_position_F, t)}],
    ["Commanded_throttle_actuator", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.Commanded_throttle_actuator, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Commanded_throttle_actuator, t)}],
    ["Time_run_with_MIL_on", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.Time_run_with_MIL_on, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Time_run_with_MIL_on, t)}],
    ["Time_since_trouble_codes_cleared", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.Time_since_trouble_codes_cleared, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Time_since_trouble_codes_cleared, t)}],
    ["Ethanol_fuel_percent", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.Ethanol_fuel_percent, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Ethanol_fuel_percent, t)}],
    ["O2Sensor_1_Air_Fuel_Correction", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.O2Sensor_1_Air_Fuel_Correction, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.O2Sensor_1_Air_Fuel_Correction, t)}],
    ["O2Sensor_2_Air_Fuel_Correction", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.O2Sensor_2_Air_Fuel_Correction, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.O2Sensor_2_Air_Fuel_Correction, t)}],
    ["O2Sensor_3_Air_Fuel_Correction", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.O2Sensor_3_Air_Fuel_Correction, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.O2Sensor_3_Air_Fuel_Correction, t)}],
    ["O2Sensor_4_Air_Fuel_Correction", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.O2Sensor_4_Air_Fuel_Correction, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.O2Sensor_4_Air_Fuel_Correction, t)}],
    ["O2Sensor_5_Air_Fuel_Correction", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.O2Sensor_5_Air_Fuel_Correction, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.O2Sensor_5_Air_Fuel_Correction, t)}],
    ["O2Sensor_6_Air_Fuel_Correction", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.O2Sensor_6_Air_Fuel_Correction, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.O2Sensor_6_Air_Fuel_Correction, t)}],
    ["O2Sensor_7_Air_Fuel_Correction", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.O2Sensor_7_Air_Fuel_Correction, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.O2Sensor_7_Air_Fuel_Correction, t)}],
    ["O2Sensor_8_Air_Fuel_Correction", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.O2Sensor_8_Air_Fuel_Correction, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.O2Sensor_8_Air_Fuel_Correction, t)}],
    ["O2Sensor_1_Air_Fuel_Ratio", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.O2Sensor_1_Air_Fuel_Ratio, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.O2Sensor_1_Air_Fuel_Ratio, t)}],
    ["O2Sensor_2_Air_Fuel_Ratio", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.O2Sensor_2_Air_Fuel_Ratio, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.O2Sensor_2_Air_Fuel_Ratio, t)}],
    ["O2Sensor_3_Air_Fuel_Ratio", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.O2Sensor_3_Air_Fuel_Ratio, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.O2Sensor_3_Air_Fuel_Ratio, t)}],
    ["O2Sensor_4_Air_Fuel_Ratio", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.O2Sensor_4_Air_Fuel_Ratio, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.O2Sensor_4_Air_Fuel_Ratio, t)}],
    ["O2Sensor_5_Air_Fuel_Ratio", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.O2Sensor_5_Air_Fuel_Ratio, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.O2Sensor_5_Air_Fuel_Ratio, t)}],
    ["O2Sensor_6_Air_Fuel_Ratio", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.O2Sensor_6_Air_Fuel_Ratio, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.O2Sensor_6_Air_Fuel_Ratio, t)}],
    ["O2Sensor_7_Air_Fuel_Ratio", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.O2Sensor_7_Air_Fuel_Ratio, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.O2Sensor_7_Air_Fuel_Ratio, t)}],
    ["O2Sensor_8_Air_Fuel_Ratio", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.O2Sensor_8_Air_Fuel_Ratio, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.O2Sensor_8_Air_Fuel_Ratio, t)}],
    ["Evap_system_vapor_pressure", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.Evap_system_vapor_pressure, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Evap_system_vapor_pressure, t)}],
    ["Fuel_rail_absolute_pressure", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.Fuel_rail_absolute_pressure, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Fuel_rail_absolute_pressure, t)}],
    ["Relative_accelerator_pedal_position", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.Relative_accelerator_pedal_position, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Relative_accelerator_pedal_position, t)}],
    ["Hybrid_battery_pack_remaining_life", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.Hybrid_battery_pack_remaining_life, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Hybrid_battery_pack_remaining_life, t)}],
    ["Engine_oil_temperature", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.Engine_oil_temperature, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Engine_oil_temperature, t)}],
    ["Fuel_injection_timing", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.Fuel_injection_timing, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Fuel_injection_timing, t)}],
    ["Engine_fuel_rate", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.Engine_fuel_rate, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Engine_fuel_rate, t)}],
    ["Driver_demand_engine_percent_torque", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.Driver_demand_engine_percent_torque, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Driver_demand_engine_percent_torque, t)}],
    ["Actual_engine_percent_torque", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.Actual_engine_percent_torque, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Actual_engine_percent_torque, t)}],
    ["Engine_reference_torque", {CodeRegisterFunction : (w, r) => w.ELM327WS.ParameterCodeList.push({code : OBDIIParameterCode.Engine_reference_torque, readmode :r}), ValueGetFunction : (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Engine_reference_torque, t)}]   
]) ;
