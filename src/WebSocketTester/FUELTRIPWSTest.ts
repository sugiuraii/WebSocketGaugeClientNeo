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
        this.webSocket.SendSectSpan($('#sectSPANBox').val());
    };

    private inputSECTSTOREMAX() {
        this.webSocket.SendSectStoreMax($('#sectStoreMaxBox').val());
    };
}




