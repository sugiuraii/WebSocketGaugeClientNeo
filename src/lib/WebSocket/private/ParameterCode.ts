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

export namespace SSMParameterCode
{
    export const Engine_Load = "Engine_Load";
    export const Coolant_Temperature = "Coolant_Temperature";
    export const Air_Fuel_Correction_1 = "Air_Fuel_Correction_1";
    export const Air_Fuel_Learning_1 = "Air_Fuel_Learning_1";
    export const Air_Fuel_Correction_2 = "Air_Fuel_Correction_2";
    export const Air_Fuel_Learning_2 = "Air_Fuel_Learning_2";
    export const Manifold_Absolute_Pressure = "Manifold_Absolute_Pressure";
    export const Engine_Speed = "Engine_Speed";
    export const Vehicle_Speed = "Vehicle_Speed";
    export const Ignition_Timing = "Ignition_Timing";
    export const Intake_Air_Temperature = "Intake_Air_Temperature";
    export const Mass_Air_Flow = "Mass_Air_Flow";
    export const Throttle_Opening_Angle = "Throttle_Opening_Angle";
    export const Front_O2_Sensor_1 = "Front_O2_Sensor_1";
    export const Rear_O2_Sensor = "Rear_O2_Sensor";
    export const Front_O2_Sensor_2 = "Front_O2_Sensor_2";
    export const Battery_Voltage = "Battery_Voltage";
    export const Air_Flow_Sensor_Voltage = "Air_Flow_Sensor_Voltage";
    export const Throttle_Sensor_Voltage = "Throttle_Sensor_Voltage";
    export const Differential_Pressure_Sensor_Voltage = "Differential_Pressure_Sensor_Voltage";
    export const Fuel_Injection_1_Pulse_Width = "Fuel_Injection_1_Pulse_Width";
    export const Fuel_Injection_2_Pulse_Width = "Fuel_Injection_2_Pulse_Width";
    export const Knock_Correction = "Knock_Correction";
    export const Atmospheric_Pressure = "Atmospheric_Pressure";
    export const Manifold_Relative_Pressure = "Manifold_Relative_Pressure";
    export const Pressure_Differential_Sensor = "Pressure_Differential_Sensor";
    export const Fuel_Tank_Pressure = "Fuel_Tank_Pressure";
    export const CO_Adjustment = "CO_Adjustment";
    export const Learned_Ignition_Timing = "Learned_Ignition_Timing";
    export const Accelerator_Opening_Angle = "Accelerator_Opening_Angle";
    export const Fuel_Temperature = "Fuel_Temperature";
    export const Front_O2_Heater_1 = "Front_O2_Heater_1";
    export const Rear_O2_Heater_Current = "Rear_O2_Heater_Current";
    export const Front_O2_Heater_2 = "Front_O2_Heater_2";
    export const Fuel_Level = "Fuel_Level";
    export const Primary_Wastegate_Duty_Cycle = "Primary_Wastegate_Duty_Cycle";
    export const Secondary_Wastegate_Duty_Cycle = "Secondary_Wastegate_Duty_Cycle";
    export const CPC_Valve_Duty_Ratio = "CPC_Valve_Duty_Ratio";
    export const Tumble_Valve_Position_Sensor_Right = "Tumble_Valve_Position_Sensor_Right";
    export const Tumble_Valve_Position_Sensor_Left = "Tumble_Valve_Position_Sensor_Left";
    export const Idle_Speed_Control_Valve_Duty_Ratio = "Idle_Speed_Control_Valve_Duty_Ratio";
    export const Air_Fuel_Lean_Correction = "Air_Fuel_Lean_Correction";
    export const Air_Fuel_Heater_Duty = "Air_Fuel_Heater_Duty";
    export const Idle_Speed_Control_Valve_Step = "Idle_Speed_Control_Valve_Step";
    export const Number_of_Ex_Gas_Recirc_Steps = "Number_of_Ex_Gas_Recirc_Steps";
    export const Alternator_Duty = "Alternator_Duty";
    export const Fuel_Pump_Duty = "Fuel_Pump_Duty";
    export const Intake_VVT_Advance_Angle_Right = "Intake_VVT_Advance_Angle_Right";
    export const Intake_VVT_Advance_Angle_Left = "Intake_VVT_Advance_Angle_Left";
    export const Intake_OCV_Duty_Right = "Intake_OCV_Duty_Right";
    export const Intake_OCV_Duty_Left = "Intake_OCV_Duty_Left";
    export const Intake_OCV_Current_Right = "Intake_OCV_Current_Right";
    export const Intake_OCV_Current_Left = "Intake_OCV_Current_Left";
    export const Air_Fuel_Sensor_1_Current = "Air_Fuel_Sensor_1_Current";
    export const Air_Fuel_Sensor_2_Current = "Air_Fuel_Sensor_2_Current";
    export const Air_Fuel_Sensor_1_Resistance = "Air_Fuel_Sensor_1_Resistance";
    export const Air_Fuel_Sensor_2_Resistance = "Air_Fuel_Sensor_2_Resistance";
    export const Air_Fuel_Sensor_1 = "Air_Fuel_Sensor_1";
    export const Air_Fuel_Sensor_2 = "Air_Fuel_Sensor_2";
    export const Gear_Position = "Gear_Position";
    export const A_F_Sensor_1_Heater_Current = "A_F_Sensor_1_Heater_Current";
    export const A_F_Sensor_2_Heater_Current = "A_F_Sensor_2_Heater_Current";
    export const Roughness_Monitor_Cylinder_1 = "Roughness_Monitor_Cylinder_1";
    export const Roughness_Monitor_Cylinder_2 = "Roughness_Monitor_Cylinder_2";
    export const Air_Fuel_Correction_3 = "Air_Fuel_Correction_3";
    export const Air_Fuel_Learning_3 = "Air_Fuel_Learning_3";
    export const Rear_O2_Heater_Voltage = "Rear_O2_Heater_Voltage";
    export const Air_Fuel_Adjustment_Voltage = "Air_Fuel_Adjustment_Voltage";
    export const Roughness_Monitor_Cylinder_3 = "Roughness_Monitor_Cylinder_3";
    export const Roughness_Monitor_Cylinder_4 = "Roughness_Monitor_Cylinder_4";
    export const Throttle_Motor_Duty = "Throttle_Motor_Duty";
    export const Throttle_Motor_Voltage = "Throttle_Motor_Voltage";
    export const Sub_Throttle_Sensor = "Sub_Throttle_Sensor";
    export const Main_Throttle_Sensor = "Main_Throttle_Sensor";
    export const Sub_Accelerator_Sensor = "Sub_Accelerator_Sensor";
    export const Main_Accelerator_Sensor = "Main_Accelerator_Sensor";
    export const Brake_Booster_Pressure = "Brake_Booster_Pressure";
    export const Fuel_Rail_Pressure = "Fuel_Rail_Pressure";
    export const Exhaust_Gas_Temperature = "Exhaust_Gas_Temperature";
    export const Cold_Start_Injector = "Cold_Start_Injector";
    export const SCV_Step = "SCV_Step";
    export const Memorised_Cruise_Speed = "Memorised_Cruise_Speed";
    export const Exhaust_VVT_Advance_Angle_Right = "Exhaust_VVT_Advance_Angle_Right";
    export const Exhaust_VVT_Advance_Angle_Left = "Exhaust_VVT_Advance_Angle_Left";
    export const Exhaust_OCV_Duty_Right = "Exhaust_OCV_Duty_Right";
    export const Exhaust_OCV_Duty_Left = "Exhaust_OCV_Duty_Left";
    export const Exhaust_OCV_Current_Right = "Exhaust_OCV_Current_Right";
    export const Exhaust_OCV_Current_Left = "Exhaust_OCV_Current_Left";
    export const Switch_P0x061 = "Switch_P0x061";
    export const Switch_P0x062 = "Switch_P0x062";
    export const Switch_P0x063 = "Switch_P0x063";
    export const Switch_P0x064 = "Switch_P0x064";
    export const Switch_P0x065 = "Switch_P0x065";
    export const Switch_P0x066 = "Switch_P0x066";
    export const Switch_P0x067 = "Switch_P0x067";
    export const Switch_P0x068 = "Switch_P0x068";
    export const Switch_P0x069 = "Switch_P0x069";
    export const Switch_P0x120 = "Switch_P0x120";
    export const Switch_P0x121 = "Switch_P0x121";
}

