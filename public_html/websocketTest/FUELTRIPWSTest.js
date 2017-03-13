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
var FUELTRIPWebsocket = webSocketGauge.lib.communication.FUELTRIPWebsocket;
window.onload = function () {
    FUELTRIPWSTest.main();
};
var FUELTRIPWSTest = (function () {
    function FUELTRIPWSTest() {
    }
    FUELTRIPWSTest.main = function () {
        this.fueltripWS = new FUELTRIPWebsocket();
        $('#serverURL_box').val("ws://localhost:2014/");
        this.registerWSEvents();
    };
    FUELTRIPWSTest.registerWSEvents = function () {
        this.fueltripWS.OnMomentFUELTRIPPacketReceived = function (moment_gasmilage, total_gas, total_trip, total_gasmilage) {
            //clear
            $('#div_moment_fueltrip_data').html("");
            $('#div_moment_fueltrip_data').append("Moment GasMilage : " + moment_gasmilage + "<br>");
            $('#div_moment_fueltrip_data').append("Total Gas : " + total_gas + "<br>");
            $('#div_moment_fueltrip_data').append("Total Trip : " + total_trip + "<br>");
            $('#div_moment_fueltrip_data').append("Total GasMilage : " + total_gasmilage + "<br>");
        };
        this.fueltripWS.OnSectFUELTRIPPacketReceived = function (sect_span, sect_trip, sect_gas, sect_gasmilage) {
            //clear
            $('#div_sect_fueltrip_data').html("");
            $('#div_sect_fueltrip_data').append("Sect Span : " + sect_span + "<br>");
            $('#div_sect_fueltrip_data').append("Sect Trip : " + sect_trip + "<br>");
            $('#div_sect_fueltrip_data').append("Sect Gas : " + sect_gas + "<br>");
            $('#div_sect_fueltrip_data').append("Sect GasMilage : " + sect_gasmilage + "<br>");
        };
        this.fueltripWS.OnERRPacketReceived = function (msg) {
            $('#div_err_data').append(msg + "<br>");
        };
        this.fueltripWS.OnRESPacketReceived = function (msg) {
            $('#div_res_data').append(msg + "<br>");
        };
        this.fueltripWS.OnWebsocketError = function (msg) {
            $('#div_ws_message').append(msg + "<br>");
        };
        this.fueltripWS.OnWebsocketOpen = function () {
            $('#div_ws_message').append('* Connection open<br/>');
            $('#sendmessagecontent_box').removeAttr("disabled");
            $('#sendButton').removeAttr("disabled");
            $('#connectButton').attr("disabled", "disabled");
            $('#disconnectButton').removeAttr("disabled");
        };
        this.fueltripWS.OnWebsocketClose = function () {
            $('#div_ws_message').append('* Connection closed<br/>');
            $('#sendmessagecontent_box').attr("disabled", "disabled");
            $('#sendButton').attr("disabled", "disabled");
            $('#connectButton').removeAttr("disabled");
            $('#disconnectButton').attr("disabled", "disabled");
        };
    };
    FUELTRIPWSTest.connectWebSocket = function () {
        this.fueltripWS.URL = $("#serverURL_box").val();
        this.fueltripWS.Connect();
    };
    ;
    FUELTRIPWSTest.disconnectWebSocket = function () {
        this.fueltripWS.Close();
    };
    ;
    FUELTRIPWSTest.input_SECT_SPAN = function () {
        this.fueltripWS.SendSectSpan($('#span_SECT_SPAN').val());
    };
    ;
    FUELTRIPWSTest.input_SECT_STOREMAX = function () {
        this.fueltripWS.SendSectStoreMax($('#storemax_SECT_STOREMAX').val());
    };
    ;
    return FUELTRIPWSTest;
}());
//# sourceMappingURL=FUELTRIPWSTest.js.map