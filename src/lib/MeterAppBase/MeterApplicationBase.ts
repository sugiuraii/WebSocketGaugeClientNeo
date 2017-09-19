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
import * as PIXI from "pixi.js";
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

const VIEWPORT_ATTRIBUTE = "width=device-width, minimal-ui, initial-scale=1.0";
//const VIEWPORT_ATTRIBUTE = "width=device-width, minimal-ui";

export abstract class MeterApplicationBase extends PIXI.Application
{    
    private webSocketServerName : string;
    
    private controlPanel = new ControlPanel();
    
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
    
    constructor(width : number, height : number, webSocketServerName? : string)
    {
        super(width, height);
        // Append to document body
        this.view.style.width = "100vw";
        this.view.style.touchAction = "auto";
        document.body.appendChild(this.view);
        
        //Set url of websocket
        if (typeof (webSocketServerName) === "undefined")
            this.webSocketServerName = location.hostname;
        else
            this.webSocketServerName = webSocketServerName;
        this.setWSURL(this.webSocketServerName);
        
        //Set controlPanel
        document.body.appendChild(this.controlPanel.Container);   
        //Add controlPanel open button
        document.body.appendChild(this.controlPanel.OpenButton);
        
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
        
        //Load WSInterval from localstorage and set to spinner.
        this.setWSIntervalSpinner();
        
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
        const logWindow = this.controlPanel.LogWindow;

        wsObj.OnWebsocketError = (message: string) => {
            logWindow.appendLog(logPrefix + " websocket error : " + message);
        }
        wsObj.OnRESPacketReceived = (message: string) => {
            logWindow.appendLog(logPrefix + " RES message : " + message);
        }
        wsObj.OnERRPacketReceived = (message: string) => {
            logWindow.appendLog(logPrefix + " ERR message : " + message);
        }
    }
    
    private registerControlPanelEvents()
    {
        const ResetButton = this.controlPanel.ResetButton;
        const LogWindow = this.controlPanel.LogWindow;
        const IntervalController = this.controlPanel.IntervalController;
        
        ResetButton.onclick =  () => 
        {
            if (window.confirm("Reset FUELTRIP logger?"))
            {
                if (this.fueltripWS.getReadyState() === WebSocket.OPEN)
                {
                    LogWindow.appendLog("FUELTRIP send RESET..");
                    this.fueltripWS.SendReset();
                }
                else
                    LogWindow.appendLog("FUELTRIP RESET is requested. However, fueltripWS is not active.");
            }
        };
        IntervalController.setOnWebSocketIntervalSpinnerChanged( () =>
        {
            let wsIntervalSent = false;
            
            //Save to local storage
            this.setWSIntervalToLocalStorage(IntervalController.WebSocketInterval);
            
            if (this.defiWS.getReadyState() === WebSocket.OPEN)
            {
                this.defiWS.SendWSInterval(IntervalController.WebSocketInterval);
                wsIntervalSent = true;
            }
            if (this.arduinoWS.getReadyState()  === WebSocket.OPEN)
            {
                this.arduinoWS.SendWSInterval(IntervalController.WebSocketInterval);
                wsIntervalSent = true;
            }
            
            if (!wsIntervalSent)
            {
                this.controlPanel.LogWindow.appendLog("WSInterval spinner is changed. However, neither DefiWS nor ArduinoWS are active.");
            }
            
            
        });
    }
    
    private checkWebSocketStatus()
    {
        const Indicator = this.controlPanel.WebSocketIndicator;
        Indicator.setDefiIndicatorStatus(this.defiWS.getReadyState());
        Indicator.setSSMIndicatorStatus(this.ssmWS.getReadyState());
        Indicator.setArduinoIndicatorStatus(this.arduinoWS.getReadyState());
        Indicator.setELM327IndicatorStatus(this.elm327WS.getReadyState());
        Indicator.setFUELTRIPIndicatorStatus(this.fueltripWS.getReadyState());
    }
    
    public run()
    {
        this.connectWebSocket();
    }
    
    private setWebsocketIndicator()
    {
        const Indicator = this.controlPanel.WebSocketIndicator;
        Indicator.IsDefiInidicatorEnabled = this.IsDefiWSEnabled;
        Indicator.IsSSMInidicatorEnabled = this.IsSSMWSEnabled;
        Indicator.IsArduinoInidicatorEnabled = this.IsArudinoWSEnabled;
        Indicator.IsELM327InidicatorEnabled = this.IsELM327WSEnabled;
        Indicator.IsFUELTRIPInidicatorEnabled = this.IsFUELTRIPWSEnabled;
        
        // Check websocket staus every 1sec
        window.setInterval(() => this.checkWebSocketStatus(), WEBSOCKET_CHECK_INTERVAL);
    }
    
