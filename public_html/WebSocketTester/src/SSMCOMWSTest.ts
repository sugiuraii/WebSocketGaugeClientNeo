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

import comm = require('../../lib/websocket/websocketClient');
import $ = require("jquery");

window.onload = function()
{
    let wsTest = new webSocketGauge.test.SSMCOMWSTest();
    wsTest.main();
}

namespace webSocketGauge.test
{
    import SSMWebsocket = comm.webSocketGauge.lib.communication.SSMWebsocket;
    import SSMParameterCode = comm.webSocketGauge.lib.communication.SSMParameterCode;

    export class SSMCOMWSTest
    {    
        private webSocket : SSMWebsocket;

        public main(): void
        {
            this.webSocket = new SSMWebsocket();
            $('#serverURLBox').val("ws://localhost:2013/");
            this.assignButtonEvents();
            this.setParameterCodeSelectBox();
            this.registerWSEvents();
        }
        
        protected assignButtonEvents() : void
        {
            $("#connectButton").click(()=> this.connectWebSocket());
            $("#disconnectButton").click(() => this.disconnectWebSocket());
            $("#buttonWSSend").click(() => this.inputWSSend());
            $("#buttonWSInterval").click(() => this.inputWSInterval());
        }

        private setParameterCodeSelectBox()
        {
            for (let code in SSMParameterCode)
                $('#codeSelect').append($('<option>').html(code).val(code));
        }

        private registerWSEvents() : void
        {
            this.webSocket.OnVALPacketReceived = (intervalTime: number, val: {[code: string]: number}) => 
            {
                $('#spanInterval').text(intervalTime.toFixed(2));
                 //clear
                $('#divVAL').html("");
                for (var key in val)
                {
                    $('#divVAL').append(key + " : " + val[key] + "<br>" );
                }
            }
            this.webSocket.OnERRPacketReceived = (msg:string)=>
            {
                $('#divERR').append(msg + "<br>")
            };

            this.webSocket.OnRESPacketReceived = (msg : string) =>
            {
                $('#divRES').append(msg + "<br>");
            };
            this.webSocket.OnWebsocketError = (msg : string) =>
            {
                $('#divWSMsg').append(msg + "<br>");
            };
            this.webSocket.OnWebsocketOpen = () =>
            {
                $('#divWSMsg').append('* Connection open<br/>');
                $('#connectButton').attr("disabled", "disabled");
                $('#disconnectButton').removeAttr("disabled");  
            };
            this.webSocket.OnWebsocketClose = () =>
            {
                $('#divWSMsg').append('* Connection closed<br/>');
                $('#connectButton').removeAttr("disabled");
                $('#disconnectButton').attr("disabled", "disabled");
            };
        }

        public connectWebSocket() : void
        {
            this.webSocket.URL = $("#serverURLBox").val();
            this.webSocket.Connect();
        };

        public disconnectWebSocket()
        {
            this.webSocket.Close();
        };

        public inputWSSend()
        {
            this.webSocket.SendCOMRead($('#codeSelect').val(), $('#codeReadmode').val(), $('#codeFlag').val());
        };

        public inputWSInterval()
        {
            this.webSocket.SendSlowreadInterval(($('#WSInterval').val()));
        };
    } 
}
