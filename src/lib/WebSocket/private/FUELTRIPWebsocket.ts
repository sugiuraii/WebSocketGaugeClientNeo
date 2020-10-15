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

import * as Interpolation from "./utils/Interpolation";
import * as JSONFormats from "./JSONFormats";
import { WebsocketCommon } from "./WebsocketCommon";

const ReturnValueOnSectGasMilageUndefined = 0;

export class FUELTRIPWebsocket extends WebsocketCommon {
    //private modePrefix = "FUELTRIP";
    private onMomentFUELTRIPPacketReceived: (momentGasMilage: number, totalGas: number, totalTrip: number, totalGasMilage: number) => void;
    private onSectFUELTRIPPacketReceived: (sectSpan: number, sectTrip: number[], sectGas: number[], sectGasMilage: number[]) => void;

    private recordIntervalTimeEnabled: boolean;
    //Internal state
    private momentFUELTripPacketPreviousTimeStamp: number;
    private momentFUELTripPacketIntervalTime: number;

    //Interpolate value buffer (Momnt fuel trip only)
    private momentGasMilageInterpolateBuffer = new Interpolation.VALInterpolationBuffer();
    private totalGas = 0;
    private totalTrip = 0;
    private totalGasMilage = 0;
    //Stored sect fuelTrip data
    private sectSpan = 0;
    private sectTrip: number[] = [];
    private sectGas: number[] = [];
    private sectGasMilage: number[] = [];

    get RecordIntervalTimeEnabled(): boolean { return this.recordIntervalTimeEnabled; }
    set RecordIntervalTimeEnabled(val: boolean) { this.recordIntervalTimeEnabled = val; }
    get OnMomentFUELTRIPPacketReceived(): (momentGasMilage: number, totalGas: number, totalTrip: number, totalGasMilage: number) => void { return this.onMomentFUELTRIPPacketReceived; }
    set OnMomentFUELTRIPPacketReceived(func: (momentGasMilage: number, totalGas: number, totalTrip: number, totalGasMilage: number) => void) { this.onMomentFUELTRIPPacketReceived = func; }
    get OnSectFUELTRIPPacketReceived(): (sectSpan: number, sectTrip: number[], sectGas: number[], sectGasMilage: number[]) => void { return this.onSectFUELTRIPPacketReceived; }
    set OnSectFUELTRIPPacketReceived(func: (sectSpan: number, sectTrip: number[], sectGas: number[], sectGasMilage: number[]) => void) { this.onSectFUELTRIPPacketReceived = func; }

    constructor(url : string) {
        super(url);
        this.recordIntervalTimeEnabled = true;
        this.momentFUELTripPacketPreviousTimeStamp = window.performance.now();
        this.momentFUELTripPacketIntervalTime = 0;
        this.onMomentFUELTRIPPacketReceived = () => {/*do nothing*/};
        this.onSectFUELTRIPPacketReceived = () => {/*ddo nothing*/};
    }

    public getMomentGasMilage(timestamp: number): number {
        return this.momentGasMilageInterpolateBuffer.getVal(timestamp);
    }
    public getRawMomentGasMilage(): number {
        return this.momentGasMilageInterpolateBuffer.getRawVal();
    }
    public getTotalTrip(): number {
        return this.totalTrip;
    }
    public getTotalGas(): number {
        return this.totalGas;
    }
    public getTotalGasMilage(): number {
        return this.totalGasMilage;
    }
    public getSectSpan(): number {
        return this.sectSpan;
    }
    public getSectTrip(sectIndex: number): number {
        if (sectIndex > this.sectTrip.length)
            return ReturnValueOnSectGasMilageUndefined;
        else
            return this.sectTrip[sectIndex];
    }
    public getSectGas(sectIndex: number): number {
        if (sectIndex > this.sectGas.length)
            return ReturnValueOnSectGasMilageUndefined;
        else
            return this.sectGas[sectIndex];
    }
    public getSectGasMilage(sectIndex: number) : number {
        if (sectIndex > this.sectGasMilage.length)
            return ReturnValueOnSectGasMilageUndefined;
        else
            return this.sectGasMilage[sectIndex];
    }

    public SendSectStoreMax(storeMax: number): void {
        if (!this.IsConnetced)
            return;

        const obj = new JSONFormats.SectStoreMaxJSONMessage();
        obj.storemax = storeMax;
        const jsonstr = JSON.stringify(obj);
        this.WebSocket.send(jsonstr);
    }
    public SendSectSpan(sectSpan: number): void {
        if (!this.IsConnetced)
            return;

        const obj = new JSONFormats.SectSpanJSONMessage();
        obj.sect_span = sectSpan;
        const jsonstr = JSON.stringify(obj);
        this.WebSocket.send(jsonstr);
    }

    protected parseIncomingMessage(msg: string): void {
        const recevedJSONIface: JSONFormats.IJSONMessage = JSON.parse(msg);
        switch (recevedJSONIface.mode) {
            case ("MOMENT_FUELTRIP"):
                {
                    if (this.recordIntervalTimeEnabled) {
                        //Update interval time
                        const nowTime = window.performance.now();
                        this.momentFUELTripPacketIntervalTime = nowTime - this.momentFUELTripPacketPreviousTimeStamp;
                        this.momentFUELTripPacketPreviousTimeStamp = nowTime;
                    }

                    const jsonObj: JSONFormats.MomentFuelTripJSONMessage = JSON.parse(msg);

                    // Invoke MomentFUELTRIPPacketReceived Event
                    if (typeof (this.onMomentFUELTRIPPacketReceived) !== "undefined") {
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
            case ("SECT_FUELTRIP"):
                {
                    const jsonObj: JSONFormats.SectFuelTripJSONMessage = JSON.parse(msg);
                    // Invoke SECTFUELTRIPPacketReceived Event
                    if (typeof (this.onSectFUELTRIPPacketReceived) !== "undefined") {
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
            case ("ERR"):
                {
                    const jsonObj: JSONFormats.ErrorJSONMessage = JSON.parse(msg);
                    if (typeof (this.OnERRPacketReceived) !== "undefined")
                        this.OnERRPacketReceived(jsonObj.msg);
                    break;
                }
            case ("RES"):
                {
                    const jsonObj: JSONFormats.ResponseJSONMessage = JSON.parse(msg);
                    if (typeof (this.OnRESPacketReceived) !== "undefined")
                        this.OnRESPacketReceived(jsonObj.msg);
                    break;
                }
            default:
                this.OnWebsocketError("Unknown mode packet received. " + msg);
        }
    }
}
