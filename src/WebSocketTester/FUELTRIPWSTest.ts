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

/// <reference path="../lib/webpackRequire.ts" />

import {FUELTRIPWebsocket} from '../lib/WebSocket/WebSocketCommunication';
import {WebSocketTesterBase} from './base/WebSocketTesterBase';
import * as $ from "jquery";
require('./FUELTRIPWSTest.html');

window.onload = function () {
    let wsTest = new FUELTRIPWSTest();
    wsTest.main();
}

export class FUELTRIPWSTest extends WebSocketTesterBase {
    private webSocket: FUELTRIPWebsocket;
    
    constructor()
    {
        const webSocket = new FUELTRIPWebsocket()
        super(webSocket);
        this.webSocket = webSocket;
        
        this.defaultPortNo = 2014;
    }
    
    protected setParameterCodeSelectBox()
    {
        //FUELTRIPWSTest have no parameter code select box.
    }
    
    public main(): void {
         $('#serverURLBox').val("ws://" + this.defaultSeverAddress + ":" + this.defaultPortNo.toString() + "/");
        this.assignButtonEvents();
        this.registerWSEvents();
    }

    protected assignButtonEvents(): void {
        super.assignButtonEvents();
        $("#buttonSECTSPAN").click(() => this.inputSECTSPAN());
        $("#buttonSECTSTOREMAX").click(() => this.inputSECTSTOREMAX());
    }

    protected registerWSEvents(): void {
        this.webSocket.OnMomentFUELTRIPPacketReceived = (moment_gasmilage: number, total_gas: number, total_trip: number, total_gasmilage: number) => {
            //clear
            $('#divMomentFuelTrip').html("");

            $('#divMomentFuelTrip').append("Moment GasMilage : " + moment_gasmilage + "<br>");
            $('#divMomentFuelTrip').append("Total Gas : " + total_gas + "<br>");
            $('#divMomentFuelTrip').append("Total Trip : " + total_trip + "<br>");
            $('#divMomentFuelTrip').append("Total GasMilage : " + total_gasmilage + "<br>");
        }
        this.webSocket.OnSectFUELTRIPPacketReceived = (sect_span: number, sect_trip: number[], sect_gas: number[], sect_gasmilage: number[]) => {
            //clear
            $('#divSectFuelTrip').html("");

            $('#divSectFuelTrip').append("Sect Span : " + sect_span + "<br>");
            $('#divSectFuelTrip').append("Sect Trip : " + sect_trip + "<br>");
            $('#divSectFuelTrip').append("Sect Gas : " + sect_gas + "<br>");
            $('#divSectFuelTrip').append("Sect GasMilage : " + sect_gasmilage + "<br>");
        }

        this.webSocket.OnERRPacketReceived = (msg: string) => {
            $('#divERR').append(msg + "<br>");
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
            $('#div_ws_message').append('* Connection closed<br/>');
            $('#connectButton').removeAttr("disabled");
            $('#disconnectButton').attr("disabled", "disabled");
        };
    }

    private inputSECTSPAN() {
        this.webSocket.SendSectSpan(Number($('#sectSPANBox').val()));
    };

    private inputSECTSTOREMAX() {
        this.webSocket.SendSectStoreMax(Number($('#sectStoreMaxBox').val()));
    };
}




