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

import { VALInterpolationBuffer } from "./utils/Interpolation";
import * as JSONFormats from "./JSONFormats";
import { WebsocketCommon } from "./WebsocketCommon";
import { ReadModeCode } from "./parameterCode/ReadModeCode";
import { SSMParameterCode } from "./parameterCode/SSMParameterCode";
import { SSMSwitchCode } from "./parameterCode/SSMSwitchCode";

export class SSMWebsocket extends WebsocketCommon {
    private onVALPacketReceived: (intervalTime: number, val: { [code: string]: string }) => void;

    //Internal state
    private valPacketPreviousTimeStamp: number;
    private valPacketIntervalTime: number;

    //Interpolate value buffer
    private interpolateBuffers: { [code: string]: VALInterpolationBuffer } = {};
    //Switch data buffer    
    private switchFlagBuffers: { [code: string]: boolean } = {};

    constructor() {
        super();
        this.modePrefix = "SSM";
        this.valPacketPreviousTimeStamp = window.performance.now();
        this.valPacketIntervalTime = 0;
    }

    private checkInterpolateBufferAndCreateIfEmpty(code: string): void {
        if (!(code in this.interpolateBuffers))
            this.interpolateBuffers[code] = new VALInterpolationBuffer();
    }

    private checkSwitchFlagBuffersAndCreateIfEmpty(code: string): void {
        if (!(code in this.switchFlagBuffers))
            this.switchFlagBuffers[code] = false;
    }

    public getVal(code: SSMParameterCode, timestamp: number): number {
        const codeStr = SSMParameterCode[code];
        this.checkInterpolateBufferAndCreateIfEmpty(codeStr);
        return this.interpolateBuffers[codeStr].getVal(timestamp);
    }

    public getRawVal(code: SSMParameterCode): number {
        const codeStr = SSMParameterCode[code];
        this.checkInterpolateBufferAndCreateIfEmpty(codeStr);
        return this.interpolateBuffers[codeStr].getRawVal();
    }

    public getSwitchFlag(code: SSMSwitchCode): boolean {
        const codeStr = SSMSwitchCode[code];
        this.checkSwitchFlagBuffersAndCreateIfEmpty[codeStr];
        return this.switchFlagBuffers[codeStr];
    }

    public SendCOMRead(code: SSMParameterCode, readmode: ReadModeCode, flag: boolean): void {
        if (!this.IsConnetced)
            return;

        const sendCOMReadObj = new JSONFormats.SendCOMReadJSONMessage();
        sendCOMReadObj.mode = this.modePrefix + "_COM_READ";
        sendCOMReadObj.code = SSMParameterCode[code];
        sendCOMReadObj.read_mode = ReadModeCode[readmode];
        sendCOMReadObj.flag = flag;
        const jsonstr = JSON.stringify(sendCOMReadObj);
        this.WebSocket.send(jsonstr);
    }

    public SendSlowreadInterval(interval: number): void {
        if (!this.IsConnetced)
            return;

        const sendSlowreadIntervalObj = new JSONFormats.SendSlowReadIntervalJSONMessage();
        sendSlowreadIntervalObj.mode = this.modePrefix + "_SLOWREAD_INTERVAL";
        sendSlowreadIntervalObj.interval = interval;
        const jsonstr = JSON.stringify(sendSlowreadIntervalObj);
        this.WebSocket.send(jsonstr);
    }

    private processVALJSONMessage(receivedJson: JSONFormats.StringVALJSONMessage): void {
        //Update interval time
        const nowTime = window.performance.now();
        this.valPacketIntervalTime = nowTime - this.valPacketPreviousTimeStamp;
        this.valPacketPreviousTimeStamp = nowTime;

        // Invoke VALPacketReceived Event
        if (typeof (this.onVALPacketReceived) !== "undefined")
            this.onVALPacketReceived(this.valPacketIntervalTime, receivedJson.val);

        // Store value into interpolation buffers
        for (const key in receivedJson.val) {
            const valStr: string = receivedJson.val[key];

            if (Object.values(SSMParameterCode).includes(key as SSMParameterCode)) {
                const val = Number(valStr);
                // Register to interpolate buffer
                this.checkInterpolateBufferAndCreateIfEmpty(key);
                this.interpolateBuffers[key].setVal(val);
            }
            else if (Object.values(SSMSwitchCode).includes(key as SSMSwitchCode)) {
                let valFlag: boolean;
                if (valStr.toLowerCase() === "true")
                    valFlag = true;
                else if (valStr.toLowerCase() === "false")
                    valFlag = false;
                else
                    throw EvalError("Value of switch data is neither true nor false. value=" + valStr);

                this.switchFlagBuffers[key] = valFlag;
            }
            else
                throw EvalError("Key of VAL message is not found in SSMParameterCode or SSMSwitchCode. key=" + key);
        }
    }

    private processERRJSONMessage(receivedJson: JSONFormats.ErrorJSONMessage) {
        if (typeof (this.OnERRPacketReceived) !== "undefined")
            this.OnERRPacketReceived(receivedJson.msg);
    }

    private processRESJSONMessage(receivedJson: JSONFormats.ResponseJSONMessage) {
        if (typeof (this.OnRESPacketReceived) !== "undefined")
            this.OnRESPacketReceived(receivedJson.msg);
    }

    protected parseIncomingMessage(msg: string): void {
        const receivedJsonObj: JSONFormats.IJSONMessage | JSONFormats.StringVALJSONMessage | JSONFormats.ErrorJSONMessage | JSONFormats.ResponseJSONMessage = JSON.parse(msg);
        const modeCode: string = (receivedJsonObj).mode;
        switch (modeCode) {
            case ("VAL"):
                this.processVALJSONMessage(receivedJsonObj as JSONFormats.StringVALJSONMessage);
                break;
            case ("ERR"):
                this.processERRJSONMessage(receivedJsonObj as JSONFormats.ErrorJSONMessage);
                break;
            case ("RES"):
                this.processRESJSONMessage(receivedJsonObj as JSONFormats.ResponseJSONMessage);
                break;
            default:
                this.OnWebsocketError("Unknown mode packet received. " + msg);
        }
    }

    public get OnVALPacketReceived(): (intervalTime: number, val: { [code: string]: string }) => void { return this.onVALPacketReceived }
    public set OnVALPacketReceived(func: (intervalTime: number, val: { [code: string]: string }) => void) { this.onVALPacketReceived = func }
    public get VALPacketIntervalTime(): number { return this.valPacketIntervalTime; }
}