export namespace SSMSwitchCode
{
    export const AT_Vehicle_ID = "AT_Vehicle_ID";
    export const Test_Mode_Connector = "Test_Mode_Connector";
    export const Read_Memory_Connector = "Read_Memory_Connector";
    export const Neutral_Position_Switch = "Neutral_Position_Switch";
    export const Idle_Switch = "Idle_Switch";
    export const Intercooler_AutoWash_Switch = "Intercooler_AutoWash_Switch";
    export const Ignition_Switch = "Ignition_Switch";
    export const Power_Steering_Switch = "Power_Steering_Switch";
    export const Air_Conditioning_Switch = "Air_Conditioning_Switch";
    export const Handle_Switch = "Handle_Switch";
    export const Starter_Switch = "Starter_Switch";
    export const Front_O2_Rich_Signal = "Front_O2_Rich_Signal";
    export const Rear_O2_Rich_Signal = "Rear_O2_Rich_Signal";
    export const Front_O2_2_Rich_Signal = "Front_O2_2_Rich_Signal";
    export const Knock_Signal_1 = "Knock_Signal_1";
    export const Knock_Signal_2 = "Knock_Signal_2";
    export const Electrical_Load_Signal = "Electrical_Load_Signal";
    export const Crank_Position_Sensor = "Crank_Position_Sensor";
    export const Cam_Position_Sensor = "Cam_Position_Sensor";
    export const Defogger_Switch = "Defogger_Switch";
    export const Blower_Switch = "Blower_Switch";
    export const Interior_Light_Switch = "Interior_Light_Switch";
    export const Wiper_Switch = "Wiper_Switch";
    export const AirCon_Lock_Signal = "AirCon_Lock_Signal";
    export const AirCon_Mid_Pressure_Switch = "AirCon_Mid_Pressure_Switch";
    export const AirCon_Compressor_Signal = "AirCon_Compressor_Signal";
    export const Radiator_Fan_Relay_3 = "Radiator_Fan_Relay_3";
    export const Radiator_Fan_Relay_1 = "Radiator_Fan_Relay_1";
    export const Radiator_Fan_Relay_2 = "Radiator_Fan_Relay_2";
    export const Fuel_Pump_Relay = "Fuel_Pump_Relay";
    export const Intercooler_AutoWash_Relay = "Intercooler_AutoWash_Relay";
    export const CPC_Solenoid_Valve = "CPC_Solenoid_Valve";
    export const BlowBy_Leak_Connector = "BlowBy_Leak_Connector";
    export const PCV_Solenoid_Valve = "PCV_Solenoid_Valve";
    export const TGV_Output = "TGV_Output";
    export const TGV_Drive = "TGV_Drive";
    export const Variable_Intake_Air_Solenoid = "Variable_Intake_Air_Solenoid";
    export const Pressure_Sources_Change = "Pressure_Sources_Change";
    export const Vent_Solenoid_Valve = "Vent_Solenoid_Valve";
    export const P_S_Solenoid_Valve = "P_S_Solenoid_Valve";
    export const Assist_Air_Solenoid_Valve = "Assist_Air_Solenoid_Valve";
    export const Tank_Sensor_Control_Valve = "Tank_Sensor_Control_Valve";
    export const Relief_Valve_Solenoid_1 = "Relief_Valve_Solenoid_1";
    export const Relief_Valve_Solenoid_2 = "Relief_Valve_Solenoid_2";
    export const TCS_Relief_Valve_Solenoid = "TCS_Relief_Valve_Solenoid";
    export const Ex_Gas_Positive_Pressure = "Ex_Gas_Positive_Pressure";
    export const Ex_Gas_Negative_Pressure = "Ex_Gas_Negative_Pressure";
    export const Intake_Air_Solenoid = "Intake_Air_Solenoid";
    export const Muffler_Control = "Muffler_Control";
    export const Retard_Signal_from_AT = "Retard_Signal_from_AT";
    export const Fuel_Cut_Signal_from_AT = "Fuel_Cut_Signal_from_AT";
    export const Ban_of_Torque_Down = "Ban_of_Torque_Down";
    export const Request_Torque_Down_VDC = "Request_Torque_Down_VDC";
    export const Torque_Control_Signal_1 = "Torque_Control_Signal_1";
    export const Torque_Control_Signal_2 = "Torque_Control_Signal_2";
    export const Torque_Permission_Signal = "Torque_Permission_Signal";
    export const EAM_Signal = "EAM_Signal";
    export const AT_coop_lock_up_signal = "AT_coop_lock_up_signal";
    export const AT_coop_lean_burn_signal = "AT_coop_lean_burn_signal";
    export const AT_coop_rich_spike_signal = "AT_coop_rich_spike_signal";
    export const AET_Signal = "AET_Signal";
    export const ETC_Motor_Relay = "ETC_Motor_Relay";
    export const Clutch_Switch = "Clutch_Switch";
    export const Stop_Light_Switch = "Stop_Light_Switch";
    export const Set_Coast_Switch = "Set_Coast_Switch";
    export const Rsume_Accelerate_Switch = "Rsume_Accelerate_Switch";
    export const Brake_Switch = "Brake_Switch";
    export const Accelerator_Switch = "Accelerator_Switch";

