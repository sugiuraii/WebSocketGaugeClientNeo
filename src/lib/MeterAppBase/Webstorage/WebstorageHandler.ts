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

import { WebsocketParameterCode } from "../WebsocketObjCollection/WebsocketParameterCode";

export class WebstorageHandler {
    private keyPrefix = location.pathname+":";
    private keyList = ["WSInterval","ForceCanvas","MeterSelectDialogSetting"];

    private getKey(keyname : string) : string
    {
        return this.keyPrefix + keyname;
    }

    public get WSInterval() : number
    {
        const wsInterval = localStorage.getItem(this.getKey("WSInterval"));
        return wsInterval === null ? 0 : Number(wsInterval);
    }

    public set WSInterval(interval : number)
    {
        localStorage.setItem(this.getKey("WSInterval"), interval.toString());
    }

    public get ForceCanvas() : boolean
    {
        const forceCanvas = localStorage.getItem(this.getKey("ForceCanvas"));
        return forceCanvas === null? false : forceCanvas === "true";
    }

    public set ForceCanvas(flag : boolean)
    {
        localStorage.setItem(this.getKey("ForceCanvas"), flag?"true":"false");
    }

    public get MeterSelectDialogSetting() : {meterID : string, code : WebsocketParameterCode}[] | undefined
    {
        const item = localStorage.getItem(this.getKey("MeterSelectDialogSetting"));
        return (item === null || item === undefined) ? undefined : JSON.parse(item);
    }

    public set MeterSelectDialogSetting (val : {meterID : string, code : WebsocketParameterCode}[] | undefined)
    {
        localStorage.setItem(this.getKey("MeterSelectDialogSetting"), JSON.stringify(val));
    }

    public Reset():void
    {
        if(window.confirm("Reset page setting of this page? (webstorage)?"))
        {
            this.keyList.forEach(k => localStorage.removeItem(this.getKey(k)));
            window.alert("Page setting (webstorage) is cleared. Please reload the page");
        }
    }

    public ResetAll(): void
    {
        if(window.confirm("Reset page setting of all pages? (webstorage)?"))
        {
            localStorage.clear();
            window.alert("Page setting (webstorage) is cleared for all pages.");
        }
    }
}

