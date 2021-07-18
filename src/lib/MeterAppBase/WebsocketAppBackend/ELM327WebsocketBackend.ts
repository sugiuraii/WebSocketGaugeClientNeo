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

import { ELM327COMWebsocket, OBDIIParameterCode, ReadModeCode } from "../../WebSocket/WebSocketCommunication";
import { ILogger } from "../utils/ILogger";
import { WebsocketAppBackend } from "./WebsocketAppBackend";
import { WebsocketConnectionStatus } from "./WebsocketConnectionStatus";
import { WebsocketState } from "./WebsocketState";

export class ELM327WebsocketBackend implements WebsocketAppBackend {
   public static readonly DEFAULT_WS_PORT = 2016;
   public static readonly WS_URL_PATH = "/elm327";
   private readonly name = "ELM327";
   private readonly logPrefix = this.name;
   private readonly WEBSOCKET_CHECK_INTERVAL = 1000;
   private readonly WAITTIME_BEFORE_SENDWSSEND = 3000;
   private readonly WAITTIME_BEFORE_RECONNECT = 5000;

   private readonly SLOWREAD_INTERVAL = 10;

   private readonly elm327WS: ELM327COMWebsocket;
   private readonly parameterCodeList: { code: OBDIIParameterCode, readmode: ReadModeCode }[] = [];
   private readonly logger: ILogger;
   private readonly state: WebsocketState;

   private readonly webSocketServerURL: string;

   private indicatorUpdateIntervalID = 0;

   public get ParameterCodeList(): { code: OBDIIParameterCode, readmode: ReadModeCode }[] { return this.parameterCodeList }

   constructor(serverurl: string, logger: ILogger) {
      this.elm327WS = new ELM327COMWebsocket(serverurl);
      this.logger = logger;
      this.state = {isEnabled : true, connectionStatus : WebsocketConnectionStatus.Closed};
      this.webSocketServerURL = this.elm327WS.URL;

      this.elm327WS.OnWebsocketError = (message: string) => this.logger.appendLog(this.logPrefix + " websocket error : " + message);
   }

   public Run(): void {
      this.indicatorUpdateIntervalID = window.setInterval(() => this.setStatusIndicator(), this.WEBSOCKET_CHECK_INTERVAL);
      this.connectWebSocket();
   }

   public Stop(): void {
      clearInterval(this.indicatorUpdateIntervalID);
      this.elm327WS.Close();
   }

   public getVal(code: OBDIIParameterCode, timestamp?: number): number {
      if(timestamp === undefined)
         return this.getRawVal(code);
      else
         return this.elm327WS.getVal(code, timestamp);
   }

   public getRawVal(code: OBDIIParameterCode): number {
      return this.elm327WS.getRawVal(code);
   }

   public getWebsocketState() : WebsocketState
   {
      return this.state;
   }
   public getName() : string
   {
      return this.name;
   }

   private setStatusIndicator() {
      this.state.connectionStatus = this.elm327WS.getReadyState();
   }

   private connectWebSocket() {
      const logger = this.logger;
      const webSocketObj = this.elm327WS;
      const logPrefix = this.logPrefix;

      webSocketObj.OnWebsocketOpen = () => {
         logger.appendLog(logPrefix + " is connected. SendWSSend/Interval after " + this.WAITTIME_BEFORE_SENDWSSEND.toString() + " msec");
         window.setTimeout(() => {
            //SendWSSend
            this.parameterCodeList.forEach(item => {
               if (item.readmode === ReadModeCode.SLOWandFAST) {
                  webSocketObj.SendCOMRead(item.code, ReadModeCode.SLOW, true);
                  webSocketObj.SendCOMRead(item.code, ReadModeCode.FAST, true);
               }
               else
                  webSocketObj.SendCOMRead(item.code, item.readmode, true);
            });

            webSocketObj.SendSlowreadInterval(this.SLOWREAD_INTERVAL);
         }, this.WAITTIME_BEFORE_SENDWSSEND);
      };

      webSocketObj.OnWebsocketClose = () => {
         logger.appendLog(logPrefix + " is disconnected. Reconnect after " + this.WAITTIME_BEFORE_RECONNECT.toString() + "msec...");
         window.setTimeout(() => webSocketObj.Connect(), this.WAITTIME_BEFORE_RECONNECT);
      };

      webSocketObj.OnWebsocketError = (message: string) => {
         logger.appendLog(logPrefix + " websocket error : " + message);
      }
      webSocketObj.OnRESPacketReceived = (message: string) => {
         logger.appendLog(logPrefix + " RES message : " + message);
      }
      webSocketObj.OnERRPacketReceived = (message: string) => {
         logger.appendLog(logPrefix + " ERR message : " + message);
      }

      logger.appendLog(logPrefix + " connect...");
      webSocketObj.Connect();
   }
}