    export function getNumericCodeFromSwitchCode(switchCode : string) : string
    {
        switch(switchCode){
            case "AT_Vehicle_ID" : 
            case "Test_Mode_Connector" : 
            case "Read_Memory_Connector" : 
                return "Switch_P0x061";

            case "Neutral_Position_Switch" : 
            case "Idle_Switch" : 
            case "Intercooler_AutoWash_Switch" : 
            case "Ignition_Switch" : 
            case "Power_Steering_Switch" : 
            case "Air_Conditioning_Switch" : 
                return "Switch_P0x062";

            case "Handle_Switch" : 
            case "Starter_Switch" : 
            case "Front_O2_Rich_Signal" : 
            case "Rear_O2_Rich_Signal" : 
            case "Front_O2_2_Rich_Signal" : 
            case "Knock_Signal_1" : 
            case "Knock_Signal_2" : 
            case "Electrical_Load_Signal" : 
                return "Switch_P0x063";

            case "Crank_Position_Sensor" : 
            case "Cam_Position_Sensor" : 
            case "Defogger_Switch" : 
            case "Blower_Switch" : 
            case "Interior_Light_Switch" : 
            case "Wiper_Switch" : 
            case "AirCon_Lock_Signal" : 
            case "AirCon_Mid_Pressure_Switch" : 
                return "Switch_P0x064";

            case "AirCon_Compressor_Signal" : 
            case "Radiator_Fan_Relay_3" : 
            case "Radiator_Fan_Relay_1" : 
            case "Radiator_Fan_Relay_2" : 
            case "Fuel_Pump_Relay" : 
            case "Intercooler_AutoWash_Relay" : 
            case "CPC_Solenoid_Valve" : 
            case "BlowBy_Leak_Connector" :
                return "Switch_P0x065";

            case "PCV_Solenoid_Valve" : 
            case "TGV_Output" : 
            case "TGV_Drive" : 
            case "Variable_Intake_Air_Solenoid" : 
            case "Pressure_Sources_Change" : 
            case "Vent_Solenoid_Valve" : 
            case "P_S_Solenoid_Valve" : 
            case "Assist_Air_Solenoid_Valve" : 
                return "Switch_P0x066";

            case "Tank_Sensor_Control_Valve" : 
            case "Relief_Valve_Solenoid_1" : 
            case "Relief_Valve_Solenoid_2" : 
            case "TCS_Relief_Valve_Solenoid" : 
            case "Ex_Gas_Positive_Pressure" : 
            case "Ex_Gas_Negative_Pressure" : 
            case "Intake_Air_Solenoid" : 
            case "Muffler_Control" : 
                return "Switch_P0x067";

            case "Retard_Signal_from_AT" : 
            case "Fuel_Cut_Signal_from_AT" : 
            case "Ban_of_Torque_Down" : 
            case "Request_Torque_Down_VDC" : 
                return "Switch_P0x068";

            case "Torque_Control_Signal_1" : 
            case "Torque_Control_Signal_2" : 
            case "Torque_Permission_Signal" : 
            case "EAM_Signal" : 
            case "AT_coop_lock_up_signal" : 
            case "AT_coop_lean_burn_signal" : 
            case "AT_coop_rich_spike_signal" : 
            case "AET_Signal" : 
                return "Switch_P0x069";

            case "ETC_Motor_Relay" : 
                return "Switch_P0x120";

            case "Clutch_Switch" : 
            case "Stop_Light_Switch" : 
            case "Set_Coast_Switch" : 
            case "Rsume_Accelerate_Switch" : 
            case "Brake_Switch" : 
            case "Accelerator_Switch" :
                return "Switch_P0x121";
 
            default :
                return "Error_Switch_Code_Not_Match";
        }
    }    
}

