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

import * as Interpolation from "./private/Interpolation";
import * as JSONFormats from "./private/JSONFormats";

export abstract class WebsocketCommon
{
    protected modePrefix: string;
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

    public get ModePrefix() : string {return this.modePrefix;}
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
    private recordIntervalTimeEnabled : boolean;

    private onVALPacketReceivedByCode : {[code : string] : (val : number)=>void};
    private onVALPacketReceived : (intervalTime : number, val:{[code : string] : number}) => void;

    //Internal state
    private valPacketPreviousTimeStamp : number;
    private valPacketIntervalTime : number;

    //Interpolate value buffer
    private interpolateBuffers: {[code: string]: Interpolation.VALInterpolationBuffer} = {};

    constructor()
    {
        super();
        this.recordIntervalTimeEnabled = true;
        this.valPacketPreviousTimeStamp = window.performance.now();
        this.valPacketIntervalTime = 0;
    }

    public EnableInterpolate(code : string) : void
    {
        this.checkInterpolateBufferAndCreateIfEmpty(code);
        this.interpolateBuffers[code].InterpolateEnabled = true;
    }
    public DisableInterpolate(code : string) : void
    {
        this.checkInterpolateBufferAndCreateIfEmpty(code);
        this.interpolateBuffers[code].InterpolateEnabled = false;
    }

    private checkInterpolateBufferAndCreateIfEmpty(code: string): void
    {
        if(!(code in this.interpolateBuffers))
            this.interpolateBuffers[code] = new Interpolation.VALInterpolationBuffer();            
    }

    public getVal(code : string, timestamp : number) : number
    {
        this.checkInterpolateBufferAndCreateIfEmpty(code);
        return this.interpolateBuffers[code].getVal(timestamp);
    }

    public getRawVal(code : string) : number
    {
        this.checkInterpolateBufferAndCreateIfEmpty(code);
        return this.interpolateBuffers[code].getRawVal();
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

                const receivedVALJSON: JSONFormats.VALJSONMessage = receivedJson;

                // Invoke VALPacketReceived Event
                if ( typeof(this.onVALPacketReceived) !== "undefined" )
                    this.OnVALPacketReceived(this.valPacketIntervalTime, receivedVALJSON.val);
                
                    // Store value into interpolation buffers
                for (let key in receivedVALJSON.val)
                {
                    const val: number = Number(receivedVALJSON.val[key]);
                    // Register to interpolate buffer
                    this.checkInterpolateBufferAndCreateIfEmpty(key);
                    this.interpolateBuffers[key].setVal(val);

                    // Invoke onVALPacketReceivedByCode event
                    if (typeof (this.onVALPacketReceivedByCode) !== "undefined")
                    {
                        if (key in this.onVALPacketReceivedByCode)
                            this.OnVALPacketReceivedByCode[key](val);
                    }
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
        this.modePrefix = "DEFI";
    }

    public SendWSSend(code : string, flag : boolean) : void
    {
        if (!this.IsConnetced)
            return;

        let sendWSSendObj = new JSONFormats.SendWSSendJSONMessage();          
        sendWSSendObj.mode = this.modePrefix + "_WS_SEND";
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
        sendWSIntervalObj.mode = this.modePrefix + "_WS_INTERVAL";
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
        this.modePrefix = "ARDUINO";
    }
}

export class SSMWebsocket extends DefiSSMWebsocketCommon
{
    constructor()
    {
        super();
        this.modePrefix = "SSM";
    }

    public SendCOMRead(code: string, readmode: string, flag: boolean): void
    {
        if (!this.IsConnetced)
            return;

        let sendCOMReadObj = new JSONFormats.SendCOMReadJSONMessage();
        sendCOMReadObj.mode = this.modePrefix + "_COM_READ";
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
        sendSlowreadIntervalObj.mode = this.modePrefix + "_SLOWREAD_INTERVAL";
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
        this.modePrefix = "ELM327";
    }
}

export class FUELTRIPWebsocket extends WebsocketCommon
{
    //private modePrefix = "FUELTRIP";
    private onMomentFUELTRIPPacketReceived: (momentGasMilage : number, totalGas : number, totalTrip : number, totalGasMilage : number)=>void;
    private onSectFUELTRIPPacketReceived: (sectSpan : number, sectTrip : number[], sectGas : number[], sectGasMilage: number[])=>void;
        
    private recordIntervalTimeEnabled : boolean;
    //Internal state
    private momentFUELTripPacketPreviousTimeStamp : number;
    private momentFUELTripPacketIntervalTime : number;

