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

import * as JSONFormats from "./JSONFormats";

export abstract class WebsocketCommon
{
    protected modePrefix: string;
    private websocket: WebSocket;
    private isConnetced : boolean = false;
    private url : string;
    private onRESPacketReceived: (message : string) => void;
    private onERRPacketReceived: (message : string) => void;
    private onWebsocketOpen: ()=>void;
    private onWebsocketClose: ()=>void;
    private onWebsocketError: (message : string) => void;

    constructor()
    {
        this.onWebsocketError = (msg : string)=>alert(msg);
    }

    protected abstract parseIncomingMessage(msg : string) : void;
    /**
    * Connect websocket.
    */
    public Connect() : void
    {
        this.websocket = new WebSocket(this.url); 
        if (this.websocket === null) {
            if (typeof (this.onWebsocketError) !== "undefined")
                this.onWebsocketError("Websocket is not supported.");
            return;
        };

        // store self reference in order to register event handler.
        var self = this;
        // when data is comming from the server, this metod is called
        this.websocket.onmessage = function (evt) {

            const msg = evt.data;
            //Ignore "DMY" message. (DMY message is sent from server in order to keep-alive wifi connection (to prevent wifi low-power(high latency) mode).
            if(msg === "DMY")
                return;
            
            self.parseIncomingMessage(msg);
        };
        // when the connection is established, this method is called
        this.websocket.onopen = function () {
            if (typeof (self.onWebsocketOpen) !== "undefined")
                self.onWebsocketOpen();
        };
        // when the connection is closed, this method is called
        this.websocket.onclose = function () {
            if (typeof (self.onWebsocketClose) !== "undefined")
            self.onWebsocketClose();
        };

        this.isConnetced = true;
    }

    /**
    * Send reset packet.
    */
    public SendReset(): void
    {
        if (!this.isConnetced)
            return;

        let jsonstr: string = JSON.stringify(new JSONFormats.ResetJSONMessage());
        this.websocket.send(jsonstr);
    }

    /**
    * Close websocket.
    */
    public Close(): void
    {
        if(this.websocket)
        {
            this.websocket.close();
        }
        this.isConnetced = false;
    }

    /**
     * Get websocket ready state.
     * @return {number} Websocket state code.
     */        
    public getReadyState(): number
    {
        if(typeof this.websocket === "undefined")
            return -1;
        else
            return this.websocket.readyState;
    }

    public get ModePrefix() : string {return this.modePrefix;}
    protected get WebSocket() : WebSocket { return this.websocket; }
    public get URL(): string { return this.url; }
    public set URL(val : string) { this.url = val; }
    public get OnRESPacketReceived() { return this.onRESPacketReceived; };
    public set OnRESPacketReceived(func) { this.onRESPacketReceived = func; };
    public get OnERRPacketReceived() { return this.onERRPacketReceived; };
    public set OnERRPacketReceived(func) { this.onERRPacketReceived = func; };
    public get OnWebsocketOpen() {return this.onWebsocketOpen; };
    public set OnWebsocketOpen(func) {this.onWebsocketOpen = func; };
    public get OnWebsocketClose() {return this.onWebsocketClose; };
    public set OnWebsocketClose(func) {this.onWebsocketClose = func; };
    public get OnWebsocketError() {return this.onWebsocketError; };
    public set OnWebsocketError(func) {this.onWebsocketError = func; };

    public get IsConnetced() { return this.isConnetced;};
}
