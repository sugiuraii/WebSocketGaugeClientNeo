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
    webSocketGauge.test.SSMCOMWSTest.main();
}

namespace webSocketGauge.test
{
    import SSMWebsocket = webSocketGauge.lib.communication.SSMWebsocket;
    import SSMParameterCode = webSocketGauge.lib.communication.SSMParameterCode;

    export class SSMCOMWSTest
    {    
        private static ssmWS : SSMWebsocket;

        public static main(): void
        {
            this.ssmWS = new SSMWebsocket();
            $('#serverURL_box').val("ws://localhost:2013/");
            this.setParameterCodeSelectBox();
            this.registerWSEvents();
        }

        private static setParameterCodeSelectBox()
        {
            for (let code in SSMParameterCode)
                $('#ssmcomcode_select').append($('<option>').html(code).val(code));
        }

        private static registerWSEvents() : void
        {
            this.ssmWS.OnVALPacketReceived = (intervalTime: number, val: {[code: string]: number}) => 
            {
                $('#interval').text(intervalTime.toFixed(2));
                 //clear
                $('#div_val_data').html("");
                for (var key in val)
                {
                    $('#div_val_data').append(key + " : " + val[key] + "<br>" );
                }
            }
            this.ssmWS.OnERRPacketReceived = (msg:string)=>
            {
                $('#div_err_data').append(msg + "<br>")
            };

            this.ssmWS.OnRESPacketReceived = (msg : string) =>
            {
                $('#div_res_data').append(msg + "<br>");
            };
            this.ssmWS.OnWebsocketError = (msg : string) =>
            {
                $('#div_ws_message').append(msg + "<br>");
            };
            this.ssmWS.OnWebsocketOpen = () =>
            {
                $('#div_ws_message').append('* Connection open<br/>');

                $('#sendmessagecontent_box').removeAttr("disabled");
                $('#sendButton').removeAttr("disabled");
                $('#connectButton').attr("disabled", "disabled");
                $('#disconnectButton').removeAttr("disabled");  
            };
            this.ssmWS.OnWebsocketClose = () =>
            {
                $('#div_ws_message').append('* Connection closed<br/>');

                $('#sendmessagecontent_box').attr("disabled", "disabled");
                $('#sendButton').attr("disabled", "disabled");
                $('#connectButton').removeAttr("disabled");
                $('#disconnectButton').attr("disabled", "disabled");
            };
        }

        public static connectWebSocket() : void
        {
            this.ssmWS.URL = $("#serverURL_box").val();
            this.ssmWS.Connect();
        };

        public static disconnectWebSocket()
        {
            this.ssmWS.Close();
        };

        public static input_SSM_COM_READ()
        {
            this.ssmWS.SendCOMRead($('#ssmcomcode_select').val(), $('#ssmcode_readmode').val(), $('#ssmcode_flag').val());
        };

        public static input_SSMCOM_SLOWREAD_INTERVAL()
        {
            this.ssmWS.SendSlowreadInterval(($('#interval_SSMCOM_SLOWREAD_INTERVAL').val()));
        };
    } 
}
