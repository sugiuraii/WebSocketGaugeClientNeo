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
var SSMWebsocket = webSocketGauge.lib.communication.SSMWebsocket;
var SSMParameterCode = webSocketGauge.lib.communication.SSMParameterCode;
window.onload = function () {
    SSMCOMWSTest.main();
};
var SSMCOMWSTest = (function () {
    function SSMCOMWSTest() {
    }
    SSMCOMWSTest.main = function () {
        this.ssmWS = new SSMWebsocket();
        $('#serverURL_box').val("ws://localhost:2013/");
        this.setParameterCodeSelectBox();
        this.registerWSEvents();
    };
    SSMCOMWSTest.setParameterCodeSelectBox = function () {
        for (var code in SSMParameterCode)
            $('#ssmcomcode_select').append($('<option>').html(code).val(code));
    };
    SSMCOMWSTest.registerWSEvents = function () {
        this.ssmWS.OnVALPacketReceived = function (intervalTime, val) {
            $('#interval').text(intervalTime.toFixed(2));
            //clear
            $('#div_val_data').html("");
            for (var key in val) {
                $('#div_val_data').append(key + " : " + val[key] + "<br>");
            }
        };
        this.ssmWS.OnERRPacketReceived = function (msg) {
            $('#div_err_data').append(msg + "<br>");
        };
        this.ssmWS.OnRESPacketReceived = function (msg) {
            $('#div_res_data').append(msg + "<br>");
        };
        this.ssmWS.OnWebsocketError = function (msg) {
            $('#div_ws_message').append(msg + "<br>");
        };
        this.ssmWS.OnWebsocketOpen = function () {
            $('#div_ws_message').append('* Connection open<br/>');
            $('#sendmessagecontent_box').removeAttr("disabled");
            $('#sendButton').removeAttr("disabled");
            $('#connectButton').attr("disabled", "disabled");
            $('#disconnectButton').removeAttr("disabled");
        };
        this.ssmWS.OnWebsocketClose = function () {
            $('#div_ws_message').append('* Connection closed<br/>');
            $('#sendmessagecontent_box').attr("disabled", "disabled");
            $('#sendButton').attr("disabled", "disabled");
            $('#connectButton').removeAttr("disabled");
            $('#disconnectButton').attr("disabled", "disabled");
        };
    };
    SSMCOMWSTest.connectWebSocket = function () {
        this.ssmWS.URL = $("#serverURL_box").val();
        this.ssmWS.Connect();
    };
    ;
    SSMCOMWSTest.disconnectWebSocket = function () {
        this.ssmWS.Close();
    };
    ;
    SSMCOMWSTest.input_SSM_COM_READ = function () {
        this.ssmWS.SendCOMRead($('#ssmcomcode_select').val(), $('#ssmcode_readmode').val(), $('#ssmcode_flag').val());
    };
    ;
    SSMCOMWSTest.input_SSMCOM_SLOWREAD_INTERVAL = function () {
        this.ssmWS.SendSlowreadInterval(($('#interval_SSMCOM_SLOWREAD_INTERVAL').val()));
    };
    ;
    return SSMCOMWSTest;
}());
//# sourceMappingURL=SSMCOMWSTest.js.map