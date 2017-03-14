/* 
 * Copyright (c) 2017, kuniaki
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * * Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

module webSocketGauge.lib.communication
{
    namespace JSONFormats
    {
        export interface IJSONMessage
        {
            mode : string;
        }

        export class ResetJSONMessage implements IJSONMessage
        {
            public mode : string = "RESET";
        }

        export class VALJSONMessage implements IJSONMessage
        {
            public mode:string = "VAL";
            public val : {[key : string] : number;};
        }

        export class ErrorJSONMessage implements IJSONMessage
        {
            public mode: string = "ERR";
            public msg: string;
        }

        export class ResponseJSONMessage implements IJSONMessage
        {
            public mode: string = "RES";
            public msg: string;
        }

        export class MomentFuelTripJSONMessage implements IJSONMessage
        {
            public mode: string = "MOMENT_FUELTRIP";
            public moment_gasmilage : number;
            public total_gas : number;
            public total_trip : number;
            public total_gasmilage : number;
        }

        export class SectFuelTripJSONMessage implements IJSONMessage
        {
            public mode: string = "SECT_FUELTRIP";
            public sect_span: number;
            public sect_trip : number[];
            public sect_gas : number[];
            public sect_gasmilage : number[];
        }

        export class SectSpanJSONMessage implements IJSONMessage
        {
            public mode : string = "SECT_SPAN";
            public sect_span : number;
        }

        export class SectStoreMaxJSONMessage implements IJSONMessage
        {
            public mode : string = "SECT_STOREMAX";
            public storemax : number;
        }
        
        export class SendWSSendJSONMessage implements IJSONMessage
        {
            public mode : string;
            public code : string;
            public flag : boolean;
        }
        export class SendWSIntervalJSONMessage implements IJSONMessage
        {
            public mode : string;
            public interval : number;
        }
        export class SendCOMReadJSONMessage implements IJSONMessage
        {
            mode : string;
            code : string;
            read_mode : string;
            flag : boolean;
        }
        export class SendSlowReadIntervalJSONMessage implements IJSONMessage
        {
            mode : string;
            interval : number;
        }
    }
    
    abstract class WebsocketCommon
    {
        private websocket: WebSocket;
        private isConnetced : boolean = false;
        private url : string;
        private onRESPacketReceived: (message : string) => void;
        private onERRPacketReceived: (message : string) => void;
        private onWebsocketOpen: ()=>void;
        private onWebsocketClose: ()=>void;
        private onWebsocketError: (message : string) => void;
        
        constructor()
        {
            this.onWebsocketError = (msg : string)=>alert(msg);
        }
        
        protected abstract parseIncomingMessage(msg : string) : void;
        /**
        * Connect websocket.
        */
        public Connect() : void
        {
            this.websocket = new WebSocket(this.url); 
            if (this.websocket === null) {
                if (typeof (this.onWebsocketError) !== "undefined")
                    this.onWebsocketError("Websocket is not supported.");
                return;
            };

            // store self reference in order to register event handler.
            var self = this;
            // when data is comming from the server, this metod is called
            this.websocket.onmessage = function (evt) {
                self.parseIncomingMessage(evt.data);
            };
            // when the connection is established, this method is called
            this.websocket.onopen = function () {
                if (typeof (self.onWebsocketOpen) !== "undefined")
                    self.onWebsocketOpen();
            };
            // when the connection is closed, this method is called
            this.websocket.onclose = function () {
                if (typeof (self.onWebsocketClose) !== "undefined")
                self.onWebsocketClose();
            };
            
            this.isConnetced = true;
        }
        
        /**
        * Send reset packet.
        */
        public SendReset(): void
        {
            if (!this.isConnetced)
                return;
                
            let jsonstr: string = JSON.stringify(new JSONFormats.ResetJSONMessage());
            this.websocket.send(jsonstr);
        }
        
        /**
        * Close websocket.
        */
        public Close(): void
        {
            if(this.websocket)
            {
                this.websocket.close();
            }
            this.isConnetced = false;
        }
        
        /**
         * Get websocket ready state.
         * @return {number} Websocket state code.
         */        
        public getReadyState(): number
        {
            if(typeof this.websocket === "undefined")
                return -1;
            else
                return this.websocket.readyState;
        }
        
        protected get WebSocket() : WebSocket { return this.websocket; }
        public get URL(): string { return this.url; }
        public set URL(val : string) { this.url = val; }
        public get OnRESPacketReceived() { return this.onRESPacketReceived; };
        public set OnRESPacketReceived(func) { this.onRESPacketReceived = func; };
        public get OnERRPacketReceived() { return this.onERRPacketReceived; };
        public set OnERRPacketReceived(func) { this.onERRPacketReceived = func; };
        public get OnWebsocketOpen() {return this.onWebsocketOpen; };
        public set OnWebsocketOpen(func) {this.onWebsocketOpen = func; };
        public get OnWebsocketClose() {return this.onWebsocketClose; };
        public set OnWebsocketClose(func) {this.onWebsocketClose = func; };
        public get OnWebsocketError() {return this.onWebsocketError; };
        public set OnWebsocketError(func) {this.onWebsocketError = func; };
        
        public get IsConnetced() { return this.isConnetced;};
    }
    
    /**
    * Superclass of Defi/SSM/Arduino/ELM327 websocket.
    */
    abstract class DefiSSMWebsocketCommon extends WebsocketCommon
    {
        protected ModePrefix: string;
        private recordIntervalTimeEnabled : boolean;
        
        private onVALPacketReceivedByCode : {[code : string] : (val : number)=>void};
        private onVALPacketReceived : (intervalTime : number, val:{[code : string] : number}) => void;
        
        //Internal state
        private valPacketPreviousTimeStamp : number;
        private valPacketIntervalTime : number;
        
        constructor()
        {
            super();
            this.recordIntervalTimeEnabled = true;
            this.valPacketPreviousTimeStamp = window.performance.now();
            this.valPacketIntervalTime = 0;
        }
        
        protected parseIncomingMessage(msg : string) : void
        {
            let receivedJson : any = JSON.parse(msg);    
            let receivedJSONIface: JSONFormats.IJSONMessage = receivedJson;
            switch (receivedJSONIface.mode)
            {
                case ("VAL") :
                    if(this.recordIntervalTimeEnabled)
                    {
                        //Update interval time
                        var nowTime = window.performance.now();
                        this.valPacketIntervalTime = nowTime - this.valPacketPreviousTimeStamp;
                        this.valPacketPreviousTimeStamp = nowTime;
                    };
                    
                    let receivedVALJSON: JSONFormats.VALJSONMessage = receivedJson;
                    if ( typeof(this.onVALPacketReceived) !== "undefined" )
                        this.OnVALPacketReceived(this.valPacketIntervalTime, receivedVALJSON.val);
                    
                    if (typeof (this.onVALPacketReceivedByCode) !== "undefined")
                    {
                        for (let key in receivedVALJSON.val)
                            if (key in this.onVALPacketReceivedByCode)
                                this.OnVALPacketReceivedByCode[key](receivedVALJSON.val[key]);
                    }
                    break;
                case("ERR"):
                    let receivedERRJSON: JSONFormats.ErrorJSONMessage = receivedJson;
                    if (typeof (this.OnERRPacketReceived) !== "undefined")
                        this.OnERRPacketReceived(receivedERRJSON.msg);
                    break;
                case("RES"):
                    let receivedRESJSON: JSONFormats.ResponseJSONMessage = receivedJson;
                    if(typeof (this.OnRESPacketReceived) !== "undefined")
                        this.OnRESPacketReceived(receivedRESJSON.msg);
                    break;
                default:
                    this.OnWebsocketError("Unknown mode packet received. " + msg);
            };
        }
        
        public get RecordIntervalTimeEnabled(): boolean { return this.recordIntervalTimeEnabled;}
        public set RecordIntervalTimeEnabled(val : boolean) { this.recordIntervalTimeEnabled = val;}
        public get OnVALPacketReceivedByCode() {return this.onVALPacketReceivedByCode;}
        public set OnVALPacketReceivedByCode(funclist) {this.onVALPacketReceivedByCode = funclist;}
        public get OnVALPacketReceived() {return this.onVALPacketReceived};
        public set OnVALPacketReceived(func) {this.onVALPacketReceived = func };
        public get VALPacketIntervalTime(): number { return this.valPacketIntervalTime; }
    }
    
    /**
     * DefiCOMWebsocket class.
     * @extends DefiSSMWebsocketCommon
     */ 
    export class DefiCOMWebsocket extends DefiSSMWebsocketCommon
    {
        constructor()
        {
            super();
            this.ModePrefix = "DEFI";
        }
        
        public SendWSSend(code : string, flag : boolean) : void
        {
            if (!this.IsConnetced)
                return;

            let sendWSSendObj = new JSONFormats.SendWSSendJSONMessage();          
            sendWSSendObj.mode = this.ModePrefix + "_WS_SEND";
            sendWSSendObj.code = code;
            sendWSSendObj.flag = flag;
            let jsonstr: string = JSON.stringify(sendWSSendObj);
            this.WebSocket.send(jsonstr);
        }
        
        public SendWSInterval(interval : number) : void
        {
            if (!this.IsConnetced)
                return;
            
            let sendWSIntervalObj = new JSONFormats.SendWSIntervalJSONMessage();
            sendWSIntervalObj.mode = this.ModePrefix + "_WS_INTERVAL";
            sendWSIntervalObj.interval = interval;           
            var jsonstr = JSON.stringify(sendWSIntervalObj);
            this.WebSocket.send(jsonstr);
        }    
    }
    
    /**
     * ArduinoCOM_Websocket class.
     * @extends DefiCOMWebsocket
     */
    export class ArduinoCOMWebsocket extends DefiCOMWebsocket
    {
        constructor()
        {
            super();
            this.ModePrefix = "ARDUINO";
        }
    }
    
    export class SSMWebsocket extends DefiSSMWebsocketCommon
    {
        constructor()
        {
            super();
            this.ModePrefix = "SSM";
        }
        
        public SendCOMRead(code: string, readmode: string, flag: boolean): void
        {
            if (!this.IsConnetced)
                return;
            
            let sendCOMReadObj = new JSONFormats.SendCOMReadJSONMessage();
            sendCOMReadObj.mode = this.ModePrefix + "_COM_READ";
            sendCOMReadObj.code = code;
            sendCOMReadObj.read_mode = readmode;
            sendCOMReadObj.flag = flag;
            const jsonstr = JSON.stringify(sendCOMReadObj);
            this.WebSocket.send(jsonstr);
        }
        
        public SendSlowreadInterval(interval : number)
        {
            if (!this.IsConnetced)
                return;

            let sendSlowreadIntervalObj = new JSONFormats.SendSlowReadIntervalJSONMessage();
            sendSlowreadIntervalObj.mode = this.ModePrefix + "_SLOWREAD_INTERVAL";
            sendSlowreadIntervalObj.interval = interval;
            const jsonstr = JSON.stringify(sendSlowreadIntervalObj);
            this.WebSocket.send(jsonstr);
        }
    }
    
    export class ELM327COMWebsocket extends SSMWebsocket
    {
        constructor()
        {
            super();
            this.ModePrefix = "ELM327";
        }
    }
    
    export class FUELTRIPWebsocket extends WebsocketCommon
    {
        //private ModePrefix = "FUELTRIP";
        private onMomentFUELTRIPPacketReceived: (momentGasMilage : number, totalGas : number, totalTrip : number, totalGasMilage : number)=>void;
        private onSectFUELTRIPPacketReceived: (sectSpan : number, sectTrip : number[], sectGas : number[], sectGasMilage: number[])=>void;
        
        get OnMomentFUELTRIPPacketReceived() { return this.onMomentFUELTRIPPacketReceived;}
        set OnMomentFUELTRIPPacketReceived(func) { this.onMomentFUELTRIPPacketReceived = func; }
        get OnSectFUELTRIPPacketReceived() { return this.onSectFUELTRIPPacketReceived;}
        set OnSectFUELTRIPPacketReceived(func) { this.onSectFUELTRIPPacketReceived = func; }        

        public SendSectStoreMax(storeMax : number): void
        {
            if (!this.IsConnetced)
                return;

            const obj = new JSONFormats.SectStoreMaxJSONMessage();
            obj.storemax = storeMax;
            const jsonstr:string = JSON.stringify(obj);
            this.WebSocket.send(jsonstr);    
        };
        public SendSectSpan(sectSpan : number): void
        {
            if (!this.IsConnetced)
                return;

            const obj = new JSONFormats.SectSpanJSONMessage();
            obj.sect_span = sectSpan;
            const jsonstr: string = JSON.stringify(obj);
            this.WebSocket.send(jsonstr);
        }
        
        protected parseIncomingMessage(msg : string) : void
        {
            const recevedJSONIface: JSONFormats.IJSONMessage = JSON.parse(msg);
            switch(recevedJSONIface.mode)
            {
                case ("MOMENT_FUELTRIP") :
                {
                    const jsonObj: JSONFormats.MomentFuelTripJSONMessage = JSON.parse(msg);
                    if (typeof (this.onMomentFUELTRIPPacketReceived) !== "undefined")
                    {
                        this.onMomentFUELTRIPPacketReceived(jsonObj.moment_gasmilage,
                        jsonObj.total_gas,
                        jsonObj.total_trip,
                        jsonObj.total_gasmilage);
                    }
                    break;
                }
                case ("SECT_FUELTRIP") :
                {
                    const jsonObj: JSONFormats.SectFuelTripJSONMessage = JSON.parse(msg);
                    if (typeof (this.onSectFUELTRIPPacketReceived) !== "undefined")
                    {
                        this.onSectFUELTRIPPacketReceived(jsonObj.sect_span,
                        jsonObj.sect_trip,
                        jsonObj.sect_gas,
                        jsonObj.sect_gasmilage);
                    }
                    break;
                }
                case("ERR"):
                {
                    const jsonObj: JSONFormats.ErrorJSONMessage = JSON.parse(msg);
                    if (typeof (this.OnERRPacketReceived) !== "undefined")
                        this.OnERRPacketReceived(jsonObj.msg);
                    break;
                }
                case("RES"):
                {
                    const jsonObj: JSONFormats.ResponseJSONMessage = JSON.parse(msg);
                    if(typeof (this.OnRESPacketReceived) !== "undefined")
                        this.OnRESPacketReceived(jsonObj.msg);
                    break;
                }
                default:
                    this.OnWebsocketError("Unknown mode packet received. " + msg);
            }
        }
    }
    
    //Define string based enum of ParameterCode
    export namespace DefiParameterCode
    {
        export const Manifold_Absolute_Pressure = "Manifold_Absolute_Pressure";
        export const Engine_Speed = "Engine_Speed";
        export const Oil_Pressure = "Oil_Pressure";
        export const Fuel_Rail_Pressure = "Fuel_Rail_Pressure";
        export const Exhaust_Gas_Temperature = "Exhaust_Gas_Temperature";
        export const Oil_Temperature = "Oil_Temperature";
        export const Coolant_Temperature = "Coolant_Temperature";
    }
    
    export namespace ArduinoParameterCode
    {
        export const Engine_Speed = "Engine_Speed";
        export const Vehicle_Speed = "Vehicle_Speed";
        export const Manifold_Absolute_Pressure = "Manifold_Absolute_Pressure";
        export const Coolant_Temperature = "Coolant_Temperature";
        export const Oil_Temperature = "Oil_Temperature";
        export const Oil_Temperature2 = "Oil_Temperature2";
        export const Oil_Pressure = "Oil_Pressure";
        export const Fuel_Rail_Pressure = "Fuel_Rail_Pressure";
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
    }
    
    namespace Interpolation
    {
        export enum UpdatePeriodCalcMethod
        {
            Direct,
            Average,
            Median
        }
        
        export class VALInterpolationBuffer
        {
            public static UpdatePeriodCalcMethod: UpdatePeriodCalcMethod = UpdatePeriodCalcMethod.Median;
            public static UpdatePeriodBufferLength : number = 4;
            
            private lastUpdateTimeStamp : number;
            private lastValue : number;
            private value : number;
            private valUpdatePeriod : number;
            
            private updatePeriodAveragingQueue: MovingAverageQueue;
            
            constructor()
            {
                this.updatePeriodAveragingQueue = new MovingAverageQueue(VALInterpolationBuffer.UpdatePeriodBufferLength);
            }
            
            /**
             * Set value to buffer.
             * @param value value to store.
             * @param period value update period.
             * @param timestamp timestamp of value update.
             */
            public setVal(value : number, period? : number, timestamp? : number) : void
            {
                //Calculate value update period
                let currentPeriod : number;
                if (typeof(period) === "number")
                    currentPeriod = period;
                else if(typeof(timestamp) === "number")
                    currentPeriod = timestamp - this.lastUpdateTimeStamp;
                else
                    currentPeriod = performance.now() - this.lastUpdateTimeStamp;
                
                //Calculate average/median of valueUpdate period
                switch (VALInterpolationBuffer.UpdatePeriodCalcMethod)
                {
                    case UpdatePeriodCalcMethod.Direct:
                        this.valUpdatePeriod = currentPeriod;
                        break;
                    case UpdatePeriodCalcMethod.Median:
                        this.updatePeriodAveragingQueue.add(currentPeriod);
                        this.valUpdatePeriod = this.updatePeriodAveragingQueue.getMedian();
                        break;
                    case UpdatePeriodCalcMethod.Average:
                        this.updatePeriodAveragingQueue.add(currentPeriod);
                        this.valUpdatePeriod = this.updatePeriodAveragingQueue.getAverage();
                        break;
                }
                    
                // Store lastUpdateTimeStamp
                if (typeof(timestamp) === "number" )
                    this.lastUpdateTimeStamp = timestamp;
                else
                    this.lastUpdateTimeStamp = performance.now();

                this.lastValue = this.value;
                this.value = value;
            }

            public get LastValue() : number { return this.lastValue; }
            public get Value(): number {return this.value; }

            public getInterpolatedVal(timeStamp?: number): number
            {
                let actualTimeStamp : number
                if(!(typeof(timeStamp) === "number"))
                    actualTimeStamp = performance.now();
                else
                    actualTimeStamp = timeStamp;
                
                let interpolateFactor = (actualTimeStamp - this.lastUpdateTimeStamp) / this.valUpdatePeriod;
                if(interpolateFactor > 1)
                    interpolateFactor = 1;
                if(interpolateFactor < 0)
                    interpolateFactor = 0;
                const interpolatedVal = this.lastValue + (this.value - this.lastValue)*interpolateFactor;
                
                return interpolatedVal;
            }
        }
        
        class MovingAverageQueue
        {
            private queueLength : number;
            private valArray : number[];
            
            constructor(queueLength : number)
            {
                this.queueLength = queueLength;
            }
            
            /**
             * Add value to buffer queue.
             * @param value value to add.
             */
            public add(value : number) : void
            {
                //Discard one oldest item
                if (this.valArray.length == this.queueLength)
                    this.valArray.shift();
                
                this.valArray.push(value);
            }
            
            /**
             * Get moving average.
             */
            public getAverage() : number
            {
                const length : number = this.valArray.length;
                let temp : number = 0;
                for(let i = 0; i < length; i++)
                    temp += this.valArray[i];

                if (length === 0)
                    return 1;

                return temp/length;
            }
            
            /**
             * Get movinig median.
             */
            public getMedian() : number
            {
                const temp : number[] = this.valArray.sort(function(a,b){return a-b;});
                const length = temp.length;
                const half : number = (temp.length/2)|0;

                if (length === 0)
                    return 1;

                if(length % 2)
                    return temp[half];
                else
                    return (temp[half-1] + temp[half])/2;
            }
        }
    }
}
