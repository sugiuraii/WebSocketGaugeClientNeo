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
import {ApplicationNavBar} from "./bootstrapParts/ApplicationNavBar"
import * as WebFont from "webfontloader";
import * as WebSocketCommunication from "../WebSocket/WebSocketCommunication";
import {calculateGearPosition} from "./CalculateGearPosition";

const DEFICOM_WS_PORT = 2012;
const ARDUINOCOM_WS_PORT = 2015;
const SSMCOM_WS_PORT = 2013;
const ELM327COM_WS_PORT = 2016;
const FUELTRIP_WS_PORT = 2014;
const ACSHM_WS_PORT = 2017;

const WEBSOCKET_CHECK_INTERVAL = 1000;
const WAITTIME_BEFORE_SENDWSSEND = 3000;
const WAITTIME_BEFORE_RECONNECT = 5000;

const VIEWPORT_ATTRIBUTE = "width=device-width, minimal-ui, initial-scale=1.0";
//const VIEWPORT_ATTRIBUTE = "width=device-width, minimal-ui";

/**
 * Base class to define application with meter panel and websocket clients.
 */
export abstract class MeterApplicationBase extends PIXI.Application
{    
    private webSocketServerName : string;
    
    private applicationnavBar: ApplicationNavBar;
    
    private defiWS: WebSocketCommunication.DefiCOMWebsocket;
    private ssmWS: WebSocketCommunication.SSMWebsocket;
    private arduinoWS: WebSocketCommunication.ArduinoCOMWebsocket;
    private elm327WS: WebSocketCommunication.ELM327COMWebsocket;
    private fueltripWS: WebSocketCommunication.FUELTRIPWebsocket;
    private assettoCorsaWS : WebSocketCommunication.AssettoCorsaSHMWebsocket;   
    /**
     * Get DefiWS websocket client.
     */ 
    get DefiWS() {return this.defiWS}
    /**
     * Get SSMWS websocket client.
     */
    get SSMWS() {return this.ssmWS}
    /**
     * Get ArduinoWS websocket client.
     */
    get ArduinoWS() {return this.arduinoWS}
    /**
     * Get ELM327WS websocket client..
     */
    get ELM327WS() { return this.elm327WS}
    /**
     * Get FUElTRIP websocket client.
     */
    get FUELTRIPWS() {return this.fueltripWS}
 
    get AssettoCorsaWS() { return this.assettoCorsaWS}

    /**
     * Flag to enable DefiWS client.
     */
    public IsDefiWSEnabled: boolean;
    /**
     * Flag to enable SSMWS client.
     */
    public IsSSMWSEnabled: boolean;
    /**
     *  Flag to enable ArduinoWS client.
     */
    public IsArudinoWSEnabled: boolean;
    /**
     * Flag to enable ELM327WS client.
     */
    public IsELM327WSEnabled: boolean;
    /**
     * Flag to enable FUELTRIP WS client.
     */
    public IsFUELTRIPWSEnabled: boolean;

    public IsAssettoCorsaWSEnabled: boolean;

    /**
     * Slow read interval for SSM and ELM327 Websocket.
     */
    public SSMELM327SlowReadInterval : number;
    
    private webFontFamiliyNameToPreload : string[];
    private webFontCSSURLToPreload : string[];
    private texturePathToPreload : string[];
    
    /**
     * Register WebFont family name to preload before running meter application.
     * @param target WebFontFamily name to preload.
     */
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
    /**
     * Register WebFont CSS URL to preload before running meter application.
     * @param target CSS URL to preload.
     */
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
    /**
     * Register texture(sprite) image path to preload before running meter application.
     * @param target Image (or sprite sheet json file) path to preload.
     */
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
    
    private defiParameterCodeList: {code: string, interpolate : boolean}[];
    private arduinoParameterCodeList : {code : string, interpolate : boolean}[]; 
    private ssmParameterCodeList : {code : string, readMode : string, interpolate: boolean}[];
    private elm327ParameterCodeList : {code : string, readMode : string, interpolate : boolean}[];
    private assettoCorsaPhysicsParameterCodeList  : {code : string, interpolate : boolean}[];
    private assettoCorsaGraphicsParameterCodeList  : {code : string, interpolate : boolean}[];
    private assettoCorsaStaticInfoParameterCodeList  : {code : string, interpolate : boolean}[];
    
