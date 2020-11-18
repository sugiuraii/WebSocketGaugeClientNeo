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
import { ILogger } from "../interfaces/ILogger";
import { WebsocketState } from "./WebsocketState";

export class FUELTRIPWebsocketBackend {
    public static readonly DEFAULT_WS_PORT = 2014;

    private readonly logPrefix = "FUELTRIP";
    private readonly WEBSOCKET_CHECK_INTERVAL = 1000;
    private readonly WAITTIME_BEFORE_SENDWSSEND = 3000;
    private readonly WAITTIME_BEFORE_RECONNECT = 5000;

    private readonly fueltripWS: FUELTRIPWebsocket;

    private readonly logger: ILogger;
    private readonly state: WebsocketState;

    private readonly fueltripSectStoreMax: number;
    private readonly fueltripSectSpan: number;

    private readonly webSocketServerURL: string;

    private indicatorUpdateIntervalID  = 0;

    constructor(serverurl: string, logger: ILogger, fueltripSectSpan: number, fueltripSectStoremax: number, state: WebsocketState) {
        this.fueltripWS = new FUELTRIPWebsocket(serverurl);
        this.logger = logger;
        this.state = state;
        this.webSocketServerURL = this.fueltripWS.URL;
        this.fueltripSectSpan = fueltripSectSpan;
        this.fueltripSectStoreMax = fueltripSectStoremax;

        this.fueltripWS.OnWebsocketError = (message: string) => this.logger.appendLog(this.logPrefix + " websocket error : " + message);
    }

    public Run(): void {
        this.indicatorUpdateIntervalID = window.setInterval(() => this.setStatusIndicator(), this.WEBSOCKET_CHECK_INTERVAL);
        this.connectWebSocket();
    }

    public Stop(): void {
        clearInterval(this.indicatorUpdateIntervalID);
        this.fueltripWS.Close();
    }
    public SendReset(): void {
        this.fueltripWS.SendReset();
    }
    public getMomentGasMilage(timestamp: number): number {
        return this.fueltripWS.getMomentGasMilage(timestamp);
    }
    public getRawMomentGasMilage(): number {
        return this.fueltripWS.getRawMomentGasMilage();
    }
    public getTotalTrip(): number {
        return this.fueltripWS.getTotalTrip();
    }
    public getTotalGas(): number {
        return this.fueltripWS.getTotalGas();
    }
    public getTotalGasMilage(): number {
        return this.fueltripWS.getTotalGasMilage();
    }
    public getSectSpan(): number {
        return this.fueltripWS.getSectSpan();
    }
    public getSectTrip(sectIndex: number): number {
        return this.fueltripWS.getSectTrip(sectIndex);
    }
    public getSectGas(sectIndex: number): number {
        return this.fueltripWS.getSectGas(sectIndex);
    }
    public getSectGasMilage(sectIndex: number): number {
        return this.fueltripWS.getSectGasMilage(sectIndex);
    }
    private setStatusIndicator(): void {
        this.state.connectionStatus = this.fueltripWS.getReadyState();
    }

    private connectWebSocket(): void {
        const wsObj = this.fueltripWS;
        const logger = this.logger;
        const logPrefix = this.logPrefix;
        const sectSpan = this.fueltripSectSpan;
        const sectStoreMax = this.fueltripSectStoreMax;

        wsObj.OnWebsocketOpen = () => {
            logger.appendLog(logPrefix + " is connected. Send SECT_SPAN and SECT_STOREMAX after " + this.WAITTIME_BEFORE_SENDWSSEND.toString() + " ms.");
            window.setTimeout(() => {
                wsObj.SendSectSpan(sectSpan);
                wsObj.SendSectStoreMax(sectStoreMax);

            }, this.WAITTIME_BEFORE_SENDWSSEND);
        }

        wsObj.OnWebsocketClose = () => {
            logger.appendLog(logPrefix + " is disconnected. Reconnect after " + this.WAITTIME_BEFORE_RECONNECT.toString() + "msec...");
            window.setTimeout(() => wsObj.Connect(), this.WAITTIME_BEFORE_RECONNECT);
        }

        wsObj.OnWebsocketError = (message: string) => {
            logger.appendLog(logPrefix + " websocket error : " + message);
        }
        wsObj.OnRESPacketReceived = (message: string) => {
            logger.appendLog(logPrefix + " RES message : " + message);
        }
        wsObj.OnERRPacketReceived = (message: string) => {
            logger.appendLog(logPrefix + " ERR message : " + message);
        }

        logger.appendLog(logPrefix + " connect...");
        wsObj.Connect();
    }
}