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

import {HTMLDivContainer} from './ControlPanelParts/HTMLDivContainer';

import {WebSocketIndicator} from './ControlPanelParts/WebSocketIndicator';
import {IntervalController} from './ControlPanelParts/IntervalController';
import {InlineLogWindow} from './ControlPanelParts/InlineLogWindow';

export class ControlPanel extends HTMLDivContainer
{
    private readonly resetButtonElement: HTMLButtonElement;
    private readonly webSocketIndicator: WebSocketIndicator;
    private readonly intervalController: IntervalController;    
    private readonly logWindow : InlineLogWindow;
    
    private readonly closeButtonElement : HTMLButtonElement;
    private readonly openButtonElement: HTMLButtonElement;
    private isControlPanelOpen = false;
    
    private openControlPanel()
    {
        this.isControlPanelOpen = true;
        const style = this.Container.style;
        if (window.screen.width > 600)
            style.width = "40vw";
        else
            style.width = "320px";
        
        style.height = "100vh";
        
        this.openButtonElement.style.visibility = "hidden";
    }
    private closeControlPanel()
    {
        this.isControlPanelOpen = false;
        const style = this.Container.style;
        style.width = "0px";
        style.height = "0px";
        
        this.openButtonElement.style.visibility = "visible";
    }
    
    constructor()
    {
        super();
        this.resetButtonElement = this.createButton("ResetTRIP");
        this.closeButtonElement = this.createButton("Close→");
        this.resetButtonElement.style.width = "80%";
        this.closeButtonElement.style.width = "20%";
        this.webSocketIndicator = new WebSocketIndicator();
        this.intervalController = new IntervalController();
        this.logWindow = new InlineLogWindow();
        
        this.openButtonElement = this.createOpenButton("←Control");
        
        const container = this.Container;
        this.setContainerStyle();
        container.appendChild(this.resetButtonElement);
        container.appendChild(this.closeButtonElement);
        container.appendChild(this.webSocketIndicator.Container);
        container.appendChild(this.intervalController.Container);
        container.appendChild(this.logWindow.Container);
        
        this.openButtonElement.onclick = () => this.openControlPanel();
        this.closeButtonElement.onclick = () => this.closeControlPanel();
    }
    
    public get OpenButton() {return this.openButtonElement}
    public get CloseButton() {return this.closeButtonElement}
    public get ResetButton() {return this.resetButtonElement}
    public get WebSocketIndicator() {return this.webSocketIndicator}
    public get IntervalController() {return this.intervalController}
    public get LogWindow() {return this.logWindow}
    
    private setContainerStyle()
    {
        const style = this.Container.style;
        style.position = "fixed";
        style.background = "black";
        style.top = "0px";
        style.right = "10px";
        style.opacity = "0.9";
        style.overflow = "auto";
        style.transition = "0.5s";
        
        this.closeControlPanel();
    }
    
    private createButton(buttonText : string) : HTMLButtonElement
    {
        const setButtonStyle = (buttonElem: HTMLButtonElement) =>
        {
            const style = buttonElem.style;
            style.position = "relative";
            style.textAlign = "center";
            style.height = "32px";
            style.fontSize = "7vm";
            style.fontWeight = "bold";
            style.padding = "3px";
            style.color = "white";
            style.background = "#666666";
            style.borderRadius = "5px";
            style.boxSizing = "border-box";
        }

        const elem = document.createElement('button');
        elem.innerText = buttonText;
        setButtonStyle(elem);

        return elem;
    }
    
    private createOpenButton(buttonText: string): HTMLButtonElement
    {
        const setButtonStyle = (buttonElem: HTMLButtonElement) =>
        {
            const style = buttonElem.style;
            style.position = "fixed";
            style.top = "0px";
            style.right = "10px";
            style.height = "32px";
            style.width = "72px";
            style.fontWeight = "bold";
            style.textAlign = "center";
            style.fontSize = "7vm";
            style.padding = "3px";
            style.color = "white";
            style.background = "#666666";
            style.borderRadius = "5px";
            style.boxSizing = "border-box";
            style.transition = "0.5s";
            style.opacity = "0.4";
        }
        
        const elem = document.createElement('button');
        elem.innerText = buttonText;
        setButtonStyle(elem);
        
        elem.onmouseenter = () => elem.style.opacity = "1";
        elem.onmouseleave = () => elem.style.opacity = "0.4";
        return elem;
    }
}
