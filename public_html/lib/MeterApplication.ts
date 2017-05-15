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

import {LogWindow} from "./LogWindow";
import {ControlPanel} from "./ControlPanel";
import * as WebFont from "webfontloader";
import * as WebSocketCommunication from "./WebSocket/WebSocketCommunication";
export {DefiParameterCode} from "./WebSocket/WebSocketCommunication";

const DEFICOM_WS_PORT = 2012;
const ARDUINOCOM_WS_PORT = 2015;
const SSMCOM_WS_PORT = 2013;
const ELM327COM_WS_PORT = 2016;
const FUELTRIP_WS_PORT = 2014;

const WEBSOCKET_CHECK_INTERVAL = 1000;

export class MeterApplication
{
    private webSocketServerName : string;
    
    private controlPanel = new ControlPanel();
    private logWindow = new LogWindow();
    
    private defiWS = new WebSocketCommunication.DefiCOMWebsocket();
    private ssmWS = new WebSocketCommunication.SSMWebsocket();
    private arduinoWS = new WebSocketCommunication.ArduinoCOMWebsocket();
    private elm327WS = new WebSocketCommunication.ELM327COMWebsocket();
    private fueltripWS = new WebSocketCommunication.FUELTRIPWebsocket();    
    get DefiWS() {return this.defiWS}
    get SSMWS() {return this.ssmWS}
    get ArduinoWS() {return this.arduinoWS}
    get ELM327WS() { return this.elm327WS}
    get FUELTRIPWS() {return this.fueltripWS}
    public IsDefiWSEnabled = false;
    public IsSSMWSEnabled = false;
    public IsArudinoWSEnabled = false;
    public IsELM327WSEnabled = false;
    public IsFUELTRIPWSEnabled = false;

    public PreloadWebFontFamiliy : string[] = new Array();
    public PreloadWebFontCSSURL : string[] = new Array();
    public PreloadTexturePath : string[] = new Array();
        
    private defiParameterCodeList: {code: string, interpolate : boolean}[] = new Array();
    private arduinoParameterCodeList : {code : string, interpolate : boolean}[] = new Array(); 
    private ssmParameterCodeList : {code : string, readMode : string, interpolate : boolean}[] = new Array();
    private elm327ParameterCodeList : {code : string, readMode : string, interpolate : boolean}[] = new Array();
    
    public registerDefiParameterCode(code : string, interpolate : boolean)
    {
        this.defiParameterCodeList.push({code, interpolate});
    }
    public registerArduinoParameterCode(code : string, interpolate : boolean)
    {
        this.arduinoParameterCodeList.push({code, interpolate});
    }
    public registerSSMParameterCode(code : string, readMode : string, interpolate : boolean)
    {
        this.ssmParameterCodeList.push({code, readMode, interpolate});
    }
    public registerELM327ParameterCode(code : string, readMode : string, interpolate : boolean)
    {
        this.elm327ParameterCodeList.push({code, readMode, interpolate});
    }
    
    public run()
    {
        // Check websocket staus every 1sec
        window.setInterval(this.checkWebSocketStatus(), WEBSOCKET_CHECK_INTERVAL);
        
        // Preload fonts and textures
        this.preloadFonts();
    }
    
    private checkWebSocketStatus()
    {
        this.controlPanel.setDefiIndicatorStatus(this.defiWS.getReadyState());
        this.controlPanel.setSSMIndicatorStatus(this.ssmWS.getReadyState());
        this.controlPanel.setArduinoIndicatorStatus(this.arduinoWS.getReadyState());
        this.controlPanel.setELM327IndicatorStatus(this.elm327WS.getReadyState());
        this.controlPanel.setFUELTRIPIndicatorStatus(this.fueltripWS.getReadyState());
    }
    
    private preloadFonts()
    {
        WebFont.load(
            {
                custom: 
                { 
                    families: this.PreloadWebFontFamiliy,
                    urls: this.PreloadWebFontCSSURL 
                },
                active: () => {this.preloadTextures}
            }
        );
    }
    
    private preloadTextures()
    {
        for( let texturePath of this.PreloadTexturePath)
            PIXI.loader.add(texturePath);
            
        PIXI.loader.load(this.connectWebSocket);
    }

