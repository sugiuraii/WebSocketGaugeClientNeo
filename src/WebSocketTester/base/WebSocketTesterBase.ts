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

import * as $ from "jquery";
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
        this.webSocketBase.URL = $("#serverURLBox").val();
        this.webSocketBase.Connect();
    };

    public disconnectWebSocket()
    {
        this.webSocketBase.Close();
    };
    
    protected assignButtonEvents() : void
    {
        $("#connectButton").click(()=> this.connectWebSocket());
        $("#disconnectButton").click(() => this.disconnectWebSocket());
    }
    
    protected abstract setParameterCodeSelectBox() : void;
    protected abstract registerWSEvents() : void;
}
