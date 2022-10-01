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
import { MeterSelectionSetting } from "../reactParts/dialog/MeterSelectDialog";
import { WebsocketObjectCollection, WebsocketObjectCollectionOption } from "../WebsocketObjCollection/WebsocketObjectCollection";
import { WebsocketParameterCode } from "../WebsocketObjCollection/WebsocketParameterCode";

class PreloadResourceCollection {
    public readonly WebFontFamiliyName = new Array<string>();
    public readonly WebFontCSSURL = new Array<string>();
    public readonly TexturePath = new Array<string>();
}

class MeterSelectDialogOption {
    public DefaultMeterSelectDialogSetting : MeterSelectionSetting;
    public ParameterCodeListToSelect : WebsocketParameterCode[];
    constructor()
    {
        this.DefaultMeterSelectDialogSetting = {};
        this.ParameterCodeListToSelect = [];
    }
}

export class MeterApplicationOption {
    public readonly PreloadResource : PreloadResourceCollection;
    public readonly WebSocketCollectionOption : WebsocketObjectCollectionOption;
    public readonly PIXIApplicationOption : PIXI.IApplicationOptions;
    public readonly NavBarItems : JSX.Element[] = [];
    public readonly MeteSelectDialogOption = new MeterSelectDialogOption();
    
    public SetupPIXIMeterPanel: (pixiApp: PIXI.Application, wsObj: WebsocketObjectCollection, meterSelection : MeterSelectionSetting) => Promise<void> = async () => {/* do nothing*/};
    
    constructor(pixiApplicationOption? : PIXI.IApplicationOptions, wsCollectionOption? :WebsocketObjectCollectionOption, preloadResource? : PreloadResourceCollection)
    {
        if(pixiApplicationOption === undefined)
            this.PIXIApplicationOption = {};
        else
            this.PIXIApplicationOption = pixiApplicationOption;
        
        if(preloadResource === undefined)
            this.PreloadResource = new PreloadResourceCollection();
        else
            this.PreloadResource = preloadResource;

        if(wsCollectionOption === undefined)
            this.WebSocketCollectionOption = new WebsocketObjectCollectionOption();
        else
            this.WebSocketCollectionOption = wsCollectionOption;
    }
}
