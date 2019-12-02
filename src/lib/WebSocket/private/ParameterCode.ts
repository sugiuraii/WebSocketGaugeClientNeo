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

//Define string based enum of ParameterCode
export enum DefiParameterCode
{
    Manifold_Absolute_Pressure,
    Engine_Speed,
    Oil_Pressure,
    Fuel_Rail_Pressure,
    Exhaust_Gas_Temperature,
    Oil_Temperature,
    Coolant_Temperature
}

export enum ArduinoParameterCode
{
    Engine_Speed,
    Vehicle_Speed,
    Manifold_Absolute_Pressure,
    Coolant_Temperature,
    Oil_Temperature,
    Oil_Temperature2,
    Oil_Pressure,
    Fuel_Rail_Pressure
}

export enum SSMParameterCode
{
    Engine_Load,
    Coolant_Temperature,
    Air_Fuel_Correction_1,
    Air_Fuel_Learning_1,
    Air_Fuel_Correction_2,
    Air_Fuel_Learning_2,
    Manifold_Absolute_Pressure,
    Engine_Speed,
    Vehicle_Speed,
    Ignition_Timing,
    Intake_Air_Temperature,
    Mass_Air_Flow,
    Throttle_Opening_Angle,
    Front_O2_Sensor_1,
    Rear_O2_Sensor,
    Front_O2_Sensor_2,
    Battery_Voltage,
    Air_Flow_Sensor_Voltage,
    Throttle_Sensor_Voltage,
    Differential_Pressure_Sensor_Voltage,
    Fuel_Injection_1_Pulse_Width,
    Fuel_Injection_2_Pulse_Width,
    Knock_Correction,
    Atmospheric_Pressure,
    Manifold_Relative_Pressure,
    Pressure_Differential_Sensor,
    Fuel_Tank_Pressure,
    CO_Adjustment,
    Learned_Ignition_Timing,
    Accelerator_Opening_Angle,
    Fuel_Temperature,
    Front_O2_Heater_1,
    Rear_O2_Heater_Current,
    Front_O2_Heater_2,
    Fuel_Level,
    Primary_Wastegate_Duty_Cycle,
    Secondary_Wastegate_Duty_Cycle,
    CPC_Valve_Duty_Ratio,
    Tumble_Valve_Position_Sensor_Right,
    Tumble_Valve_Position_Sensor_Left,
    Idle_Speed_Control_Valve_Duty_Ratio,
    Air_Fuel_Lean_Correction,
    Air_Fuel_Heater_Duty,
    Idle_Speed_Control_Valve_Step,
    Number_of_Ex_Gas_Recirc_Steps,
    Alternator_Duty,
    Fuel_Pump_Duty,
    Intake_VVT_Advance_Angle_Right,
    Intake_VVT_Advance_Angle_Left,
    Intake_OCV_Duty_Right,
    Intake_OCV_Duty_Left,
    Intake_OCV_Current_Right,
    Intake_OCV_Current_Left,
    Air_Fuel_Sensor_1_Current,
    Air_Fuel_Sensor_2_Current,
    Air_Fuel_Sensor_1_Resistance,
    Air_Fuel_Sensor_2_Resistance,
    Air_Fuel_Sensor_1,
    Air_Fuel_Sensor_2,
    Gear_Position,
    A_F_Sensor_1_Heater_Current,
    A_F_Sensor_2_Heater_Current,
    Roughness_Monitor_Cylinder_1,
    Roughness_Monitor_Cylinder_2,
    Air_Fuel_Correction_3,
    Air_Fuel_Learning_3,
    Rear_O2_Heater_Voltage,
    Air_Fuel_Adjustment_Voltage,
    Roughness_Monitor_Cylinder_3,
    Roughness_Monitor_Cylinder_4,
    Throttle_Motor_Duty,
    Throttle_Motor_Voltage,
    Sub_Throttle_Sensor,
    Main_Throttle_Sensor,
    Sub_Accelerator_Sensor,
    Main_Accelerator_Sensor,
    Brake_Booster_Pressure,
    Fuel_Rail_Pressure,
    Exhaust_Gas_Temperature,
    Cold_Start_Injector,
    SCV_Step,
    Memorised_Cruise_Speed,
    Exhaust_VVT_Advance_Angle_Right,
    Exhaust_VVT_Advance_Angle_Left,
    Exhaust_OCV_Duty_Right,
    Exhaust_OCV_Duty_Left,
    Exhaust_OCV_Current_Right,
    Exhaust_OCV_Current_Left,
    Switch_P0x061,
    Switch_P0x062,
    Switch_P0x063,
    Switch_P0x064,
    Switch_P0x065,
    Switch_P0x066,
    Switch_P0x067,
    Switch_P0x068,
    Switch_P0x069,
    Switch_P0x120,
    Switch_P0x121
}

