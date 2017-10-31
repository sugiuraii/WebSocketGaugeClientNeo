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