export namespace OBDIIParameterCode
{
    export const Engine_Load = "Engine_Load";
    export const Coolant_Temperature = "Coolant_Temperature";
    export const Air_Fuel_Correction_1 = "Air_Fuel_Correction_1";
    export const Air_Fuel_Learning_1 = "Air_Fuel_Learning_1";
    export const Air_Fuel_Correction_2 = "Air_Fuel_Correction_2";
    export const Air_Fuel_Learning_2 = "Air_Fuel_Learning_2";
    export const Fuel_Tank_Pressure = "Fuel_Tank_Pressure";
    export const Manifold_Absolute_Pressure = "Manifold_Absolute_Pressure";
    export const Engine_Speed = "Engine_Speed";
    export const Vehicle_Speed = "Vehicle_Speed";
    export const Ignition_Timing = "Ignition_Timing";
    export const Intake_Air_Temperature = "Intake_Air_Temperature";
    export const Mass_Air_Flow = "Mass_Air_Flow";
    export const Throttle_Opening_Angle = "Throttle_Opening_Angle";
    export const Run_time_since_engine_start = "Run_time_since_engine_start";
    export const Distance_traveled_with_MIL_on = "Distance_traveled_with_MIL_on";
    export const Fuel_Rail_Pressure = "Fuel_Rail_Pressure";
    export const Fuel_Rail_Pressure_diesel = "Fuel_Rail_Pressure_diesel";
    export const Commanded_EGR = "Commanded_EGR";
    export const EGR_Error = "EGR_Error";
    export const Commanded_evaporative_purge = "Commanded_evaporative_purge";
    export const Fuel_Level_Input = "Fuel_Level_Input";
    export const Number_of_warmups_since_codes_cleared = "Number_of_warmups_since_codes_cleared";
    export const Distance_traveled_since_codes_cleared = "Distance_traveled_since_codes_cleared";
    export const Evap_System_Vapor_Pressure = "Evap_System_Vapor_Pressure";
    export const Atmospheric_Pressure = "Atmospheric_Pressure";
    export const Catalyst_TemperatureBank_1_Sensor_1 = "Catalyst_TemperatureBank_1_Sensor_1";
    export const Catalyst_TemperatureBank_2_Sensor_1 = "Catalyst_TemperatureBank_2_Sensor_1";
    export const Catalyst_TemperatureBank_1_Sensor_2 = "Catalyst_TemperatureBank_1_Sensor_2";
    export const Catalyst_TemperatureBank_2_Sensor_2 = "Catalyst_TemperatureBank_2_Sensor_2";
    export const Battery_Voltage = "Battery_Voltage";
    export const Absolute_load_value = "Absolute_load_value";
    export const Command_equivalence_ratio = "Command_equivalence_ratio";
    export const Relative_throttle_position = "Relative_throttle_position";
    export const Ambient_air_temperature = "Ambient_air_temperature";
    export const Absolute_throttle_position_B = "Absolute_throttle_position_B";
    export const Absolute_throttle_position_C = "Absolute_throttle_position_C";
    export const Accelerator_pedal_position_D = "Accelerator_pedal_position_D";
    export const Accelerator_pedal_position_E = "Accelerator_pedal_position_E";
    export const Accelerator_pedal_position_F = "Accelerator_pedal_position_F";
    export const Commanded_throttle_actuator = "Commanded_throttle_actuator";
    export const Time_run_with_MIL_on = "Time_run_with_MIL_on";
    export const Time_since_trouble_codes_cleared = "Time_since_trouble_codes_cleared";
    export const Ethanol_fuel_percent = "Ethanol_fuel_percent";
    
