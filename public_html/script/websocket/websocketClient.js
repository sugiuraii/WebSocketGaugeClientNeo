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
            })(JSONFormats || (JSONFormats = {}));
            var WebsocketCommon = (function () {
                function WebsocketCommon() {
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
                };
                /**
                * Send reset packet.
                */
                WebsocketCommon.prototype.SendReset = function () {
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
                    var sendWSSendObj = {
                        mode: this.ModePrefix + "_WS_SEND",
                        code: code,
                        flag: flag
                    };
                    var jsonstr = JSON.stringify(sendWSSendObj);
                    this.WebSocket.send(jsonstr);
                };
                DefiCOMWebsocket.prototype.SendWSInterval = function (interval) {
                    var sendWSIntervalObj;
                    sendWSIntervalObj.mode = this.ModePrefix + +"_WS_INTERVAL";
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
                    var sendCOMReadObj;
                    sendCOMReadObj.mode = this.ModePrefix + "_COM_READ";
                    sendCOMReadObj.code = code;
                    sendCOMReadObj.read_mode = readmode;
                    sendCOMReadObj.flag = flag;
                    var jsonstr = JSON.stringify(sendCOMReadObj);
                    this.WebSocket.send(jsonstr);
                };
                SSMWebsocket.prototype.SendSlowreadInterval = function (interval) {
                    var sendSlowreadIntervalObj;
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
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.ModePrefix = "FUELTRIP";
                    return _this;
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
                    var obj = new JSONFormats.SectStoreMaxJSONMessage();
                    obj.storemax = storeMax;
                    var jsonstr = JSON.stringify(obj);
                    this.WebSocket.send(jsonstr);
                };
                ;
                FUELTRIPWebsocket.prototype.SendSectSpan = function (sectSpan) {
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
        })(communication = lib.communication || (lib.communication = {}));
    })(lib = webSocketGauge.lib || (webSocketGauge.lib = {}));
})(webSocketGauge || (webSocketGauge = {}));
//# sourceMappingURL=websocketClient.js.map