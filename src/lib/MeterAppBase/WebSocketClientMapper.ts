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
import { OBDIIParameterCode, SSMParameterCode, ArduinoParameterCode, DefiParameterCode, ReadModeCode } from "../WebSocket/WebSocketCommunication";
import { WebsocketObjectCollection } from "./WebSocketObjectCollection";

export type WebsocketClientMapEntry = { CodeRegisterFunction: (ws: WebsocketObjectCollection, readmode: ReadModeCode) => void, ValueGetFunction: (ws: WebsocketObjectCollection, timeStamp?: number) => number };

export class WebsocketClientMapper
{
    private readonly webSocketCollection: WebsocketObjectCollection;
    private readonly map = new Map<WebsocketParameterCode, WebsocketClientMapEntry>();

    constructor(webSocketCollection: WebsocketObjectCollection, map: Map<WebsocketParameterCode, WebsocketClientMapEntry>) {
        this.webSocketCollection = webSocketCollection;
        this.map = map;
    }

    public registerParameterCode(code: WebsocketParameterCode, readmode: ReadModeCode): void {
        const mapItem = this.map.get(code);
        if (mapItem !== undefined)
            mapItem.CodeRegisterFunction(this.webSocketCollection, readmode);
        else
            throw ReferenceError("Code of " + code + " is not registered websocket client map.");
    }

    public getValue(code: WebsocketParameterCode, timeStamp?: number): number {
        const mapItem = this.map.get(code);
        if (mapItem !== undefined)
            return mapItem.ValueGetFunction(this.webSocketCollection, timeStamp);
        else
            throw ReferenceError("Code of " + code + " is not registered websocket client map.");
    }
}

export type WebsocketParameterCode =
    // Copied from OBDII parameter code
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
    "Engine_reference_torque" |
    // SSM (parameter code) unique code
    "Front_O2_Sensor_1" |
    "Rear_O2_Sensor" |
    "Front_O2_Sensor_2" |
    "Air_Flow_Sensor_Voltage" |
    "Throttle_Sensor_Voltage" |
    "Differential_Pressure_Sensor_Voltage" |
    "Fuel_Injection_1_Pulse_Width" |
    "Fuel_Injection_2_Pulse_Width" |
    "Knock_Correction" |
    "Manifold_Relative_Pressure" |
    "Pressure_Differential_Sensor" |
    "CO_Adjustment" |
    "Learned_Ignition_Timing" |
    "Accelerator_Opening_Angle" |
    "Fuel_Temperature" |
    "Front_O2_Heater_1" |
    "Rear_O2_Heater_Current" |
    "Front_O2_Heater_2" |
    "Fuel_Level" |
    "Primary_Wastegate_Duty_Cycle" |
    "Secondary_Wastegate_Duty_Cycle" |
    "CPC_Valve_Duty_Ratio" |
    "Tumble_Valve_Position_Sensor_Right" |
    "Tumble_Valve_Position_Sensor_Left" |
    "Idle_Speed_Control_Valve_Duty_Ratio" |
    "Air_Fuel_Lean_Correction" |
    "Air_Fuel_Heater_Duty" |
    "Idle_Speed_Control_Valve_Step" |
    "Number_of_Ex_Gas_Recirc_Steps" |
    "Alternator_Duty" |
    "Fuel_Pump_Duty" |
    "Intake_VVT_Advance_Angle_Right" |
    "Intake_VVT_Advance_Angle_Left" |
    "Intake_OCV_Duty_Right" |
    "Intake_OCV_Duty_Left" |
    "Intake_OCV_Current_Right" |
    "Intake_OCV_Current_Left" |
    "Air_Fuel_Sensor_1_Current" |
    "Air_Fuel_Sensor_2_Current" |
    "Air_Fuel_Sensor_1_Resistance" |
    "Air_Fuel_Sensor_2_Resistance" |
    "Air_Fuel_Sensor_1" |
    "Air_Fuel_Sensor_2" |
    "Gear_Position" |
    "A_F_Sensor_1_Heater_Current" |
    "A_F_Sensor_2_Heater_Current" |
    "Roughness_Monitor_Cylinder_1" |
    "Roughness_Monitor_Cylinder_2" |
    "Air_Fuel_Correction_3" |
    "Air_Fuel_Learning_3" |
    "Rear_O2_Heater_Voltage" |
    "Air_Fuel_Adjustment_Voltage" |
    "Roughness_Monitor_Cylinder_3" |
    "Roughness_Monitor_Cylinder_4" |
    "Throttle_Motor_Duty" |
    "Throttle_Motor_Voltage" |
    "Sub_Throttle_Sensor" |
    "Main_Throttle_Sensor" |
    "Sub_Accelerator_Sensor" |
    "Main_Accelerator_Sensor" |
    "Brake_Booster_Pressure" |
    "Exhaust_Gas_Temperature" |
    "Cold_Start_Injector" |
    "SCV_Step" |
    "Memorised_Cruise_Speed" |
    "Exhaust_VVT_Advance_Angle_Right" |
    "Exhaust_VVT_Advance_Angle_Left" |
    "Exhaust_OCV_Duty_Right" |
    "Exhaust_OCV_Duty_Left" |
    "Exhaust_OCV_Current_Right" |
    "Exhaust_OCV_Current_Left" |
    // Arduino unique code
    "Oil_Temperature2" |
    "Oil_Pressure";


