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
    
    constructor()
    {
        super();
        this.resetButtonElement = this.createButton("ResetTRIP");
        this.webSocketIndicator = new WebSocketIndicator();
        this.intervalController = new IntervalController();
        this.logWindow = new InlineLogWindow();
        
        const container = this.Container;
        this.setContainerStyle();
        container.appendChild(this.resetButtonElement);
        container.appendChild(this.webSocketIndicator.Container);
        container.appendChild(this.intervalController.Container);
        container.appendChild(this.logWindow.Container);
    }
    
    public get ResetButton() {return this.resetButtonElement}
    public get WebSocketIndicator() {return this.webSocketIndicator}
    public get IntervalController() {return this.intervalController}
    public get LogWindow() {return this.logWindow}
    
    private setContainerStyle()
    {
        const style = this.Container.style;
        style.position = "fixed";
        style.background = "black";
        
        if (window.screen.width > 600)
            style.width = "40vw";
        else
            style.width = "320px";
        
        style.height = "100vh";
        style.margin = "0";
        style.opacity = "0.5";
        style.overflow = "auto";
    }
    
    private createButton(buttonText : string) : HTMLButtonElement
    {
        const setButtonStyle = (buttonElem: HTMLButtonElement) =>
        {
            const style = buttonElem.style;
            style.position = "relative";
            style.textAlign = "center";
            style.display = "block";
            style.fontSize = "6vm";
            style.width = "100%";
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
}
