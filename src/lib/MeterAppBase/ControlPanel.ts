/* 
 * Copyright (c) 2017, kuniaki
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * * Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

export class ControlPanel
{
    private controlPanelElement: HTMLDivElement;
    private logButtonElement: HTMLButtonElement;
    private resetButtonElement: HTMLButtonElement;
    private defiCOMIndicator: HTMLDivElement;
    private ssmCOMIndicator: HTMLDivElement;
    private arduinoCOMIndicator: HTMLDivElement;
    private elm327COMIndicator: HTMLDivElement;
    private fueltripIndicator: HTMLDivElement;
    private websocketIntervalSpinner: HTMLInputElement;

    constructor()
    {
        this.controlPanelElement = this.createControlPanel();
        document.body.appendChild(this.controlPanelElement);
        this.IsDefiInidicatorEnabled = false;
        this.IsSSMInidicatorEnabled = false;
        this.IsArduinoInidicatorEnabled = false;
        this.IsELM327InidicatorEnabled = false;
        this.IsFUELTRIPInidicatorEnabled = false;
    }

    public setOnLogButtonClicked(handler: (this: Element, ev: MouseEvent) => void) {this.logButtonElement.onclick = handler}
    public setOnResetButtonClicked(handler: (this: Element, ev: MouseEvent) => void) {this.resetButtonElement.onclick = handler}
    public setOnWebSocketIntervalSpinnerChanged(handler: (this: Element, ev: MouseEvent) => void) {this.websocketIntervalSpinner.onchange = handler}   
    public setDefiIndicatorStatus(status : number) {this.changeIndicatorColor(this.defiCOMIndicator, status)};
    public setSSMIndicatorStatus(status : number) {this.changeIndicatorColor(this.ssmCOMIndicator, status)};
    public setArduinoIndicatorStatus(status : number) {this.changeIndicatorColor(this.arduinoCOMIndicator, status)};
    public setELM327IndicatorStatus(status : number) {this.changeIndicatorColor(this.elm327COMIndicator, status)};
    public setFUELTRIPIndicatorStatus(status : number) {this.changeIndicatorColor(this.fueltripIndicator, status)};

    public get WebSocketInterval(): number {return parseInt(this.websocketIntervalSpinner.value) };
    
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

    private createControlPanel(): HTMLDivElement
    {
        const setControlPanelStyle = (divElem: HTMLDivElement) =>
        {
            const style = divElem.style;
            style.zIndex = "10";
            style.position = 'fixed';
            style.right = '0';
            style.top = '0';
            style.backgroundColor = 'black';
            style.opacity = '0.2';
            style.width = '180px';
            style.height = '360px';
            style.transition = 'all 0.5s ease';
            style.borderRadius = '10px';

            divElem.onmouseenter = () =>
            {
                divElem.style.opacity = "1";
            }
            divElem.onmouseleave = () =>
            {
                divElem.style.opacity = "0.2";
            }
        }
        const container = document.createElement('div');
        setControlPanelStyle(container);

        this.logButtonElement = this.createButton("Debug");
        this.resetButtonElement = this.createButton("Reset");
        
        container.appendChild(this.resetButtonElement);
        container.appendChild(this.logButtonElement);

        container.appendChild(this.createWebSocketIndicator());
        container.appendChild(this.createWebsocketIntervalSpinner());

        return container;
    }

    private createWebSocketIndicator() : HTMLDivElement
    {
        const setIndicatorStyle = (divElem: HTMLDivElement) =>
        {
            const style = divElem.style;
            style.position = "relative";
            style.width = "90%";
            style.marginLeft = "auto";
            style.marginRight = "auto";
            style.marginTop = "1vh";
            style.marginBottom = "1vh";
            style.background = "black";
            style.color = "grey";
            style.fontSize = "1vm";
            style.fontWeight = "bold";
        };

        const indicatorElem = document.createElement('div');
        setIndicatorStyle(indicatorElem);

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

        indicatorElem.appendChild(titleElem);
        indicatorElem.appendChild(this.defiCOMIndicator);
        indicatorElem.appendChild(this.ssmCOMIndicator);
        indicatorElem.appendChild(this.arduinoCOMIndicator);
        indicatorElem.appendChild(this.elm327COMIndicator);
        indicatorElem.appendChild(this.fueltripIndicator);

        return indicatorElem;
    }

    private createWebsocketIntervalSpinner() : HTMLDivElement
    {
        const setSpinnerStyle = (inputElem: HTMLInputElement) =>
        {
            const style = inputElem.style;
            style.background = "black";
            style.color = "white";
        }

        const setContainerStyle = (container: HTMLDivElement) =>
        {
            const style = container.style;
            style.position = "relative";
            style.width = "90%";
            style.marginLeft = "auto";
            style.marginRight = "auto";
            style.marginTop = "1vh";
            style.marginBottom = "1vh";
            style.background = "black";
            style.color = "grey";
            style.fontSize = "1vm";
            style.fontWeight = "bold";
        }

        const titleElem = document.createElement('div');
        titleElem.innerText = "WSInterval";
        titleElem.style.color = "white";

        this.websocketIntervalSpinner = document.createElement('input');
        this.websocketIntervalSpinner.type = "number";
        this.websocketIntervalSpinner.min = '0';
        this.websocketIntervalSpinner.max = '100';
        this.websocketIntervalSpinner.step = '1';
        this.websocketIntervalSpinner.value = '0';
        setSpinnerStyle(this.websocketIntervalSpinner);

        const container = document.createElement('div');
        container.appendChild(titleElem);
        container.appendChild(this.websocketIntervalSpinner);            
        setContainerStyle(container);

        return container;
    }

    private createButton(buttonText : string) : HTMLButtonElement
    {
        const setButtonStyle = (buttonElem: HTMLButtonElement) =>
        {
            const style = buttonElem.style;
            style.position = "relative";
            style.textAlign = "center";
            style.display = "block";
            style.fontSize = "6vmin";
            style.width = "90%";
            style.marginLeft = "auto";
            style.marginRight = "auto";
            style.marginTop = "1vh";
            style.marginBottom = "1vh";
            style.padding = "3px";
            style.color = "white";
            style.borderStyle = "none";
            style.boxShadow = "2px 2px 3px 1px #666";
            style.textShadow = "0px 0px 2px #fff";
            style.background = "#666666";
            style.borderRadius = "5px";
        }

        const elem = document.createElement('button');
        elem.innerText = buttonText;
        setButtonStyle(elem);

        return elem;
    }

    public setPosition(x : number, y: number, xUnit? : string, yUnit? : string) : void
    {            
        if(!xUnit)
            xUnit = "px";    
        if(!yUnit)
            yUnit = "px";    

        const style = this.controlPanelElement.style;
        style.top = x.toString() + xUnit;
        style.left = y.toString() + yUnit;
    }
}
