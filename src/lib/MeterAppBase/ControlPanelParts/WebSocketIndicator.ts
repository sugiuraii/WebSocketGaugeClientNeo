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

class WebsocketStatusIndicator extends HTMLDivElement implements IStatusIndicator
{
    private status : number;

    constructor(caption : string)
    {
        super();
        this.innerText = caption;
        this.status = WebsocketStatus.Closed;
    }

    public SetStatus(status : WebsocketStatus)
    {
        this.changeIndicatorColor(status);
    }

    private changeIndicatorColor(status : number)
    {
        const style = this.style;
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

export class WebSocketIndicator extends HTMLDivContainer
{
    private readonly defiIndicator = new WebsocketStatusIndicator("Defi");
    private readonly ssmIndicator = new WebsocketStatusIndicator("SSM");
    private readonly arduinoIndicator = new WebsocketStatusIndicator("Arduino");
    private readonly elm327Indicator = new WebsocketStatusIndicator("ELM327");
    private readonly fueltripIndicator = new WebsocketStatusIndicator("FUELTRIP");
    private readonly assettoCorsaSHMIndicator = new WebsocketStatusIndicator("AssettoCorsa");
    
    public get DefiIndicator() : IStatusIndicator{ return this.defiIndicator };  
    public get SSMIndicator() : IStatusIndicator{ return this.ssmIndicator };  
    public get ArduinoIndicator() : IStatusIndicator{ return this.arduinoIndicator };  
    public get ELM327Indicator() : IStatusIndicator{ return this.elm327Indicator };  
    public get FUELTRIPIndicator() : IStatusIndicator{ return this.fueltripIndicator };  
    public get AssettoCorsaSHMIndicator() : IStatusIndicator{ return this.assettoCorsaSHMIndicator };  
    
    constructor()
    {
        super();

        const containerStyle = this.Container.style;        
        containerStyle.position = "relative";
        containerStyle.width = "100%";
        containerStyle.color = "grey";
        containerStyle.fontSize = "16px";
        containerStyle.fontWeight = "bold";

        const titleElem = document.createElement('div');
        titleElem.innerText = "Websocket Status";
        titleElem.style.color = "white";

        this.Container.appendChild(titleElem);
        this.Container.appendChild(this.defiIndicator);
        this.Container.appendChild(this.ssmIndicator);
        this.Container.appendChild(this.arduinoIndicator);
        this.Container.appendChild(this.elm327Indicator);
        this.Container.appendChild(this.fueltripIndicator);
        this.Container.appendChild(this.assettoCorsaSHMIndicator);

        this.defiIndicator.hidden = true;
        this.ssmIndicator.hidden = true;
        this.arduinoIndicator.hidden = true;
        this.elm327Indicator.hidden = true;
        this.fueltripIndicator.hidden = true;
        this.assettoCorsaSHMIndicator.hidden = true;
    }    
}