export const DefaultELM327Map = new Map<WebsocketParameterCode, WebsocketClientMapEntry>([
    ["Engine_Load", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.Engine_Load, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Engine_Load, t) }],
    ["Coolant_Temperature", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.Coolant_Temperature, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Coolant_Temperature, t) }],
    ["Air_Fuel_Correction_1", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.Air_Fuel_Correction_1, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Air_Fuel_Correction_1, t) }],
    ["Air_Fuel_Learning_1", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.Air_Fuel_Learning_1, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Air_Fuel_Learning_1, t) }],
    ["Air_Fuel_Correction_2", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.Air_Fuel_Correction_2, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Air_Fuel_Correction_2, t) }],
    ["Air_Fuel_Learning_2", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.Air_Fuel_Learning_2, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Air_Fuel_Learning_2, t) }],
    ["Fuel_Tank_Pressure", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.Fuel_Tank_Pressure, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Fuel_Tank_Pressure, t) }],
    ["Manifold_Absolute_Pressure", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.Manifold_Absolute_Pressure, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Manifold_Absolute_Pressure, t) }],
    ["Engine_Speed", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.Engine_Speed, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Engine_Speed, t) }],
    ["Vehicle_Speed", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.Vehicle_Speed, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Vehicle_Speed, t) }],
    ["Ignition_Timing", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.Ignition_Timing, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Ignition_Timing, t) }],
    ["Intake_Air_Temperature", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.Intake_Air_Temperature, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Intake_Air_Temperature, t) }],
    ["Mass_Air_Flow", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.Mass_Air_Flow, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Mass_Air_Flow, t) }],
    ["Throttle_Opening_Angle", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.Throttle_Opening_Angle, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Throttle_Opening_Angle, t) }],
    ["Run_time_since_engine_start", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.Run_time_since_engine_start, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Run_time_since_engine_start, t) }],
    ["Distance_traveled_with_MIL_on", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.Distance_traveled_with_MIL_on, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Distance_traveled_with_MIL_on, t) }],
    ["Fuel_Rail_Pressure", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.Fuel_Rail_Pressure, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Fuel_Rail_Pressure, t) }],
    ["Fuel_Rail_Pressure_diesel", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.Fuel_Rail_Pressure_diesel, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Fuel_Rail_Pressure_diesel, t) }],
    ["Commanded_EGR", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.Commanded_EGR, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Commanded_EGR, t) }],
    ["EGR_Error", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.EGR_Error, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.EGR_Error, t) }],
    ["Commanded_evaporative_purge", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.Commanded_evaporative_purge, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Commanded_evaporative_purge, t) }],
    ["Fuel_Level_Input", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.Fuel_Level_Input, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Fuel_Level_Input, t) }],
    ["Number_of_warmups_since_codes_cleared", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.Number_of_warmups_since_codes_cleared, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Number_of_warmups_since_codes_cleared, t) }],
    ["Distance_traveled_since_codes_cleared", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.Distance_traveled_since_codes_cleared, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Distance_traveled_since_codes_cleared, t) }],
    ["Evap_System_Vapor_Pressure", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.Evap_System_Vapor_Pressure, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Evap_System_Vapor_Pressure, t) }],
    ["Atmospheric_Pressure", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.Atmospheric_Pressure, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Atmospheric_Pressure, t) }],
    ["Catalyst_TemperatureBank_1_Sensor_1", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.Catalyst_TemperatureBank_1_Sensor_1, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Catalyst_TemperatureBank_1_Sensor_1, t) }],
    ["Catalyst_TemperatureBank_2_Sensor_1", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.Catalyst_TemperatureBank_2_Sensor_1, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Catalyst_TemperatureBank_2_Sensor_1, t) }],
    ["Catalyst_TemperatureBank_1_Sensor_2", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.Catalyst_TemperatureBank_1_Sensor_2, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Catalyst_TemperatureBank_1_Sensor_2, t) }],
    ["Catalyst_TemperatureBank_2_Sensor_2", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.Catalyst_TemperatureBank_2_Sensor_2, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Catalyst_TemperatureBank_2_Sensor_2, t) }],
    ["Battery_Voltage", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.Battery_Voltage, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Battery_Voltage, t) }],
    ["Absolute_load_value", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.Absolute_load_value, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Absolute_load_value, t) }],
    ["Command_equivalence_ratio", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.Command_equivalence_ratio, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Command_equivalence_ratio, t) }],
    ["Relative_throttle_position", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.Relative_throttle_position, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Relative_throttle_position, t) }],
    ["Ambient_air_temperature", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.Ambient_air_temperature, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Ambient_air_temperature, t) }],
    ["Absolute_throttle_position_B", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.Absolute_throttle_position_B, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Absolute_throttle_position_B, t) }],
    ["Absolute_throttle_position_C", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.Absolute_throttle_position_C, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Absolute_throttle_position_C, t) }],
    ["Accelerator_pedal_position_D", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.Accelerator_pedal_position_D, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Accelerator_pedal_position_D, t) }],
    ["Accelerator_pedal_position_E", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.Accelerator_pedal_position_E, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Accelerator_pedal_position_E, t) }],
    ["Accelerator_pedal_position_F", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.Accelerator_pedal_position_F, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Accelerator_pedal_position_F, t) }],
    ["Commanded_throttle_actuator", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.Commanded_throttle_actuator, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Commanded_throttle_actuator, t) }],
    ["Time_run_with_MIL_on", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.Time_run_with_MIL_on, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Time_run_with_MIL_on, t) }],
    ["Time_since_trouble_codes_cleared", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.Time_since_trouble_codes_cleared, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Time_since_trouble_codes_cleared, t) }],
    ["Ethanol_fuel_percent", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.Ethanol_fuel_percent, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Ethanol_fuel_percent, t) }],
    ["O2Sensor_1_Air_Fuel_Correction", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.O2Sensor_1_Air_Fuel_Correction, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.O2Sensor_1_Air_Fuel_Correction, t) }],
    ["O2Sensor_2_Air_Fuel_Correction", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.O2Sensor_2_Air_Fuel_Correction, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.O2Sensor_2_Air_Fuel_Correction, t) }],
    ["O2Sensor_3_Air_Fuel_Correction", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.O2Sensor_3_Air_Fuel_Correction, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.O2Sensor_3_Air_Fuel_Correction, t) }],
    ["O2Sensor_4_Air_Fuel_Correction", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.O2Sensor_4_Air_Fuel_Correction, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.O2Sensor_4_Air_Fuel_Correction, t) }],
    ["O2Sensor_5_Air_Fuel_Correction", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.O2Sensor_5_Air_Fuel_Correction, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.O2Sensor_5_Air_Fuel_Correction, t) }],
    ["O2Sensor_6_Air_Fuel_Correction", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.O2Sensor_6_Air_Fuel_Correction, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.O2Sensor_6_Air_Fuel_Correction, t) }],
    ["O2Sensor_7_Air_Fuel_Correction", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.O2Sensor_7_Air_Fuel_Correction, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.O2Sensor_7_Air_Fuel_Correction, t) }],
    ["O2Sensor_8_Air_Fuel_Correction", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.O2Sensor_8_Air_Fuel_Correction, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.O2Sensor_8_Air_Fuel_Correction, t) }],
    ["O2Sensor_1_Air_Fuel_Ratio", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.O2Sensor_1_Air_Fuel_Ratio, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.O2Sensor_1_Air_Fuel_Ratio, t) }],
    ["O2Sensor_2_Air_Fuel_Ratio", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.O2Sensor_2_Air_Fuel_Ratio, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.O2Sensor_2_Air_Fuel_Ratio, t) }],
    ["O2Sensor_3_Air_Fuel_Ratio", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.O2Sensor_3_Air_Fuel_Ratio, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.O2Sensor_3_Air_Fuel_Ratio, t) }],
    ["O2Sensor_4_Air_Fuel_Ratio", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.O2Sensor_4_Air_Fuel_Ratio, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.O2Sensor_4_Air_Fuel_Ratio, t) }],
    ["O2Sensor_5_Air_Fuel_Ratio", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.O2Sensor_5_Air_Fuel_Ratio, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.O2Sensor_5_Air_Fuel_Ratio, t) }],
    ["O2Sensor_6_Air_Fuel_Ratio", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.O2Sensor_6_Air_Fuel_Ratio, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.O2Sensor_6_Air_Fuel_Ratio, t) }],
    ["O2Sensor_7_Air_Fuel_Ratio", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.O2Sensor_7_Air_Fuel_Ratio, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.O2Sensor_7_Air_Fuel_Ratio, t) }],
    ["O2Sensor_8_Air_Fuel_Ratio", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.O2Sensor_8_Air_Fuel_Ratio, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.O2Sensor_8_Air_Fuel_Ratio, t) }],
    ["Evap_system_vapor_pressure", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.Evap_system_vapor_pressure, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Evap_system_vapor_pressure, t) }],
    ["Fuel_rail_absolute_pressure", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.Fuel_rail_absolute_pressure, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Fuel_rail_absolute_pressure, t) }],
    ["Relative_accelerator_pedal_position", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.Relative_accelerator_pedal_position, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Relative_accelerator_pedal_position, t) }],
    ["Hybrid_battery_pack_remaining_life", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.Hybrid_battery_pack_remaining_life, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Hybrid_battery_pack_remaining_life, t) }],
    ["Engine_oil_temperature", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.Engine_oil_temperature, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Engine_oil_temperature, t) }],
    ["Fuel_injection_timing", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.Fuel_injection_timing, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Fuel_injection_timing, t) }],
    ["Engine_fuel_rate", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.Engine_fuel_rate, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Engine_fuel_rate, t) }],
    ["Driver_demand_engine_percent_torque", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.Driver_demand_engine_percent_torque, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Driver_demand_engine_percent_torque, t) }],
    ["Actual_engine_percent_torque", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.Actual_engine_percent_torque, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Actual_engine_percent_torque, t) }],
    ["Engine_reference_torque", { CodeRegisterFunction: (w, r) => w.ELM327WS.ParameterCodeList.push({ code: OBDIIParameterCode.Engine_reference_torque, readmode: r }), ValueGetFunction: (w, t) => w.ELM327WS.getVal(OBDIIParameterCode.Engine_reference_torque, t) }]
]);

