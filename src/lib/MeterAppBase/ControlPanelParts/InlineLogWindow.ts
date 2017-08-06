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
