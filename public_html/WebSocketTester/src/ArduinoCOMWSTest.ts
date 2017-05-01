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

window.onload = function()
{
    webSocketGauge.test.ArduinoCOMWSTest.main();
}

import comm = require('../../script/websocket/websocketClient');
import $ = require("jquery");

namespace webSocketGauge.test
{
    import ArduinoCOMWebsocket = comm.webSocketGauge.lib.communication.ArduinoCOMWebsocket;
    import ArduinoParameterCode = comm.webSocketGauge.lib.communication.ArduinoParameterCode;
    
    export class ArduinoCOMWSTest
    {    
        private static arduinoWS : ArduinoCOMWebsocket;

        public static main(): void
        {
            this.arduinoWS = new ArduinoCOMWebsocket();
            $('#serverURLBox').val("ws://localhost:2012/");
            $("#connectButton").click(()=>{this.connectWebSocket()});
            $("#disconnectButton").click(() => {this.disconnectWebSocket()});
            $("#buttonWSSend").click(() => {this.inputWSSend()});
            this.setParameterCodeSelectBox();
            this.registerWSEvents();
        }

        private static setParameterCodeSelectBox()
        {
            for (let code in ArduinoParameterCode)
                $('#codeSelect').append($('<option>').html(code).val(code));
        }

        private static registerWSEvents() : void
        {
            this.arduinoWS.OnVALPacketReceived = (intervalTime: number, val: {[code: string]: number}) => 
            {
                $('#spanInterval').text(intervalTime.toFixed(2));
                 //clear
                $('#divVAL').html("");
                for (var key in val)
                {
                    $('#divVAL').append(key + " : " + val[key] + "<br>" );
                }
            }
            this.arduinoWS.OnERRPacketReceived = (msg:string)=>
            {
                $('#divERR').append(msg + "<br>")
            };

            this.arduinoWS.OnRESPacketReceived = (msg : string) =>
            {
                $('#divRES').append(msg + "<br>");
            };
            this.arduinoWS.OnWebsocketError = (msg : string) =>
            {
                $('#divWSMsg').append(msg + "<br>");
            };
            this.arduinoWS.OnWebsocketOpen = () =>
            {
                $('#divWSMsg').append('* Connection open<br/>');
                $('#connectButton').attr("disabled", "disabled");
                $('#disconnectButton').removeAttr("disabled");  
            };
            this.arduinoWS.OnWebsocketClose = () =>
            {
                $('#divWSMsg').append('* Connection closed<br/>');
                $('#connectButton').removeAttr("disabled");
                $('#disconnectButton').attr("disabled", "disabled");
            };
        }

        public static connectWebSocket() : void
        {
            this.arduinoWS.URL = $("#serverURLBox").val();
            this.arduinoWS.Connect();
        };

        public static disconnectWebSocket()
        {
            this.arduinoWS.Close();
        };

        public static inputWSSend()
        {
            this.arduinoWS.SendWSSend($('#codeSelect').val(),$('#codeFlag').val());
        };

        public static inputWSInterval()
        {
            this.arduinoWS.SendWSInterval($('#WSInterval').val());
        };
    } 
}