export const DefaultSSMMap = new Map<WebsocketParameterCode, WebsocketClientMapEntry>([
    ["Engine_Load", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Engine_Load, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Engine_Load, t)}],
    ["Coolant_Temperature", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Coolant_Temperature, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Coolant_Temperature, t)}],
    ["Air_Fuel_Correction_1", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Air_Fuel_Correction_1, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Air_Fuel_Correction_1, t)}],
    ["Air_Fuel_Learning_1", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Air_Fuel_Learning_1, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Air_Fuel_Learning_1, t)}],
    ["Air_Fuel_Correction_2", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Air_Fuel_Correction_2, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Air_Fuel_Correction_2, t)}],
    ["Air_Fuel_Learning_2", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Air_Fuel_Learning_2, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Air_Fuel_Learning_2, t)}],
    ["Manifold_Absolute_Pressure", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Manifold_Absolute_Pressure, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Manifold_Absolute_Pressure, t)}],
    ["Engine_Speed", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Engine_Speed, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Engine_Speed, t)}],
    ["Vehicle_Speed", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Vehicle_Speed, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Vehicle_Speed, t)}],
    ["Ignition_Timing", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Ignition_Timing, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Ignition_Timing, t)}],
    ["Intake_Air_Temperature", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Intake_Air_Temperature, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Intake_Air_Temperature, t)}],
    ["Mass_Air_Flow", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Mass_Air_Flow, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Mass_Air_Flow, t)}],
    ["Throttle_Opening_Angle", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Throttle_Opening_Angle, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Throttle_Opening_Angle, t)}],
    ["Front_O2_Sensor_1", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Front_O2_Sensor_1, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Front_O2_Sensor_1, t)}],
    ["Rear_O2_Sensor", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Rear_O2_Sensor, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Rear_O2_Sensor, t)}],
    ["Front_O2_Sensor_2", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Front_O2_Sensor_2, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Front_O2_Sensor_2, t)}],
    ["Battery_Voltage", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Battery_Voltage, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Battery_Voltage, t)}],
    ["Air_Flow_Sensor_Voltage", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Air_Flow_Sensor_Voltage, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Air_Flow_Sensor_Voltage, t)}],
    ["Throttle_Sensor_Voltage", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Throttle_Sensor_Voltage, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Throttle_Sensor_Voltage, t)}],
    ["Differential_Pressure_Sensor_Voltage", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Differential_Pressure_Sensor_Voltage, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Differential_Pressure_Sensor_Voltage, t)}],
    ["Fuel_Injection_1_Pulse_Width", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Fuel_Injection_1_Pulse_Width, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Fuel_Injection_1_Pulse_Width, t)}],
    ["Fuel_Injection_2_Pulse_Width", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Fuel_Injection_2_Pulse_Width, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Fuel_Injection_2_Pulse_Width, t)}],
    ["Knock_Correction", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Knock_Correction, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Knock_Correction, t)}],
    ["Atmospheric_Pressure", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Atmospheric_Pressure, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Atmospheric_Pressure, t)}],
    ["Manifold_Relative_Pressure", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Manifold_Relative_Pressure, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Manifold_Relative_Pressure, t)}],
    ["Pressure_Differential_Sensor", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Pressure_Differential_Sensor, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Pressure_Differential_Sensor, t)}],
    ["Fuel_Tank_Pressure", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Fuel_Tank_Pressure, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Fuel_Tank_Pressure, t)}],
    ["CO_Adjustment", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.CO_Adjustment, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.CO_Adjustment, t)}],
    ["Learned_Ignition_Timing", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Learned_Ignition_Timing, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Learned_Ignition_Timing, t)}],
    ["Accelerator_Opening_Angle", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Accelerator_Opening_Angle, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Accelerator_Opening_Angle, t)}],
    ["Fuel_Temperature", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Fuel_Temperature, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Fuel_Temperature, t)}],
    ["Front_O2_Heater_1", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Front_O2_Heater_1, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Front_O2_Heater_1, t)}],
    ["Rear_O2_Heater_Current", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Rear_O2_Heater_Current, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Rear_O2_Heater_Current, t)}],
    ["Front_O2_Heater_2", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Front_O2_Heater_2, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Front_O2_Heater_2, t)}],
    ["Fuel_Level", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Fuel_Level, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Fuel_Level, t)}],
    ["Primary_Wastegate_Duty_Cycle", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Primary_Wastegate_Duty_Cycle, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Primary_Wastegate_Duty_Cycle, t)}],
    ["Secondary_Wastegate_Duty_Cycle", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Secondary_Wastegate_Duty_Cycle, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Secondary_Wastegate_Duty_Cycle, t)}],
    ["CPC_Valve_Duty_Ratio", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.CPC_Valve_Duty_Ratio, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.CPC_Valve_Duty_Ratio, t)}],
    ["Tumble_Valve_Position_Sensor_Right", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Tumble_Valve_Position_Sensor_Right, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Tumble_Valve_Position_Sensor_Right, t)}],
    ["Tumble_Valve_Position_Sensor_Left", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Tumble_Valve_Position_Sensor_Left, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Tumble_Valve_Position_Sensor_Left, t)}],
    ["Idle_Speed_Control_Valve_Duty_Ratio", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Idle_Speed_Control_Valve_Duty_Ratio, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Idle_Speed_Control_Valve_Duty_Ratio, t)}],
    ["Air_Fuel_Lean_Correction", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Air_Fuel_Lean_Correction, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Air_Fuel_Lean_Correction, t)}],
    ["Air_Fuel_Heater_Duty", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Air_Fuel_Heater_Duty, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Air_Fuel_Heater_Duty, t)}],
    ["Idle_Speed_Control_Valve_Step", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Idle_Speed_Control_Valve_Step, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Idle_Speed_Control_Valve_Step, t)}],
    ["Number_of_Ex_Gas_Recirc_Steps", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Number_of_Ex_Gas_Recirc_Steps, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Number_of_Ex_Gas_Recirc_Steps, t)}],
    ["Alternator_Duty", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Alternator_Duty, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Alternator_Duty, t)}],
    ["Fuel_Pump_Duty", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Fuel_Pump_Duty, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Fuel_Pump_Duty, t)}],
    ["Intake_VVT_Advance_Angle_Right", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Intake_VVT_Advance_Angle_Right, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Intake_VVT_Advance_Angle_Right, t)}],
    ["Intake_VVT_Advance_Angle_Left", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Intake_VVT_Advance_Angle_Left, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Intake_VVT_Advance_Angle_Left, t)}],
    ["Intake_OCV_Duty_Right", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Intake_OCV_Duty_Right, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Intake_OCV_Duty_Right, t)}],
    ["Intake_OCV_Duty_Left", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Intake_OCV_Duty_Left, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Intake_OCV_Duty_Left, t)}],
    ["Intake_OCV_Current_Right", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Intake_OCV_Current_Right, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Intake_OCV_Current_Right, t)}],
    ["Intake_OCV_Current_Left", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Intake_OCV_Current_Left, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Intake_OCV_Current_Left, t)}],
    ["Air_Fuel_Sensor_1_Current", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Air_Fuel_Sensor_1_Current, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Air_Fuel_Sensor_1_Current, t)}],
    ["Air_Fuel_Sensor_2_Current", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Air_Fuel_Sensor_2_Current, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Air_Fuel_Sensor_2_Current, t)}],
    ["Air_Fuel_Sensor_1_Resistance", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Air_Fuel_Sensor_1_Resistance, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Air_Fuel_Sensor_1_Resistance, t)}],
    ["Air_Fuel_Sensor_2_Resistance", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Air_Fuel_Sensor_2_Resistance, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Air_Fuel_Sensor_2_Resistance, t)}],
    ["Air_Fuel_Sensor_1", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Air_Fuel_Sensor_1, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Air_Fuel_Sensor_1, t)}],
    ["Air_Fuel_Sensor_2", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Air_Fuel_Sensor_2, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Air_Fuel_Sensor_2, t)}],
    ["Gear_Position", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Gear_Position, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Gear_Position, t)}],
    ["A_F_Sensor_1_Heater_Current", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.A_F_Sensor_1_Heater_Current, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.A_F_Sensor_1_Heater_Current, t)}],
    ["A_F_Sensor_2_Heater_Current", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.A_F_Sensor_2_Heater_Current, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.A_F_Sensor_2_Heater_Current, t)}],
    ["Roughness_Monitor_Cylinder_1", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Roughness_Monitor_Cylinder_1, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Roughness_Monitor_Cylinder_1, t)}],
    ["Roughness_Monitor_Cylinder_2", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Roughness_Monitor_Cylinder_2, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Roughness_Monitor_Cylinder_2, t)}],
    ["Air_Fuel_Correction_3", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Air_Fuel_Correction_3, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Air_Fuel_Correction_3, t)}],
    ["Air_Fuel_Learning_3", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Air_Fuel_Learning_3, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Air_Fuel_Learning_3, t)}],
    ["Rear_O2_Heater_Voltage", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Rear_O2_Heater_Voltage, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Rear_O2_Heater_Voltage, t)}],
    ["Air_Fuel_Adjustment_Voltage", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Air_Fuel_Adjustment_Voltage, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Air_Fuel_Adjustment_Voltage, t)}],
    ["Roughness_Monitor_Cylinder_3", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Roughness_Monitor_Cylinder_3, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Roughness_Monitor_Cylinder_3, t)}],
    ["Roughness_Monitor_Cylinder_4", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Roughness_Monitor_Cylinder_4, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Roughness_Monitor_Cylinder_4, t)}],
    ["Throttle_Motor_Duty", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Throttle_Motor_Duty, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Throttle_Motor_Duty, t)}],
    ["Throttle_Motor_Voltage", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Throttle_Motor_Voltage, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Throttle_Motor_Voltage, t)}],
    ["Sub_Throttle_Sensor", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Sub_Throttle_Sensor, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Sub_Throttle_Sensor, t)}],
    ["Main_Throttle_Sensor", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Main_Throttle_Sensor, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Main_Throttle_Sensor, t)}],
    ["Sub_Accelerator_Sensor", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Sub_Accelerator_Sensor, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Sub_Accelerator_Sensor, t)}],
    ["Main_Accelerator_Sensor", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Main_Accelerator_Sensor, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Main_Accelerator_Sensor, t)}],
    ["Brake_Booster_Pressure", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Brake_Booster_Pressure, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Brake_Booster_Pressure, t)}],
    ["Fuel_Rail_Pressure", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Fuel_Rail_Pressure, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Fuel_Rail_Pressure, t)}],
    ["Exhaust_Gas_Temperature", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Exhaust_Gas_Temperature, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Exhaust_Gas_Temperature, t)}],
    ["Cold_Start_Injector", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Cold_Start_Injector, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Cold_Start_Injector, t)}],
    ["SCV_Step", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.SCV_Step, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.SCV_Step, t)}],
    ["Memorised_Cruise_Speed", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Memorised_Cruise_Speed, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Memorised_Cruise_Speed, t)}],
    ["Exhaust_VVT_Advance_Angle_Right", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Exhaust_VVT_Advance_Angle_Right, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Exhaust_VVT_Advance_Angle_Right, t)}],
    ["Exhaust_VVT_Advance_Angle_Left", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Exhaust_VVT_Advance_Angle_Left, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Exhaust_VVT_Advance_Angle_Left, t)}],
    ["Exhaust_OCV_Duty_Right", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Exhaust_OCV_Duty_Right, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Exhaust_OCV_Duty_Right, t)}],
    ["Exhaust_OCV_Duty_Left", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Exhaust_OCV_Duty_Left, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Exhaust_OCV_Duty_Left, t)}],
    ["Exhaust_OCV_Current_Right", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Exhaust_OCV_Current_Right, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Exhaust_OCV_Current_Right, t)}],
    ["Exhaust_OCV_Current_Left", {CodeRegisterFunction : (w, r) => w.SSMWS.ParameterCodeList.push({code : SSMParameterCode.Exhaust_OCV_Current_Left, readmode :r}), ValueGetFunction : (w, t) => w.SSMWS.getVal(SSMParameterCode.Exhaust_OCV_Current_Left, t)}],   
]);

