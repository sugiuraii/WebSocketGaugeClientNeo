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

import { DefiCOMWebsocket, DefiParameterCode } from "../../WebSocket/WebSocketCommunication";
import { WebstorageHandler } from "../Webstorage/WebstorageHandler";
import { ILogWindow } from "../interfaces/ILogWindow";
import { IStatusIndicator } from "../interfaces/IStatusIndicator";

export class DefiWebsocketBackend {

   public static readonly DEFAULT_WS_PORT = 2012;

   private readonly logPrefix = "Defi";
   private readonly WEBSOCKET_CHECK_INTERVAL = 1000;
   private readonly WAITTIME_BEFORE_SENDWSSEND = 3000;
   private readonly WAITTIME_BEFORE_RECONNECT = 5000;

   private readonly defiWS: DefiCOMWebsocket;
   private readonly parameterCodeList: DefiParameterCode[];
   private readonly loggerWindow: ILogWindow;
   private readonly statusIndicator: IStatusIndicator;

   private readonly webSocketServerURL: string;

   private indicatorUpdateIntervalID = 0;

   constructor(serverurl: string, codeList: DefiParameterCode[], loggerWindow: ILogWindow, statusIndicator: IStatusIndicator) {
      this.defiWS = new DefiCOMWebsocket(serverurl);
      this.parameterCodeList = codeList;
      this.loggerWindow = loggerWindow;
      this.statusIndicator = statusIndicator;
      this.webSocketServerURL = this.defiWS.URL;

      this.defiWS.OnWebsocketError = (message: string) => this.loggerWindow.appendLog(this.logPrefix + " websocket error : " + message);
   }

   public getVal(code: DefiParameterCode, timestamp: number): number {
      return this.defiWS.getVal(code, timestamp);
   }

   public getRawVal(code: DefiParameterCode): number {
      return this.defiWS.getRawVal(code);
   }

   public Run(): void {
      this.indicatorUpdateIntervalID = window.setInterval(() => this.setStatusIndicator(), this.WEBSOCKET_CHECK_INTERVAL);
      this.connectWebSocket();
   }

   public Stop(): void {
      clearInterval(this.indicatorUpdateIntervalID);
      this.defiWS.Close();
   }

   private setStatusIndicator() {
      this.statusIndicator.SetStatus(this.defiWS.getReadyState());
   }

   private connectWebSocket() {
      const LogWindow = this.loggerWindow;
      const webSocketObj = this.defiWS;
      const logPrefix = this.logPrefix;

      webSocketObj.OnWebsocketOpen = () => {
         LogWindow.appendLog(logPrefix + " is connected. SendWSSend/Interval after " + this.WAITTIME_BEFORE_SENDWSSEND.toString() + " msec");
         window.setTimeout(() => {
            //SendWSSend
            this.parameterCodeList.forEach(item => webSocketObj.SendWSSend(item, true));

            //SendWSInterval from spinner
            webSocketObj.SendWSInterval(WebstorageHandler.GetWSIntervalFromLocalStorage());

         }, this.WAITTIME_BEFORE_SENDWSSEND);
      }
      webSocketObj.OnWebsocketClose = () => {
         LogWindow.appendLog(logPrefix + " is disconnected. Reconnect after " + this.WAITTIME_BEFORE_RECONNECT.toString() + "msec...");
         window.setTimeout(() => webSocketObj.Connect(), this.WAITTIME_BEFORE_RECONNECT);
      }

      webSocketObj.OnWebsocketError = (message: string) => {
         LogWindow.appendLog(logPrefix + " websocket error : " + message);
      }
      webSocketObj.OnRESPacketReceived = (message: string) => {
         LogWindow.appendLog(logPrefix + " RES message : " + message);
      }
      webSocketObj.OnERRPacketReceived = (message: string) => {
         LogWindow.appendLog(logPrefix + " ERR message : " + message);
      }

      LogWindow.appendLog(logPrefix + " connect...");
      webSocketObj.Connect();
   }
}