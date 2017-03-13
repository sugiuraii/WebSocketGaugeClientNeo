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
import FUELTRIPWebsocket = webSocketGauge.lib.communication.FUELTRIPWebsocket;

window.onload = function()
{
    FUELTRIPWSTest.main();
}

class FUELTRIPWSTest
{
    private static fueltripWS : FUELTRIPWebsocket;
    
    public static main() : void
    {
        this.fueltripWS = new FUELTRIPWebsocket();
        $('#serverURL_box').val("ws://localhost:2014/");
        this.registerWSEvents();
    }
    
    private static registerWSEvents() : void
    {
        this.fueltripWS.OnMomentFUELTRIPPacketReceived = (moment_gasmilage : number, total_gas : number, total_trip : number, total_gasmilage : number)=>
        {
            //clear
            $('#div_moment_fueltrip_data').html("");

            $('#div_moment_fueltrip_data').append("Moment GasMilage : " + moment_gasmilage + "<br>" );
            $('#div_moment_fueltrip_data').append("Total Gas : " + total_gas + "<br>" );
            $('#div_moment_fueltrip_data').append("Total Trip : " + total_trip + "<br>" );
            $('#div_moment_fueltrip_data').append("Total GasMilage : " + total_gasmilage + "<br>" );
        }
        this.fueltripWS.OnSectFUELTRIPPacketReceived = (sect_span: number, sect_trip: number[], sect_gas: number[], sect_gasmilage: number[]) =>
        {
            //clear
            $('#div_sect_fueltrip_data').html("");

            $('#div_sect_fueltrip_data').append("Sect Span : " + sect_span + "<br>" );
            $('#div_sect_fueltrip_data').append("Sect Trip : " + sect_trip + "<br>" );
            $('#div_sect_fueltrip_data').append("Sect Gas : " + sect_gas + "<br>" );
            $('#div_sect_fueltrip_data').append("Sect GasMilage : " + sect_gasmilage + "<br>" );
        }
        
        this.fueltripWS.OnERRPacketReceived = (msg : string) =>
        {
            $('#div_err_data').append(msg + "<br>");
        };
        this.fueltripWS.OnRESPacketReceived = (msg : string) =>
        {
            $('#div_res_data').append(msg + "<br>");
        };
        this.fueltripWS.OnWebsocketError = (msg : string) =>
        {
            $('#div_ws_message').append(msg + "<br>");
        };
        this.fueltripWS.OnWebsocketOpen = () =>
        {
            $('#div_ws_message').append('* Connection open<br/>');

            $('#sendmessagecontent_box').removeAttr("disabled");
            $('#sendButton').removeAttr("disabled");
            $('#connectButton').attr("disabled", "disabled");
            $('#disconnectButton').removeAttr("disabled");  
        };
        this.fueltripWS.OnWebsocketClose = () =>
        {
            $('#div_ws_message').append('* Connection closed<br/>');

            $('#sendmessagecontent_box').attr("disabled", "disabled");
            $('#sendButton').attr("disabled", "disabled");
            $('#connectButton').removeAttr("disabled");
            $('#disconnectButton').attr("disabled", "disabled");
        };
    }

    private static connectWebSocket()
    {
        this.fueltripWS.URL = $("#serverURL_box").val();
        this.fueltripWS.Connect();
    };

    private static disconnectWebSocket()
    {
        this.fueltripWS.Close();
    };

    private static input_SECT_SPAN()
    {
        this.fueltripWS.SendSectSpan($('#span_SECT_SPAN').val());
    };

    private static input_SECT_STOREMAX()
    {
        this.fueltripWS.SendSectStoreMax($('#storemax_SECT_STOREMAX').val());
    };
}




