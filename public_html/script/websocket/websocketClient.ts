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
    namespace JSONFormat
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
    }
    abstract class WebsocketCommon
    {
        private websocket: WebSocket;
        private url : string;
        private onRESPacketReceived : (msg:string)=>void;
        private onERRPacketReceived : (msg:string)=>void;
        private onWebsocketOpen : ()=>void;
        private onWebsocketClose : ()=>void;
        private onWebsocketError : (msg:string)=>void;
        
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
                self.onWebsocketOpen();
            };
            // when the connection is closed, this method is called
            this.websocket.onclose = function () {
                self.onWebsocketClose();
            };
        }
        
        /**
        * Send reset packet.
        */
        public SendReset(): void
        {
            let jsonstr: string = JSON.stringify(new JSONFormat.ResetJSONMessage());
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
        public get OnRESPacketReceived() : (msg: string) => void { return this.onRESPacketReceived; };
        public set OnRESPacketReceived(func : (msg: string) => void) { this.onRESPacketReceived = func; };
        public get OnERRPacketReceived() : (msg: string) => void { return this.onERRPacketReceived; };
        public set OnERRPacketReceived(func : (msg: string) => void) { this.onERRPacketReceived = func; };
        public get OnWebsocketOpen(): () => void {return this.onWebsocketOpen; };
        public set OnWebsocketOpen(func: () => void) {this.onWebsocketOpen = func; };
        public get OnWebsocketClose(): () => void {return this.onWebsocketClose; };
        public set OnWebsocketClose(func: () => void) {this.onWebsocketClose = func; };
        public get OnWebsocketError(): (msg:string)=>void {return this.onWebsocketError; };
        public set OnWebsocketError(func: (msg:string)=>void) {this.onWebsocketError = func; };
    }
    
    /**
    * Superclass of Defi/SSM/Arduino/ELM327 websocket.
    */
    abstract class DefiSSMWebsocketCommon extends WebsocketCommon
    {
        protected ModePrefix: string;
        private recordIntervalTimeEnabled : boolean;
        
        private onVALPacketReceived : {[code : string] : (val : number)=>void};
        
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
            let receivedJSONIface: JSONFormat.IJSONMessage = receivedJson;
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
                    
                    let receivedVALJSON: JSONFormat.VALJSONMessage = receivedJson;
                    for (let key in receivedVALJSON.val)
                    {
                        if (key in this.onVALPacketReceived)
                            this.OnVALPacketReceived[key](receivedVALJSON.val[key]);
                    }
                    break;
                case("ERR"):
                    let receivedERRJSON: JSONFormat.ErrorJSONMessage = receivedJson;
                    this.OnERRPacketReceived(receivedERRJSON.msg);
                    break;
                case("RES"):
                    let receivedRESJSON: JSONFormat.ResponseJSONMessage = receivedJson;
                    this.OnRESPacketReceived(receivedRESJSON.msg);
                    break;
                default:
                    this.OnWebsocketError("Unknown mode packet received. " + msg);
            };
        }
        
        public get RecordIntervalTimeEnabled(): boolean { return this.recordIntervalTimeEnabled;}
        public set RecordIntervalTimeEnabled(val : boolean) { this.recordIntervalTimeEnabled = val;}
        public get OnVALPacketReceived(): {[code : string] : (val : number)=>void} {return this.onVALPacketReceived;}
        public set OnVALPacketReceived(funclist: {[code : string] : (val : number)=>void}) {this.onVALPacketReceived = funclist;}
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
            let sendWSSendObj :
            {
                mode : string,
                code : string,
                flag : boolean
            };
            sendWSSendObj.mode = this.ModePrefix + "_WS_SEND";
            sendWSSendObj.code = code;
            sendWSSendObj.flag = flag;
            let jsonstr: string = JSON.stringify(sendWSSendObj);
            this.WebSocket.send(jsonstr);
        }
        
        public SendWSInterval(interval : number) : void
        {
            let sendWSIntervalObj : 
            {
                mode : string,
                interval : number
            };
            sendWSIntervalObj.mode = this.ModePrefix +  + "_WS_INTERVAL";
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
            let sendCOMReadObj : {
                mode : string,
                code : string,
                read_mode : string,
                flag : boolean
            };
            sendCOMReadObj.mode = this.ModePrefix + "_COM_READ";
            sendCOMReadObj.code = code;
            sendCOMReadObj.read_mode = readmode;
            sendCOMReadObj.flag = flag;
            const jsonstr = JSON.stringify(sendCOMReadObj);
            this.WebSocket.send(jsonstr);
        }
        
        public SendSlowreadInterval(interval : number)
        {
            let sendSlowreadIntervalObj : {
                mode : string,
                interval : number
            }
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
        private ModePrefix = "FUELTRIP";
        private onMomentFUELTRIPPacketReceived : (momentGasMilage : number, totalGas : number, totalTrip : number, totalGasMilage : number)=>void;
        private onSectFUELTRIPPacketReceived : (sectSpan : number, sectTrip : number[], sectGas : number[], sectGasMilage: number[])=>void;
        
        get OnMomentFUELTRIPPacketReceived() { return this.onMomentFUELTRIPPacketReceived;}
        set OnMomentFUELTRIPPacketReceived(func) { this.onMomentFUELTRIPPacketReceived = func; }
        get OnSectFUELTRIPPacketReceived() { return this.onSectFUELTRIPPacketReceived;}
        set OnSectFUELTRIPPacketReceived(func) { this.onSectFUELTRIPPacketReceived = func; }        

        public SendSectStoreMax(storeMax : number): void
        {
            const obj = new JSONFormat.SectStoreMaxJSONMessage();
            obj.storemax = storeMax;
            const jsonstr:string = JSON.stringify(obj);
            this.WebSocket.send(jsonstr);    
        };
        public SendSectSpan(sectSpan : number): void
        {
            const obj = new JSONFormat.SectSpanJSONMessage();
            obj.sect_span = sectSpan;
            const jsonstr: string = JSON.stringify(obj);
            this.WebSocket.send(jsonstr);
        }
        
        protected parseIncomingMessage(msg : string) : void
        {
            const recevedJSONIface: JSONFormat.IJSONMessage = JSON.parse(msg);
            switch(recevedJSONIface.mode)
            {
                case ("MOMENT_FUELTRIP") :
                {
                    const jsonObj: JSONFormat.MomentFuelTripJSONMessage = JSON.parse(msg);
                    this.onMomentFUELTRIPPacketReceived(jsonObj.moment_gasmilage,
                    jsonObj.total_gas,
                    jsonObj.total_trip,
                    jsonObj.total_gasmilage);
                    break;
                }
                case ("SECT_FUELTRIP") :
                {
                    const jsonObj: JSONFormat.SectFuelTripJSONMessage = JSON.parse(msg);
                    this.onSectFUELTRIPPacketReceived(jsonObj.sect_span,
                    jsonObj.sect_trip,
                    jsonObj.sect_gas,
                    jsonObj.sect_gasmilage);
                    break;
                }
                case("ERR"):
                {
                    const jsonObj: JSONFormat.ErrorJSONMessage = JSON.parse(msg);
                    this.OnERRPacketReceived(jsonObj.msg);
                    break;
                }
                case("RES"):
                {
                    const jsonObj: JSONFormat.ResponseJSONMessage = JSON.parse(msg);
                    this.OnRESPacketReceived(jsonObj.msg);
                    break;
                }
                default:
                    this.OnWebsocketError("Unknown mode packet received. " + msg);
            }
        }
    }
}
