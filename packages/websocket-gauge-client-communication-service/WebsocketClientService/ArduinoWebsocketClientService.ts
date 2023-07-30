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

import { ArduinoCOMWebsocket, ArduinoParameterCode } from "websocket-gauge-client-communication";
import { ILogger } from "basic-logger";
import { WebsocketState } from "./WebsocketState";
import { WebsocketConnectionStatus } from "./WebsocketConnectionStatus";
import { WebsocketClientService } from "./WebsocketClientService";
import { InterpolatorOption } from "websocket-gauge-client-communication/utils/Interpolator";

export class ArduinoWebsocketClientService implements WebsocketClientService {
   public static readonly DEFAULT_WS_PORT = 2016;
   public static readonly WS_URL_PATH = "/arduino";
   private readonly name = "Arduino";
   
   private readonly logPrefix = this.name;
   private readonly WEBSOCKET_CHECK_INTERVAL = 1000;
   private readonly WAITTIME_BEFORE_SENDWSSEND = 3000;
   private readonly WAITTIME_BEFORE_RECONNECT = 5000;

   private readonly arduinoWS: ArduinoCOMWebsocket;
   private readonly parameterCodeList: ArduinoParameterCode[] = [];
   private readonly logger: ILogger;
   private readonly state: WebsocketState;
   private readonly WSInterval : number;

   private readonly webSocketServerURL: string;

   private indicatorUpdateIntervalID = 0;

   public get ParameterCodeList() : ArduinoParameterCode[] { return this.parameterCodeList }

   constructor(serverurl: string, logger: ILogger, wsInterval : number, interpolatorOprion? : InterpolatorOption) {
      this.arduinoWS = new ArduinoCOMWebsocket(serverurl, interpolatorOprion);
      this.logger = logger;
      this.state = {isEnabled : true, connectionStatus : WebsocketConnectionStatus.Closed};
      this.webSocketServerURL = this.arduinoWS.URL;
      this.WSInterval = wsInterval;
      
      this.arduinoWS.OnWebsocketError = (message: string) => this.logger.appendLog(this.logPrefix + " websocket error : " + message);
   }

   public Run(): void {
      this.indicatorUpdateIntervalID = window.setInterval(() => this.setStatusIndicator(), this.WEBSOCKET_CHECK_INTERVAL);
      this.connectWebSocket();
   }

   public Stop(): void {
      clearInterval(this.indicatorUpdateIntervalID);
      this.arduinoWS.Close();
   }

   public getVal(code: ArduinoParameterCode, timestamp?: number): number {
      if(timestamp === undefined)
         return this.getRawVal(code);
      else
         return this.arduinoWS.getVal(code, timestamp);
   }

   public getRawVal(code: ArduinoParameterCode): number {
      return this.arduinoWS.getRawVal(code);
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
      this.state.connectionStatus = this.arduinoWS.getReadyState();
   }

   private connectWebSocket() {
      const Logger = this.logger;
      const webSocketObj = this.arduinoWS;
      const logPrefix = this.logPrefix;

      webSocketObj.OnWebsocketOpen = () => {
         Logger.appendLog(logPrefix + " is connected. SendWSSend/Interval after " + this.WAITTIME_BEFORE_SENDWSSEND.toString() + " msec");
         window.setTimeout(() => {
            //SendWSSend
            this.parameterCodeList.forEach(item => webSocketObj.SendWSSend(item, true));

            //SendWSInterval from spinner
            webSocketObj.SendWSInterval(this.WSInterval);

         }, this.WAITTIME_BEFORE_SENDWSSEND);
      }
      webSocketObj.OnWebsocketClose = () => {
         Logger.appendLog(logPrefix + " is disconnected. Reconnect after " + this.WAITTIME_BEFORE_RECONNECT.toString() + "msec...");
         window.setTimeout(() => webSocketObj.Connect(), this.WAITTIME_BEFORE_RECONNECT);
      }

      webSocketObj.OnWebsocketError = (message: string) => {
         Logger.appendLog(logPrefix + " websocket error : " + message);
      }
      webSocketObj.OnRESPacketReceived = (message: string) => {
         Logger.appendLog(logPrefix + " RES message : " + message);
      }
      webSocketObj.OnERRPacketReceived = (message: string) => {
         Logger.appendLog(logPrefix + " ERR message : " + message);
      }

      Logger.appendLog(logPrefix + " connect...");
      webSocketObj.Connect();
   }
}