export namespace SSMSwitchCode
{
    export function getNumericCodeFromSwitchCode(switchCode : SSMSwitchCode) : SSMParameterCode
    {
        switch(switchCode){
            case SSMSwitchCode.AT_Vehicle_ID: 
            case SSMSwitchCode.Test_Mode_Connector: 
            case SSMSwitchCode.Read_Memory_Connector: 
                return SSMParameterCode.Switch_P0x061;

            case SSMSwitchCode.Neutral_Position_Switch: 
            case SSMSwitchCode.Idle_Switch: 
            case SSMSwitchCode.Intercooler_AutoWash_Switch: 
            case SSMSwitchCode.Ignition_Switch: 
            case SSMSwitchCode.Power_Steering_Switch: 
            case SSMSwitchCode.Air_Conditioning_Switch: 
                return SSMParameterCode.Switch_P0x062;

            case SSMSwitchCode.Handle_Switch: 
            case SSMSwitchCode.Starter_Switch: 
            case SSMSwitchCode.Front_O2_Rich_Signal: 
            case SSMSwitchCode.Rear_O2_Rich_Signal: 
            case SSMSwitchCode.Front_O2_2_Rich_Signal: 
            case SSMSwitchCode.Knock_Signal_1: 
            case SSMSwitchCode.Knock_Signal_2: 
            case SSMSwitchCode.Electrical_Load_Signal: 
                return SSMParameterCode.Switch_P0x063;

            case SSMSwitchCode.Crank_Position_Sensor: 
            case SSMSwitchCode.Cam_Position_Sensor: 
            case SSMSwitchCode.Defogger_Switch: 
            case SSMSwitchCode.Blower_Switch: 
            case SSMSwitchCode.Interior_Light_Switch: 
            case SSMSwitchCode.Wiper_Switch: 
            case SSMSwitchCode.AirCon_Lock_Signal: 
            case SSMSwitchCode.AirCon_Mid_Pressure_Switch: 
                return SSMParameterCode.Switch_P0x064;

            case SSMSwitchCode.AirCon_Compressor_Signal: 
            case SSMSwitchCode.Radiator_Fan_Relay_3: 
            case SSMSwitchCode.Radiator_Fan_Relay_1: 
            case SSMSwitchCode.Radiator_Fan_Relay_2: 
            case SSMSwitchCode.Fuel_Pump_Relay: 
            case SSMSwitchCode.Intercooler_AutoWash_Relay: 
            case SSMSwitchCode.CPC_Solenoid_Valve: 
            case SSMSwitchCode.BlowBy_Leak_Connector:
                return SSMParameterCode.Switch_P0x065;

            case SSMSwitchCode.PCV_Solenoid_Valve: 
            case SSMSwitchCode.TGV_Output: 
            case SSMSwitchCode.TGV_Drive: 
            case SSMSwitchCode.Variable_Intake_Air_Solenoid: 
            case SSMSwitchCode.Pressure_Sources_Change: 
            case SSMSwitchCode.Vent_Solenoid_Valve: 
            case SSMSwitchCode.P_S_Solenoid_Valve: 
            case SSMSwitchCode.Assist_Air_Solenoid_Valve: 
                return SSMParameterCode.Switch_P0x066;

            case SSMSwitchCode.Tank_Sensor_Control_Valve: 
            case SSMSwitchCode.Relief_Valve_Solenoid_1: 
            case SSMSwitchCode.Relief_Valve_Solenoid_2: 
            case SSMSwitchCode.TCS_Relief_Valve_Solenoid: 
            case SSMSwitchCode.Ex_Gas_Positive_Pressure: 
            case SSMSwitchCode.Ex_Gas_Negative_Pressure: 
            case SSMSwitchCode.Intake_Air_Solenoid: 
            case SSMSwitchCode.Muffler_Control: 
                return SSMParameterCode.Switch_P0x067;

            case SSMSwitchCode.Retard_Signal_from_AT: 
            case SSMSwitchCode.Fuel_Cut_Signal_from_AT: 
            case SSMSwitchCode.Ban_of_Torque_Down: 
            case SSMSwitchCode.Request_Torque_Down_VDC: 
                return SSMParameterCode.Switch_P0x068;

            case SSMSwitchCode.Torque_Control_Signal_1: 
            case SSMSwitchCode.Torque_Control_Signal_2: 
            case SSMSwitchCode.Torque_Permission_Signal: 
            case SSMSwitchCode.EAM_Signal: 
            case SSMSwitchCode.AT_coop_lock_up_signal: 
            case SSMSwitchCode.AT_coop_lean_burn_signal: 
            case SSMSwitchCode.AT_coop_rich_spike_signal: 
            case SSMSwitchCode.AET_Signal: 
                return SSMParameterCode.Switch_P0x069;

            case SSMSwitchCode.ETC_Motor_Relay: 
                return SSMParameterCode.Switch_P0x120;

            case SSMSwitchCode.Clutch_Switch: 
            case SSMSwitchCode.Stop_Light_Switch: 
            case SSMSwitchCode.Set_Coast_Switch: 
            case SSMSwitchCode.Rsume_Accelerate_Switch: 
            case SSMSwitchCode.Brake_Switch: 
            case SSMSwitchCode.Accelerator_Switch:
                return SSMParameterCode.Switch_P0x121;
 
            default :
                throw Error("Error_Switch_Code_Not_Match");
        }
    }
}

