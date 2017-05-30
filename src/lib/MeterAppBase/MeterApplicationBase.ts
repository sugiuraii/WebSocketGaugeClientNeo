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
import * as WebSocketCommunication from "../WebSocket/WebSocketCommunication";
import {calculateGearPosition} from "./CalculateGearPosition";
export {DefiParameterCode} from "../WebSocket/WebSocketCommunication";

const DEFICOM_WS_PORT = 2012;
const ARDUINOCOM_WS_PORT = 2015;
const SSMCOM_WS_PORT = 2013;
const ELM327COM_WS_PORT = 2016;
const FUELTRIP_WS_PORT = 2014;

const WEBSOCKET_CHECK_INTERVAL = 1000;
const WAITTIME_BEFORE_SENDWSSEND = 3000;
const WAITTIME_BEFORE_RECONNECT = 5000;

const VIEWPORT_ATTRIBUTE = "width=device-width, minimal-ui";

export abstract class MeterApplicationBase
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
    
    public SSMELM327SlowReadInterval : number = 10;
    
    private webFontFamiliyNameToPreload : string[] = new Array();
    private webFontCSSURLToPreload : string[] = new Array();
    private texturePathToPreload : string[] = new Array();
    
    public registerWebFontFamilyNameToPreload(target : string[]) : void;
    public registerWebFontFamilyNameToPreload(target : string) : void;
    public registerWebFontFamilyNameToPreload(target : any) : void
    {
        if(typeof target === "string")
        {
            const targetArray : string[] = [target];
            this.registerWebFontFamilyNameToPreload(targetArray);
        }
        else if (target instanceof Array)
             this.webFontFamiliyNameToPreload = this.webFontFamiliyNameToPreload.concat(target);
    }
    public registerWebFontCSSURLToPreload(target : string[]) : void;
    public registerWebFontCSSURLToPreload(target : string) : void;
    public registerWebFontCSSURLToPreload(target : any) : void
    {
        if(typeof target === "string")
        {
            const targetArray : string[] = [target];
            this.registerWebFontCSSURLToPreload(targetArray);
        }
        else if (target instanceof Array)
             this.webFontCSSURLToPreload = this.webFontCSSURLToPreload.concat(target);
    }
    public registerTexturePathToPreload(target : string[]) : void;
    public registerTexturePathToPreload(target : string) : void;
    public registerTexturePathToPreload(target : any) : void
    {
        if(typeof target === "string")
        {
            const targetArray : string[] = [target];
            this.registerTexturePathToPreload(targetArray);
        }
        else if (target instanceof Array)
            this.texturePathToPreload = this.texturePathToPreload.concat(target);
    }
    
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
    
    public FUELTRIPSectSpan : number = 300;
    public FUELTRIPSectStoreMax : number = 5;
    
    protected abstract setWebSocketOptions() : void;
    protected abstract setTextureFontPreloadOptions() : void;
    
    protected abstract setPIXIMeterPanel() : void;
    
    constructor(webSocketServerName? : string)
    {
        //Set url of websocket
        if (typeof (webSocketServerName) === "undefined")
            this.webSocketServerName = location.hostname;
        else
            this.webSocketServerName = webSocketServerName;
        this.setWSURL(this.webSocketServerName);
        
        // Register control panel events (buttons and spinner)
        this.registerControlPanelEvents();
        
        // Set viewport meta-tag
        this.setViewPortMetaTag();
        
        // Set fullscreen tag for android and ios
        this.setWebAppCapable();
        
        // Set common websocket events (OnClose, OnError, OnRESPacketReceived, OnERRPacketReceived)
        this.registerWebSocketCommonEvents("DEFI", this.defiWS);
        this.registerWebSocketCommonEvents("SSM", this.ssmWS);
        this.registerWebSocketCommonEvents("ARDUINO", this.arduinoWS);
        this.registerWebSocketCommonEvents("ELM327", this.elm327WS);
        this.registerWebSocketCommonEvents("FUELTRIP", this.fueltripWS); 
        
        // Set websocket options
        // Code list, etc...
        this.setWebSocketOptions();
        
        //Setup websocket indicator.
        this.setWebsocketIndicator();
        // Set texture, font preload options
        this.setTextureFontPreloadOptions();
        
        // Preload Fonts -> textures-> parts
        this.preloadFonts( () => this.preloadTextures( () => this.setPIXIMeterPanel()));        
    }
    
    private setViewPortMetaTag()
    {
        let metalist = document.getElementsByTagName('meta');
        let hasMeta = false;
        
        for(let i = 0; i < metalist.length; i++) 
        {
            let name = metalist[i].getAttribute('name');
            if(name && name.toLowerCase() === 'viewport') 
            {
                metalist[i].setAttribute('content', VIEWPORT_ATTRIBUTE);
                hasMeta = true;
                break;
            }
        }
        if(!hasMeta) 
        {
            let meta = document.createElement('meta');
            meta.setAttribute('name', 'viewport');
            meta.setAttribute('content', VIEWPORT_ATTRIBUTE);
            document.getElementsByTagName('head')[0].appendChild(meta);
        }
    }
    
    private setWebAppCapable() : void
    {
        {
            const meta = document.createElement('meta');
            meta.setAttribute('name', 'apple-mobile-web-app-capable');
            meta.setAttribute('content', 'yes');
            document.getElementsByTagName('head')[0].appendChild(meta);
        }
        {
            const meta = document.createElement('meta');
            meta.setAttribute('name', 'mobile-web-app-capable');
            meta.setAttribute('content', 'yes');
            document.getElementsByTagName('head')[0].appendChild(meta);
        }
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
    
    private registerControlPanelEvents()
    {
        this.controlPanel.setOnLogButtonClicked(() => this.logWindow.Visible = !this.logWindow.Visible);
        this.controlPanel.setOnResetButtonClicked( () => 
        {
            if (window.confirm("Reset FUELTRIP logger?"))
            {
                if (this.fueltripWS.getReadyState() === WebSocket.OPEN)
                {
                    this.logWindow.appendLog("FUELTRIP send RESET..");
                    this.fueltripWS.SendReset();
                }
                else
                    this.logWindow.appendLog("FUELTRIP RESET is requested. However, fueltripWS is not active.");
            }
        });
        this.controlPanel.setOnWebSocketIntervalSpinnerChanged( () =>
        {
            let wsIntervalSent = false;
            
            if (this.defiWS.getReadyState() === WebSocket.OPEN)
            {
                this.defiWS.SendWSInterval(this.controlPanel.WebSocketInterval);
                wsIntervalSent = true;
            }
            if (this.arduinoWS.getReadyState())
            {
                this.arduinoWS.SendWSInterval(this.controlPanel.WebSocketInterval);
                wsIntervalSent = true;
            }
        });
    }
    
    private checkWebSocketStatus()
    {
        this.controlPanel.setDefiIndicatorStatus(this.defiWS.getReadyState());
        this.controlPanel.setSSMIndicatorStatus(this.ssmWS.getReadyState());
        this.controlPanel.setArduinoIndicatorStatus(this.arduinoWS.getReadyState());
        this.controlPanel.setELM327IndicatorStatus(this.elm327WS.getReadyState());
        this.controlPanel.setFUELTRIPIndicatorStatus(this.fueltripWS.getReadyState());
    }
    
    public run()
    {
        this.connectWebSocket();
    }
    
    private setWebsocketIndicator()
    {
        this.controlPanel.IsDefiInidicatorEnabled = this.IsDefiWSEnabled;
        this.controlPanel.IsSSMInidicatorEnabled = this.IsSSMWSEnabled;
        this.controlPanel.IsArduinoInidicatorEnabled = this.IsArudinoWSEnabled;
        this.controlPanel.IsELM327InidicatorEnabled = this.IsELM327WSEnabled;
        this.controlPanel.IsFUELTRIPInidicatorEnabled = this.IsFUELTRIPWSEnabled;
        
        // Check websocket staus every 1sec
        window.setInterval(() => this.checkWebSocketStatus(), WEBSOCKET_CHECK_INTERVAL);
    }
    
    private preloadFonts(callBack : ()=> void)
    {
        const webFontFamilyWithoutOverlap = this.webFontFamiliyNameToPreload.filter(
            (x, i, self) => 
            {
                return self.indexOf(x) === i;
            }
        );
        const webFontCSSURLWithoutOverlap = this.webFontCSSURLToPreload.filter(
            (x, i, self) => 
            {
                return self.indexOf(x) === i;
            }
        );
        
        // call callBack() without loading fonts if the webFontFamily and webFoutCSSURL contains no elements.
        if (webFontFamilyWithoutOverlap.length === 0 && webFontCSSURLWithoutOverlap.length === 0)
            callBack();
        
        WebFont.load(
            {
                custom: 
                { 
                    families: webFontFamilyWithoutOverlap,
                    urls: webFontCSSURLWithoutOverlap 
                },
                active: () => { callBack(); }
            }
        );
    }
    
    private preloadTextures(callBack : ()=> void)
    {
        const texturePathWithoutOverlap = this.texturePathToPreload.filter(
            (x, i, self) => 
            {
                return self.indexOf(x) === i;
            }
        );
        
        for (let i = 0; i < texturePathWithoutOverlap.length; i++)
        {
            const texturePath = texturePathWithoutOverlap[i];
            PIXI.loader.add(texturePath);
        }

        PIXI.loader.load(() => 
        {
            callBack();
        }
        );
    }

    private connectWebSocket()
    {
        console.debug("called connectWebSocket");
        if (this.IsDefiWSEnabled)
            this.connectDefiArduinoWebSocket("DefiWS", this.defiParameterCodeList, this.defiWS);
        if (this.IsArudinoWSEnabled)
            this.connectDefiArduinoWebSocket("ArduinoWS", this.arduinoParameterCodeList, this.arduinoWS);
        if (this.IsSSMWSEnabled)
            this.connectSSMELM327WebSocket("SSMWS", this.ssmParameterCodeList, this.SSMELM327SlowReadInterval,  this.ssmWS);
        if (this.IsELM327WSEnabled)
            this.connectSSMELM327WebSocket("ELM327WS", this.elm327ParameterCodeList, this.SSMELM327SlowReadInterval, this.elm327WS);
        if (this.IsFUELTRIPWSEnabled)
            this.connectFUELTRIPWebSocket("FUELTRIPWS",  this.FUELTRIPSectSpan, this.FUELTRIPSectStoreMax, this.fueltripWS);
    }
    
    private connectFUELTRIPWebSocket(logPrefix: string, sectSpan : number, sectStoreMax : number, webSocketObj: WebSocketCommunication.FUELTRIPWebsocket)
    {
        webSocketObj.OnWebsocketOpen = () =>
        {
            this.logWindow.appendLog(logPrefix + " is connected. Send SECT_SPAN and SECT_STOREMAX after " + WAITTIME_BEFORE_SENDWSSEND.toString() + " ms.");
            window.setTimeout( () => 
            {
                webSocketObj.SendSectSpan(sectSpan);
                webSocketObj.SendSectStoreMax(sectStoreMax);
                
            }, WAITTIME_BEFORE_SENDWSSEND);
        }
        
        webSocketObj.OnWebsocketClose = () =>
        {
            this.logWindow.appendLog(logPrefix + " is disconnected. Reconnect after " + WAITTIME_BEFORE_RECONNECT.toString() + "msec...");                
            window.setTimeout(() => webSocketObj.Connect(), WAITTIME_BEFORE_RECONNECT);
        }
        
        this.logWindow.appendLog(logPrefix + " connect...");
        webSocketObj.Connect();
        
    }
    
    private connectDefiArduinoWebSocket(logPrefix : string, parameterCodeList : {code: string, interpolate : boolean}[] , webSocketObj: WebSocketCommunication.DefiCOMWebsocket)
    {
        webSocketObj.OnWebsocketOpen = () =>
        {
            this.logWindow.appendLog(logPrefix + " is connected. SendWSSend after "  + WAITTIME_BEFORE_SENDWSSEND.toString() + " msec");
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
            }, WAITTIME_BEFORE_SENDWSSEND);
        }
        webSocketObj.OnWebsocketClose = () =>
        {
            this.logWindow.appendLog(logPrefix + " is disconnected. Reconnect after " + WAITTIME_BEFORE_RECONNECT.toString() + "msec...");                
            window.setTimeout(() => webSocketObj.Connect(), WAITTIME_BEFORE_RECONNECT);
        }

        this.logWindow.appendLog(logPrefix + " connect...");
        webSocketObj.Connect();
    }
    
    private connectSSMELM327WebSocket(logPrefix : string, parameterCodeList : {code: string, readMode: string, interpolate : boolean}[] , slowReadInterval : number, webSocketObj: WebSocketCommunication.SSMWebsocket)
    {
        webSocketObj.OnWebsocketOpen = () =>
        {
            this.logWindow.appendLog(logPrefix + " is connected. SendWSSend after "  + WAITTIME_BEFORE_SENDWSSEND.toString() + " msec");
            window.setTimeout( () => 
            {
                webSocketObj.SendSlowreadInterval(slowReadInterval);
                
                for (let item of parameterCodeList)
                {
                    if (item.readMode === WebSocketCommunication.ReadModeCode.SLOWandFAST)
                    {
                        webSocketObj.SendCOMRead(item.code, WebSocketCommunication.ReadModeCode.SLOW, true);
                        webSocketObj.SendCOMRead(item.code, WebSocketCommunication.ReadModeCode.FAST, true);
                    }
                    else
                        webSocketObj.SendCOMRead(item.code, item.readMode, true);
                    
                    if (item.interpolate)
                        webSocketObj.EnableInterpolate(item.code)
                    else
                        webSocketObj.DisableInterpolate(item.code)
                }
            }, WAITTIME_BEFORE_SENDWSSEND);
        }
        webSocketObj.OnWebsocketClose = () =>
        {
            this.logWindow.appendLog(logPrefix + " is disconnected. Reconnect after " + WAITTIME_BEFORE_RECONNECT.toString() + "msec...");                
            window.setTimeout(() => webSocketObj.Connect(), WAITTIME_BEFORE_RECONNECT);
        }

        this.logWindow.appendLog(logPrefix + " connect...");
        webSocketObj.Connect();
    }
    
    protected calculateGearPosition(rev : number, speed : number, neutralSw : boolean) : string
    {
        return calculateGearPosition(rev, speed, neutralSw);
    }
}
