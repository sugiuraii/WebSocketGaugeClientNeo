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

import { ReadModeCode } from "websocket-gauge-client-communication";
import { ILogger } from "../utils/ILogger";

import { WebsocketServiceCollection } from "./WebsocketServiceCollection";
import { WebsocketParameterCode } from "./WebsocketParameterCode";

export type WebsocketServiceMapEntry = { CodeRegisterFunction: (ws: WebsocketServiceCollection, readmode: ReadModeCode) => void, ValueGetFunction: (ws: WebsocketServiceCollection, timeStamp?: number) => number };

export class WebsocketServiceMapper
{
    private readonly webSocketCollection: WebsocketServiceCollection;
    private readonly map = new Map<WebsocketParameterCode, WebsocketServiceMapEntry>();
    private readonly logger : ILogger;

    constructor(webSocketCollection: WebsocketServiceCollection, map: Map<WebsocketParameterCode, WebsocketServiceMapEntry>, logger : ILogger) {
        this.webSocketCollection = webSocketCollection;
        this.map = map;
        this.logger = logger;
    }

    public registerParameterCode(code: WebsocketParameterCode, readmode: ReadModeCode): void {
        const mapItem = this.map.get(code);
        if (mapItem !== undefined)
            mapItem.CodeRegisterFunction(this.webSocketCollection, readmode);
        else
        {
            const logmsg = "The mapping of parameter code:" + code + " is not assigned.";
            window.alert(logmsg);
            this.logger.appendLog(logmsg);
            console.error(logmsg);
        }
    }

    public isParmeterCodeAvailable(code: WebsocketParameterCode): boolean {
        return this.map.get(code) !== undefined;
    }

    public getValue(code: WebsocketParameterCode, timeStamp?: number): number {
        const mapItem = this.map.get(code);
        if (mapItem !== undefined)
            return mapItem.ValueGetFunction(this.webSocketCollection, timeStamp);
        else
        {
            const logmsg = "The mapping of parameter code:" + code + " is not assigned.";
            console.error(logmsg);
            return NaN;
        }
    }
}

