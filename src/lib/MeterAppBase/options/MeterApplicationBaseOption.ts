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

class WebsocketEnableFlag
{
    public Defi = false;
    public SSM = false;
    public Arduino = false;
    public ELM327 = false;
    public FUELTRIP = false;
    public AssettoCorsaSHM = false;
}

export class MeterApplicationBaseOption
{
    public readonly WebsocketEnableFlag = new WebsocketEnableFlag();

    public readonly WebFontFamiliyNameToPreload : string[] = new Array();
    public readonly WebFontCSSURLToPreload : string[] = new Array();
    public readonly TexturePathToPreload : string[] = new Array();

    public width : number;
    public height : number;

    public readonly WebSocketServerName : string;
    
    public readonly pPreserveDrawingBuffer : boolean = localStorage.getItem("preserveDrawingBuffer")==="true"?true:false;        

    constructor()
    {
        this.WebSocketServerName = this.getWebsocketServerName();

    }

    private getWebsocketServerName() : string
    {
        const wsServerHostname : string = localStorage.getItem("WSServerHostname");
        const setWSServerSameAsHttpSite : boolean = localStorage.getItem("SetWSServerSameAsHttp")==="true"?true:false;
        if (setWSServerSameAsHttpSite)
            return location.hostname;
        else
            return wsServerHostname;
    }

}
