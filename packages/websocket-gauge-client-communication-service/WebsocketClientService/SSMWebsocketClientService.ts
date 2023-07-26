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

import { SSMWebsocket, SSMParameterCode, SSMSwitchCode, ReadModeCode } from "websocket-gauge-client-communication";
import { ILogger } from "../utils/ILogger";
import { WebsocketClientService } from "./WebsocketClientService";
import { WebsocketConnectionStatus } from "./WebsocketConnectionStatus";
import { WebsocketState } from "./WebsocketState";
import { InterpolatorOption } from "websocket-gauge-client-communication/utils/Interpolator";

export class SSMWebsocketClientService implements WebsocketClientService {
   public static readonly DEFAULT_WS_PORT = 2016;
   public static readonly WS_URL_PATH = "/ssm";
   private readonly name = "SSM";
   private readonly logPrefix = this.name;
   private readonly WEBSOCKET_CHECK_INTERVAL = 1000;
   private readonly WAITTIME_BEFORE_SENDWSSEND = 3000;
   private readonly WAITTIME_BEFORE_RECONNECT = 5000;

   private readonly SLOWREAD_INTERVAL = 10;

   private readonly ssmWS: SSMWebsocket;
   private readonly parameterCodeList: { code: SSMParameterCode, readmode: ReadModeCode }[] = [];
   public get ParameterCodeList(): { code: SSMParameterCode, readmode: ReadModeCode }[] { return this.parameterCodeList }
   private readonly logger: ILogger;
   private readonly state: WebsocketState;

   private readonly webSocketServerURL: string;

   private indicatorUpdateIntervalID = 0;

   constructor(serverurl: string, logger: ILogger, interpolatorOprion? : InterpolatorOption) {
      this.ssmWS = new SSMWebsocket(serverurl, interpolatorOprion);
      this.logger = logger;
      this.state = {isEnabled : true, connectionStatus : WebsocketConnectionStatus.Closed};
      this.webSocketServerURL = this.ssmWS.URL;

      this.ssmWS.OnWebsocketError = (message: string) => this.logger.appendLog(this.logPrefix + " websocket error : " + message);
   }

   public Run(): void {
      this.indicatorUpdateIntervalID = window.setInterval(() => this.setStatusIndicator(), this.WEBSOCKET_CHECK_INTERVAL);
      this.connectWebSocket();
   }

   public Stop(): void {
      clearInterval(this.indicatorUpdateIntervalID);
      this.ssmWS.Close();
   }

   public getVal(code: SSMParameterCode, timestamp?: number): number {
      if(timestamp === undefined)
         return this.getRawVal(code);
      else
         return this.ssmWS.getVal(code, timestamp);
   }

   public getRawVal(code: SSMParameterCode): number {
      return this.ssmWS.getRawVal(code);
   }

   public getSwitchFlag(code: SSMSwitchCode): boolean {
      return this.ssmWS.getSwitchFlag(code);
   }

   public getWebsocketState() : WebsocketState
   {
      return this.state;
   }   
   public getName() : string
   {
      return this.name;
   }

   private setStatusIndicator(): void {
      this.state.connectionStatus = this.ssmWS.getReadyState();
   }

   private connectWebSocket(): void {
      const logger = this.logger;
      const webSocketObj = this.ssmWS;
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

