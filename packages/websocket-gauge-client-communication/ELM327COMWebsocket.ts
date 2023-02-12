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

import { Interpolator, InterpolatorFactory } from './utils/Interpolator';
import * as JSONFormats from "./JSONFormats";
import { WebsocketCommon } from "./WebsocketCommon";
import { ReadModeCode } from "./parameterCode/ReadModeCode";
import { OBDIIParameterCode } from "./parameterCode/OBDIIParameterCode";

export class ELM327COMWebsocket extends WebsocketCommon {
    private onVALPacketReceived: (intervalTime: number, val: { [code: string]: string }) => void;

    //Internal state
    private valPacketPreviousTimeStamp: number;
    private valPacketIntervalTime: number;

    //Interpolate value buffer
    private interpolateBuffers: { [code: string]: Interpolator } = {};

    constructor(url? : string) {
        super(url);
        this.modePrefix = "ELM327";
        this.valPacketPreviousTimeStamp = window.performance.now();
        this.valPacketIntervalTime = 0;
        this.onVALPacketReceived = () => {/* do nothing*/};
    }

    private checkInterpolateBufferAndCreateIfEmpty(code: OBDIIParameterCode): void {
        if (!(code in this.interpolateBuffers)) {
            const interpolatorFactory = new InterpolatorFactory()
            this.interpolateBuffers[code] = interpolatorFactory.getLinearInterpolator();
        }
    }

    public getVal(code: OBDIIParameterCode, timestamp: number): number {
        this.checkInterpolateBufferAndCreateIfEmpty(code);
        return this.interpolateBuffers[code].getVal(timestamp);
    }

    public getRawVal(code: OBDIIParameterCode): number {
        this.checkInterpolateBufferAndCreateIfEmpty(code);
        return this.interpolateBuffers[code].getRawVal();
    }

    public SendCOMRead(code: OBDIIParameterCode, readmode: ReadModeCode, flag: boolean): void {
        if (!this.IsConnetced)
            return;

        const sendCOMReadObj = new JSONFormats.SendCOMReadJSONMessage();
        sendCOMReadObj.mode = this.modePrefix + "_COM_READ";
        sendCOMReadObj.code = OBDIIParameterCode[code];
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

            if (Object.values(OBDIIParameterCode).includes(key as OBDIIParameterCode)) {
                const val = Number(valStr);
                // Register to interpolate buffer
                this.checkInterpolateBufferAndCreateIfEmpty(key as OBDIIParameterCode);
                this.interpolateBuffers[key].setVal(val);
            }
            else
                throw EvalError("Key of VAL message is not found in OBDIIParameterCode. key=" + key);
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
        const modeCode: string = receivedJsonObj.mode;
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
