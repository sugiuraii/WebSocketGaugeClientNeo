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

export class IntervalController extends HTMLDivContainer
{
    private readonly websocketIntervalSpinner: HTMLInputElement;
    
    constructor()
    {
        super();
        
        const containerStyle = this.Container.style;
        containerStyle.color = "white";
        containerStyle.fontSize = "16px";
        containerStyle.width = "100%";
        containerStyle.marginLeft = "auto";
        containerStyle.marginRight = "auto";
        
        const titleElem = document.createElement('div');
        titleElem.innerText = "Defi/Arduino websocket interval";
        const titleStyle = titleElem.style;
        titleStyle.position = "relative";
        titleStyle.display = "block";
        titleStyle.width = "100%";
        titleStyle.fontSize = "16px";
        titleStyle.fontWeight = "bold";

        this.websocketIntervalSpinner = document.createElement('input');
        this.websocketIntervalSpinner.type = "number";
        this.websocketIntervalSpinner.min = '0';
        this.websocketIntervalSpinner.max = '100';
        this.websocketIntervalSpinner.step = '1';
        this.websocketIntervalSpinner.value = '0';
        const spinnerStyle = this.websocketIntervalSpinner.style;
        spinnerStyle.position = "relative";
        spinnerStyle.display = "block";
        spinnerStyle.width = "100%";
        spinnerStyle.color = "white";
        spinnerStyle.fontSize = "16px";
        spinnerStyle.background = "black";
        spinnerStyle.boxSizing = "border-box";
        
        this.Container.appendChild(titleElem);
        this.Container.appendChild(this.websocketIntervalSpinner);
    }
    
    public setOnWebSocketIntervalSpinnerChanged(handler: (this: Element, ev: MouseEvent) => void) {this.websocketIntervalSpinner.onchange = handler};   
    public get WebSocketInterval(): number {return parseInt(this.websocketIntervalSpinner.value) };
}