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

import comm = require('../script/websocket/websocketClient');
import $ = require('jquery');

module webSocketGauge.test
{
    import WebSocketCommon = comm.webSocketGauge.lib.communication.WebsocketCommon;
    import DefiCOMWebsocket = comm.webSocketGauge.lib.communication.DefiCOMWebsocket;
    import DefiParameterCode = comm.webSocketGauge.lib.communication.DefiParameterCode;
    
    abstract class WebSocketTestBase
    {
        private webSocketObj : WebSocketCommon;
                        
        constructor()
        {
        }
        
        protected setWebSocketObj(webSocketObj : WebSocketCommon)
        {
            this.webSocketObj = webSocketObj;
        }
        
        protected registerWSEvents() : void
        {
            this.webSocketObj.OnERRPacketReceived = (msg:string)=>
            {
                $('#div_err_data').append(msg + "<br>")
            };

            this.webSocketObj.OnRESPacketReceived = (msg : string) =>
            {
                $('#div_res_data').append(msg + "<br>");
            };
            this.webSocketObj.OnWebsocketError = (msg : string) =>
            {
                $('#div_ws_message').append(msg + "<br>");
            };
            this.webSocketObj.OnWebsocketOpen = () =>
            {
                $('#div_ws_message').append('* Connection open<br/>');

                $('#sendmessagecontent_box').removeAttr("disabled");
                $('#sendButton').removeAttr("disabled");
                $('#connectButton').attr("disabled", "disabled");
                $('#disconnectButton').removeAttr("disabled");  
            };
            this.webSocketObj.OnWebsocketClose = () =>
            {
                $('#div_ws_message').append('* Connection closed<br/>');

                $('#sendmessagecontent_box').attr("disabled", "disabled");
                $('#sendButton').attr("disabled", "disabled");
                $('#connectButton').removeAttr("disabled");
                $('#disconnectButton').attr("disabled", "disabled");
            };
        }
        
        public connectWebSocket() : void
        {
            this.webSocketObj.URL = $("#serverURL_box").val();
            this.webSocketObj.Connect();
        };
        
        public disconnectWebSocket() : void
        {
            this.webSocketObj.Close();
        }; 
    }
    
    export class DefiCOMWSTest extends WebSocketTestBase
    {    
        private defiWS : DefiCOMWebsocket = new DefiCOMWebsocket();
        
        constructor()
        {
            super();
            super.setWebSocketObj(this.defiWS);
        }

        public main(): void
        {
            this.defiWS = new DefiCOMWebsocket();
            $('#serverURL_box').val("ws://localhost:2012/");
            this.setParameterCodeSelectBox();
            this.registerWSEvents();
        }

        private setParameterCodeSelectBox()
        {
            for (let code in DefiParameterCode)
                $('#deficode_select').append($('<option>').html(code).val(code));
        }

        protected registerWSEvents() : void
        {
            super.registerWSEvents();
            
            this.defiWS.OnVALPacketReceived = (intervalTime: number, val: {[code: string]: number}) => 
            {
                $('#interval').text(intervalTime.toFixed(2));
                 //clear
                $('#div_val_data').html("");
                for (var key in val)
                {
                    $('#div_val_data').append(key + " : " + val[key] + "<br>" );
                }
            }
        }        
        public input_WS_SEND()
        {
            this.defiWS.SendWSSend($('#code_select').val(),$('#deficode_flag').val());
        };

        public input_WS_INTERVAL()
        {
            this.defiWS.SendWSInterval($('#interval').val());
        };
    } 
}
