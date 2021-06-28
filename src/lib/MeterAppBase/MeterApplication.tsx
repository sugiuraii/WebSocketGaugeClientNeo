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

import * as WebFont from "webfontloader";
import * as PIXI from "pixi.js";
import React, { Fragment } from "react";
import ReactDOM from "react-dom";

import { WebstorageHandler } from "./Webstorage/WebstorageHandler";
import { WebsocketObjectCollection } from "./WebsocketObjCollection/WebsocketObjectCollection";
import { MeterApplicationOption } from "./options/MeterApplicationOption";
import { ApplicationNavbar } from './reactParts/ApplicationNavbar';
import { StringListLogger } from "./utils/StringListLogger";
import PIXIApplication from "./reactParts/PIXIApplication";

import 'bootswatch/dist/slate/bootstrap.min.css';
const BOOTSTRAP_CSS_FILENAME = "bootstrap.min.css";

const VIEWPORT_ATTRIBUTE = "width=device-width, minimal-ui, initial-scale=1.0";

export class MeterApplication {
    private Option: MeterApplicationOption;
    private Logger = new StringListLogger();

    private readonly webSocketCollection: WebsocketObjectCollection;
    public get WebSocketCollection(): WebsocketObjectCollection { return this.webSocketCollection }

    constructor(option: MeterApplicationOption) {
        this.Option = option;
        this.webSocketCollection = new WebsocketObjectCollection(this.Logger, option.WebSocketCollectionOption);
    }

    public async Run(): Promise<void> {
        const webStorage = new WebstorageHandler();

        // Override forceCanvas flag from webstorage, if Option.PIXIApplication.forceCanvas is undefinded.
        if (this.Option.PIXIApplicationOption.forceCanvas === undefined)
            if (webStorage.ForceCanvas)
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
            <Fragment>
                <ApplicationNavbar
                    defaultOptionDialogContent={{ forceCanvas: webStorage.ForceCanvas }}
                    defaultWSInterval={webStorage.WSInterval}
                    onOptionDialogSet={c => {
                        webStorage.ForceCanvas = c.forceCanvas;
                    }}
                    onWSIntervalDialogSet={interval => webStorage.WSInterval = interval}
                    onFUELTripResetDialogSet={() => this.WebSocketCollection.FUELTRIPWS.SendReset()}
                    logList={this.Logger.Content}
                    websocketStatusList={this.WebSocketCollection.WebsocketStates}
                    opacityOnMouseOff={"0.1"}
                />
                <PIXIApplication application={pixiApp} />
            </Fragment>
            , rootElement);

        // Add react components to html body
        document.body.appendChild(rootElement);


        // Preload Fonts -> textures-> parts
        await this.preloadFonts();
        await this.preloadTextures();
        this.Option.SetupPIXIMeterPanel(pixiApp, this.WebSocketCollection);
        this.WebSocketCollection.Run();
    }

    private async preloadFonts() {
        const webFontFamilyWithoutOverlap = this.Option.PreloadResource.WebFontFamiliyName.Array.filter(
            (x, i, self) => {
                return self.indexOf(x) === i;
            }
        );
        const webFontCSSURLWithoutOverlap = this.Option.PreloadResource.WebFontCSSURL.Array.filter(
            (x, i, self) => {
                return self.indexOf(x) === i;
            }
        );

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
        const texturePathWithoutOverlap = this.Option.PreloadResource.TexturePath.Array.filter(
            (x, i, self) => {
                return self.indexOf(x) === i;
            }
        );

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
