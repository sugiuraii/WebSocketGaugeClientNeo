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

import { WebsocketCommon } from './WebsocketCommon';
import { ArduinoParameterCode } from './parameterCode/ArduinoParameterCode'
import { VALInterpolationBuffer } from './utils/Interpolation';
import * as JSONFormats from './JSONFormats';

export class ArduinoCOMWebsocket extends WebsocketCommon {
    private onVALPacketReceived: (intervalTime: number, val: { [code: string]: string }) => void;

    //Internal state
    private valPacketPreviousTimeStamp: number;
    private valPacketIntervalTime: number;

    //Interpolate value buffer
    private interpolateBuffers: { [code: string]: VALInterpolationBuffer } = {};

    constructor() {
        super();
        this.modePrefix = "ARDUINO";
        this.valPacketPreviousTimeStamp = window.performance.now();
        this.valPacketIntervalTime = 0;
    }

    private checkInterpolateBufferAndCreateIfEmpty(code: string): void {
        if (!(code in this.interpolateBuffers))
            this.interpolateBuffers[code] = new VALInterpolationBuffer();
    }

    public getVal(code: ArduinoParameterCode, timestamp: number): number {
        this.checkInterpolateBufferAndCreateIfEmpty(ArduinoParameterCode[code]);
        return this.interpolateBuffers[ArduinoParameterCode[code]].getVal(timestamp);
    }

    public getRawVal(code: ArduinoParameterCode): number {
        this.checkInterpolateBufferAndCreateIfEmpty(ArduinoParameterCode[code]);
        return this.interpolateBuffers[ArduinoParameterCode[code]].getRawVal();
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
            if (Object.values(ArduinoParameterCode).includes(key as ArduinoParameterCode)) {
                const val = Number(receivedJson.val[key]);
                // Register to interpolate buffer
                this.checkInterpolateBufferAndCreateIfEmpty(key);
                this.interpolateBuffers[key].setVal(val);
            }
            else
                throw Error("VAL JSON key of" + key + "is not found in ArduinoParameterCode.");
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
        const modeCode = receivedJsonObj.mode;
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

    public SendWSSend(code: ArduinoParameterCode, flag: boolean): void {
        if (!this.IsConnetced)
            return;

        const sendWSSendObj = new JSONFormats.SendWSSendJSONMessage();
        sendWSSendObj.mode = this.modePrefix + "_WS_SEND";
        sendWSSendObj.code = ArduinoParameterCode[code];
        sendWSSendObj.flag = flag;
        const jsonstr = JSON.stringify(sendWSSendObj);
        this.WebSocket.send(jsonstr);
    }

    public SendWSInterval(interval: number): void {
        if (!this.IsConnetced)
            return;

        const sendWSIntervalObj = new JSONFormats.SendWSIntervalJSONMessage();
        sendWSIntervalObj.mode = this.modePrefix + "_WS_INTERVAL";
        sendWSIntervalObj.interval = interval;
        const jsonstr = JSON.stringify(sendWSIntervalObj);
        this.WebSocket.send(jsonstr);
    }

    public get OnVALPacketReceived(): (intervalTime: number, val: { [code: string]: string }) => void { return this.onVALPacketReceived }
    public set OnVALPacketReceived(func: (intervalTime: number, val: { [code: string]: string }) => void) { this.onVALPacketReceived = func }
    public get VALPacketIntervalTime(): number { return this.valPacketIntervalTime; }
}
