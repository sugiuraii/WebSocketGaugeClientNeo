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
import { ReadModeCode } from "../WebSocket/WebSocketCommunication";
import { WebsocketObjectCollection } from "./WebSocketObjectCollection";

export class WebsocketClientMapEntry
{
    public readonly CodeRegisterFunctoion : (ws : WebsocketObjectCollection, readmode: ReadModeCode) => void;
    public readonly ValueGetFunction : (ws : WebsocketObjectCollection, timeStamp : number) => number;
    public readonly RawValueGetFunction : (ws : WebsocketObjectCollection) => number;

    constructor(codeRegisterFunc: (ws: WebsocketObjectCollection, readmode: ReadModeCode) => void, valueGetFunction: (ws: WebsocketObjectCollection, timeStamp: number) => number, rawValueGetFunction: (ws: WebsocketObjectCollection) => number)
    {
        this.CodeRegisterFunctoion = codeRegisterFunc;
        this.ValueGetFunction = valueGetFunction;
        this.RawValueGetFunction = rawValueGetFunction;
    }
}

export class WebsocketClientMapper<T> 
{
    private readonly webSocketCollection : WebsocketObjectCollection;
    private readonly map = new Map<T, WebsocketClientMapEntry>();

    constructor(webSocketCollection : WebsocketObjectCollection, map: Map<T, WebsocketClientMapEntry>)
    {
        this.webSocketCollection = webSocketCollection;
        this.map = map;
    }

    public registerParameterCode(code : T, readmode: ReadModeCode) : void
    {
        const mapItem = this.map.get(code);
        if(mapItem !== undefined)
            mapItem.CodeRegisterFunctoion(this.webSocketCollection, readmode);
        else
            throw ReferenceError("Code of " + code + " is not registered websocket client map.");
    }

    public getValue(code : T, timeStamp : number) : number
    {
        const mapItem = this.map.get(code);
        if(mapItem !== undefined)
            return mapItem.ValueGetFunction(this.webSocketCollection, timeStamp);
        else
            throw ReferenceError("Code of " + code + " is not registered websocket client map.");
    }

    public getRawValue(code : T) : number
    {
        const mapItem = this.map.get(code);
        if(mapItem !== undefined)
            return mapItem.RawValueGetFunction(this.webSocketCollection);
        else
            throw ReferenceError("Code of " + code + " is not registered websocket client map.");
    }
}