    // Added on 2018/01/07
    export const O2Sensor_1_Air_Fuel_Correction = "O2Sensor_1_Air_Fuel_Correction";
    export const O2Sensor_2_Air_Fuel_Correction = "O2Sensor_2_Air_Fuel_Correction";
    export const O2Sensor_3_Air_Fuel_Correction = "O2Sensor_3_Air_Fuel_Correction";
    export const O2Sensor_4_Air_Fuel_Correction = "O2Sensor_4_Air_Fuel_Correction";
    export const O2Sensor_5_Air_Fuel_Correction = "O2Sensor_5_Air_Fuel_Correction";
    export const O2Sensor_6_Air_Fuel_Correction = "O2Sensor_6_Air_Fuel_Correction";
    export const O2Sensor_7_Air_Fuel_Correction = "O2Sensor_7_Air_Fuel_Correction";
    export const O2Sensor_8_Air_Fuel_Correction = "O2Sensor_8_Air_Fuel_Correction";

    export const O2Sensor_1_Air_Fuel_Ratio = "O2Sensor_1_Air_Fuel_Ratio";
    export const O2Sensor_2_Air_Fuel_Ratio = "O2Sensor_2_Air_Fuel_Ratio";
    export const O2Sensor_3_Air_Fuel_Ratio = "O2Sensor_3_Air_Fuel_Ratio";
    export const O2Sensor_4_Air_Fuel_Ratio = "O2Sensor_4_Air_Fuel_Ratio";
    export const O2Sensor_5_Air_Fuel_Ratio = "O2Sensor_5_Air_Fuel_Ratio";
    export const O2Sensor_6_Air_Fuel_Ratio = "O2Sensor_6_Air_Fuel_Ratio";
    export const O2Sensor_7_Air_Fuel_Ratio = "O2Sensor_7_Air_Fuel_Ratio";
    export const O2Sensor_8_Air_Fuel_Ratio = "O2Sensor_8_Air_Fuel_Ratio";

