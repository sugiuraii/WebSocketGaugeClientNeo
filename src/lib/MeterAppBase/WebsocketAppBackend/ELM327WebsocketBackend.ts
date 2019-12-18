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

import { ELM327COMWebsocket, OBDIIParameterCode, ReadModeCode } from "../../WebSocket/WebSocketCommunication";
import { WebstorageHandler } from "../Webstorage/WebstorageHandler";
import { ILogWindow } from "../interfaces/ILogWindow";
import { IStatusIndicator } from "../interfaces/IStatusIndicator";

export class ELM327WebsocketBackend {
   public static readonly DEFAULT_WS_PORT = 2016;

   private readonly logPrefix = "ELM327";
   private readonly WEBSOCKET_CHECK_INTERVAL = 1000;
   private readonly WAITTIME_BEFORE_SENDWSSEND = 3000;
   private readonly WAITTIME_BEFORE_RECONNECT = 5000;

   private readonly SLOWREAD_INTERVAL = 10;

   private readonly elm327WS: ELM327COMWebsocket;
   private readonly obdiiParameterCodeList: { code: OBDIIParameterCode, readmode: ReadModeCode }[] = new Array();
   private readonly loggerWindow: ILogWindow;
   private readonly statusIndicator: IStatusIndicator;

   public get ELM327WS() { return this.elm327WS };
   public get ParameterCodeList() { return this.obdiiParameterCodeList };

   private readonly webSocketServerURL: string;

   private indicatorUpdateIntervalID: number;

   constructor(serverurl: string, loggerWindow: ILogWindow, statusIndicator: IStatusIndicator) {
      this.elm327WS = new ELM327COMWebsocket();
      this.loggerWindow = loggerWindow;
      this.statusIndicator = statusIndicator;

      this.elm327WS.OnWebsocketError = (message: string) => this.loggerWindow.appendLog(this.logPrefix + " websocket error : " + message);
   }

   public Run() {
      this.indicatorUpdateIntervalID = window.setInterval(() => this.setStatusIndicator(), this.WEBSOCKET_CHECK_INTERVAL);
      this.connectWebSocket();
   }

   public Stop() {
      clearInterval(this.indicatorUpdateIntervalID);
      this.elm327WS.Close();
   }

   private setStatusIndicator() {
      this.statusIndicator.SetStatus(this.elm327WS.getReadyState());
   }

   private connectWebSocket() {
      const LogWindow = this.loggerWindow;
      const webSocketObj = this.elm327WS;
      const logPrefix = this.logPrefix;

      webSocketObj.URL = this.webSocketServerURL;

      webSocketObj.OnWebsocketOpen = () => {
         LogWindow.appendLog(logPrefix + " is connected. SendWSSend/Interval after " + this.WAITTIME_BEFORE_SENDWSSEND.toString() + " msec");
         window.setTimeout(() => {
            //SendWSSend
            this.ParameterCodeList.forEach(item => {
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
         LogWindow.appendLog(logPrefix + " is disconnected. Reconnect after " + this.WAITTIME_BEFORE_RECONNECT.toString() + "msec...");
         window.setTimeout(() => webSocketObj.Connect(), this.WAITTIME_BEFORE_RECONNECT);
      };

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

