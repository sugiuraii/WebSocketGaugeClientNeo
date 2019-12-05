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

import {HTMLDivContainer} from './HTMLDivContainer';

export enum WebsocketStatus
{
    Connecting = WebSocket.CONNECTING,
    Open = WebSocket.OPEN,
    Closing = WebSocket.CLOSING,
    Closed = WebSocket.CLOSED
}

export interface IStatusIndicator
{
    SetStatus(status : WebsocketStatus); 
}

export class WebSocketIndicator extends HTMLDivContainer
{
    private readonly defiCOMIndicator: HTMLDivElement;
    private readonly ssmCOMIndicator: HTMLDivElement;
    private readonly arduinoCOMIndicator: HTMLDivElement;
    private readonly elm327COMIndicator: HTMLDivElement;
    private readonly fueltripIndicator: HTMLDivElement;
    
    public setDefiIndicatorStatus(status : number) {this.changeIndicatorColor(this.defiCOMIndicator, status)};
    public setSSMIndicatorStatus(status : number) {this.changeIndicatorColor(this.ssmCOMIndicator, status)};
    public setArduinoIndicatorStatus(status : number) {this.changeIndicatorColor(this.arduinoCOMIndicator, status)};
    public setELM327IndicatorStatus(status : number) {this.changeIndicatorColor(this.elm327COMIndicator, status)};
    public setFUELTRIPIndicatorStatus(status : number) {this.changeIndicatorColor(this.fueltripIndicator, status)};
    
    public get IsDefiInidicatorEnabled() { return !this.defiCOMIndicator.hidden }
    public set IsDefiInidicatorEnabled(flag : boolean) { this.defiCOMIndicator.hidden = !flag }
    public get IsSSMInidicatorEnabled() { return !this.ssmCOMIndicator.hidden }
    public set IsSSMInidicatorEnabled(flag : boolean) { this.ssmCOMIndicator.hidden = !flag }
    public get IsArduinoInidicatorEnabled() { return !this.arduinoCOMIndicator.hidden }
    public set IsArduinoInidicatorEnabled(flag : boolean) { this.arduinoCOMIndicator.hidden = !flag }
    public get IsELM327InidicatorEnabled() { return !this.elm327COMIndicator.hidden }
    public set IsELM327InidicatorEnabled(flag : boolean) { this.elm327COMIndicator.hidden = !flag }
    public get IsFUELTRIPInidicatorEnabled() { return !this.fueltripIndicator.hidden }
    public set IsFUELTRIPInidicatorEnabled(flag : boolean) { this.fueltripIndicator.hidden = !flag }
    
    constructor()
    {
        super();

        const containerStyle = this.Container.style;        
        containerStyle.position = "relative";
        containerStyle.width = "100%";
        containerStyle.color = "grey";
        containerStyle.fontSize = "16px";
        containerStyle.fontWeight = "bold";

        this.defiCOMIndicator = document.createElement('div');
        this.defiCOMIndicator.innerText = "Defi";
        this.ssmCOMIndicator = document.createElement('div');
        this.ssmCOMIndicator.innerText = "SSM";
        this.arduinoCOMIndicator = document.createElement('div');
        this.arduinoCOMIndicator.innerText = "Arduino";
        this.elm327COMIndicator = document.createElement('div');
        this.elm327COMIndicator.innerText = "ELM327";
        this.fueltripIndicator = document.createElement('div');
        this.fueltripIndicator.innerText = "FUELTRIP";

        const titleElem = document.createElement('div');
        titleElem.innerText = "Websocket Status";
        titleElem.style.color = "white";

        this.Container.appendChild(titleElem);
        this.Container.appendChild(this.defiCOMIndicator);
        this.Container.appendChild(this.ssmCOMIndicator);
        this.Container.appendChild(this.arduinoCOMIndicator);
        this.Container.appendChild(this.elm327COMIndicator);
        this.Container.appendChild(this.fueltripIndicator);
        
        this.IsDefiInidicatorEnabled = false;
        this.IsArduinoInidicatorEnabled = false;
        this.IsSSMInidicatorEnabled = false;
        this.IsELM327InidicatorEnabled = false;
        this.IsFUELTRIPInidicatorEnabled = false;
    }
    
    private changeIndicatorColor(indicator : HTMLDivElement, status : number)
    {
        const style = indicator.style;
        switch (status)
        {
            case WebSocket.CONNECTING://CONNECTING
                style.color = "blue";
                break;
            case WebSocket.OPEN://OPEN
                style.color = "green";
                break;
            case WebSocket.CLOSING://CLOSING
                style.color = "orange";
                break;
            case WebSocket.CLOSED://CLOSED
                style.color = "grey";
                break;
            default:
                // this never happens
                break;     
        }
    }
}