    /**
     * Register Defi parameter code to enable communication.
     * @param code Parameter code name to register.
     * @param interpolate Flag to enable or disable time domain interpolation.
     */
    public registerDefiParameterCode(code : string, interpolate : boolean)
    {
        this.defiParameterCodeList.push({code, interpolate});
    }
    /**
     * Register Arduino parameter code to enable communication.
     * @param code Parameter code name to register.
     * @param interpolate Flag to enable or disable time domain interpolation.
     */
    public registerArduinoParameterCode(code : string, interpolate : boolean)
    {
        this.arduinoParameterCodeList.push({code, interpolate});
    }
    /**
     * Register SSM parameter code to enable communication.
     * @param code Parameter code name to register.
     * @param interpolate Flag to enable or disable time domain interpolation.
     */
    public registerSSMParameterCode(code : string, readMode : string, interpolate : boolean)
    {
        this.ssmParameterCodeList.push({code, readMode, interpolate});
    }
    /**
     * Register ELM327(OBDII PID) parameter code to enable communication.
     * @param code Parameter code name to register.
     * @param interpolate Flag to enable or disable time domain interpolation.
     */
    public registerELM327ParameterCode(code : string, readMode : string, interpolate : boolean)
    {
        this.elm327ParameterCodeList.push({code, readMode, interpolate});
    }
    
    public registerAssettoCorsaPhysicsParameterCode(code : string, interpolate : boolean)
    {
        this.assettoCorsaPhysicsParameterCodeList.push({code, interpolate});
    }

    public registerAssettoCorsaGraphicsParameterCode(code : string, interpolate : boolean)
    {
        this.assettoCorsaGraphicsParameterCodeList.push({code, interpolate});
    }

    public registerAssettoCorsaStaticInfoParameterCode(code : string, interpolate : boolean)
    {
        this.assettoCorsaStaticInfoParameterCodeList.push({code, interpolate});
    }



    /**
     * Fueltrip logger section fueltrip time span (in sec).
     */
    public FUELTRIPSectSpan : number;
    /**
     * Number of section to store gas milage.
     */
    public FUELTRIPSectStoreMax : number;
    
    /**
     * Set websocket options.
     */
    protected abstract setWebSocketOptions() : void;
    /**
     * Set webfont/texture preload.
     */
    protected abstract setTextureFontPreloadOptions() : void;
    /**
     * Set pixi.js meter panel.
     */
    protected abstract setPIXIMeterPanel() : void;
    
    /**
     * Construct MeterApplicationBase.
     * @param width Stage width in px.
     * @param height Stage height in px.
     */
    constructor(width: number, height: number)
    {
        // Get preserveDrawingBuffer flag from webstorage
        const preserveDrawingBuffer : boolean = localStorage.getItem("preserveDrawingBuffer")==="true"?true:false;        
        
        // Call PIXI.Application
        super({width:width, height:height, preserveDrawingBuffer});
           
        // Initialize websocket instances
        this.initializeWebSocketInstances();
        
        // Append PIXI.js application to document body
        this.view.style.width = "100vw";
        this.view.style.touchAction = "auto";
        this.view.style.pointerEvents = "none";
        document.body.appendChild(this.view);
        
        //Set url of websocket
        const wsServerHostname : string = localStorage.getItem("WSServerHostname");
        const setWSServerSameAsHttpSite : boolean = localStorage.getItem("SetWSServerSameAsHttp")==="true"?true:false;
        if (setWSServerSameAsHttpSite)
            this.webSocketServerName = location.hostname;
        else
            this.webSocketServerName = wsServerHostname;
        this.setWSURL(this.webSocketServerName);
        
        // Initialize control panel.
        this.initializeNavBar();
        
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
        this.registerWebSocketCommonEvents("ACSHM", this.assettoCorsaWS); 

        // Set websocket options
        // Code list, etc...
        this.setWebSocketOptions();
        
        //Setup websocket indicator.
        this.setWebsocketIndicator();
        
        // Set texture, font preload options
        this.webFontFamiliyNameToPreload = new Array();
        this.webFontCSSURLToPreload = new Array();
        this.texturePathToPreload = new Array();
        this.setTextureFontPreloadOptions();
        
        // Preload Fonts -> textures-> parts
        this.preloadFonts( () => this.preloadTextures( () => this.setPIXIMeterPanel()));        
    }
    