    private connectWebSocket()
    {
        if (this.IsDefiWSEnabled)
            this.connectDefiArduinoWebSocket("DefiWS", this.defiParameterCodeList, this.defiWS);
        if (this.IsArudinoWSEnabled)
            this.connectDefiArduinoWebSocket("ArduinoWS", this.arduinoParameterCodeList, this.arduinoWS);
        if (this.IsSSMWSEnabled)
            this.connectSSMELM327WebSocket("SSMWS", this.ssmParameterCodeList, this.ssmWS);
        if (this.IsELM327WSEnabled)
            this.connectSSMELM327WebSocket("ELM327WS", this.elm327ParameterCodeList, this.elm327WS);
        if (this.IsFUELTRIPWSEnabled
            this.connectFUELTRIPWebSocket();
    }
    
    private connectDefiArduinoWebSocket(logPrefix : string, parameterCodeList : {code: string, interpolate : boolean}[] , webSocketObj: WebSocketCommunication.DefiCOMWebsocket)
    {
        webSocketObj.OnWebsocketOpen = () =>
        {
            this.logWindow.appendLog(logPrefix + " is connected. SendWSSend after 3sec");
            window.setTimeout( () => 
            {
                for (let item of parameterCodeList)
                {
                    webSocketObj.SendWSSend(item.code, true);
                    if (item.interpolate)
                        webSocketObj.EnableInterpolate(item.code)
                    else
                        webSocketObj.DisableInterpolate(item.code)
                }
            });
        }
        webSocketObj.OnWebsocketClose = () =>
        {
            this.logWindow.appendLog(logPrefix + " is disconnected. Reconnect after 5sec...");                
            window.setTimeout(() => webSocketObj.Connect(), 5000);
        }

        this.logWindow.appendLog(logPrefix + " connect...");
        webSocketObj.Connect();
    }
    
    private connectSSMELM327WebSocket(logPrefix : string, parameterCodeList : {code: string, readMode: string, interpolate : boolean}[] , webSocketObj: WebSocketCommunication.SSMWebsocket)
    {
        webSocketObj.OnWebsocketOpen = () =>
        {
            this.logWindow.appendLog(logPrefix + " is connected. SendWSSend after 3sec");
            window.setTimeout( () => 
            {
                for (let item of parameterCodeList)
                {
                    webSocketObj.SendCOMRead(item.code, item.readMode, true);
                    if (item.interpolate)
                        webSocketObj.EnableInterpolate(item.code)
                    else
                        webSocketObj.DisableInterpolate(item.code)
                }
            });
        }
        webSocketObj.OnWebsocketClose = () =>
        {
            this.logWindow.appendLog(logPrefix + " is disconnected. Reconnect after 5sec...");                
            window.setTimeout(() => webSocketObj.Connect(), 5000);
        }

        this.logWindow.appendLog(logPrefix + " connect...");
        webSocketObj.Connect();
    }    
    
    constructor(webSocketServerName? : string)
    {
        if (typeof (webSocketServerName) === "undefined")
            this.webSocketServerName = location.hostname;
        else
            this.webSocketServerName = webSocketServerName;
            
        this.setWSURL(this.webSocketServerName);
        
        this.registerWebSocketCommonEvents("DEFI", this.defiWS);
        this.registerWebSocketCommonEvents("SSM", this.ssmWS);
        this.registerWebSocketCommonEvents("ARDUINO", this.arduinoWS);
        this.registerWebSocketCommonEvents("ELM327", this.elm327WS);
        this.registerWebSocketCommonEvents("FUELTRIP", this.fueltripWS);
    }
    
    private setWSURL(webSocketServerName : string)
    {
        this.defiWS.URL = "ws://" + webSocketServerName + ":" + DEFICOM_WS_PORT.toString() + "/"; 
        this.ssmWS.URL = "ws://" + webSocketServerName + ":" + SSMCOM_WS_PORT.toString() + "/"; 
        this.arduinoWS.URL = "ws://" + webSocketServerName + ":" + ARDUINOCOM_WS_PORT.toString() + "/"; 
        this.elm327WS.URL = "ws://" + webSocketServerName + ":" + ELM327COM_WS_PORT.toString() + "/"; 
        this.fueltripWS.URL = "ws://" + webSocketServerName + ":" + FUELTRIP_WS_PORT.toString() + "/"; 
    }
    
    private registerWebSocketCommonEvents(logPrefix : string, wsObj: WebSocketCommunication.WebsocketCommon)
    {
        wsObj.OnWebsocketClose = () => {
        this.logWindow.appendLog(logPrefix + " is disconnected.");
        this.controlPanel.setDefiIndicatorStatus(wsObj.getReadyState());

        window.setTimeout(() => wsObj.Connect(), 5000);
        }
        wsObj.OnWebsocketError = (message : string) => {
            this.logWindow.appendLog(logPrefix + " websocket error : " + message);
        }
        wsObj.OnRESPacketReceived = (message : string) => {
            this.logWindow.appendLog(logPrefix + " RES message : " + message);
        }
        wsObj.OnERRPacketReceived = (message : string) =>
        {
            this.logWindow.appendLog(logPrefix + " ERR message : " + message);
        }
    }
    
}
