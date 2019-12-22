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
import {DefiWebsocketBackend} from "./WebsocketAppBackend/DefiWebsocketBackend";
import {SSMWebsocketBackend} from "./WebsocketAppBackend/SSMWebsocketBackend";
import {ArduinoWebsocketBackend} from "./WebsocketAppBackend/ArduinoWebsocketBackend";
import {ELM327WebsocketBackend} from "./WebsocketAppBackend/ELM327WebsocketBackend";
import {AssettoCorsaSHMWebsocketBackend} from "./WebsocketAppBackend/AssettoCorsaSHMWebsocketBackend";
import {FUELTRIPWebsocketBackend} from "./WebsocketAppBackend/FUELTRIPWebsocketBackend";
import * as WebFont from "webfontloader";

import {calculateGearPosition} from "./utils/CalculateGearPosition";
import { MeterApplicationBaseOption } from "./options/MeterApplicationBaseOption";

const VIEWPORT_ATTRIBUTE = "width=device-width, minimal-ui, initial-scale=1.0";

export abstract class MeterApplicationBase extends PIXI.Application
{   
    private Option : MeterApplicationBaseOption; 

    private applicationnavBar: ApplicationNavBar;
    
    private defiWS: DefiWebsocketBackend;
    private ssmWS: SSMWebsocketBackend;
    private arduinoWS: ArduinoWebsocketBackend;
    private elm327WS: ELM327WebsocketBackend;
    private fueltripWS: FUELTRIPWebsocketBackend;
    private assettoCorsaWS : AssettoCorsaSHMWebsocketBackend;   
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
    constructor(option : MeterApplicationBaseOption)
    {
        // Call PIXI.Application
        super({width:option.width, height:option.height, preserveDrawingBuffer:option.PreserveDrawingBuffer});

        this.Option = option;

        // Append PIXI.js application to document body
        this.view.style.width = "100vw";
        this.view.style.touchAction = "auto";
        this.view.style.pointerEvents = "none";
        document.body.appendChild(this.view);
        // Set viewport meta-tag
        this.setViewPortMetaTag();        
        // Set fullscreen tag for android and ios
        this.setWebAppCapable();
        
        this.applicationnavBar = new ApplicationNavBar();
        this.applicationnavBar.create();

        this.initializeWebsocketBackend(this.applicationnavBar);
                       
        // Set texture, font preload options
        this.setTextureFontPreloadOptions();
        
        // Preload Fonts -> textures-> parts
        this.preloadFonts( () => this.preloadTextures( () => this.setPIXIMeterPanel()));        
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
    private initializeWebsocketBackend(navBar : ApplicationNavBar)
    {
        const webSocketServerName = this.Option.WebSocketServerName;
        const logDialog = navBar.LogModalDialog;

        if(this.Option.WebsocketEnableFlag.Defi)
        {
            const wsURL = "ws://" + webSocketServerName + ":" + DefiWebsocketBackend.DEFAULT_WS_PORT.toString() + "/";
            navBar.AddWebSocketStatusIndicator("defiWSIndicator", "Defi");
            this.defiWS = new DefiWebsocketBackend(wsURL, logDialog, navBar.GetWebSocketStatusIndicator("defiWSIndicator"));
        }
        if(this.Option.WebsocketEnableFlag.SSM)
        {
            const wsURL = "ws://" + webSocketServerName + ":" + SSMWebsocketBackend.DEFAULT_WS_PORT.toString() + "/";
            navBar.AddWebSocketStatusIndicator("ssmWSIndicator", "SSM");
            this.ssmWS = new SSMWebsocketBackend(wsURL, logDialog, navBar.GetWebSocketStatusIndicator("ssmWSIndicator"));
        }
        if(this.Option.WebsocketEnableFlag.Arduino)
        {
            const wsURL = "ws://" + webSocketServerName + ":" + ArduinoWebsocketBackend.DEFAULT_WS_PORT.toString() + "/";
            navBar.AddWebSocketStatusIndicator("arduinoWSIndicator", "Arduino");
            this.arduinoWS = new ArduinoWebsocketBackend(wsURL, logDialog, navBar.GetWebSocketStatusIndicator("arduinoWSIndicator"));
        }
        if(this.Option.WebsocketEnableFlag.ELM327)
        {
            const wsURL = "ws://" + webSocketServerName + ":" + ELM327WebsocketBackend.DEFAULT_WS_PORT.toString() + "/";
            navBar.AddWebSocketStatusIndicator("elm327WSIndicator", "ELM327");
            this.elm327WS = new ELM327WebsocketBackend(wsURL, logDialog, navBar.GetWebSocketStatusIndicator("elm327WSIndicator"));
        }
        if(this.Option.WebsocketEnableFlag.FUELTRIP)
        {
            const wsURL = "ws://" + webSocketServerName + ":" + FUELTRIPWebsocketBackend.DEFAULT_WS_PORT.toString() + "/";
            navBar.AddWebSocketStatusIndicator("fueltripWSIndicator", "FUELTRIP");
            this.fueltripWS = new FUELTRIPWebsocketBackend(wsURL, logDialog, navBar.GetWebSocketStatusIndicator("fueltripWSIndicator"));
        }
        if(this.Option.WebsocketEnableFlag.AssettoCorsaSHM)
        {
            const wsURL = "ws://" + webSocketServerName + ":" + AssettoCorsaSHMWebsocketBackend.DEFAULT_WS_PORT.toString() + "/";
            navBar.AddWebSocketStatusIndicator("acshmWSIndicator", "AssettoCorsaSHM");
            this.assettoCorsaWS = new AssettoCorsaSHMWebsocketBackend(wsURL, logDialog, navBar.GetWebSocketStatusIndicator("acshmWSIndicator"));
        }
    }
    
    /**
     * Start application.
     */
    public run()
    {
        this.connectWebSocket();
    }
           
    private preloadFonts(callBack : ()=> void)
    {
        const webFontFamilyWithoutOverlap = this.Option.WebFontFamiliyNameToPreload.filter(
            (x, i, self) => 
            {
                return self.indexOf(x) === i;
            }
        );
        const webFontCSSURLWithoutOverlap = this.Option.WebFontCSSURLToPreload.filter(
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
        const texturePathWithoutOverlap = this.Option.TexturePathToPreload.filter(
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