    //Interpolate value buffer (Momnt fuel trip only)
    private momentGasMilageInterpolateBuffer = new Interpolation.VALInterpolationBuffer();
    private totalGas = 0;
    private totalTrip = 0;
    private totalGasMilage = 0;
    //Stored sect fuelTrip data
    private sectSpan : number = 0;
    private sectTrip : number[] = new Array();
    private sectGas : number[] = new Array();
    private sectGasMilage : number[] = new Array();
    
    get RecordIntervalTimeEnabled(): boolean { return this.recordIntervalTimeEnabled;}
    set RecordIntervalTimeEnabled(val : boolean) { this.recordIntervalTimeEnabled = val;}
    get OnMomentFUELTRIPPacketReceived() { return this.onMomentFUELTRIPPacketReceived;}
    set OnMomentFUELTRIPPacketReceived(func) { this.onMomentFUELTRIPPacketReceived = func; }
    get OnSectFUELTRIPPacketReceived() { return this.onSectFUELTRIPPacketReceived;}
    set OnSectFUELTRIPPacketReceived(func) { this.onSectFUELTRIPPacketReceived = func; }        
    
    constructor()
    {
        super();
        this.recordIntervalTimeEnabled = true;
        this.momentFUELTripPacketPreviousTimeStamp = window.performance.now();
        this.momentFUELTripPacketIntervalTime = 0;
    }
    
    public EnableInterpolate() : void
    {
        this.momentGasMilageInterpolateBuffer.InterpolateEnabled = true;
    }
    public DisableInterpolate() : void
    {
        this.momentGasMilageInterpolateBuffer.InterpolateEnabled = false;
    }
    public getMomentGasMilage(timestamp : number) : number
    {
        return this.momentGasMilageInterpolateBuffer.getVal(timestamp);
    }
    public getRawMomentGasMilage() : number
    {
        return this.momentGasMilageInterpolateBuffer.getRawVal();
    }
    public getTotalTrip() : number
    {
        return this.totalTrip;
    }
    public getTotalGas() : number
    {
        return this.totalGas;
    }
    public getTotalGasMilage() : number
    {
        return this.totalGasMilage;
    }
    public getSectSpan() : number
    {
        return this.sectSpan;
    }
    public getSectTrip() : number[]
    {
        return this.sectTrip;
    }
    public getSectGas() : number[]
    {
        return this.sectGas;
    }
    public getSectGasMilage() : number[]
    {
        return this.sectGasMilage;
    }
    
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
                if (this.recordIntervalTimeEnabled)
                {
                    //Update interval time
                    var nowTime = window.performance.now();
                    this.momentFUELTripPacketIntervalTime = nowTime - this.momentFUELTripPacketPreviousTimeStamp;
                    this.momentFUELTripPacketPreviousTimeStamp = nowTime;
                }
                
                const jsonObj: JSONFormats.MomentFuelTripJSONMessage = JSON.parse(msg);
                
                // Invoke MomentFUELTRIPPacketReceived Event
                if (typeof (this.onMomentFUELTRIPPacketReceived) !== "undefined")
                {
                    this.onMomentFUELTRIPPacketReceived(jsonObj.moment_gasmilage,
                    jsonObj.total_gas,
                    jsonObj.total_trip,
                    jsonObj.total_gasmilage);
                }
                
                //Store buffers
                this.momentGasMilageInterpolateBuffer.setVal(jsonObj.moment_gasmilage);
                this.totalGas = jsonObj.total_gas;
                this.totalTrip = jsonObj.total_trip;
                this.totalGasMilage = jsonObj.total_gasmilage;
                
                break;
            }
            case ("SECT_FUELTRIP") :
            {
                const jsonObj: JSONFormats.SectFuelTripJSONMessage = JSON.parse(msg);
                // Invoke SECTFUELTRIPPacketReceived Event
                if (typeof (this.onSectFUELTRIPPacketReceived) !== "undefined")
                {
                    this.onSectFUELTRIPPacketReceived(jsonObj.sect_span,
                    jsonObj.sect_trip,
                    jsonObj.sect_gas,
                    jsonObj.sect_gasmilage);
                }
                
                //Store values to buffer
                this.sectSpan = jsonObj.sect_span;
                this.sectTrip = jsonObj.sect_trip;
                this.sectGas = jsonObj.sect_gas;
                this.sectGasMilage = jsonObj.sect_gasmilage;
                
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
