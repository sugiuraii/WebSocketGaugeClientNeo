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

import {HTMLDivContainer} from './ControlPanelParts/HTMLDivContainer';
import {ButtonStyle} from './ControlPanelParts/ButtonStyle';

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
        this.openButtonElement.style.visibility = "hidden";
        
        this.isControlPanelOpen = true;
        const style = this.Container.style;
        style.transform = "scale(1.0)";

    }
    private closeControlPanel()
    {
        this.isControlPanelOpen = false;
        const style = this.Container.style;
        style.transform = "scale(0)";
        
        this.openButtonElement.style.visibility = "visible";
    }
    
    constructor()
    {
        super();
        this.resetButtonElement = this.createButton("ResetTRIP");
        this.closeButtonElement = this.createButton("Close");
        this.resetButtonElement.style.width = "80%";
        this.closeButtonElement.style.width = "20%";
        this.webSocketIndicator = new WebSocketIndicator();
        this.intervalController = new IntervalController();
        this.logWindow = new InlineLogWindow();
        
        this.openButtonElement = this.createOpenButton("Control");
        
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
        style.overflow = "hidden";
        style.transition = "0.5s";
        style.zIndex = "2";
        
        if (window.screen.width > 600)
            style.width = "40vw";
        else
            style.width = "320px";
        style.height = "100vh";
        
        style.transformOrigin = "100% 0%";
        style.transform = "scale(0)";
    }
    
    private createButton(buttonText : string) : HTMLButtonElement
    {
        const elem = document.createElement('button');
        elem.innerText = buttonText;
        ButtonStyle.setButtonStyle(elem);

        return elem;
    }
    
    private createOpenButton(buttonText: string): HTMLButtonElement
    {
        const elem = document.createElement('button');
        elem.innerText = buttonText;
        
        ButtonStyle.setButtonStyle(elem);
        //Overrride default button style
        const style = elem.style;
        style.position = "fixed";
        style.transition = "0.5s";
        style.opacity = "0.4";
        style.zIndex = "1";
        style.top = "0px";
        style.right = "10px";
        style.height = "32px";
        style.width = "72px";
        
        elem.onmouseenter = () => elem.style.opacity = "1";
        elem.onmouseleave = () => elem.style.opacity = "0.4";
        return elem;
    }
}