export enum SSMSwitchCode
{
    AT_Vehicle_ID,
    Test_Mode_Connector,
    Read_Memory_Connector,
    Neutral_Position_Switch,
    Idle_Switch,
    Intercooler_AutoWash_Switch,
    Ignition_Switch,
    Power_Steering_Switch,
    Air_Conditioning_Switch,
    Handle_Switch,
    Starter_Switch,
    Front_O2_Rich_Signal,
    Rear_O2_Rich_Signal,
    Front_O2_2_Rich_Signal,
    Knock_Signal_1,
    Knock_Signal_2,
    Electrical_Load_Signal,
    Crank_Position_Sensor,
    Cam_Position_Sensor,
    Defogger_Switch,
    Blower_Switch,
    Interior_Light_Switch,
    Wiper_Switch,
    AirCon_Lock_Signal,
    AirCon_Mid_Pressure_Switch,
    AirCon_Compressor_Signal,
    Radiator_Fan_Relay_3,
    Radiator_Fan_Relay_1,
    Radiator_Fan_Relay_2,
    Fuel_Pump_Relay,
    Intercooler_AutoWash_Relay,
    CPC_Solenoid_Valve,
    BlowBy_Leak_Connector,
    PCV_Solenoid_Valve,
    TGV_Output,
    TGV_Drive,
    Variable_Intake_Air_Solenoid,
    Pressure_Sources_Change,
    Vent_Solenoid_Valve,
    P_S_Solenoid_Valve,
    Assist_Air_Solenoid_Valve,
    Tank_Sensor_Control_Valve,
    Relief_Valve_Solenoid_1,
    Relief_Valve_Solenoid_2,
    TCS_Relief_Valve_Solenoid,
    Ex_Gas_Positive_Pressure,
    Ex_Gas_Negative_Pressure,
    Intake_Air_Solenoid,
    Muffler_Control,
    Retard_Signal_from_AT,
    Fuel_Cut_Signal_from_AT,
    Ban_of_Torque_Down,
    Request_Torque_Down_VDC,
    Torque_Control_Signal_1,
    Torque_Control_Signal_2,
    Torque_Permission_Signal,
    EAM_Signal,
    AT_coop_lock_up_signal,
    AT_coop_lean_burn_signal,
    AT_coop_rich_spike_signal,
    AET_Signal,
    ETC_Motor_Relay,
    Clutch_Switch,
    Stop_Light_Switch,
    Set_Coast_Switch,
    Rsume_Accelerate_Switch,
    Brake_Switch,
    Accelerator_Switch
}

