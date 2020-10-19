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

import $ from "jquery";
import {WebsocketCommon} from '../../lib/WebSocket/WebSocketCommunication';

export abstract class WebSocketTesterBase
{
    private webSocketBase: WebsocketCommon;
    
    protected defaultPortNo = 2012;
    protected readonly defaultSeverAddress = location.hostname;
    
    constructor(webSocketBase: WebsocketCommon)
    {
        this.webSocketBase = webSocketBase;
    }
        
    public main(): void
    {
        $('#serverURLBox').val("ws://" + this.defaultSeverAddress + ":" + this.defaultPortNo.toString() + "/");
        this.assignButtonEvents();
        this.setParameterCodeSelectBox();
        this.registerWSEvents();
    }
    
    public connectWebSocket() : void
    {
        this.webSocketBase.URL = $("#serverURLBox").val() as string;
        this.webSocketBase.Connect();
    }

    public disconnectWebSocket() : void
    {
        this.webSocketBase.Close();
    }
    
    protected assignButtonEvents() : void
    {
        $("#connectButton").on('click', ()=> this.connectWebSocket());
        $("#disconnectButton").on('click', () => this.disconnectWebSocket());
    }
    
    protected abstract setParameterCodeSelectBox() : void;
    protected abstract registerWSEvents() : void;
}
