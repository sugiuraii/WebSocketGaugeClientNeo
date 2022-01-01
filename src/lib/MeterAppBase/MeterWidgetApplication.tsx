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

import { WebsocketObjectCollection } from "./WebsocketObjCollection/WebsocketObjectCollection";
import { MeterApplicationOption } from "./options/MeterApplicationOption";
import { StringListLogger } from "./utils/StringListLogger";
import PIXIApplication from "./reactParts/PIXIApplication";

import 'bootswatch/dist/slate/bootstrap.min.css';
import { MeterSelectionSetting } from "./reactParts/dialog/MeterSelectDialog";
import { WebsocketParameterCode } from "./WebsocketObjCollection/WebsocketParameterCode";
import { MeterWidgetConfigPageRenderer } from "./reactParts/widgetSetting/MeterWidgetConfigPageRenderer";
import { MeterWidgetConfigPageWithMeterSelectRenderer } from "./reactParts/widgetSetting/MeterWidgetConfigPageWithMeterSelectRenderer";
const BOOTSTRAP_CSS_FILENAME = "bootstrap.min.css";

const VIEWPORT_ATTRIBUTE = "width=device-width, minimal-ui, initial-scale=1.0";

class URLQueryParseResult {
    public readonly WSInterval: number;
    public readonly ForceCanvas: boolean;
    public readonly MeterSelectionSetting: MeterSelectionSetting;

    constructor() {
        const urlSearchParams = new URLSearchParams(window.location.search);
        const wsInteval = urlSearchParams.get("WSInterval");
        const forceCanvas = urlSearchParams.get("ForceCanvas");
        const meterIDs = urlSearchParams.getAll("MeterID");
        const paramCodes = urlSearchParams.getAll("Param");

        this.WSInterval = (wsInteval === null || isNaN(Number(wsInteval))) ? 0 : Number(wsInteval);
        this.ForceCanvas = (forceCanvas === null) ? false : (forceCanvas.toLowerCase() === "true");
        if (meterIDs.length !== paramCodes.length)
            throw EvalError("Number of MeterID and Param (in query) are not equal.");

        const meterSelectionSetting: MeterSelectionSetting = {};
        for (let i = 0; i < meterIDs.length; i++)
            meterSelectionSetting[meterIDs[i]] = (paramCodes[i]) as WebsocketParameterCode;
        this.MeterSelectionSetting = meterSelectionSetting;
    }
}

export class MeterWidgetApplication {
    private Option: MeterApplicationOption;
    private Logger = new StringListLogger();

    private readonly UrlQueryResult = new URLQueryParseResult();
    private readonly webSocketCollection: WebsocketObjectCollection;

    constructor(option: MeterApplicationOption) {
        this.Option = option;
        this.webSocketCollection = new WebsocketObjectCollection(this.Logger, option.WebSocketCollectionOption, this.UrlQueryResult.WSInterval);
    }

    private renderSettingPageIfEmptyQuery()
    {
        const baseURL = location.href;
        const previewHeight = this.Option.PIXIApplicationOption.height;
        const previewWidth = this.Option.PIXIApplicationOption.width;
        if(this.Option.MeteSelectDialogOption.ParameterCodeListToSelect.length === 0)
        {
            const settingPageRenderer = new MeterWidgetConfigPageRenderer();
            const previewAspect = (previewHeight === undefined || previewWidth === undefined)?undefined:previewHeight/previewWidth;
            settingPageRenderer.render(baseURL, previewAspect);
        }
        else
        {
            const settingPageRenderer = new MeterWidgetConfigPageWithMeterSelectRenderer();
            settingPageRenderer.render(baseURL, this.Option.MeteSelectDialogOption.ParameterCodeListToSelect, this.Option.MeteSelectDialogOption.DefaultMeterSelectDialogSetting, previewHeight + "px", previewWidth + "px");
        }
    }

    public async Run(): Promise<void> {
        // Show setting page if the query string is empty
        if(window.location.search.length === 0)
        {
            this.renderSettingPageIfEmptyQuery();
            return;
        }

        // Override forceCanvas flag from query, if Option.PIXIApplication.forceCanvas is undefinded.
        if (this.Option.PIXIApplicationOption.forceCanvas === undefined)
            if (this.UrlQueryResult.ForceCanvas)
                this.Option.PIXIApplicationOption.forceCanvas = true;

        // Set transparent background for widget.
        this.Option.PIXIApplicationOption.backgroundAlpha = 0;

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
                <PIXIApplication application={pixiApp} />
            </>
            , rootElement);

        // Add react components to html body
        document.body.appendChild(rootElement);

        // Preload Fonts -> textures-> parts
        await this.preloadFonts();
        await this.preloadTextures();
        this.Option.SetupPIXIMeterPanel(pixiApp, this.webSocketCollection, this.UrlQueryResult.MeterSelectionSetting);
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
