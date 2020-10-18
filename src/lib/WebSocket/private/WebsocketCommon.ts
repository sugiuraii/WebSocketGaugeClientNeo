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

import * as JSONFormats from "./JSONFormats";

export abstract class WebsocketCommon {
    protected modePrefix = "";
    private websocket: WebSocket | undefined;
    private readonly url : string;
    private isConnetced = false;
    private onRESPacketReceived: (message: string) => void = () => {/*do nothing.*/};
    private onERRPacketReceived: (message: string) => void = () => {/*do nothing.*/};
    private onWebsocketOpen: () => void = () => {/*do nothing.*/};
    private onWebsocketClose: () => void = () => {/*do nothing.*/};
    private onWebsocketError: (message: string) => void = () => {/*do nothing.*/};

    constructor(url : string) {
        this.onWebsocketError = (msg: string) => alert(msg);
        this.url = url;
    }

    protected abstract parseIncomingMessage(msg: string): void;
    /**
    * Connect websocket.
    */
    public Connect(): void {
        if(this.isConnetced)
            throw Error("Websocket is already connected.");
        
        this.websocket = new WebSocket(this.url);

        if (this.websocket === null) {
            if (typeof (this.onWebsocketError) !== "undefined")
                this.onWebsocketError("Websocket is not supported.");
            return;
        }

        // when data is comming from the server, this metod is called
        this.websocket.onmessage = (evt) => {

            const msg = evt.data;
            //Ignore "DMY" message. (DMY message is sent from server in order to keep-alive wifi connection (to prevent wifi low-power(high latency) mode).
            if (msg === "DMY")
                return;

            this.parseIncomingMessage(msg);
        };
        // when the connection is established, this method is called
        this.websocket.onopen = () => {
            if (typeof (this.onWebsocketOpen) !== "undefined")
                this.onWebsocketOpen();
        };
        // when the connection is closed, this method is called
        this.websocket.onclose = () => {
            if (typeof (this.onWebsocketClose) !== "undefined")
                this.onWebsocketClose();
        };

        this.isConnetced = true;
    }

    /**
    * Send reset packet.
    */
    public SendReset(): void {
        if (!this.isConnetced || this.websocket === undefined)
            throw Error("Websocket is not connected.");

        const jsonstr: string = JSON.stringify(new JSONFormats.ResetJSONMessage());
        this.websocket.send(jsonstr);
    }

    /**
    * Close websocket.
    */
    public Close(): void {
        if (!this.isConnetced || this.websocket === undefined)
            throw Error("Websocket is not connected.");
        
        this.websocket.close();
        this.isConnetced = false;
    }

    /**
     * Get websocket ready state.
     * @return {number} Websocket state code.
     */
    public getReadyState(): number {
        if (typeof this.websocket === "undefined")
            return -1;
        else
            return this.websocket.readyState;
    }

    public get ModePrefix(): string { return this.modePrefix; }
    protected get WebSocket(): WebSocket {
        if(this.websocket === undefined)
            throw Error("Websocket is not initialized. Connect once before refere websocket object.");
        return this.websocket;
    }
    
    public get URL(): string { return this.url; }
    public get OnRESPacketReceived(): (message: string) => void { return this.onRESPacketReceived; }
    public set OnRESPacketReceived(func: (message: string) => void) { this.onRESPacketReceived = func; }
    public get OnERRPacketReceived(): (message: string) => void { return this.onERRPacketReceived; }
    public set OnERRPacketReceived(func: (message: string) => void) { this.onERRPacketReceived = func; }
    public get OnWebsocketOpen(): () => void { return this.onWebsocketOpen; }
    public set OnWebsocketOpen(func: () => void) { this.onWebsocketOpen = func; }
    public get OnWebsocketClose(): () => void { return this.onWebsocketClose; }
    public set OnWebsocketClose(func: () => void) { this.onWebsocketClose = func; }
    public get OnWebsocketError(): (message: string) => void { return this.onWebsocketError; }
    public set OnWebsocketError(func: (message: string) => void) { this.onWebsocketError = func; }

    public get IsConnetced(): boolean { return this.isConnetced; }
}
