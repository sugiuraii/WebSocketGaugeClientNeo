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

import { AssettoCorsaSHMWebsocket, AssettoCorsaSHMPhysicsParameterCode, AssettoCorsaSHMStaticInfoParameterCode, AssettoCorsaSHMGraphicsParameterCode } from '../lib/WebSocket/WebSocketCommunication';
import { AssettoCorsaSHMNumericalVALCode } from '../lib/WebSocket/WebSocketCommunication';
import { WebSocketTesterBase } from './base/WebSocketTesterBase'

import $ from "jquery";
require('./AssettoCorsaSHMWSTest.html');

window.onload = function () {
    const wsTest = new AssettoCorsaSHMWSTest();
    wsTest.main();
}

class AssettoCorsaSHMWSTest extends WebSocketTesterBase {
    private webSocket: AssettoCorsaSHMWebsocket;
    constructor() {
        const webSocket = new AssettoCorsaSHMWebsocket();
        super(webSocket);
        this.webSocket = webSocket;
        this.defaultPortNo = 2017;
    }

    protected assignButtonEvents(): void {
        super.assignButtonEvents();
        $("#buttonPhysWSSend").on('click', () => this.inputPhysWSSend());
        $("#buttonPhysWSInterval").on('click', () => this.inputPhysWSInterval());
        $("#buttonGrphWSSend").on('click', () => this.inputGrphWSSend());
        $("#buttonGrphWSInterval").on('click', () => this.inputGrphWSInterval());
        $("#buttonStaticWSSend").on('click', () => this.inputStaticWSSend());
        $("#buttonStaticWSInterval").on('click', () => this.inputStaticWSInterval());
    }

    protected setParameterCodeSelectBox(): void {
        Object.values(AssettoCorsaSHMPhysicsParameterCode).forEach(code => $('#physCodeSelect').append($('<option>').html(code).val(code)));
        Object.values(AssettoCorsaSHMGraphicsParameterCode).forEach(code => $('#grphCodeSelect').append($('<option>').html(code).val(code)));
        Object.values(AssettoCorsaSHMStaticInfoParameterCode).forEach(code => $('#staticCodeSelect').append($('<option>').html(code).val(code)));
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

    public main() {
        super.main();
        window.requestAnimationFrame((timestamp: number) => this.showInterpolateVal(timestamp));
    }

    public inputPhysWSSend() {
        const codeFlag = $('#physCodeFlag').val() === "true" ? true : false;
        const codeName = AssettoCorsaSHMPhysicsParameterCode[$('#physCodeSelect').val().toString()];
        this.webSocket.SendPhysicsWSSend(codeName, codeFlag);
    }

    public inputPhysWSInterval() {
        const wsInterval = Number($('#physWSInterval').val());
        this.webSocket.SendPhysicsWSInterval(wsInterval);
    }

    public inputGrphWSSend() {
        const codeFlag = $('#grphCodeFlag').val() === "true" ? true : false;
        const codeName = AssettoCorsaSHMGraphicsParameterCode[$('#grphCodeSelect').val().toString()];
        this.webSocket.SendGraphicsWSSend(codeName, codeFlag);
    }

    public inputGrphWSInterval() {
        const wsInterval = Number($('#grphWSInterval').val());
        this.webSocket.SendGraphicsWSInterval(wsInterval);
    }

    public inputStaticWSSend() {
        const codeName = AssettoCorsaSHMStaticInfoParameterCode[$('#staticCodeSelect').val().toString()];
        const codeFlag = $('#staticCodeFlag').val() === "true" ? true : false;
        this.webSocket.SendStaticInfoWSSend(codeName, codeFlag);
    }

    public inputStaticWSInterval() {
        const wsInterval = Number($('#staticWSInterval').val());
        this.webSocket.SendStaticInfoWSInterval(wsInterval);
    }

    public showInterpolateVal(timestamp: number) {
        $('#divInterpolatedVAL').html("");
        Object.values(AssettoCorsaSHMNumericalVALCode).forEach(k => {
            const val = this.webSocket.getVal(k, timestamp);
            $('#divInterpolatedVAL').append(k + " : " + val + "<br>");
        });
        window.requestAnimationFrame((timestamp) => this.showInterpolateVal(timestamp));
    }
}