    export const Evap_system_vapor_pressure = "Evap_system_vapor_pressure";
    export const Fuel_rail_absolute_pressure = "Fuel_rail_absolute_pressure";
    export const Relative_accelerator_pedal_position = "Relative_accelerator_pedal_position";
    export const Hybrid_battery_pack_remaining_life = "Hybrid_battery_pack_remaining_life";
    export const Engine_oil_temperature = "Engine_oil_temperature";
    export const Fuel_injection_timing = "Fuel_injection_timing";
    export const Engine_fuel_rate = "Engine_fuel_rate";
    export const Driver_demand_engine_percent_torque = "Driver_demand_engine_percent_torque";
    export const Actual_engine_percent_torque = "Actual_engine_percent_torque";
    export const Engine_reference_torque = "Engine_reference_torque";
}

export namespace AssettoCorsaSHMPhysicsParameterCode
{
    export const Gas = "Gas";
    export const Brake = "Brake";
    export const Fuel = "Fuel";
    export const Gear = "Gear";
    export const Rpms = "Rpms";
    export const SteerAngle = "SteerAngle";
    export const SpeedKmh = "SpeedKmh";
    export const Velocity = "Velocity";
    export const AccG = "AccG";
    export const WheelSlip = "WheelSlip";
    export const WheelLoad = "WheelLoad";
    export const WheelsPressure = "WheelsPressure";
    export const WheelAngularSpeed = "WheelAngularSpeed";
    export const TyreWear = "TyreWear";
    export const TyreDirtyLevel = "TyreDirtyLevel";
    export const TyreCoreTemperature = "TyreCoreTemperature";
    export const CamberRad = "CamberRad";
    export const SuspensionTravel = "SuspensionTravel";
    export const Drs = "Drs";
    export const TC = "TC";
    export const Heading = "Heading";
    export const Pitch = "Pitch";
    export const Roll = "Roll";
    export const CgHeight = "CgHeight";
    export const CarDamage = "CarDamage";
    export const NumberOfTyresOut = "NumberOfTyresOut";
    export const PitLimiterOn = "PitLimiterOn";
    export const Abs = "Abs";
    export const KersCharge = "KersCharge";
    export const KersInput = "KersInput";
    export const AutoShifterOn = "AutoShifterOn";
    export const RideHeight = "RideHeight";
    export const TurboBoost = "TurboBoost";
    export const Ballast = "Ballast";
    export const AirDensity = "AirDensity";
    export const AirTemp = "AirTemp";
    export const RoadTemp = "RoadTemp";
    export const LocalAngularVelocity = "LocalAngularVelocity";
    export const FinalFF = "FinalFF";
    export const PerformanceMeter = "PerformanceMeter";
    export const EngineBrake = "EngineBrake";
    export const ErsRecoveryLevel = "ErsRecoveryLevel";
    export const ErsPowerLevel = "ErsPowerLevel";
    export const ErsHeatCharging = "ErsHeatCharging";
    export const ErsisCharging = "ErsisCharging";
    export const KersCurrentKJ = "KersCurrentKJ";
    export const DrsAvailable = "DrsAvailable";
    export const DrsEnabled = "DrsEnabled";
    export const BrakeTemp = "BrakeTemp";
    export const Clutch = "Clutch";
    export const TyreTempI = "TyreTempI";
    export const TyreTempM = "TyreTempM";
    export const TyreTempO = "TyreTempO";
    export const IsAIControlled = "IsAIControlled";
    export const TyreContactPoint = "TyreContactPoint";
    export const TyreContactNormal = "TyreContactNormal";
    export const TyreContactHeading = "TyreContactHeading";
    export const BrakeBias = "BrakeBias";
    export const LocalVelocity = "LocalVelocity";

