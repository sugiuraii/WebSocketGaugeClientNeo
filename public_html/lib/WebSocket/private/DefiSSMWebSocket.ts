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

import * as Interpolation from "./Interpolation";
import * as JSONFormats from "./JSONFormats";
import {WebsocketCommon} from "./WebsocketCommon";

/**
* Superclass of Defi/SSM/Arduino/ELM327 websocket.
*/
abstract class DefiSSMWebsocketCommon extends WebsocketCommon
{
    private recordIntervalTimeEnabled : boolean;

    private onVALPacketReceivedByCode : {[code : string] : (val : string)=>void};
    private onVALPacketReceived : (intervalTime : number, val:{[code : string] : string}) => void;

    //Internal state
    private valPacketPreviousTimeStamp : number;
    private valPacketIntervalTime : number;

    //Interpolate value buffer
    private interpolateBuffers: {[code: string]: Interpolation.VALInterpolationBuffer} = {};
    
    private switchFlagBuffers: {[code: string] : boolean} = {};

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
    
    public getSwitchFlag(code : string) : boolean
    {
        return this.switchFlagBuffers[code];
    }
    
    private processVALJSONMessage(receivedJson: JSONFormats.StringVALJSONMessage) : void
    {
        if(this.recordIntervalTimeEnabled)
        {
            //Update interval time
            var nowTime = window.performance.now();
            this.valPacketIntervalTime = nowTime - this.valPacketPreviousTimeStamp;
            this.valPacketPreviousTimeStamp = nowTime;
        };

        // Invoke VALPacketReceived Event
        if ( typeof(this.onVALPacketReceived) !== "undefined" )
            this.OnVALPacketReceived(this.valPacketIntervalTime, receivedJson.val);
        
        // Store value into interpolation buffers
        for (let key in receivedJson.val)
        {            
            const valStr : string = receivedJson.val[key];
                        
            // Invoke onVALPacketReceivedByCode event
            if (typeof (this.onVALPacketReceivedByCode) !== "undefined")
            {
                if (key in this.onVALPacketReceivedByCode)
                    this.OnVALPacketReceivedByCode[key](valStr);
            }

            // Store into interpolation(or value) buffer.
            if (valStr.toLowerCase() === "true" || valStr.toLowerCase() === "false") //Val is boolean (ex. SSMSwitchCode)
            {
                let valFlag : boolean;
                if(valStr.toLowerCase() === "true")
                    valFlag = true;
                else
                    valFlag = false;
                
                this.switchFlagBuffers[key] = valFlag;                   
            }
            else // Val is number
            {
                const val: number = Number(receivedJson.val[key]);
                // Register to interpolate buffer
                this.checkInterpolateBufferAndCreateIfEmpty(key);
                this.interpolateBuffers[key].setVal(val);
            }
        }
    }
    
    private processERRJSONMessage(receivedJson: JSONFormats.ErrorJSONMessage)
    {
        if (typeof (this.OnERRPacketReceived) !== "undefined")
            this.OnERRPacketReceived(receivedJson.msg);
    }
    
    private processRESJSONMessage(receivedJson: JSONFormats.ResponseJSONMessage)
    {
        if(typeof (this.OnRESPacketReceived) !== "undefined")
            this.OnRESPacketReceived(receivedJson.msg);
    }
    
    protected parseIncomingMessage(msg : string) : void
    {
        const receivedJson : any = JSON.parse(msg);
        const modeCode : string = (<JSONFormats.IJSONMessage>receivedJson).mode;
        switch (modeCode)
        {
            case ("VAL") :
                this.processVALJSONMessage(<JSONFormats.StringVALJSONMessage>receivedJson);
                break;
            case("ERR"):
                this.processERRJSONMessage(<JSONFormats.ErrorJSONMessage>receivedJson);
                break;
            case("RES"):
                this.processRESJSONMessage(<JSONFormats.ResponseJSONMessage>receivedJson);
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