export enum OBDIIParameterCode
{
    Engine_Load,
    Coolant_Temperature,
    Air_Fuel_Correction_1,
    Air_Fuel_Learning_1,
    Air_Fuel_Correction_2,
    Air_Fuel_Learning_2,
    Fuel_Tank_Pressure,
    Manifold_Absolute_Pressure,
    Engine_Speed,
    Vehicle_Speed,
    Ignition_Timing,
    Intake_Air_Temperature,
    Mass_Air_Flow,
    Throttle_Opening_Angle,
    Run_time_since_engine_start,
    Distance_traveled_with_MIL_on,
    Fuel_Rail_Pressure,
    Fuel_Rail_Pressure_diesel,
    Commanded_EGR,
    EGR_Error,
    Commanded_evaporative_purge,
    Fuel_Level_Input,
    Number_of_warmups_since_codes_cleared,
    Distance_traveled_since_codes_cleared,
    Evap_System_Vapor_Pressure,
    Atmospheric_Pressure,
    Catalyst_TemperatureBank_1_Sensor_1,
    Catalyst_TemperatureBank_2_Sensor_1,
    Catalyst_TemperatureBank_1_Sensor_2,
    Catalyst_TemperatureBank_2_Sensor_2,
    Battery_Voltage,
    Absolute_load_value,
    Command_equivalence_ratio,
    Relative_throttle_position,
    Ambient_air_temperature,
    Absolute_throttle_position_B,
    Absolute_throttle_position_C,
    Accelerator_pedal_position_D,
    Accelerator_pedal_position_E,
    Accelerator_pedal_position_F,
    Commanded_throttle_actuator,
    Time_run_with_MIL_on,
    Time_since_trouble_codes_cleared,
    Ethanol_fuel_percent,
    // Added on 2018/01/07
    O2Sensor_1_Air_Fuel_Correction,
    O2Sensor_2_Air_Fuel_Correction,
    O2Sensor_3_Air_Fuel_Correction,
    O2Sensor_4_Air_Fuel_Correction,
    O2Sensor_5_Air_Fuel_Correction,
    O2Sensor_6_Air_Fuel_Correction,
    O2Sensor_7_Air_Fuel_Correction,
    O2Sensor_8_Air_Fuel_Correction,
    O2Sensor_1_Air_Fuel_Ratio,
    O2Sensor_2_Air_Fuel_Ratio,
    O2Sensor_3_Air_Fuel_Ratio,
    O2Sensor_4_Air_Fuel_Ratio,
    O2Sensor_5_Air_Fuel_Ratio,
    O2Sensor_6_Air_Fuel_Ratio,
    O2Sensor_7_Air_Fuel_Ratio,
    O2Sensor_8_Air_Fuel_Ratio,
    Evap_system_vapor_pressure,
    Fuel_rail_absolute_pressure,
    Relative_accelerator_pedal_position,
    Hybrid_battery_pack_remaining_life,
    Engine_oil_temperature,
    Fuel_injection_timing,
    Engine_fuel_rate,
    Driver_demand_engine_percent_torque,
    Actual_engine_percent_torque,
    Engine_reference_torque
}

export enum ReadModeCode
{
    SLOW,
    FAST,
    SLOWandFAST
}



