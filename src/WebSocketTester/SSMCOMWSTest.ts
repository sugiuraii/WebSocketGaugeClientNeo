/* 
 * The MIT License
 *
 * Copyright 2017 sz2.
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

import { SSMWebsocket } from "websocket-gauge-client-communication";
import { SSMParameterCode } from "websocket-gauge-client-communication";
import { ReadModeCode } from "websocket-gauge-client-communication";
import { WebSocketTesterBase } from "./base/WebSocketTesterBase";

import $ from "jquery";
require('./SSMCOMWSTest.html');

window.onload = function () {
    const wsTest = new SSMCOMWSTest();
    wsTest.main();
}

export class SSMCOMWSTest extends WebSocketTesterBase {
    private webSocket: SSMWebsocket;

    constructor() {
        const webSocket = new SSMWebsocket();
        super(webSocket);
        this.webSocket = webSocket;
        this.defaultWebSocketPath = "/ssm";
    }

    protected setParameterCodeSelectBox(): void {
        Object.values(SSMParameterCode).forEach(code => $('#codeSelect').append($('<option>').html(code).val(code)));
    }

    protected assignButtonEvents(): void {
        super.assignButtonEvents();
        $("#buttonWSSend").click(() => this.inputWSSend());
        $("#buttonWSInterval").click(() => this.inputWSInterval());
    }

    protected registerWSEvents(): void {
        this.webSocket.OnVALPacketReceived = (intervalTime: number, val: { [code: string]: string }) => {
            $('#spanInterval').text(intervalTime.toFixed(2));
            //clear
            $('#divVAL').html("");
            for (const key in val) {
                $('#divVAL').append(key + " : " + val[key] + "<br>");
            }
        }
        this.webSocket.OnERRPacketReceived = (msg: string) => {
            $('#divERR').append(msg + "<br>")
        };

        this.webSocket.OnRESPacketReceived = (msg: string) => {
            $('#divRES').append(msg + "<br>");
        };
        this.webSocket.OnWebsocketError = (msg: string) => {
            $('#divWSMsg').append(msg + "<br>");
        };
        this.webSocket.OnWebsocketOpen = () => {
            $('#divWSMsg').append('* Connection open<br/>');
            $('#connectButton').attr("disabled", "disabled");
            $('#disconnectButton').removeAttr("disabled");
        };
        this.webSocket.OnWebsocketClose = () => {
            $('#divWSMsg').append('* Connection closed<br/>');
            $('#connectButton').removeAttr("disabled");
            $('#disconnectButton').attr("disabled", "disabled");
        };
    }

    public inputWSSend(): void {
        const codeSelect = $('#codeSelect').val() as SSMParameterCode;
        const codeReadmode = $('#codeReadmode').val() as ReadModeCode;
        const codeFlag = $('#codeFlag').val() === "true" ? true : false;
        this.webSocket.SendCOMRead(codeSelect, codeReadmode, codeFlag);
    }

    public inputWSInterval(): void {
        const WSinterval = Number($('#WSInterval').val());
        this.webSocket.SendSlowreadInterval(WSinterval);
    }
}

