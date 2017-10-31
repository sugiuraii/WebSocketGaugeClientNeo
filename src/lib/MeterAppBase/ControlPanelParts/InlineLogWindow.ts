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
import {ILogWindow} from './LogWindow';
import {HTMLDivContainer} from './HTMLDivContainer';

export class InlineLogWindow extends HTMLDivContainer implements ILogWindow
{
    private writeDate : boolean;

    constructor()
    {
        super();
        this.setStyle();
        this.writeDate = false;
    }

    private setStyle() : void
    {
        const style = this.Container.style;
        style.position = "relative";
        style.background = "#000000";
        style.display = "block";
        style.color = "white";
        style.overflowX = "hidden";
        style.overflowY = "scroll";
        style.width = "100%";
        style.height = "70%"
        style.marginLeft = "auto";
        style.marginRight = "auto";
        style.fontSize = "12px"
    }

    private getTimeString() : string
    {
        return new Date().toLocaleString();
    }

    public clearLog() : void
    {
        this.Container.innerHTML = "";
    }

    public appendLog(message : string) : void
    {
        let strToAppend : string;
        if (this.writeDate)
            strToAppend = this.getTimeString() + "<br>";
        else
            strToAppend = "";

        strToAppend += (message + "<br>");

        this.Container.innerHTML += strToAppend;
    }
    
    public get WriteDate(): boolean {return this.writeDate}
    public set WriteDate(flag: boolean) {this.writeDate = flag}
}
