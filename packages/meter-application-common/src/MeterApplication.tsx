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

import * as PIXI from "pixi.js";
import React from "react";
import { createRoot } from 'react-dom/client';

import { WebstorageHandler } from "./Webstorage/WebstorageHandler";
import { WebsocketServiceCollection } from "websocket-gauge-client-communication-service"
import { MeterApplicationOption } from "./options/MeterApplicationOption";
import { ApplicationNavbar } from './reactParts/navbar/ApplicationNavbar';
import { StringListLogger } from "basic-logger";
import PIXIApplication from "./reactParts/PIXIApplication";

import 'bootswatch/dist/slate/bootstrap.min.css';
import { MeterSelectionSetting } from "./reactParts/dialog/MeterSelectDialog";
import { TrailLayer } from "pixi-traillayer";
const BOOTSTRAP_CSS_FILENAME = "bootstrap.min.css";

const VIEWPORT_ATTRIBUTE = "width=device-width, minimal-ui, initial-scale=1.0";

export class MeterApplication {
    private Option: MeterApplicationOption;
    private Logger = new StringListLogger();
    private readonly WebStorage: WebstorageHandler;

    private readonly webSocketCollection: WebsocketServiceCollection;
    private MeterSelectDialogSetting: MeterSelectionSetting;

    protected get RootElem(): JSX.Element {
        const onMeterSelectDialogSet = (Object.keys(this.MeterSelectDialogSetting).length === 0) ? undefined : (c: MeterSelectionSetting) => {
            this.MeterSelectDialogSetting = c;
            this.WebStorage.MeterSelectDialogSetting = c;
        };

        return (
            <>
                <ApplicationNavbar
                    defaultOptionDialogContent={{ forceCanvas: this.WebStorage.ForceCanvas }}
                    defaultWSInterval={this.WebStorage.WSInterval}
                    onOptionDialogSet={c => {
                        this.WebStorage.ForceCanvas = c.forceCanvas;
                    }}
                    onWSIntervalDialogSet={interval => this.WebStorage.WSInterval = interval}
                    onFUELTripResetDialogSet={() => this.webSocketCollection.FUELTRIPWS.SendReset()}
                    logList={this.Logger.Content}
                    websocketStatusList={this.webSocketCollection.WebsocketStates}
                    opacityOnMouseOff={"0.1"}
                    defaultMeterSelectDialogContent={this.MeterSelectDialogSetting}
                    parameterToSelectInMeterSelectDialog={this.Option.MeteSelectDialogOption.ParameterCodeListToSelect}
                    onMeterSelectDialogSet={onMeterSelectDialogSet}
                    onWebStorageReset={() => this.WebStorage.Reset()}
                />
            </>
        );
    }

    constructor(option: MeterApplicationOption) {
        this.Option = option;
        this.WebStorage = new WebstorageHandler(option.MeteSelectDialogOption.DefaultMeterSelectDialogSetting);
        this.webSocketCollection = new WebsocketServiceCollection(this.Logger, option.WebSocketCollectionOption, this.WebStorage.WSInterval, option.WebSocketCollectionOption.InterpolatorOption);

        if (this.WebStorage.MeterSelectDialogSetting === undefined) {
            const logmessage = "MeterDialogSetting is undefined. Overwrite with default value.";
            this.Logger.appendLog(logmessage)
            console.log(logmessage);
            this.WebStorage.MeterSelectDialogSetting = this.Option.MeteSelectDialogOption.DefaultMeterSelectDialogSetting;
        }
        this.MeterSelectDialogSetting = this.WebStorage.MeterSelectDialogSetting;
    }

    public async Run(): Promise<void> {
        /*
        // Override forceCanvas flag from webstorage, if Option.PIXIApplication.forceCanvas is undefinded.
        if (this.Option.PIXIApplicationOption.forceCanvas === undefined)
            if (this.WebStorage.ForceCanvas)
                this.Option.PIXIApplicationOption.forceCanvas = true;
        */
        const pixiApp = new PIXI.Application();
        await pixiApp.init(this.Option.PIXIApplicationOption);
        // Append PIXI.js application to document body
        if(window.innerHeight > (this.Option.PIXIApplicationOption.height ?? 0))
            pixiApp.view.style.width = "100vw";
        else
            pixiApp.view.style.height = "100vh";
        pixiApp.view.style.display = "block";
        pixiApp.view.style.margin = "0 auto";
        pixiApp.view.style.touchAction = "auto";
        pixiApp.view.style.pointerEvents = "none";

        // Register app to TrailLayer to enable traling.
        TrailLayer.setApp(pixiApp);

        // Set viewport meta-tag
        this.setViewPortMetaTag();
        // Set fullscreen tag for android and ios
        this.setWebAppCapable();
        // Load bootstrap css
        this.loadBootStrapCSS();

        // Crete react components
        const rootElement = document.createElement('div');
        const rootReactElem = createRoot(rootElement);
        rootReactElem.render(
            <>
                {this.RootElem}
                <PIXIApplication application={pixiApp} />
            </>
        );

        // Add react components to html body
        document.body.appendChild(rootElement);

        await this.Option.SetupPIXIMeterPanel(pixiApp, this.webSocketCollection, this.WebStorage.MeterSelectDialogSetting);
        this.webSocketCollection.Run();
    }

    private loadBootStrapCSS() {
        const head = document.getElementsByTagName('head')[0];
        const link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('type', 'text/css');
        link.setAttribute('href', BOOTSTRAP_CSS_FILENAME);
        head.appendChild(link);
    }

    private setViewPortMetaTag() {
        const metalist = document.getElementsByTagName('meta');
        let hasMeta = false;

        for (let i = 0; i < metalist.length; i++) {
            const name = metalist[i].getAttribute('name');
            if (name && name.toLowerCase() === 'viewport') {
                metalist[i].setAttribute('content', VIEWPORT_ATTRIBUTE);
                hasMeta = true;
                break;
            }
        }
        if (!hasMeta) {
            const meta = document.createElement('meta');
            meta.setAttribute('name', 'viewport');
            meta.setAttribute('content', VIEWPORT_ATTRIBUTE);
            document.getElementsByTagName('head')[0].appendChild(meta);
        }
    }

    private setWebAppCapable(): void {
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

}