export const DefaultArduinoMap = new Map<WebsocketParameterCode, WebsocketClientMapEntry>([
    ["Engine_Speed", {CodeRegisterFunction : (w) => w.ArduinoWS.ParameterCodeList.push(ArduinoParameterCode.Engine_Speed), ValueGetFunction : (w, t) => w.ArduinoWS.getVal(ArduinoParameterCode.Engine_Speed, t)}],
    ["Vehicle_Speed", {CodeRegisterFunction : (w) => w.ArduinoWS.ParameterCodeList.push(ArduinoParameterCode.Vehicle_Speed), ValueGetFunction : (w, t) => w.ArduinoWS.getVal(ArduinoParameterCode.Vehicle_Speed, t)}],
    ["Manifold_Absolute_Pressure", {CodeRegisterFunction : (w) => w.ArduinoWS.ParameterCodeList.push(ArduinoParameterCode.Manifold_Absolute_Pressure), ValueGetFunction : (w, t) => w.ArduinoWS.getVal(ArduinoParameterCode.Manifold_Absolute_Pressure, t)}],
    ["Coolant_Temperature", {CodeRegisterFunction : (w) => w.ArduinoWS.ParameterCodeList.push(ArduinoParameterCode.Coolant_Temperature), ValueGetFunction : (w, t) => w.ArduinoWS.getVal(ArduinoParameterCode.Coolant_Temperature, t)}],
    ["Engine_oil_temperature", {CodeRegisterFunction : (w) => w.ArduinoWS.ParameterCodeList.push(ArduinoParameterCode.Oil_Temperature), ValueGetFunction : (w, t) => w.ArduinoWS.getVal(ArduinoParameterCode.Oil_Temperature, t)}],
    ["Oil_Temperature2", {CodeRegisterFunction : (w) => w.ArduinoWS.ParameterCodeList.push(ArduinoParameterCode.Oil_Temperature2), ValueGetFunction : (w, t) => w.ArduinoWS.getVal(ArduinoParameterCode.Oil_Temperature2, t)}],
    ["Oil_Pressure", {CodeRegisterFunction : (w) => w.ArduinoWS.ParameterCodeList.push(ArduinoParameterCode.Oil_Pressure), ValueGetFunction : (w, t) => w.ArduinoWS.getVal(ArduinoParameterCode.Oil_Pressure, t)}],
    ["Fuel_Rail_Pressure", {CodeRegisterFunction : (w) => w.ArduinoWS.ParameterCodeList.push(ArduinoParameterCode.Fuel_Rail_Pressure), ValueGetFunction : (w, t) => w.ArduinoWS.getVal(ArduinoParameterCode.Fuel_Rail_Pressure, t)}]   
]);

