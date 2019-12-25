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

import { FUELTRIPWebsocket } from "../../WebSocket/WebSocketCommunication";
import { ILogWindow } from "../interfaces/ILogWindow";
import { IStatusIndicator } from "../interfaces/IStatusIndicator";

export class FUELTRIPWebsocketBackend {
    public static readonly DEFAULT_WS_PORT = 2014;

    private readonly logPrefix = "FUELTRIP";
    private readonly WEBSOCKET_CHECK_INTERVAL = 1000;
    private readonly WAITTIME_BEFORE_SENDWSSEND = 3000;
    private readonly WAITTIME_BEFORE_RECONNECT = 5000;

    private readonly fueltripWS: FUELTRIPWebsocket;

    private readonly loggerWindow: ILogWindow;
    private readonly statusIndicator: IStatusIndicator;

    public FUELTRIPSectStoreMax: number;
    public FUELTRIPSectSpan: number;

    private readonly webSocketServerURL: string;

    private indicatorUpdateIntervalID: number;

    constructor(serverurl: string, loggerWindow: ILogWindow, statusIndicator: IStatusIndicator) {
        this.fueltripWS = new FUELTRIPWebsocket();
        this.loggerWindow = loggerWindow;
        this.statusIndicator = statusIndicator;
        this.webSocketServerURL = serverurl;

        this.fueltripWS.OnWebsocketError = (message: string) => this.loggerWindow.appendLog(this.logPrefix + " websocket error : " + message);
    }

    public Run() {
        this.indicatorUpdateIntervalID = window.setInterval(() => this.setStatusIndicator(), this.WEBSOCKET_CHECK_INTERVAL);
        this.connectWebSocket();
    }

    public Stop() {
        clearInterval(this.indicatorUpdateIntervalID);
        this.fueltripWS.Close();
    }

    public getMomentGasMilage(timestamp : number) : number
    {
        return this.fueltripWS.getMomentGasMilage(timestamp);
    }
    public getRawMomentGasMilage() : number
    {
        return this.fueltripWS.getRawMomentGasMilage();
    }
    public getTotalTrip() : number
    {
        return this.fueltripWS.getTotalTrip();
    }
    public getTotalGas() : number
    {
        return this.fueltripWS.getTotalGas();
    }
    public getTotalGasMilage() : number
    {
        return this.fueltripWS.getTotalGasMilage();
    }
    public getSectSpan() : number
    {
        return this.fueltripWS.getSectSpan();
    }
    public getSectTrip(sectIndex : number) : number
    {
        return this.fueltripWS.getSectTrip(sectIndex);
    }
    public getSectGas(sectIndex : number) : number
    {
        return this.fueltripWS.getSectGas(sectIndex);
    }
    public getSectGasMilage(sectIndex : number)
    {
        return this.fueltripWS.getSectGasMilage(sectIndex);
    }
    private setStatusIndicator() {
        this.statusIndicator.SetStatus(this.fueltripWS.getReadyState());
    }

    private connectWebSocket() {
        const wsObj = this.fueltripWS;
        const logWindow = this.loggerWindow;
        const logPrefix = this.logPrefix;
        const sectSpan = this.FUELTRIPSectSpan;
        const sectStoreMax = this.FUELTRIPSectStoreMax;

        wsObj.OnWebsocketOpen = () => {
            logWindow.appendLog(logPrefix + " is connected. Send SECT_SPAN and SECT_STOREMAX after " + this.WAITTIME_BEFORE_SENDWSSEND.toString() + " ms.");
            window.setTimeout(() => {
                wsObj.SendSectSpan(sectSpan);
                wsObj.SendSectStoreMax(sectStoreMax);

            }, this.WAITTIME_BEFORE_SENDWSSEND);
        }

        wsObj.OnWebsocketClose = () => {
            logWindow.appendLog(logPrefix + " is disconnected. Reconnect after " + this.WAITTIME_BEFORE_RECONNECT.toString() + "msec...");
            window.setTimeout(() => wsObj.Connect(), this.WAITTIME_BEFORE_RECONNECT);
        }

        wsObj.OnWebsocketError = (message: string) => {
            logWindow.appendLog(logPrefix + " websocket error : " + message);
        }
        wsObj.OnRESPacketReceived = (message: string) => {
            logWindow.appendLog(logPrefix + " RES message : " + message);
        }
        wsObj.OnERRPacketReceived = (message: string) => {
            logWindow.appendLog(logPrefix + " ERR message : " + message);
        }

        logWindow.appendLog(logPrefix + " connect...");
        wsObj.Connect();
    }
}