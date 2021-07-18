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

import * as WebFont from "webfontloader";
import * as PIXI from "pixi.js";
import React, { Fragment } from "react";
import ReactDOM from "react-dom";

import { WebstorageHandler } from "./Webstorage/WebstorageHandler";
import { WebsocketObjectCollection } from "./WebsocketObjCollection/WebsocketObjectCollection";
import { MeterApplicationOption } from "./options/MeterApplicationOption";
import { ApplicationNavbar } from './reactParts/navbar/ApplicationNavbar';
import { StringListLogger } from "./utils/StringListLogger";
import PIXIApplication from "./reactParts/PIXIApplication";

import 'bootswatch/dist/slate/bootstrap.min.css';
import { MeterSelectDialogCotents } from "./reactParts/dialog/MeterSelectDialog";
const BOOTSTRAP_CSS_FILENAME = "bootstrap.min.css";

const VIEWPORT_ATTRIBUTE = "width=device-width, minimal-ui, initial-scale=1.0";

export class MeterApplication {
    private Option: MeterApplicationOption;
    private Logger = new StringListLogger();
    private readonly WebStorage: WebstorageHandler;

    private readonly webSocketCollection: WebsocketObjectCollection;
    private MeterSelectDialogSetting: MeterSelectDialogCotents;

    protected get RootElem(): JSX.Element {
        const onMeterSelectDialogSet = (Object.keys(this.MeterSelectDialogSetting).length === 0) ? undefined : (c: MeterSelectDialogCotents) => {
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
        this.WebStorage = new WebstorageHandler(option.MeteSelectDialogOption.InitialiMeterSelectDialogSetting);
        this.webSocketCollection = new WebsocketObjectCollection(this.Logger, option.WebSocketCollectionOption, this.WebStorage.WSInterval);

        if (this.WebStorage.MeterSelectDialogSetting === undefined) {
            const logmessage = "MeterDialogSetting is undefined. Overwrite with default value.";
            this.Logger.appendLog(logmessage)
            console.log(logmessage);
            this.WebStorage.MeterSelectDialogSetting = this.Option.MeteSelectDialogOption.InitialiMeterSelectDialogSetting;
        }
        this.MeterSelectDialogSetting = this.WebStorage.MeterSelectDialogSetting;
    }

    public async Run(): Promise<void> {
        // Override forceCanvas flag from webstorage, if Option.PIXIApplication.forceCanvas is undefinded.
        if (this.Option.PIXIApplicationOption.forceCanvas === undefined)
            if (this.WebStorage.ForceCanvas)
                this.Option.PIXIApplicationOption.forceCanvas = true;

        const pixiApp = new PIXI.Application(this.Option.PIXIApplicationOption);
        // Append PIXI.js application to document body
        pixiApp.view.style.width = "100vw";
        pixiApp.view.style.touchAction = "auto";
        pixiApp.view.style.pointerEvents = "none";

        // Set viewport meta-tag
        this.setViewPortMetaTag();
        // Set fullscreen tag for android and ios
        this.setWebAppCapable();
        // Load bootstrap css
        this.loadBootStrapCSS();

        // Crete react components
        const rootElement = document.createElement('div');
        ReactDOM.render(
            <>
                {this.RootElem}
                <PIXIApplication application={pixiApp} />
            </>
            , rootElement);

        // Add react components to html body
        document.body.appendChild(rootElement);

        // Preload Fonts -> textures-> parts
        await this.preloadFonts();
        await this.preloadTextures();
        this.Option.SetupPIXIMeterPanel(pixiApp, this.webSocketCollection, this.WebStorage);
        this.webSocketCollection.Run();
    }

    private async preloadFonts() {
        // Use Set to remove overlaps.
        const webFontFamilyWithoutOverlap = Array.from(new Set(this.Option.PreloadResource.WebFontFamiliyName));
        const webFontCSSURLWithoutOverlap = Array.from(new Set(this.Option.PreloadResource.WebFontCSSURL));

        return new Promise<void>((resolve) => {
            // call callBack() without loading fonts if the webFontFamily and webFoutCSSURL contains no elements.
            if (webFontFamilyWithoutOverlap.length === 0 && webFontCSSURLWithoutOverlap.length === 0)
                resolve();

            WebFont.load(
                {
                    custom:
                    {
                        families: webFontFamilyWithoutOverlap,
                        urls: webFontCSSURLWithoutOverlap
                    },
                    active: () => { resolve(); }
                });
        });
    }

    private async preloadTextures() {
        // Use Set to remove overlaps.
        const texturePathWithoutOverlap = Array.from(new Set(this.Option.PreloadResource.TexturePath));

        for (let i = 0; i < texturePathWithoutOverlap.length; i++) {
            const texturePath = texturePathWithoutOverlap[i];
            PIXI.Loader.shared.add(texturePath);
        }

        return new Promise<void>((resolve) => {
            PIXI.Loader.shared.load(() => {
                resolve();
            });
        });
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
