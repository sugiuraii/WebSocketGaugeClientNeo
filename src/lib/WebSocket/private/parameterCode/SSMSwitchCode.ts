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

import { SSMParameterCode } from './SSMParameterCode';

export function SSMSwitchCodeToParameterCode(switchCode: SSMSwitchCode): SSMParameterCode {
    switch (switchCode) {
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

        default:
            throw Error("Error_Switch_Code_Not_Match");
    }
}

export const SSMSwitchCode =
    {
        AT_Vehicle_ID: "AT_Vehicle_ID",
        Test_Mode_Connector: "Test_Mode_Connector",
        Read_Memory_Connector: "Read_Memory_Connector",
        Neutral_Position_Switch: "Neutral_Position_Switch",
        Idle_Switch: "Idle_Switch",
        Intercooler_AutoWash_Switch: "Intercooler_AutoWash_Switch",
        Ignition_Switch: "Ignition_Switch",
        Power_Steering_Switch: "Power_Steering_Switch",
        Air_Conditioning_Switch: "Air_Conditioning_Switch",
        Handle_Switch: "Handle_Switch",
        Starter_Switch: "Starter_Switch",
        Front_O2_Rich_Signal: "Front_O2_Rich_Signal",
        Rear_O2_Rich_Signal: "Rear_O2_Rich_Signal",
        Front_O2_2_Rich_Signal: "Front_O2_2_Rich_Signal",
        Knock_Signal_1: "Knock_Signal_1",
        Knock_Signal_2: "Knock_Signal_2",
        Electrical_Load_Signal: "Electrical_Load_Signal",
        Crank_Position_Sensor: "Crank_Position_Sensor",
        Cam_Position_Sensor: "Cam_Position_Sensor",
        Defogger_Switch: "Defogger_Switch",
        Blower_Switch: "Blower_Switch",
        Interior_Light_Switch: "Interior_Light_Switch",
        Wiper_Switch: "Wiper_Switch",
        AirCon_Lock_Signal: "AirCon_Lock_Signal",
        AirCon_Mid_Pressure_Switch: "AirCon_Mid_Pressure_Switch",
        AirCon_Compressor_Signal: "AirCon_Compressor_Signal",
        Radiator_Fan_Relay_3: "Radiator_Fan_Relay_3",
        Radiator_Fan_Relay_1: "Radiator_Fan_Relay_1",
        Radiator_Fan_Relay_2: "Radiator_Fan_Relay_2",
        Fuel_Pump_Relay: "Fuel_Pump_Relay",
        Intercooler_AutoWash_Relay: "Intercooler_AutoWash_Relay",
        CPC_Solenoid_Valve: "CPC_Solenoid_Valve",
        BlowBy_Leak_Connector: "BlowBy_Leak_Connector",
        PCV_Solenoid_Valve: "PCV_Solenoid_Valve",
        TGV_Output: "TGV_Output",
        TGV_Drive: "TGV_Drive",
        Variable_Intake_Air_Solenoid: "Variable_Intake_Air_Solenoid",
        Pressure_Sources_Change: "Pressure_Sources_Change",
        Vent_Solenoid_Valve: "Vent_Solenoid_Valve",
        P_S_Solenoid_Valve: "P_S_Solenoid_Valve",
        Assist_Air_Solenoid_Valve: "Assist_Air_Solenoid_Valve",
        Tank_Sensor_Control_Valve: "Tank_Sensor_Control_Valve",
        Relief_Valve_Solenoid_1: "Relief_Valve_Solenoid_1",
        Relief_Valve_Solenoid_2: "Relief_Valve_Solenoid_2",
        TCS_Relief_Valve_Solenoid: "TCS_Relief_Valve_Solenoid",
        Ex_Gas_Positive_Pressure: "Ex_Gas_Positive_Pressure",
        Ex_Gas_Negative_Pressure: "Ex_Gas_Negative_Pressure",
        Intake_Air_Solenoid: "Intake_Air_Solenoid",
        Muffler_Control: "Muffler_Control",
        Retard_Signal_from_AT: "Retard_Signal_from_AT",
        Fuel_Cut_Signal_from_AT: "Fuel_Cut_Signal_from_AT",
        Ban_of_Torque_Down: "Ban_of_Torque_Down",
        Request_Torque_Down_VDC: "Request_Torque_Down_VDC",
        Torque_Control_Signal_1: "Torque_Control_Signal_1",
        Torque_Control_Signal_2: "Torque_Control_Signal_2",
        Torque_Permission_Signal: "Torque_Permission_Signal",
        EAM_Signal: "EAM_Signal",
        AT_coop_lock_up_signal: "AT_coop_lock_up_signal",
        AT_coop_lean_burn_signal: "AT_coop_lean_burn_signal",
        AT_coop_rich_spike_signal: "AT_coop_rich_spike_signal",
        AET_Signal: "AET_Signal",
        ETC_Motor_Relay: "ETC_Motor_Relay",
        Clutch_Switch: "Clutch_Switch",
        Stop_Light_Switch: "Stop_Light_Switch",
        Set_Coast_Switch: "Set_Coast_Switch",
        Rsume_Accelerate_Switch: "Rsume_Accelerate_Switch",
        Brake_Switch: "Brake_Switch",
        Accelerator_Switch: "Accelerator_Switch"
    } as const;

export type SSMSwitchCode = typeof SSMSwitchCode[keyof typeof SSMSwitchCode];

