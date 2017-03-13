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
var ELM327COMWebsocket = webSocketGauge.lib.communication.ELM327COMWebsocket;
var OBDIIParameterCode = webSocketGauge.lib.communication.OBDIIParameterCode;
window.onload = function () {
    ELM327COMWSTest.main();
};
var ELM327COMWSTest = (function () {
    function ELM327COMWSTest() {
    }
    ELM327COMWSTest.main = function () {
        this.elm327WS = new ELM327COMWebsocket();
        $('#serverURL_box').val("ws://localhost:2013/");
        this.setParameterCodeSelectBox();
        this.registerWSEvents();
    };
    ELM327COMWSTest.setParameterCodeSelectBox = function () {
        for (var code in OBDIIParameterCode)
            $('#ssmcomcode_select').append($('<option>').html(code).val(code));
    };
    ELM327COMWSTest.registerWSEvents = function () {
        this.elm327WS.OnVALPacketReceived = function (intervalTime, val) {
            $('#interval').text(intervalTime.toFixed(2));
            //clear
            $('#div_val_data').html("");
            for (var key in val) {
                $('#div_val_data').append(key + " : " + val[key] + "<br>");
            }
        };
        this.elm327WS.OnERRPacketReceived = function (msg) {
            $('#div_err_data').append(msg + "<br>");
        };
        this.elm327WS.OnRESPacketReceived = function (msg) {
            $('#div_res_data').append(msg + "<br>");
        };
        this.elm327WS.OnWebsocketError = function (msg) {
            $('#div_ws_message').append(msg + "<br>");
        };
        this.elm327WS.OnWebsocketOpen = function () {
            $('#div_ws_message').append('* Connection open<br/>');
            $('#sendmessagecontent_box').removeAttr("disabled");
            $('#sendButton').removeAttr("disabled");
            $('#connectButton').attr("disabled", "disabled");
            $('#disconnectButton').removeAttr("disabled");
        };
        this.elm327WS.OnWebsocketClose = function () {
            $('#div_ws_message').append('* Connection closed<br/>');
            $('#sendmessagecontent_box').attr("disabled", "disabled");
            $('#sendButton').attr("disabled", "disabled");
            $('#connectButton').removeAttr("disabled");
            $('#disconnectButton').attr("disabled", "disabled");
        };
    };
    ELM327COMWSTest.connectWebSocket = function () {
        this.elm327WS.URL = $("#serverURL_box").val();
        this.elm327WS.Connect();
    };
    ;
    ELM327COMWSTest.disconnectWebSocket = function () {
        this.elm327WS.Close();
    };
    ;
    ELM327COMWSTest.input_SSM_COM_READ = function () {
        this.elm327WS.SendCOMRead($('#ssmcomcode_select').val(), $('#ssmcode_readmode').val(), $('#ssmcode_flag').val());
    };
    ;
    ELM327COMWSTest.input_SSMCOM_SLOWREAD_INTERVAL = function () {
        this.elm327WS.SendSlowreadInterval(($('#interval_SSMCOM_SLOWREAD_INTERVAL').val()));
    };
    ;
    return ELM327COMWSTest;
}());
//# sourceMappingURL=ELM327COMWSTest.js.map