    //Custom parameter code
    export const ManifoldPressure = "ManifoldPressure";
}

export namespace AssettoCorsaSHMGraphicsParameterCode
{
    export const Status = "Status";
    export const Session = "Session";
    export const CurrentTime = "CurrentTime";
    export const LastTime = "LastTime";
    export const BestTime = "BestTime";
    export const Split = "Split";
    export const CompletedLaps = "CompletedLaps";
    export const Position = "Position";
    export const iCurrentTime = "iCurrentTime";
    export const iLastTime = "iLastTime";
    export const iBestTime = "iBestTime";
    export const SessionTimeLeft = "SessionTimeLeft";
    export const DistanceTraveled = "DistanceTraveled";
    export const IsInPit = "IsInPit";
    export const CurrentSectorIndex = "CurrentSectorIndex";
    export const LastSectorTime = "LastSectorTime";
    export const NumberOfLaps = "NumberOfLaps";
    export const TyreCompound = "TyreCompound";
    export const ReplayTimeMultiplier = "ReplayTimeMultiplier";
    export const NormalizedCarPosition = "NormalizedCarPosition";
    export const CarCoordinates = "CarCoordinates";
    export const PenaltyTime = "PenaltyTime";
    export const Flag = "Flag";
    export const IdealLineOn = "IdealLineOn";
    export const IsInPitLane = "IsInPitLane";
    export const SurfaceGrip = "SurfaceGrip";
    export const MandatoryPitDone = "MandatoryPitDone";
}

export namespace AssettoCorsaSHMStaticInfoParameterCode
{
    export const SMVersion = "SMVersion";
    export const ACVersion = "ACVersion";
    export const NumberOfSessions = "NumberOfSessions";
    export const NumCars = "NumCars";
    export const CarModel = "CarModel";
    export const Track = "Track";
    export const PlayerName = "PlayerName";
    export const PlayerSurname = "PlayerSurname";
    export const PlayerNick = "PlayerNick";
    export const SectorCount = "SectorCount";
    export const MaxTorque = "MaxTorque";
    export const MaxPower = "MaxPower";
    export const MaxRpm = "MaxRpm";
    export const MaxFuel = "MaxFuel";
    export const SuspensionMaxTravel = "SuspensionMaxTravel";
    export const TyreRadius = "TyreRadius";
    export const MaxTurboBoost = "MaxTurboBoost";
    export const PenaltiesEnabled = "PenaltiesEnabled";
    export const AidFuelRate = "AidFuelRate";
    export const AidTireRate = "AidTireRate";
    export const AidMechanicalDamage = "AidMechanicalDamage";
    export const AidAllowTyreBlankets = "AidAllowTyreBlankets";
    export const AidStability = "AidStability";
    export const AidAutoClutch = "AidAutoClutch";
    export const AidAutoBlip = "AidAutoBlip";
    export const HasDRS = "HasDRS";
    export const HasERS = "HasERS";
    export const HasKERS = "HasKERS";
    export const KersMaxJoules = "KersMaxJoules";
    export const EngineBrakeSettingsCount = "EngineBrakeSettingsCount";
    export const ErsPowerControllerCount = "ErsPowerControllerCount";
    export const TrackSPlineLength = "TrackSPlineLength";
    export const TrackConfiguration = "TrackConfiguration";
    export const ErsMaxJ = "ErsMaxJ";
    export const IsTimedRace = "IsTimedRace";
    export const HasExtraLap = "HasExtraLap";
    export const CarSkin = "CarSkin";
    export const ReversedGridPositions = "ReversedGridPositions";
    export const PitWindowStart = "PitWindowStart";
    export const PitWindowEnd = "PitWindowEnd";
}

export namespace ReadModeCode
{
    export const SLOW = "SLOW";
    export const FAST = "FAST";
    export const SLOWandFAST = "SLOWandFast";
}



