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
import { AssettoCorsaSHMWebsocket, AssettoCorsaSHMNumericalVALCode, AssettoCorsaSHMStringVALCode } from "../../WebSocket/WebSocketCommunication";
import { AssettoCorsaSHMGraphicsParameterCode, AssettoCorsaSHMPhysicsParameterCode, AssettoCorsaSHMStaticInfoParameterCode } from "../../WebSocket/WebSocketCommunication";
import { WebstorageHandler } from "../Webstorage/WebstorageHandler";
import { ILogger } from "../utils/ILogger";
import { WebsocketState } from "./WebsocketState";

export class AssettoCorsaSHMWebsocketBackend {
   public static readonly DEFAULT_WS_PORT = 2017;
   public static readonly WS_URL_PATH = "/assettocorsa_ws";
   
   private readonly logPrefix = "AssettoCorsaSHM";
   private readonly WEBSOCKET_CHECK_INTERVAL = 1000;
   private readonly WAITTIME_BEFORE_SENDWSSEND = 3000;
   private readonly WAITTIME_BEFORE_RECONNECT = 5000;

   private readonly assettocorsaWS: AssettoCorsaSHMWebsocket;
   private readonly physicsParameterCodeList: AssettoCorsaSHMPhysicsParameterCode[];
   private readonly graphicsParameterCodeList: AssettoCorsaSHMGraphicsParameterCode[];
   private readonly staticInfoParameterCodeList: AssettoCorsaSHMStaticInfoParameterCode[];
   private readonly logger: ILogger;
   private readonly state: WebsocketState;

   private readonly webSocketServerURL: string;

   private indicatorUpdateIntervalID = 0;

   constructor(serverurl: string, physCode: AssettoCorsaSHMPhysicsParameterCode[], graphicsCode: AssettoCorsaSHMGraphicsParameterCode[], staticCode: AssettoCorsaSHMStaticInfoParameterCode[], logger: ILogger, state: WebsocketState) {
      this.assettocorsaWS = new AssettoCorsaSHMWebsocket(serverurl);
      this.physicsParameterCodeList = physCode;
      this.graphicsParameterCodeList = graphicsCode;
      this.staticInfoParameterCodeList = staticCode;
      this.logger = logger;
      this.state = state;
      this.webSocketServerURL = this.assettocorsaWS.URL;

      this.assettocorsaWS.OnWebsocketError = (message: string) => this.logger.appendLog(this.logPrefix + " websocket error : " + message);
   }

   public Run(): void {
      this.indicatorUpdateIntervalID = window.setInterval(() => this.setStatusIndicator(), this.WEBSOCKET_CHECK_INTERVAL);
      this.connectWebSocket();
   }

   public Stop(): void {
      clearInterval(this.indicatorUpdateIntervalID);
      this.assettocorsaWS.Close();
   }

   public getVal(code: AssettoCorsaSHMNumericalVALCode, timestamp: number): number {
      return this.assettocorsaWS.getVal(code, timestamp);
   }

   public getRawVal(code: AssettoCorsaSHMNumericalVALCode): number {
      return this.assettocorsaWS.getRawVal(code);
   }

   public getStringVal(code: AssettoCorsaSHMStringVALCode): string {
      return this.assettocorsaWS.getStringVal(code);
   }


   private setStatusIndicator() {
      this.state.connectionStatus = this.assettocorsaWS.getReadyState();
   }

   private connectWebSocket() {
      const Logger = this.logger;
      const webSocketObj = this.assettocorsaWS;
      const logPrefix = this.logPrefix;
      const webStorage = new WebstorageHandler();

      webSocketObj.OnWebsocketOpen = () => {
         Logger.appendLog(logPrefix + " is connected. SendWSSend/Interval after " + this.WAITTIME_BEFORE_SENDWSSEND.toString() + " msec");
         window.setTimeout(() => {
            //SendWSSend
            this.physicsParameterCodeList.forEach(item => webSocketObj.SendPhysicsWSSend(item, true));
            this.graphicsParameterCodeList.forEach(item => webSocketObj.SendGraphicsWSSend(item, true));
            this.staticInfoParameterCodeList.forEach(item => webSocketObj.SendStaticInfoWSSend(item, true));

            //SendWSInterval from spinner
            webSocketObj.SendPhysicsWSInterval(webStorage.WSInterval);

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