    private initializeWebSocketInstances()
    {
        this.defiWS = new WebSocketCommunication.DefiCOMWebsocket();
        this.ssmWS = new WebSocketCommunication.SSMWebsocket();
        this.arduinoWS = new WebSocketCommunication.ArduinoCOMWebsocket();
        this.elm327WS = new WebSocketCommunication.ELM327COMWebsocket();
        this.fueltripWS = new WebSocketCommunication.FUELTRIPWebsocket();
        this.assettoCorsaWS = new WebSocketCommunication.AssettoCorsaSHMWebsocket();
        
        this.IsDefiWSEnabled = false;
        this.IsSSMWSEnabled = false;
        this.IsArudinoWSEnabled = false;
        this.IsELM327WSEnabled = false;
        this.IsAssettoCorsaWSEnabled = false;

        this.SSMELM327SlowReadInterval = 10;
        
        this.FUELTRIPSectSpan = 300;
        this.FUELTRIPSectStoreMax = 5;
        
        this.defiParameterCodeList = new Array();
        this.arduinoParameterCodeList = new Array(); 
        this.ssmParameterCodeList = new Array();
        this.elm327ParameterCodeList = new Array();
        this.assettoCorsaPhysicsParameterCodeList = new Array();
        this.assettoCorsaGraphicsParameterCodeList = new Array();
        this.assettoCorsaStaticInfoParameterCodeList = new Array();
    }
    
    private initializeNavBar()
    {
        this.applicationnavBar = new ApplicationNavBar();
        this.applicationnavBar.create();
        this.applicationnavBar.FUELTRIPModalDialog.FUELTRIPWebsocket = this.FUELTRIPWS;
    }
    
    /**
     * Set viewport meta tag.
     */
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
    
    /**
     * Set meta tag to capable webapp.
     */
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
    
    /**
     * Set websocket URL.
     */
    private setWSURL(webSocketServerName : string)
    {
        this.defiWS.URL = "ws://" + webSocketServerName + ":" + DEFICOM_WS_PORT.toString() + "/"; 
        this.ssmWS.URL = "ws://" + webSocketServerName + ":" + SSMCOM_WS_PORT.toString() + "/"; 
        this.arduinoWS.URL = "ws://" + webSocketServerName + ":" + ARDUINOCOM_WS_PORT.toString() + "/"; 
        this.elm327WS.URL = "ws://" + webSocketServerName + ":" + ELM327COM_WS_PORT.toString() + "/"; 
        this.fueltripWS.URL = "ws://" + webSocketServerName + ":" + FUELTRIP_WS_PORT.toString() + "/"; 
        this.assettoCorsaWS.URL = "ws://" + webSocketServerName + ":" + ACSHM_WS_PORT.toString() + "/"; 
    }
    
