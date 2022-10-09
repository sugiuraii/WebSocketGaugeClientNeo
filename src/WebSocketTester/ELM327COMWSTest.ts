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

import { ELM327COMWebsocket } from "websocketcommunication";
import { OBDIIParameterCode } from "websocketcommunication";
import { ReadModeCode } from "websocketcommunication";
import { WebSocketTesterBase } from "./base/WebSocketTesterBase";

import $ from "jquery";
require('./ELM327COMWSTest.html');

window.onload = function () {
    const wsTest = new ELM327COMWSTest();
    wsTest.main();
}

export class ELM327COMWSTest extends WebSocketTesterBase {

    private webSocket: ELM327COMWebsocket;
    constructor() {
        const webSocket = new ELM327COMWebsocket();
        super(webSocket);
        this.webSocket = webSocket;
        this.defaultWebSocketPath = "/elm327";
    }

    protected setParameterCodeSelectBox(): void {
        Object.values(OBDIIParameterCode).forEach(code => $('#codeSelect').append($('<option>').html(code).val(code)));
    }

    protected assignButtonEvents(): void {
        super.assignButtonEvents();
        $("#buttonWSSend").on('click', () => this.inputWSSend());
        $("#buttonWSInterval").on('click', () => this.inputWSInterval());
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
        const codeSelect = $('#codeSelect').val() as OBDIIParameterCode;
        const codeReadmode = $('#codeReadmode').val() as ReadModeCode;
        const codeFlag = $('#codeFlag').val() === "true" ? true : false;
        this.webSocket.SendCOMRead(codeSelect, codeReadmode, codeFlag);
    }

    public inputWSInterval(): void {
        const WSinterval = Number($('#WSInterval').val());
        this.webSocket.SendSlowreadInterval(WSinterval);
    }
}

