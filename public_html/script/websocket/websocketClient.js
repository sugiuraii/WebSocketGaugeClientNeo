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
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var webSocketGauge;
(function (webSocketGauge) {
    var lib;
    (function (lib) {
        var communication;
        (function (communication) {
            var JSONFormats;
            (function (JSONFormats) {
                var ResetJSONMessage = (function () {
                    function ResetJSONMessage() {
                        this.mode = "RESET";
                    }
                    return ResetJSONMessage;
                }());
                JSONFormats.ResetJSONMessage = ResetJSONMessage;
                var VALJSONMessage = (function () {
                    function VALJSONMessage() {
                        this.mode = "VAL";
                    }
                    return VALJSONMessage;
                }());
                JSONFormats.VALJSONMessage = VALJSONMessage;
                var ErrorJSONMessage = (function () {
                    function ErrorJSONMessage() {
                        this.mode = "ERR";
                    }
                    return ErrorJSONMessage;
                }());
                JSONFormats.ErrorJSONMessage = ErrorJSONMessage;
                var ResponseJSONMessage = (function () {
                    function ResponseJSONMessage() {
                        this.mode = "RES";
                    }
                    return ResponseJSONMessage;
                }());
                JSONFormats.ResponseJSONMessage = ResponseJSONMessage;
                var MomentFuelTripJSONMessage = (function () {
                    function MomentFuelTripJSONMessage() {
                        this.mode = "MOMENT_FUELTRIP";
                    }
                    return MomentFuelTripJSONMessage;
                }());
                JSONFormats.MomentFuelTripJSONMessage = MomentFuelTripJSONMessage;
                var SectFuelTripJSONMessage = (function () {
                    function SectFuelTripJSONMessage() {
                        this.mode = "SECT_FUELTRIP";
                    }
                    return SectFuelTripJSONMessage;
                }());
                JSONFormats.SectFuelTripJSONMessage = SectFuelTripJSONMessage;
                var SectSpanJSONMessage = (function () {
                    function SectSpanJSONMessage() {
                        this.mode = "SECT_SPAN";
                    }
                    return SectSpanJSONMessage;
                }());
                JSONFormats.SectSpanJSONMessage = SectSpanJSONMessage;
                var SectStoreMaxJSONMessage = (function () {
                    function SectStoreMaxJSONMessage() {
                        this.mode = "SECT_STOREMAX";
                    }
                    return SectStoreMaxJSONMessage;
                }());
                JSONFormats.SectStoreMaxJSONMessage = SectStoreMaxJSONMessage;
                var SendWSSendJSONMessage = (function () {
                    function SendWSSendJSONMessage() {
                    }
                    return SendWSSendJSONMessage;
                }());
                JSONFormats.SendWSSendJSONMessage = SendWSSendJSONMessage;
                var SendWSIntervalJSONMessage = (function () {
                    function SendWSIntervalJSONMessage() {
                    }
                    return SendWSIntervalJSONMessage;
                }());
                JSONFormats.SendWSIntervalJSONMessage = SendWSIntervalJSONMessage;
                var SendCOMReadJSONMessage = (function () {
                    function SendCOMReadJSONMessage() {
                    }
                    return SendCOMReadJSONMessage;
                }());
                JSONFormats.SendCOMReadJSONMessage = SendCOMReadJSONMessage;
                var SendSlowReadIntervalJSONMessage = (function () {
                    function SendSlowReadIntervalJSONMessage() {
                    }
                    return SendSlowReadIntervalJSONMessage;
                }());
                JSONFormats.SendSlowReadIntervalJSONMessage = SendSlowReadIntervalJSONMessage;
            })(JSONFormats || (JSONFormats = {}));
            var WebsocketCommon = (function () {
                function WebsocketCommon() {
                    this.isConnetced = false;
                    this.onWebsocketError = function (msg) { return alert(msg); };
                }
                /**
                * Connect websocket.
                */
                WebsocketCommon.prototype.Connect = function () {
                    this.websocket = new WebSocket(this.url);
                    if (this.websocket === null) {
                        if (typeof (this.onWebsocketError) !== "undefined")
                            this.onWebsocketError("Websocket is not supported.");
                        return;
                    }
                    ;
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
                };
                /**
                * Send reset packet.
                */
                WebsocketCommon.prototype.SendReset = function () {
                    if (!this.isConnetced)
                        return;
                    var jsonstr = JSON.stringify(new JSONFormats.ResetJSONMessage());
                    this.websocket.send(jsonstr);
                };
                /**
                * Close websocket.
                */
                WebsocketCommon.prototype.Close = function () {
                    if (this.websocket) {
                        this.websocket.close();
                    }
                    this.isConnetced = false;
                };
                /**
                 * Get websocket ready state.
                 * @return {number} Websocket state code.
                 */
                WebsocketCommon.prototype.getReadyState = function () {
                    if (typeof this.websocket === "undefined")
                        return -1;
                    else
                        return this.websocket.readyState;
                };
                Object.defineProperty(WebsocketCommon.prototype, "WebSocket", {
                    get: function () { return this.websocket; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(WebsocketCommon.prototype, "URL", {
                    get: function () { return this.url; },
                    set: function (val) { this.url = val; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(WebsocketCommon.prototype, "OnRESPacketReceived", {
                    get: function () { return this.onRESPacketReceived; },
                    set: function (func) { this.onRESPacketReceived = func; },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(WebsocketCommon.prototype, "OnERRPacketReceived", {
                    get: function () { return this.onERRPacketReceived; },
                    set: function (func) { this.onERRPacketReceived = func; },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(WebsocketCommon.prototype, "OnWebsocketOpen", {
                    get: function () { return this.onWebsocketOpen; },
                    set: function (func) { this.onWebsocketOpen = func; },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(WebsocketCommon.prototype, "OnWebsocketClose", {
                    get: function () { return this.onWebsocketClose; },
                    set: function (func) { this.onWebsocketClose = func; },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(WebsocketCommon.prototype, "OnWebsocketError", {
                    get: function () { return this.onWebsocketError; },
                    set: function (func) { this.onWebsocketError = func; },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(WebsocketCommon.prototype, "IsConnetced", {
                    get: function () { return this.isConnetced; },
                    enumerable: true,
                    configurable: true
                });
                ;
                return WebsocketCommon;
            }());
            /**
            * Superclass of Defi/SSM/Arduino/ELM327 websocket.
            */
            var DefiSSMWebsocketCommon = (function (_super) {
                __extends(DefiSSMWebsocketCommon, _super);
                function DefiSSMWebsocketCommon() {
                    var _this = _super.call(this) || this;
                    _this.recordIntervalTimeEnabled = true;
                    _this.valPacketPreviousTimeStamp = window.performance.now();
                    _this.valPacketIntervalTime = 0;
                    return _this;
                }
                DefiSSMWebsocketCommon.prototype.parseIncomingMessage = function (msg) {
                    var receivedJson = JSON.parse(msg);
                    var receivedJSONIface = receivedJson;
                    switch (receivedJSONIface.mode) {
                        case ("VAL"):
                            if (this.recordIntervalTimeEnabled) {
                                //Update interval time
                                var nowTime = window.performance.now();
                                this.valPacketIntervalTime = nowTime - this.valPacketPreviousTimeStamp;
                                this.valPacketPreviousTimeStamp = nowTime;
                            }
                            ;
                            var receivedVALJSON = receivedJson;
                            if (typeof (this.onVALPacketReceived) !== "undefined")
                                this.OnVALPacketReceived(this.valPacketIntervalTime, receivedVALJSON.val);
                            if (typeof (this.onVALPacketReceivedByCode) !== "undefined") {
                                for (var key in receivedVALJSON.val)
                                    if (key in this.onVALPacketReceivedByCode)
                                        this.OnVALPacketReceivedByCode[key](receivedVALJSON.val[key]);
                            }
                            break;
                        case ("ERR"):
                            var receivedERRJSON = receivedJson;
                            if (typeof (this.OnERRPacketReceived) !== "undefined")
                                this.OnERRPacketReceived(receivedERRJSON.msg);
                            break;
                        case ("RES"):
                            var receivedRESJSON = receivedJson;
                            if (typeof (this.OnRESPacketReceived) !== "undefined")
                                this.OnRESPacketReceived(receivedRESJSON.msg);
                            break;
                        default:
                            this.OnWebsocketError("Unknown mode packet received. " + msg);
                    }
                    ;
                };
                Object.defineProperty(DefiSSMWebsocketCommon.prototype, "RecordIntervalTimeEnabled", {
                    get: function () { return this.recordIntervalTimeEnabled; },
                    set: function (val) { this.recordIntervalTimeEnabled = val; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(DefiSSMWebsocketCommon.prototype, "OnVALPacketReceivedByCode", {
                    get: function () { return this.onVALPacketReceivedByCode; },
                    set: function (funclist) { this.onVALPacketReceivedByCode = funclist; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(DefiSSMWebsocketCommon.prototype, "OnVALPacketReceived", {
                    get: function () { return this.onVALPacketReceived; },
                    set: function (func) { this.onVALPacketReceived = func; },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(DefiSSMWebsocketCommon.prototype, "VALPacketIntervalTime", {
                    get: function () { return this.valPacketIntervalTime; },
                    enumerable: true,
                    configurable: true
                });
                return DefiSSMWebsocketCommon;
            }(WebsocketCommon));
            /**
             * DefiCOMWebsocket class.
             * @extends DefiSSMWebsocketCommon
             */
            var DefiCOMWebsocket = (function (_super) {
                __extends(DefiCOMWebsocket, _super);
                function DefiCOMWebsocket() {
                    var _this = _super.call(this) || this;
                    _this.ModePrefix = "DEFI";
                    return _this;
                }
                DefiCOMWebsocket.prototype.SendWSSend = function (code, flag) {
                    if (!this.IsConnetced)
                        return;
                    var sendWSSendObj = new JSONFormats.SendWSSendJSONMessage();
                    sendWSSendObj.mode = this.ModePrefix + "_WS_SEND";
                    sendWSSendObj.code = code;
                    sendWSSendObj.flag = flag;
                    var jsonstr = JSON.stringify(sendWSSendObj);
                    this.WebSocket.send(jsonstr);
                };
                DefiCOMWebsocket.prototype.SendWSInterval = function (interval) {
                    if (!this.IsConnetced)
                        return;
                    var sendWSIntervalObj = new JSONFormats.SendWSIntervalJSONMessage();
                    sendWSIntervalObj.mode = this.ModePrefix + "_WS_INTERVAL";
                    sendWSIntervalObj.interval = interval;
                    var jsonstr = JSON.stringify(sendWSIntervalObj);
                    this.WebSocket.send(jsonstr);
                };
                return DefiCOMWebsocket;
            }(DefiSSMWebsocketCommon));
            communication.DefiCOMWebsocket = DefiCOMWebsocket;
            /**
             * ArduinoCOM_Websocket class.
             * @extends DefiCOMWebsocket
             */
            var ArduinoCOMWebsocket = (function (_super) {
                __extends(ArduinoCOMWebsocket, _super);
                function ArduinoCOMWebsocket() {
                    var _this = _super.call(this) || this;
                    _this.ModePrefix = "ARDUINO";
                    return _this;
                }
                return ArduinoCOMWebsocket;
            }(DefiCOMWebsocket));
            communication.ArduinoCOMWebsocket = ArduinoCOMWebsocket;
            var SSMWebsocket = (function (_super) {
                __extends(SSMWebsocket, _super);
                function SSMWebsocket() {
                    var _this = _super.call(this) || this;
                    _this.ModePrefix = "SSM";
                    return _this;
                }
                SSMWebsocket.prototype.SendCOMRead = function (code, readmode, flag) {
                    if (!this.IsConnetced)
                        return;
                    var sendCOMReadObj = new JSONFormats.SendCOMReadJSONMessage();
                    sendCOMReadObj.mode = this.ModePrefix + "_COM_READ";
                    sendCOMReadObj.code = code;
                    sendCOMReadObj.read_mode = readmode;
                    sendCOMReadObj.flag = flag;
                    var jsonstr = JSON.stringify(sendCOMReadObj);
                    this.WebSocket.send(jsonstr);
                };
                SSMWebsocket.prototype.SendSlowreadInterval = function (interval) {
                    if (!this.IsConnetced)
                        return;
                    var sendSlowreadIntervalObj = new JSONFormats.SendSlowReadIntervalJSONMessage();
                    sendSlowreadIntervalObj.mode = this.ModePrefix + "_SLOWREAD_INTERVAL";
                    sendSlowreadIntervalObj.interval = interval;
                    var jsonstr = JSON.stringify(sendSlowreadIntervalObj);
                    this.WebSocket.send(jsonstr);
                };
                return SSMWebsocket;
            }(DefiSSMWebsocketCommon));
            communication.SSMWebsocket = SSMWebsocket;
            var ELM327COMWebsocket = (function (_super) {
                __extends(ELM327COMWebsocket, _super);
                function ELM327COMWebsocket() {
                    var _this = _super.call(this) || this;
                    _this.ModePrefix = "ELM327";
                    return _this;
                }
                return ELM327COMWebsocket;
            }(SSMWebsocket));
            communication.ELM327COMWebsocket = ELM327COMWebsocket;
            var FUELTRIPWebsocket = (function (_super) {
                __extends(FUELTRIPWebsocket, _super);
                function FUELTRIPWebsocket() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Object.defineProperty(FUELTRIPWebsocket.prototype, "OnMomentFUELTRIPPacketReceived", {
                    get: function () { return this.onMomentFUELTRIPPacketReceived; },
                    set: function (func) { this.onMomentFUELTRIPPacketReceived = func; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FUELTRIPWebsocket.prototype, "OnSectFUELTRIPPacketReceived", {
                    get: function () { return this.onSectFUELTRIPPacketReceived; },
                    set: function (func) { this.onSectFUELTRIPPacketReceived = func; },
                    enumerable: true,
                    configurable: true
                });
                FUELTRIPWebsocket.prototype.SendSectStoreMax = function (storeMax) {
                    if (!this.IsConnetced)
                        return;
                    var obj = new JSONFormats.SectStoreMaxJSONMessage();
                    obj.storemax = storeMax;
                    var jsonstr = JSON.stringify(obj);
                    this.WebSocket.send(jsonstr);
                };
                ;
                FUELTRIPWebsocket.prototype.SendSectSpan = function (sectSpan) {
                    if (!this.IsConnetced)
                        return;
                    var obj = new JSONFormats.SectSpanJSONMessage();
                    obj.sect_span = sectSpan;
                    var jsonstr = JSON.stringify(obj);
                    this.WebSocket.send(jsonstr);
                };
                FUELTRIPWebsocket.prototype.parseIncomingMessage = function (msg) {
                    var recevedJSONIface = JSON.parse(msg);
                    switch (recevedJSONIface.mode) {
                        case ("MOMENT_FUELTRIP"):
                            {
                                var jsonObj = JSON.parse(msg);
                                if (typeof (this.onMomentFUELTRIPPacketReceived) !== "undefined") {
                                    this.onMomentFUELTRIPPacketReceived(jsonObj.moment_gasmilage, jsonObj.total_gas, jsonObj.total_trip, jsonObj.total_gasmilage);
                                }
                                break;
                            }
                        case ("SECT_FUELTRIP"):
                            {
                                var jsonObj = JSON.parse(msg);
                                if (typeof (this.onSectFUELTRIPPacketReceived) !== "undefined") {
                                    this.onSectFUELTRIPPacketReceived(jsonObj.sect_span, jsonObj.sect_trip, jsonObj.sect_gas, jsonObj.sect_gasmilage);
                                }
                                break;
                            }
                        case ("ERR"):
                            {
                                var jsonObj = JSON.parse(msg);
                                if (typeof (this.OnERRPacketReceived) !== "undefined")
                                    this.OnERRPacketReceived(jsonObj.msg);
                                break;
                            }
                        case ("RES"):
                            {
                                var jsonObj = JSON.parse(msg);
                                if (typeof (this.OnRESPacketReceived) !== "undefined")
                                    this.OnRESPacketReceived(jsonObj.msg);
                                break;
                            }
                        default:
                            this.OnWebsocketError("Unknown mode packet received. " + msg);
                    }
                };
                return FUELTRIPWebsocket;
            }(WebsocketCommon));
            communication.FUELTRIPWebsocket = FUELTRIPWebsocket;
            //Define string based enum of ParameterCode
            var DefiParameterCode;
            (function (DefiParameterCode) {
                DefiParameterCode.Manifold_Absolute_Pressure = "Manifold_Absolute_Pressure";
                DefiParameterCode.Engine_Speed = "Engine_Speed";
                DefiParameterCode.Oil_Pressure = "Oil_Pressure";
                DefiParameterCode.Fuel_Rail_Pressure = "Fuel_Rail_Pressure";
                DefiParameterCode.Exhaust_Gas_Temperature = "Exhaust_Gas_Temperature";
                DefiParameterCode.Oil_Temperature = "Oil_Temperature";
                DefiParameterCode.Coolant_Temperature = "Coolant_Temperature";
            })(DefiParameterCode = communication.DefiParameterCode || (communication.DefiParameterCode = {}));
            var ArduinoParameterCode;
            (function (ArduinoParameterCode) {
                ArduinoParameterCode.Engine_Speed = "Engine_Speed";
                ArduinoParameterCode.Vehicle_Speed = "Vehicle_Speed";
                ArduinoParameterCode.Manifold_Absolute_Pressure = "Manifold_Absolute_Pressure";
                ArduinoParameterCode.Coolant_Temperature = "Coolant_Temperature";
                ArduinoParameterCode.Oil_Temperature = "Oil_Temperature";
                ArduinoParameterCode.Oil_Temperature2 = "Oil_Temperature2";
                ArduinoParameterCode.Oil_Pressure = "Oil_Pressure";
                ArduinoParameterCode.Fuel_Rail_Pressure = "Fuel_Rail_Pressure";
            })(ArduinoParameterCode = communication.ArduinoParameterCode || (communication.ArduinoParameterCode = {}));
            var SSMParameterCode;
            (function (SSMParameterCode) {
                SSMParameterCode.Engine_Load = "Engine_Load";
                SSMParameterCode.Coolant_Temperature = "Coolant_Temperature";
                SSMParameterCode.Air_Fuel_Correction_1 = "Air_Fuel_Correction_1";
                SSMParameterCode.Air_Fuel_Learning_1 = "Air_Fuel_Learning_1";
                SSMParameterCode.Air_Fuel_Correction_2 = "Air_Fuel_Correction_2";
                SSMParameterCode.Air_Fuel_Learning_2 = "Air_Fuel_Learning_2";
                SSMParameterCode.Manifold_Absolute_Pressure = "Manifold_Absolute_Pressure";
                SSMParameterCode.Engine_Speed = "Engine_Speed";
                SSMParameterCode.Vehicle_Speed = "Vehicle_Speed";
                SSMParameterCode.Ignition_Timing = "Ignition_Timing";
                SSMParameterCode.Intake_Air_Temperature = "Intake_Air_Temperature";
                SSMParameterCode.Mass_Air_Flow = "Mass_Air_Flow";
                SSMParameterCode.Throttle_Opening_Angle = "Throttle_Opening_Angle";
                SSMParameterCode.Front_O2_Sensor_1 = "Front_O2_Sensor_1";
                SSMParameterCode.Rear_O2_Sensor = "Rear_O2_Sensor";
                SSMParameterCode.Front_O2_Sensor_2 = "Front_O2_Sensor_2";
                SSMParameterCode.Battery_Voltage = "Battery_Voltage";
                SSMParameterCode.Air_Flow_Sensor_Voltage = "Air_Flow_Sensor_Voltage";
                SSMParameterCode.Throttle_Sensor_Voltage = "Throttle_Sensor_Voltage";
                SSMParameterCode.Differential_Pressure_Sensor_Voltage = "Differential_Pressure_Sensor_Voltage";
                SSMParameterCode.Fuel_Injection_1_Pulse_Width = "Fuel_Injection_1_Pulse_Width";
                SSMParameterCode.Fuel_Injection_2_Pulse_Width = "Fuel_Injection_2_Pulse_Width";
                SSMParameterCode.Knock_Correction = "Knock_Correction";
                SSMParameterCode.Atmospheric_Pressure = "Atmospheric_Pressure";
                SSMParameterCode.Manifold_Relative_Pressure = "Manifold_Relative_Pressure";
                SSMParameterCode.Pressure_Differential_Sensor = "Pressure_Differential_Sensor";
                SSMParameterCode.Fuel_Tank_Pressure = "Fuel_Tank_Pressure";
                SSMParameterCode.CO_Adjustment = "CO_Adjustment";
                SSMParameterCode.Learned_Ignition_Timing = "Learned_Ignition_Timing";
                SSMParameterCode.Accelerator_Opening_Angle = "Accelerator_Opening_Angle";
                SSMParameterCode.Fuel_Temperature = "Fuel_Temperature";
                SSMParameterCode.Front_O2_Heater_1 = "Front_O2_Heater_1";
                SSMParameterCode.Rear_O2_Heater_Current = "Rear_O2_Heater_Current";
                SSMParameterCode.Front_O2_Heater_2 = "Front_O2_Heater_2";
                SSMParameterCode.Fuel_Level = "Fuel_Level";
                SSMParameterCode.Primary_Wastegate_Duty_Cycle = "Primary_Wastegate_Duty_Cycle";
                SSMParameterCode.Secondary_Wastegate_Duty_Cycle = "Secondary_Wastegate_Duty_Cycle";
                SSMParameterCode.CPC_Valve_Duty_Ratio = "CPC_Valve_Duty_Ratio";
                SSMParameterCode.Tumble_Valve_Position_Sensor_Right = "Tumble_Valve_Position_Sensor_Right";
                SSMParameterCode.Tumble_Valve_Position_Sensor_Left = "Tumble_Valve_Position_Sensor_Left";
                SSMParameterCode.Idle_Speed_Control_Valve_Duty_Ratio = "Idle_Speed_Control_Valve_Duty_Ratio";
                SSMParameterCode.Air_Fuel_Lean_Correction = "Air_Fuel_Lean_Correction";
                SSMParameterCode.Air_Fuel_Heater_Duty = "Air_Fuel_Heater_Duty";
                SSMParameterCode.Idle_Speed_Control_Valve_Step = "Idle_Speed_Control_Valve_Step";
                SSMParameterCode.Number_of_Ex_Gas_Recirc_Steps = "Number_of_Ex_Gas_Recirc_Steps";
                SSMParameterCode.Alternator_Duty = "Alternator_Duty";
                SSMParameterCode.Fuel_Pump_Duty = "Fuel_Pump_Duty";
                SSMParameterCode.Intake_VVT_Advance_Angle_Right = "Intake_VVT_Advance_Angle_Right";
                SSMParameterCode.Intake_VVT_Advance_Angle_Left = "Intake_VVT_Advance_Angle_Left";
                SSMParameterCode.Intake_OCV_Duty_Right = "Intake_OCV_Duty_Right";
                SSMParameterCode.Intake_OCV_Duty_Left = "Intake_OCV_Duty_Left";
                SSMParameterCode.Intake_OCV_Current_Right = "Intake_OCV_Current_Right";
                SSMParameterCode.Intake_OCV_Current_Left = "Intake_OCV_Current_Left";
                SSMParameterCode.Air_Fuel_Sensor_1_Current = "Air_Fuel_Sensor_1_Current";
                SSMParameterCode.Air_Fuel_Sensor_2_Current = "Air_Fuel_Sensor_2_Current";
                SSMParameterCode.Air_Fuel_Sensor_1_Resistance = "Air_Fuel_Sensor_1_Resistance";
                SSMParameterCode.Air_Fuel_Sensor_2_Resistance = "Air_Fuel_Sensor_2_Resistance";
                SSMParameterCode.Air_Fuel_Sensor_1 = "Air_Fuel_Sensor_1";
                SSMParameterCode.Air_Fuel_Sensor_2 = "Air_Fuel_Sensor_2";
                SSMParameterCode.Gear_Position = "Gear_Position";
                SSMParameterCode.A_F_Sensor_1_Heater_Current = "A_F_Sensor_1_Heater_Current";
                SSMParameterCode.A_F_Sensor_2_Heater_Current = "A_F_Sensor_2_Heater_Current";
                SSMParameterCode.Roughness_Monitor_Cylinder_1 = "Roughness_Monitor_Cylinder_1";
                SSMParameterCode.Roughness_Monitor_Cylinder_2 = "Roughness_Monitor_Cylinder_2";
                SSMParameterCode.Air_Fuel_Correction_3 = "Air_Fuel_Correction_3";
                SSMParameterCode.Air_Fuel_Learning_3 = "Air_Fuel_Learning_3";
                SSMParameterCode.Rear_O2_Heater_Voltage = "Rear_O2_Heater_Voltage";
                SSMParameterCode.Air_Fuel_Adjustment_Voltage = "Air_Fuel_Adjustment_Voltage";
                SSMParameterCode.Roughness_Monitor_Cylinder_3 = "Roughness_Monitor_Cylinder_3";
                SSMParameterCode.Roughness_Monitor_Cylinder_4 = "Roughness_Monitor_Cylinder_4";
                SSMParameterCode.Throttle_Motor_Duty = "Throttle_Motor_Duty";
                SSMParameterCode.Throttle_Motor_Voltage = "Throttle_Motor_Voltage";
                SSMParameterCode.Sub_Throttle_Sensor = "Sub_Throttle_Sensor";
                SSMParameterCode.Main_Throttle_Sensor = "Main_Throttle_Sensor";
                SSMParameterCode.Sub_Accelerator_Sensor = "Sub_Accelerator_Sensor";
                SSMParameterCode.Main_Accelerator_Sensor = "Main_Accelerator_Sensor";
                SSMParameterCode.Brake_Booster_Pressure = "Brake_Booster_Pressure";
                SSMParameterCode.Fuel_Rail_Pressure = "Fuel_Rail_Pressure";
                SSMParameterCode.Exhaust_Gas_Temperature = "Exhaust_Gas_Temperature";
                SSMParameterCode.Cold_Start_Injector = "Cold_Start_Injector";
                SSMParameterCode.SCV_Step = "SCV_Step";
                SSMParameterCode.Memorised_Cruise_Speed = "Memorised_Cruise_Speed";
                SSMParameterCode.Exhaust_VVT_Advance_Angle_Right = "Exhaust_VVT_Advance_Angle_Right";
                SSMParameterCode.Exhaust_VVT_Advance_Angle_Left = "Exhaust_VVT_Advance_Angle_Left";
                SSMParameterCode.Exhaust_OCV_Duty_Right = "Exhaust_OCV_Duty_Right";
                SSMParameterCode.Exhaust_OCV_Duty_Left = "Exhaust_OCV_Duty_Left";
                SSMParameterCode.Exhaust_OCV_Current_Right = "Exhaust_OCV_Current_Right";
                SSMParameterCode.Exhaust_OCV_Current_Left = "Exhaust_OCV_Current_Left";
                SSMParameterCode.Switch_P0x061 = "Switch_P0x061";
                SSMParameterCode.Switch_P0x062 = "Switch_P0x062";
                SSMParameterCode.Switch_P0x063 = "Switch_P0x063";
                SSMParameterCode.Switch_P0x064 = "Switch_P0x064";
                SSMParameterCode.Switch_P0x065 = "Switch_P0x065";
                SSMParameterCode.Switch_P0x066 = "Switch_P0x066";
                SSMParameterCode.Switch_P0x067 = "Switch_P0x067";
                SSMParameterCode.Switch_P0x068 = "Switch_P0x068";
                SSMParameterCode.Switch_P0x069 = "Switch_P0x069";
                SSMParameterCode.Switch_P0x120 = "Switch_P0x120";
                SSMParameterCode.Switch_P0x121 = "Switch_P0x121";
            })(SSMParameterCode = communication.SSMParameterCode || (communication.SSMParameterCode = {}));
            var OBDIIParameterCode;
            (function (OBDIIParameterCode) {
                OBDIIParameterCode.Engine_Load = "Engine_Load";
                OBDIIParameterCode.Coolant_Temperature = "Coolant_Temperature";
                OBDIIParameterCode.Air_Fuel_Correction_1 = "Air_Fuel_Correction_1";
                OBDIIParameterCode.Air_Fuel_Learning_1 = "Air_Fuel_Learning_1";
                OBDIIParameterCode.Air_Fuel_Correction_2 = "Air_Fuel_Correction_2";
                OBDIIParameterCode.Air_Fuel_Learning_2 = "Air_Fuel_Learning_2";
                OBDIIParameterCode.Fuel_Tank_Pressure = "Fuel_Tank_Pressure";
                OBDIIParameterCode.Manifold_Absolute_Pressure = "Manifold_Absolute_Pressure";
                OBDIIParameterCode.Engine_Speed = "Engine_Speed";
                OBDIIParameterCode.Vehicle_Speed = "Vehicle_Speed";
                OBDIIParameterCode.Ignition_Timing = "Ignition_Timing";
                OBDIIParameterCode.Intake_Air_Temperature = "Intake_Air_Temperature";
                OBDIIParameterCode.Mass_Air_Flow = "Mass_Air_Flow";
                OBDIIParameterCode.Throttle_Opening_Angle = "Throttle_Opening_Angle";
                OBDIIParameterCode.Run_time_since_engine_start = "Run_time_since_engine_start";
                OBDIIParameterCode.Distance_traveled_with_MIL_on = "Distance_traveled_with_MIL_on";
                OBDIIParameterCode.Fuel_Rail_Pressure = "Fuel_Rail_Pressure";
                OBDIIParameterCode.Fuel_Rail_Pressure_diesel = "Fuel_Rail_Pressure_diesel";
                OBDIIParameterCode.Commanded_EGR = "Commanded_EGR";
                OBDIIParameterCode.EGR_Error = "EGR_Error";
                OBDIIParameterCode.Commanded_evaporative_purge = "Commanded_evaporative_purge";
                OBDIIParameterCode.Fuel_Level_Input = "Fuel_Level_Input";
                OBDIIParameterCode.Number_of_warmups_since_codes_cleared = "Number_of_warmups_since_codes_cleared";
                OBDIIParameterCode.Distance_traveled_since_codes_cleared = "Distance_traveled_since_codes_cleared";
                OBDIIParameterCode.Evap_System_Vapor_Pressure = "Evap_System_Vapor_Pressure";
                OBDIIParameterCode.Atmospheric_Pressure = "Atmospheric_Pressure";
                OBDIIParameterCode.Catalyst_TemperatureBank_1_Sensor_1 = "Catalyst_TemperatureBank_1_Sensor_1";
                OBDIIParameterCode.Catalyst_TemperatureBank_2_Sensor_1 = "Catalyst_TemperatureBank_2_Sensor_1";
                OBDIIParameterCode.Catalyst_TemperatureBank_1_Sensor_2 = "Catalyst_TemperatureBank_1_Sensor_2";
                OBDIIParameterCode.Catalyst_TemperatureBank_2_Sensor_2 = "Catalyst_TemperatureBank_2_Sensor_2";
                OBDIIParameterCode.Battery_Voltage = "Battery_Voltage";
                OBDIIParameterCode.Absolute_load_value = "Absolute_load_value";
                OBDIIParameterCode.Command_equivalence_ratio = "Command_equivalence_ratio";
                OBDIIParameterCode.Relative_throttle_position = "Relative_throttle_position";
                OBDIIParameterCode.Ambient_air_temperature = "Ambient_air_temperature";
                OBDIIParameterCode.Absolute_throttle_position_B = "Absolute_throttle_position_B";
                OBDIIParameterCode.Absolute_throttle_position_C = "Absolute_throttle_position_C";
                OBDIIParameterCode.Accelerator_pedal_position_D = "Accelerator_pedal_position_D";
                OBDIIParameterCode.Accelerator_pedal_position_E = "Accelerator_pedal_position_E";
                OBDIIParameterCode.Accelerator_pedal_position_F = "Accelerator_pedal_position_F";
                OBDIIParameterCode.Commanded_throttle_actuator = "Commanded_throttle_actuator";
                OBDIIParameterCode.Time_run_with_MIL_on = "Time_run_with_MIL_on";
                OBDIIParameterCode.Time_since_trouble_codes_cleared = "Time_since_trouble_codes_cleared";
                OBDIIParameterCode.Ethanol_fuel_percent = "Ethanol_fuel_percent";
            })(OBDIIParameterCode = communication.OBDIIParameterCode || (communication.OBDIIParameterCode = {}));
        })(communication = lib.communication || (lib.communication = {}));
    })(lib = webSocketGauge.lib || (webSocketGauge.lib = {}));
})(webSocketGauge || (webSocketGauge = {}));
//# sourceMappingURL=websocketClient.js.map