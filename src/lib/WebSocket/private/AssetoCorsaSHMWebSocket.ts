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

import * as Interpolation from "./Interpolation";
import * as JSONFormats from "./JSONFormats";
import {WebsocketCommon} from "./WebsocketCommon";
import {AssettoCorsaSHMNumericalVALCode,
        AssettoCorsaSHMStringVALCode,
        AssettoCorsaSHMGraphicsParameterCode,
        AssettoCorsaSHMPhysicsParameterCode,
        AssettoCorsaSHMStaticInfoParameterCode} from "./AssettoCorsaSHMParameterCode";

export class AssettoCorsaSHMWebsocket extends WebsocketCommon
{
    private recordIntervalTimeEnabled : boolean;

    private onVALPacketReceivedByCode : {[code : string] : (val : string)=>void};
    private onVALPacketReceived : (intervalTime : number, val:{[code : string] : string}) => void;

    //Internal state
    private valPacketPreviousTimeStamp : number;
    private valPacketIntervalTime : number;

    //Interpolate value buffer
    private valueInterpolateBuffers: {[code: string]: Interpolation.VALInterpolationBuffer} = {};
    
    private stringBuffers: {[code: string] : string} = {};

    constructor()
    {
        super();
        this.modePrefix = "ACSHM";
        this.recordIntervalTimeEnabled = true;
        this.valPacketPreviousTimeStamp = window.performance.now();
        this.valPacketIntervalTime = 0;
    }

    public SendPhysicsWSSend(code : AssettoCorsaSHMPhysicsParameterCode, flag : boolean)
    {
        this.SendWSSend("PHYS", AssettoCorsaSHMPhysicsParameterCode[code], flag);
    }

    public SendGraphicsWSSend(code : AssettoCorsaSHMGraphicsParameterCode, flag : boolean)
    {
        this.SendWSSend("GRPH", AssettoCorsaSHMGraphicsParameterCode[code], flag);
    }

    public SendStaticInfoWSSend(code : AssettoCorsaSHMStaticInfoParameterCode, flag : boolean)
    {
        this.SendWSSend("STATIC", AssettoCorsaSHMStaticInfoParameterCode[code], flag);
    }

    public SendPhysicsWSInterval(interval : number)
    {
        this.SendWSInterval("PHYS", interval);
    }

    public SendGraphicsWSInterval(interval : number)
    {
        this.SendWSInterval("GRPH", interval);
    }

    public SendStaticInfoWSInterval(interval : number)
    {
        this.SendWSInterval("STATIC", interval);
    }

    private SendWSSend(paramtype : string, code : string, flag : boolean) : void
    {
        if (!this.IsConnetced)
            return;

        let sendWSSendObj = new JSONFormats.SendWSSendJSONMessage();          
        sendWSSendObj.mode = this.modePrefix + "_" + paramtype + "_WS_SEND";
        sendWSSendObj.code = code;
        sendWSSendObj.flag = flag;
        let jsonstr: string = JSON.stringify(sendWSSendObj);
        this.WebSocket.send(jsonstr);
    }

    private SendWSInterval(paramtype : string, interval : number) : void
    {
        if (!this.IsConnetced)
            return;

        let sendWSIntervalObj = new JSONFormats.SendWSIntervalJSONMessage();
        sendWSIntervalObj.mode = this.modePrefix + "_" + paramtype + "_WS_INTERVAL";
        sendWSIntervalObj.interval = interval;           
        var jsonstr = JSON.stringify(sendWSIntervalObj);
        this.WebSocket.send(jsonstr);
    }

    public EnableInterpolate(code : AssettoCorsaSHMNumericalVALCode) : void
    {
        this.checkInterpolateBufferAndCreateIfEmpty(code);
        this.valueInterpolateBuffers[code].InterpolateEnabled = true;
    }
    public DisableInterpolate(code : AssettoCorsaSHMNumericalVALCode) : void
    {
        this.checkInterpolateBufferAndCreateIfEmpty(code);
        this.valueInterpolateBuffers[code].InterpolateEnabled = false;
    }

    private checkInterpolateBufferAndCreateIfEmpty(code: AssettoCorsaSHMNumericalVALCode): void
    {
        if(!(code in this.valueInterpolateBuffers))
            this.valueInterpolateBuffers[code] = new Interpolation.VALInterpolationBuffer();            
    }
    
    public getVal(code : AssettoCorsaSHMNumericalVALCode, timestamp : number) : number
    {
        this.checkInterpolateBufferAndCreateIfEmpty(code);
        return this.valueInterpolateBuffers[code].getVal(timestamp);
    }

    public getRawVal(code : AssettoCorsaSHMNumericalVALCode) : number
    {
        this.checkInterpolateBufferAndCreateIfEmpty(code);
        return this.valueInterpolateBuffers[code].getRawVal();
    }
    
    public getStringVal(code : AssettoCorsaSHMStringVALCode) : string
    {
        return this.stringBuffers[code];
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
            if (AssettoCorsaSHMNumericalVALCode[key])// Val is number
            {
                const val: number = Number(receivedJson.val[key]);
                // Register to interpolate buffer
                this.checkInterpolateBufferAndCreateIfEmpty(AssettoCorsaSHMNumericalVALCode[key]);
                this.valueInterpolateBuffers[key].setVal(val);
            }
            else if (AssettoCorsaSHMStringVALCode[key]) //Val is string.
                this.stringBuffers[key] = valStr;                   
            else
                throw new Error("Undefined key of VAL packet is found.");
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