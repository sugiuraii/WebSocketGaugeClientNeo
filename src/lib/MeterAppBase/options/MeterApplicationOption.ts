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
import {
        DefiParameterCode, SSMParameterCode, SSMSwitchCode,
        ArduinoParameterCode, OBDIIParameterCode, ReadModeCode,
        AssettoCorsaSHMGraphicsParameterCode, AssettoCorsaSHMStaticInfoParameterCode, AssettoCorsaSHMPhysicsParameterCode
    } from "../../WebSocket/WebSocketCommunication";

import * as PIXI from "pixi.js";
import { WebsocketObjectCollection } from "../WebSocketObjectCollection";

class WebsocketEnableFlag
{
    public Defi = false;
    public SSM = false;
    public Arduino = false;
    public ELM327 = false;
    public FUELTRIP = false;
    public AssettoCorsaSHM = false;
}

class AddAllArray<T>
{
    private readonly content = new Array<T>();
    public get Array() { return this.content };

    public addall(itemToAdd : T);
    public addall(itemToAdd : Array<T>);
    public addall(itemToAdd : any)
    {
        if(itemToAdd instanceof Array)
            itemToAdd.forEach(e => this.content.push(e));
        else
            this.content.push(itemToAdd);
    }
}

class ParameterCodeCollection
{
    public readonly Defi = new AddAllArray<DefiParameterCode>();
    public readonly SSM = new AddAllArray<{ code: SSMParameterCode, readmode: ReadModeCode }>();
    public readonly Arduino = new AddAllArray<ArduinoParameterCode>();
    public readonly ELM327OBDII = new AddAllArray<{ code: OBDIIParameterCode, readmode: ReadModeCode }>();
    public readonly AssettoCorsaPhysics = new AddAllArray<AssettoCorsaSHMPhysicsParameterCode>();
    public readonly AssettoCorsaGraphics = new AddAllArray<AssettoCorsaSHMGraphicsParameterCode>();
    public readonly AssettoCorsaStaticInfo = new AddAllArray<AssettoCorsaSHMStaticInfoParameterCode>();
}

class FUELTRIPWebsocketOption
{
    public FUELTRIPSectSpan : number = 300;
    public FUELTRIPSectStoreMax : number = 6;
}

class PreloadResourceCollection
{
    public readonly WebFontFamiliyName = new AddAllArray<string>();
    public readonly WebFontCSSURL = new AddAllArray<string>();
    public readonly TexturePath = new AddAllArray<string>();
}

export class MeterApplicationOption
{
    public readonly WebsocketEnableFlag = new WebsocketEnableFlag();
    public readonly ParameterCode = new ParameterCodeCollection();
    public readonly PreloadResource = new PreloadResourceCollection();
    public readonly FUELTRIPWebsocketOption = new FUELTRIPWebsocketOption();

    public height : number;
    public width : number;

    public SetupPIXIMeterPanel : (pixiApp : PIXI.Application, wsObj : WebsocketObjectCollection) => void;
}
