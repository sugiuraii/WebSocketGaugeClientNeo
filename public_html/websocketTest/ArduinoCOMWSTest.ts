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
/// <reference path="../script/websocket/websocketClient.ts" />
/// <reference path="../node_modules/@types/jquery/index.d.ts" />
import ArduinoCOMWebsocket = webSocketGauge.lib.communication.ArduinoCOMWebsocket;
import ArduinoParameterCode = webSocketGauge.lib.communication.ArduinoParameterCode;

window.onload = function()
{
    ArduinoCOMWSTest.main();
}

class ArduinoCOMWSTest
{    
    private static arduinoWS : ArduinoCOMWebsocket;
    
    public static main(): void
    {
        this.arduinoWS = new ArduinoCOMWebsocket();
        $('#serverURL_box').val("ws://localhost:2012/");
        this.setParameterCodeSelectBox();
        this.registerWSEvents();
    }
    
    private static setParameterCodeSelectBox()
    {
        for (let code in ArduinoParameterCode)
            $('#deficode_select').append($('<option>').html(code).val(code));
    }
    
    private static registerWSEvents() : void
    {
        this.arduinoWS.OnVALPacketReceived = (intervalTime: number, val: {[code: string]: number}) => 
        {
            $('#interval').text(intervalTime.toFixed(2));
             //clear
            $('#div_val_data').html("");
            for (var key in val)
            {
                $('#div_val_data').append(key + " : " + val[key] + "<br>" );
            }
        }
        this.arduinoWS.OnERRPacketReceived = (msg:string)=>
        {
            $('#div_err_data').append(msg + "<br>")
        };
        
        this.arduinoWS.OnRESPacketReceived = (msg : string) =>
        {
            $('#div_res_data').append(msg + "<br>");
        };
        this.arduinoWS.OnWebsocketError = (msg : string) =>
        {
            $('#div_ws_message').append(msg + "<br>");
        };
        this.arduinoWS.OnWebsocketOpen = () =>
        {
            $('#div_ws_message').append('* Connection open<br/>');

            $('#sendmessagecontent_box').removeAttr("disabled");
            $('#sendButton').removeAttr("disabled");
            $('#connectButton').attr("disabled", "disabled");
            $('#disconnectButton').removeAttr("disabled");  
        };
        this.arduinoWS.OnWebsocketClose = () =>
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
        this.arduinoWS.URL = $("#serverURL_box").val();
        this.arduinoWS.Connect();
    };
    
    public static disconnectWebSocket()
    {
        this.arduinoWS.Close();
    };

    public static input_ARDUINO_WS_SEND()
    {
        this.arduinoWS.SendWSSend($('#deficode_select').val(),$('#deficode_flag').val());
    };

    public static input_ARDUINO_WS_INTERVAL()
    {
        this.arduinoWS.SendWSInterval($('#interval_DEFI_WS_INTERVAL').val());
    };
} 