export const DefaultDefiMap = new Map<WebsocketParameterCode, WebsocketClientMapEntry>([
    ["Manifold_Absolute_Pressure", {CodeRegisterFunction : (w) => w.DefiWS.ParameterCodeList.push(DefiParameterCode.Manifold_Absolute_Pressure), ValueGetFunction : (w, t) => w.DefiWS.getVal(DefiParameterCode.Manifold_Absolute_Pressure, t)}],
    ["Engine_Speed", {CodeRegisterFunction : (w) => w.DefiWS.ParameterCodeList.push(DefiParameterCode.Engine_Speed), ValueGetFunction : (w, t) => w.DefiWS.getVal(DefiParameterCode.Engine_Speed, t)}],
    ["Oil_Pressure", {CodeRegisterFunction : (w) => w.DefiWS.ParameterCodeList.push(DefiParameterCode.Oil_Pressure), ValueGetFunction : (w, t) => w.DefiWS.getVal(DefiParameterCode.Oil_Pressure, t)}],
    ["Fuel_Rail_Pressure", {CodeRegisterFunction : (w) => w.DefiWS.ParameterCodeList.push(DefiParameterCode.Fuel_Rail_Pressure), ValueGetFunction : (w, t) => w.DefiWS.getVal(DefiParameterCode.Fuel_Rail_Pressure, t)}],
    ["Exhaust_Gas_Temperature", {CodeRegisterFunction : (w) => w.DefiWS.ParameterCodeList.push(DefiParameterCode.Exhaust_Gas_Temperature), ValueGetFunction : (w, t) => w.DefiWS.getVal(DefiParameterCode.Exhaust_Gas_Temperature, t)}],
    ["Engine_oil_temperature", {CodeRegisterFunction : (w) => w.DefiWS.ParameterCodeList.push(DefiParameterCode.Oil_Temperature), ValueGetFunction : (w, t) => w.DefiWS.getVal(DefiParameterCode.Oil_Temperature, t)}],
    ["Coolant_Temperature", {CodeRegisterFunction : (w) => w.DefiWS.ParameterCodeList.push(DefiParameterCode.Coolant_Temperature), ValueGetFunction : (w, t) => w.DefiWS.getVal(DefiParameterCode.Coolant_Temperature, t)}],
]);

