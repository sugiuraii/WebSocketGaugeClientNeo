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
import { MeterSelectDialogCotents } from "../reactParts/dialog/MeterSelectDialog";
import { WebsocketObjectCollection, WebsocketObjectCollectionOption } from "../WebsocketObjCollection/WebsocketObjectCollection";
import { WebsocketParameterCode } from "../WebsocketObjCollection/WebsocketParameterCode";

class AddAllArray<T>
{
    private readonly content = new Array<T>();
    public get Array() { return this.content }

    public addall(itemToAdd: T | Array<T>): void {
        if (itemToAdd instanceof Array)
            itemToAdd.forEach(e => this.content.push(e));
        else
            this.content.push(itemToAdd);
    }
}

class PreloadResourceCollection {
    public readonly WebFontFamiliyName = new AddAllArray<string>();
    public readonly WebFontCSSURL = new AddAllArray<string>();
    public readonly TexturePath = new AddAllArray<string>();
}

class MeterSelectDialogOption {
    public OnMeterSelectDialogSet : ((c : MeterSelectDialogCotents) => void) | undefined;
    public InitialiMeterSelectDialogSetting : {meterID : string, code : WebsocketParameterCode}[];
    public ParameterCodeListToSelect : WebsocketParameterCode[];
    constructor()
    {
        this.OnMeterSelectDialogSet = undefined;
        this.InitialiMeterSelectDialogSetting = [];
        this.ParameterCodeListToSelect = [];
    }
}

export class MeterApplicationOption {
    public readonly PreloadResource : PreloadResourceCollection;
    public readonly WebSocketCollectionOption : WebsocketObjectCollectionOption;
    public readonly PIXIApplicationOption : PIXI.IApplicationOptions;
    public readonly NavBarItems : JSX.Element[] = [];
    public readonly MeteSelectDialogOption = new MeterSelectDialogOption();
    
    public SetupPIXIMeterPanel: (pixiApp: PIXI.Application, wsObj: WebsocketObjectCollection) => void = () => {/* do nothing*/};
    
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