    private setWSIntervalSpinner()
    {
        const interval = this.getWSIntervalFromLocalStorage();
        this.controlPanel.IntervalController.WebSocketInterval = interval;
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
        const LogWindow = this.controlPanel.LogWindow;
        webSocketObj.OnWebsocketOpen = () =>
        {
            LogWindow.appendLog(logPrefix + " is connected. Send SECT_SPAN and SECT_STOREMAX after " + WAITTIME_BEFORE_SENDWSSEND.toString() + " ms.");
            window.setTimeout( () => 
            {
                webSocketObj.SendSectSpan(sectSpan);
                webSocketObj.SendSectStoreMax(sectStoreMax);
                
            }, WAITTIME_BEFORE_SENDWSSEND);
        }
        
        webSocketObj.OnWebsocketClose = () =>
        {
            LogWindow.appendLog(logPrefix + " is disconnected. Reconnect after " + WAITTIME_BEFORE_RECONNECT.toString() + "msec...");                
            window.setTimeout(() => webSocketObj.Connect(), WAITTIME_BEFORE_RECONNECT);
        }
        
        LogWindow.appendLog(logPrefix + " connect...");
        webSocketObj.Connect();
        
    }
    
    private connectDefiArduinoWebSocket(logPrefix : string, parameterCodeList : {code: string, interpolate : boolean}[] , webSocketObj: WebSocketCommunication.DefiCOMWebsocket)
    {
        const LogWindow = this.controlPanel.LogWindow;
        webSocketObj.OnWebsocketOpen = () =>
        {
            LogWindow.appendLog(logPrefix + " is connected. SendWSSend/Interval after "  + WAITTIME_BEFORE_SENDWSSEND.toString() + " msec");
            window.setTimeout( () => 
            {
                //SendWSSend
                for (let item of parameterCodeList)
                {
                    webSocketObj.SendWSSend(item.code, true);
                    if (item.interpolate)
                        webSocketObj.EnableInterpolate(item.code)
                    else
                        webSocketObj.DisableInterpolate(item.code)
                }
                
                //SendWSInterval from spinner
                webSocketObj.SendWSInterval(this.controlPanel.IntervalController.WebSocketInterval);
                
            }, WAITTIME_BEFORE_SENDWSSEND);
        }
        webSocketObj.OnWebsocketClose = () =>
        {
            LogWindow.appendLog(logPrefix + " is disconnected. Reconnect after " + WAITTIME_BEFORE_RECONNECT.toString() + "msec...");                
            window.setTimeout(() => webSocketObj.Connect(), WAITTIME_BEFORE_RECONNECT);
        }

        LogWindow.appendLog(logPrefix + " connect...");
        webSocketObj.Connect();
    }
    
    private connectSSMELM327WebSocket(logPrefix : string, parameterCodeList : {code: string, readMode: string, interpolate : boolean}[] , slowReadInterval : number, webSocketObj: WebSocketCommunication.SSMWebsocket)
    {
        const LogWindow = this.controlPanel.LogWindow;
        webSocketObj.OnWebsocketOpen = () =>
        {
            LogWindow.appendLog(logPrefix + " is connected. SendWSSend after "  + WAITTIME_BEFORE_SENDWSSEND.toString() + " msec");
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
            LogWindow.appendLog(logPrefix + " is disconnected. Reconnect after " + WAITTIME_BEFORE_RECONNECT.toString() + "msec...");                
            window.setTimeout(() => webSocketObj.Connect(), WAITTIME_BEFORE_RECONNECT);
        }

        LogWindow.appendLog(logPrefix + " connect...");
        webSocketObj.Connect();
    }
    
    private setWSIntervalToLocalStorage(interval: number)
    {
        localStorage.setItem("WSInterval", interval.toString());
    }
    
    private getWSIntervalFromLocalStorage() : number
    {
        if (localStorage.getItem("WSInterval") === null)
            return 0;
        else
        {
            const interval = parseInt(localStorage.getItem("WSInterval"));
            return interval;    
        }
        
    }
    
    protected calculateGearPosition(rev : number, speed : number, neutralSw : boolean) : string
    {
        return calculateGearPosition(rev, speed, neutralSw);
    }
    
    public setBlurOnAppStage(amount : number)
    {
        const stage = this.stage;
        const filter = new PIXI.filters.BlurFilter();
        filter.blur = amount;
        stage.filters = [filter];
    }
    
    public unsetBlurOnAppStage()
    {
        const stage = this.stage;
        stage.filters = [];        
    }
    
}