export const SSMMapReplaceRPMAndBoostWithDefiMap = function() : Map<WebsocketParameterCode, WebsocketClientMapEntry>
{
    const ssmMap = new Map(DefaultSSMMap);
    ssmMap.set("Engine_Speed", {CodeRegisterFunction : (w) => w.DefiWS.ParameterCodeList.push(DefiParameterCode.Engine_Speed), ValueGetFunction : (w, t) => w.DefiWS.getVal(DefiParameterCode.Engine_Speed, t)});
    ssmMap.set("Manifold_Absolute_Pressure", {CodeRegisterFunction : (w) => w.ArduinoWS.ParameterCodeList.push(ArduinoParameterCode.Manifold_Absolute_Pressure), ValueGetFunction : (w, t) => w.ArduinoWS.getVal(ArduinoParameterCode.Manifold_Absolute_Pressure, t)});

    return ssmMap;
}

export const ELM327MapReplaceRPMAndBoost = function() : Map<WebsocketParameterCode, WebsocketClientMapEntry>
{
    const elm327Map = new Map(DefaultELM327Map);
    elm327Map.set("Engine_Speed", {CodeRegisterFunction : (w) => w.ArduinoWS.ParameterCodeList.push(ArduinoParameterCode.Engine_Speed), ValueGetFunction : (w, t) => w.ArduinoWS.getVal(ArduinoParameterCode.Engine_Speed, t)});
    elm327Map.set("Manifold_Absolute_Pressure", {CodeRegisterFunction : (w) => w.ArduinoWS.ParameterCodeList.push(ArduinoParameterCode.Manifold_Absolute_Pressure), ValueGetFunction : (w, t) => w.ArduinoWS.getVal(ArduinoParameterCode.Manifold_Absolute_Pressure, t)});

    return elm327Map;
}