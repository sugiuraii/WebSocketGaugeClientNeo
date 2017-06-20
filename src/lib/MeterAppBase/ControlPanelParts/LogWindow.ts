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

export interface ILogWindow
{
    clearLog() : void;
    appendLog(message : string) : void;
}

export class LogWindow implements ILogWindow
{
    private windowElement: HTMLDivElement;
    private writeDate : boolean;
    
    public get Element() { return this.windowElement };
    
    constructor()
    {
        this.windowElement = document.createElement('div');
        document.body.appendChild(this.windowElement);
        this.setDefaultStyle();
        this.writeDate = false;
    }

    private setDefaultStyle() : void
    {
        const style = this.windowElement.style;
        style.position = "relative";
        style.background = "#000000";
        style.display = "block";
        style.color = "white";
        style.overflow = "scroll";
        style.width = "100%";
        style.fontSize = "14px";

        //Change opacity when mouse is over
        this.windowElement.onmouseenter = () => {style.opacity = "0.9"};
        this.windowElement.onmouseleave = () => {style.opacity = "0.2"};        
    }

    private getTimeString() : string
    {
        return new Date().toLocaleString();
    }

    public clearLog() : void
    {
        this.windowElement.innerHTML = "";
    }

    public appendLog(message : string) : void
    {
        let strToAppend : string;
        if (this.writeDate)
            strToAppend = this.getTimeString() + "<br>";
        else
            strToAppend = "";

        strToAppend += (message + "<br>");

        this.windowElement.innerHTML += strToAppend;
    }

    public get Style(): CSSStyleDeclaration {return this.windowElement.style}
    public get WriteDate(): boolean {return this.writeDate}
    public set WriteDate(flag: boolean) {this.writeDate = flag}

    public setPosition(x : number, y: number, xUnit? : string, yUnit? : string) : void
    {            
        if(!xUnit)
            xUnit = "px";    
        if(!yUnit)
            yUnit = "px";    

        const style = this.windowElement.style;
        style.top = x.toString() + xUnit;
        style.left = y.toString() + yUnit;
    }

    public setSize(width : number, height : number, widthUnit? : string, heightUnit? : string): void
    {
        if(!widthUnit)
            widthUnit = "px";  
        if(!heightUnit)
            heightUnit = "px";  

        const style = this.windowElement.style;
        style.width = width.toString() + widthUnit;
        style.height = height.toString() + heightUnit;
    }

    public get Visible() : boolean
    {
        const style = this.windowElement.style;
        if (style.display === "none")
            return false;
        else
            return true;
    }

    public set Visible(flag : boolean)
    {
        const style = this.windowElement.style;
        if(flag)
            style.display = "inline";
        else
            style.display = "none";
    }

}
