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

import { WebsocketParameterCode } from "websocket-gauge-client-communication-service"
import React from "react";
import { createRoot } from 'react-dom/client';
import { MeterSelectionSetting } from "../dialog/MeterSelectDialog";
import { MeterWidgetConfigPageWithMeterSelect } from "./MeterWidgetConfigPageWithMeterSelect";

export class MeterWidgetConfigPageWithMeterSelectRenderer {
    private readonly BOOTSTRAP_CSS_FILENAME = "bootstrap.min.css";
    private readonly VIEWPORT_ATTRIBUTE = "width=device-width, minimal-ui, initial-scale=1.0";
    
    private setBackgroundColor()
    {
        document.body.style.backgroundColor = 'black';
    }
    
    private loadBootStrapCSS() {
        const head = document.getElementsByTagName('head')[0];
        const link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('type', 'text/css');
        link.setAttribute('href', this.BOOTSTRAP_CSS_FILENAME);
        head.appendChild(link);
    }
    
    private setViewPortMetaTag() {
        const metalist = document.getElementsByTagName('meta');
        let hasMeta = false;

        for (let i = 0; i < metalist.length; i++) {
            const name = metalist[i].getAttribute('name');
            if (name && name.toLowerCase() === 'viewport') {
                metalist[i].setAttribute('content', this.VIEWPORT_ATTRIBUTE);
                hasMeta = true;
                break;
            }
        }
        if (!hasMeta) {
            const meta = document.createElement('meta');
            meta.setAttribute('name', 'viewport');
            meta.setAttribute('content', this.VIEWPORT_ATTRIBUTE);
            document.getElementsByTagName('head')[0].appendChild(meta);
        }
    }

    public render(baseURL: string, codeToSelect:WebsocketParameterCode[], defaultMeterSelection: MeterSelectionSetting, previewAspect?:number) {
        const rootElement = document.createElement('div');
        this.loadBootStrapCSS();
        this.setBackgroundColor();
        this.setViewPortMetaTag();
        
        const rootReactElem = createRoot(rootElement);
        rootReactElem.render(
            <>
                <MeterWidgetConfigPageWithMeterSelect previewAspect={previewAspect}
                    baseURL={baseURL}
                    codesToSelect={codeToSelect}
                    default={{ forceCanvas: false, wsInterval: 0, meterSelection: defaultMeterSelection }} />
            </>
        );

        // Add react components to html body
        document.body.appendChild(rootElement);
    }
}