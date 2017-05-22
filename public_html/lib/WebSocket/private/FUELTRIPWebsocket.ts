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

const ReturnValueOnSectGasMilageUndefined = 0;

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
    public getSectTrip(sectIndex : number) : number
    {
        if (sectIndex > this.sectTrip.length)
            return ReturnValueOnSectGasMilageUndefined;
        else           
            return this.sectTrip[sectIndex];
    }
    public getSectGas(sectIndex : number) : number
    {
        if (sectIndex > this.sectGas.length)
            return ReturnValueOnSectGasMilageUndefined;
        else
            return this.sectGas[sectIndex];
    }
    public getSectGasMilage(sectIndex : number)
    {
        if (sectIndex > this.sectGasMilage.length)
            return ReturnValueOnSectGasMilageUndefined;
        else
            return this.sectGasMilage[sectIndex];
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
