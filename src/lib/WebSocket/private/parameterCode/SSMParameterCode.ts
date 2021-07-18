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

export const SSMParameterCode =
    {
        Engine_Load: "Engine_Load",
        Coolant_Temperature: "Coolant_Temperature",
        Air_Fuel_Correction_1: "Air_Fuel_Correction_1",
        Air_Fuel_Learning_1: "Air_Fuel_Learning_1",
        Air_Fuel_Correction_2: "Air_Fuel_Correction_2",
        Air_Fuel_Learning_2: "Air_Fuel_Learning_2",
        Manifold_Absolute_Pressure: "Manifold_Absolute_Pressure",
        Engine_Speed: "Engine_Speed",
        Vehicle_Speed: "Vehicle_Speed",
        Ignition_Timing: "Ignition_Timing",
        Intake_Air_Temperature: "Intake_Air_Temperature",
        Mass_Air_Flow: "Mass_Air_Flow",
        Throttle_Opening_Angle: "Throttle_Opening_Angle",
        Front_O2_Sensor_1: "Front_O2_Sensor_1",
        Rear_O2_Sensor: "Rear_O2_Sensor",
        Front_O2_Sensor_2: "Front_O2_Sensor_2",
        Battery_Voltage: "Battery_Voltage",
        Air_Flow_Sensor_Voltage: "Air_Flow_Sensor_Voltage",
        Throttle_Sensor_Voltage: "Throttle_Sensor_Voltage",
        Differential_Pressure_Sensor_Voltage: "Differential_Pressure_Sensor_Voltage",
        Fuel_Injection_1_Pulse_Width: "Fuel_Injection_1_Pulse_Width",
        Fuel_Injection_2_Pulse_Width: "Fuel_Injection_2_Pulse_Width",
        Knock_Correction: "Knock_Correction",
        Atmospheric_Pressure: "Atmospheric_Pressure",
        Manifold_Relative_Pressure: "Manifold_Relative_Pressure",
        Pressure_Differential_Sensor: "Pressure_Differential_Sensor",
        Fuel_Tank_Pressure: "Fuel_Tank_Pressure",
        CO_Adjustment: "CO_Adjustment",
        Learned_Ignition_Timing: "Learned_Ignition_Timing",
        Accelerator_Opening_Angle: "Accelerator_Opening_Angle",
        Fuel_Temperature: "Fuel_Temperature",
        Front_O2_Heater_1: "Front_O2_Heater_1",
        Rear_O2_Heater_Current: "Rear_O2_Heater_Current",
        Front_O2_Heater_2: "Front_O2_Heater_2",
        Fuel_Level: "Fuel_Level",
        Primary_Wastegate_Duty_Cycle: "Primary_Wastegate_Duty_Cycle",
        Secondary_Wastegate_Duty_Cycle: "Secondary_Wastegate_Duty_Cycle",
        CPC_Valve_Duty_Ratio: "CPC_Valve_Duty_Ratio",
        Tumble_Valve_Position_Sensor_Right: "Tumble_Valve_Position_Sensor_Right",
        Tumble_Valve_Position_Sensor_Left: "Tumble_Valve_Position_Sensor_Left",
        Idle_Speed_Control_Valve_Duty_Ratio: "Idle_Speed_Control_Valve_Duty_Ratio",
        Air_Fuel_Lean_Correction: "Air_Fuel_Lean_Correction",
        Air_Fuel_Heater_Duty: "Air_Fuel_Heater_Duty",
        Idle_Speed_Control_Valve_Step: "Idle_Speed_Control_Valve_Step",
        Number_of_Ex_Gas_Recirc_Steps: "Number_of_Ex_Gas_Recirc_Steps",
        Alternator_Duty: "Alternator_Duty",
        Fuel_Pump_Duty: "Fuel_Pump_Duty",
        Intake_VVT_Advance_Angle_Right: "Intake_VVT_Advance_Angle_Right",
        Intake_VVT_Advance_Angle_Left: "Intake_VVT_Advance_Angle_Left",
        Intake_OCV_Duty_Right: "Intake_OCV_Duty_Right",
        Intake_OCV_Duty_Left: "Intake_OCV_Duty_Left",
        Intake_OCV_Current_Right: "Intake_OCV_Current_Right",
        Intake_OCV_Current_Left: "Intake_OCV_Current_Left",
        Air_Fuel_Sensor_1_Current: "Air_Fuel_Sensor_1_Current",
        Air_Fuel_Sensor_2_Current: "Air_Fuel_Sensor_2_Current",
        Air_Fuel_Sensor_1_Resistance: "Air_Fuel_Sensor_1_Resistance",
        Air_Fuel_Sensor_2_Resistance: "Air_Fuel_Sensor_2_Resistance",
        Air_Fuel_Sensor_1: "Air_Fuel_Sensor_1",
        Air_Fuel_Sensor_2: "Air_Fuel_Sensor_2",
        Gear_Position: "Gear_Position",
        A_F_Sensor_1_Heater_Current: "A_F_Sensor_1_Heater_Current",
        A_F_Sensor_2_Heater_Current: "A_F_Sensor_2_Heater_Current",
        Roughness_Monitor_Cylinder_1: "Roughness_Monitor_Cylinder_1",
        Roughness_Monitor_Cylinder_2: "Roughness_Monitor_Cylinder_2",
        Air_Fuel_Correction_3: "Air_Fuel_Correction_3",
        Air_Fuel_Learning_3: "Air_Fuel_Learning_3",
        Rear_O2_Heater_Voltage: "Rear_O2_Heater_Voltage",
        Air_Fuel_Adjustment_Voltage: "Air_Fuel_Adjustment_Voltage",
        Roughness_Monitor_Cylinder_3: "Roughness_Monitor_Cylinder_3",
        Roughness_Monitor_Cylinder_4: "Roughness_Monitor_Cylinder_4",
        Throttle_Motor_Duty: "Throttle_Motor_Duty",
        Throttle_Motor_Voltage: "Throttle_Motor_Voltage",
        Sub_Throttle_Sensor: "Sub_Throttle_Sensor",
        Main_Throttle_Sensor: "Main_Throttle_Sensor",
        Sub_Accelerator_Sensor: "Sub_Accelerator_Sensor",
        Main_Accelerator_Sensor: "Main_Accelerator_Sensor",
        Brake_Booster_Pressure: "Brake_Booster_Pressure",
        Fuel_Rail_Pressure: "Fuel_Rail_Pressure",
        Exhaust_Gas_Temperature: "Exhaust_Gas_Temperature",
        Cold_Start_Injector: "Cold_Start_Injector",
        SCV_Step: "SCV_Step",
        Memorised_Cruise_Speed: "Memorised_Cruise_Speed",
        Exhaust_VVT_Advance_Angle_Right: "Exhaust_VVT_Advance_Angle_Right",
        Exhaust_VVT_Advance_Angle_Left: "Exhaust_VVT_Advance_Angle_Left",
        Exhaust_OCV_Duty_Right: "Exhaust_OCV_Duty_Right",
        Exhaust_OCV_Duty_Left: "Exhaust_OCV_Duty_Left",
        Exhaust_OCV_Current_Right: "Exhaust_OCV_Current_Right",
        Exhaust_OCV_Current_Left: "Exhaust_OCV_Current_Left",
        Switch_P0x061: "Switch_P0x061",
        Switch_P0x062: "Switch_P0x062",
        Switch_P0x063: "Switch_P0x063",
        Switch_P0x064: "Switch_P0x064",
        Switch_P0x065: "Switch_P0x065",
        Switch_P0x066: "Switch_P0x066",
        Switch_P0x067: "Switch_P0x067",
        Switch_P0x068: "Switch_P0x068",
        Switch_P0x069: "Switch_P0x069",
        Switch_P0x120: "Switch_P0x120",
        Switch_P0x121: "Switch_P0x121"
    } as const;

export type SSMParameterCode = typeof SSMParameterCode[keyof typeof SSMParameterCode];


