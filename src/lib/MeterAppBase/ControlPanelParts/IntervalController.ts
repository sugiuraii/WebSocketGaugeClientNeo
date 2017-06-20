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
import {ButtonStyle} from './ButtonStyle';

export class IntervalController extends HTMLDivContainer
{
    private readonly websocketIntervalSpinner: HTMLInputElement;
    private readonly websocketIntervalUpButton: HTMLButtonElement;
    private readonly websocketIntervalDownButton: HTMLButtonElement;
    private readonly websocketIntervalResetButton: HTMLButtonElement;
    
    constructor()
    {
        super();
        
        this.setContainer(this.Container);
        
        const titleElem = document.createElement('div');
        this.setTitleElem(titleElem);

        this.websocketIntervalSpinner = document.createElement('input');
        this.setSpinner(this.websocketIntervalSpinner);
        
        this.websocketIntervalUpButton = document.createElement('button');
        this.setUpDownButton("+", this.websocketIntervalUpButton);
        this.websocketIntervalDownButton = document.createElement('button');
        this.setUpDownButton("-", this.websocketIntervalDownButton);
        this.websocketIntervalResetButton = document.createElement('button');
        this.setUpDownButton("0", this.websocketIntervalResetButton);
        this.setUpDownButtonEvent(this.websocketIntervalUpButton, this.websocketIntervalDownButton, this.websocketIntervalResetButton);
        
        this.Container.appendChild(titleElem);
        this.Container.appendChild(this.websocketIntervalSpinner);
        this.Container.appendChild(this.websocketIntervalUpButton);
        this.Container.appendChild(this.websocketIntervalDownButton);
        this.Container.appendChild(this.websocketIntervalResetButton);
    }
    
    private setContainer(container: HTMLDivElement)
    {
        const containerStyle = container.style;
        containerStyle.color = "white";
        containerStyle.fontSize = "16px";
        containerStyle.width = "100%";
        containerStyle.marginLeft = "auto";
        containerStyle.marginRight = "auto";
    }
    
    private setTitleElem(titleElem: HTMLDivElement)
    {
        titleElem.innerText = "Defi/Arduino WSinterval";
        const titleStyle = titleElem.style;
        titleStyle.position = "relative";
        titleStyle.display = "block";
        titleStyle.width = "100%";
        titleStyle.fontSize = "16px";
        titleStyle.fontWeight = "bold";
    }
    
    private setSpinner(spinnerElem: HTMLInputElement)
    {
        spinnerElem.type = "number";
        spinnerElem.min = '0';
        spinnerElem.max = '100';
        spinnerElem.step = '1';
        spinnerElem.value = '0';
        const spinnerStyle = spinnerElem.style;
        spinnerStyle.position = "relative";
        spinnerStyle.width = "55%";
        spinnerStyle.color = "white";
        spinnerStyle.fontSize = "16px";
        spinnerStyle.background = "black";
        spinnerStyle.boxSizing = "border-box";
    }
    
    private setUpDownButton(innerText: string, button: HTMLButtonElement)
    {
        button.innerText = innerText;
        ButtonStyle.setButtonStyle(button);
        //Override button style
        const style = button.style;
        style.height = "auto";
        style.fontSize = "auto";
        style.width = "15%"
    }
    
    private setUpDownButtonEvent(upbutton: HTMLButtonElement, downbutton: HTMLButtonElement, resetbutton: HTMLButtonElement)
    {
        const callSpinnerChangedEvent = () =>
        {
            const event = document.createEvent("Events");
            event.initEvent("change", false, true);
            this.websocketIntervalSpinner.dispatchEvent(event);
        }
        
        upbutton.onclick = () => 
        {
            this.websocketIntervalSpinner.stepUp();
            callSpinnerChangedEvent();
        }
        downbutton.onclick = () => 
        {
            this.websocketIntervalSpinner.stepDown();
            callSpinnerChangedEvent();
        }
        resetbutton.onclick = () => 
        {
            this.websocketIntervalSpinner.value = "0";
            callSpinnerChangedEvent();
        }
    }
    
    public setOnWebSocketIntervalSpinnerChanged(handler: (this: Element, ev: MouseEvent) => void) {this.websocketIntervalSpinner.addEventListener("change",handler)};   
    public get WebSocketInterval(): number {return parseInt(this.websocketIntervalSpinner.value) };
    public set WebSocketInterval(inverval: number) {this.websocketIntervalSpinner.value = inverval.toString() };
}