    private registerWebSocketCommonEvents(logPrefix : string, wsObj: WebSocketCommunication.WebsocketCommon)
    {
        const logWindow = this.applicationnavBar.LogModalDialog;

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
    
    private checkWebSocketStatus()
    {
        const Indicator = this.applicationnavBar;
        Indicator.setDefiIndicatorStatus(this.defiWS.getReadyState());
        Indicator.setSSMIndicatorStatus(this.ssmWS.getReadyState());
        Indicator.setArduinoIndicatorStatus(this.arduinoWS.getReadyState());
        Indicator.setELM327IndicatorStatus(this.elm327WS.getReadyState());
        Indicator.setFUELTRIPIndicatorStatus(this.fueltripWS.getReadyState());
        Indicator.setAssetoCorsaSHMIndicatorStatus(this.assettoCorsaWS.getReadyState());
    }
    
    /**
     * Start application.
     */
    public run()
    {
        this.connectWebSocket();
    }
    
    private setWebsocketIndicator()
    {
        const Indicator = this.applicationnavBar;
        Indicator.IsDefiInidicatorEnabled = this.IsDefiWSEnabled;
        Indicator.IsSSMInidicatorEnabled = this.IsSSMWSEnabled;
        Indicator.IsArduinoInidicatorEnabled = this.IsArudinoWSEnabled;
        Indicator.IsELM327InidicatorEnabled = this.IsELM327WSEnabled;
        Indicator.IsFUELTRIPInidicatorEnabled = this.IsFUELTRIPWSEnabled;
        Indicator.IsAssettoCorsaSHMInidicatorEnabled = this.IsAssettoCorsaWSEnabled;
        
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
            PIXI.Loader.shared.add(texturePath);
        }

        PIXI.Loader.shared.load(() => 
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
        if(this.IsAssettoCorsaWSEnabled)
            this.connectAssetoCorsaSHMWebSocket("ACSHMWS",
            this.assettoCorsaPhysicsParameterCodeList,
            this.assettoCorsaGraphicsParameterCodeList,
            this.assettoCorsaStaticInfoParameterCodeList,
             this.assettoCorsaWS);
    }
    
    private connectFUELTRIPWebSocket(logPrefix: string, sectSpan : number, sectStoreMax : number, webSocketObj: WebSocketCommunication.FUELTRIPWebsocket)
    {
        const LogWindow = this.applicationnavBar.LogModalDialog;
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
        const LogWindow = this.applicationnavBar.LogModalDialog;
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
                webSocketObj.SendWSInterval(this.getWSIntervalFromLocalStorage());
                
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
        const LogWindow = this.applicationnavBar.LogModalDialog;
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

    private connectAssetoCorsaSHMWebSocket(logPrefix : string, 
        physicsParameterCodeList : {code: string, interpolate : boolean}[],
        graphicsParameterCodeList : {code: string, interpolate : boolean}[],
        staticInfoParameterCodeList : {code: string, interpolate : boolean}[],
         webSocketObj: WebSocketCommunication.AssettoCorsaSHMWebsocket)
    {
        const LogWindow = this.applicationnavBar.LogModalDialog;
        webSocketObj.OnWebsocketOpen = () =>
        {
            LogWindow.appendLog(logPrefix + " is connected. SendWSSend/Interval after "  + WAITTIME_BEFORE_SENDWSSEND.toString() + " msec");
            window.setTimeout( () => 
            {                
                for (let item of physicsParameterCodeList)
                {
                    webSocketObj.SendPhysicsWSSend(item.code, true);
                    if (item.interpolate)
                        webSocketObj.EnableInterpolate(item.code)
                    else
                        webSocketObj.DisableInterpolate(item.code)
                }
                for (let item of graphicsParameterCodeList)
                {
                    webSocketObj.SendGraphicsWSSend(item.code, true);
                    if (item.interpolate)
                        webSocketObj.EnableInterpolate(item.code)
                    else
                        webSocketObj.DisableInterpolate(item.code)
                }
                for (let item of staticInfoParameterCodeList)
                {
                    webSocketObj.SendStaticInfoWSSend(item.code, true);
                    if (item.interpolate)
                        webSocketObj.EnableInterpolate(item.code)
                    else
                        webSocketObj.DisableInterpolate(item.code)
                }
                //SendPhysicsWSInterval from spinner
                webSocketObj.SendPhysicsWSInterval(this.getWSIntervalFromLocalStorage());
                
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
    
    /** 
     * Calculate gear position.
     * @param rev Engine speed in rpm.
     * @paran speed Vehicle speelp.
     * @param neutralSw Flag of netural.
     * @return Calcualted gear position (number or "N" in the case of neutral).
     */
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
