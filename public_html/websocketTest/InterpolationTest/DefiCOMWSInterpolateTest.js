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
/// <reference path="../../script/websocket/websocketClient.ts" />
/// <reference path="../../node_modules/@types/jquery/index.d.ts" />
var DefiCOMWebsocket = webSocketGauge.lib.communication.DefiCOMWebsocket;
var DefiParameterCode = webSocketGauge.lib.communication.DefiParameterCode;
window.onload = function () {
    DefiCOMWSTest.main();
};
var DefiCOMWSTest = (function () {
    function DefiCOMWSTest() {
    }
    DefiCOMWSTest.main = function () {
        this.defiWS = new DefiCOMWebsocket();
        $('#serverURL_box').val("ws://localhost:2012/");
        this.setParameterCodeSelectBox();
        this.registerWSEvents();
        window.requestAnimationFrame(DefiCOMWSTest.showInterpolateVal);
    };
    DefiCOMWSTest.setParameterCodeSelectBox = function () {
        for (var code in DefiParameterCode)
            $('#deficode_select').append($('<option>').html(code).val(code));
    };
    DefiCOMWSTest.showInterpolateVal = function (timestamp) {
        $('#div_interpolated_val').html("");
        for (var key in DefiParameterCode) {
            var val = DefiCOMWSTest.defiWS.getVal(key, timestamp);
            if (typeof (val) !== "undefined")
                $('#div_interpolated_val').append(key + " : " + val + "<br>");
        }
        window.requestAnimationFrame(DefiCOMWSTest.showInterpolateVal);
    };
    DefiCOMWSTest.registerWSEvents = function () {
        this.defiWS.OnVALPacketReceived = function (intervalTime, val) {
            $('#interval').text(intervalTime.toFixed(2));
            //clear
            $('#div_val_data').html("");
            for (var key in val) {
                $('#div_val_data').append(key + " : " + val[key] + "<br>");
            }
        };
        this.defiWS.OnERRPacketReceived = function (msg) {
            $('#div_err_data').append(msg + "<br>");
        };
        this.defiWS.OnRESPacketReceived = function (msg) {
            $('#div_res_data').append(msg + "<br>");
        };
        this.defiWS.OnWebsocketError = function (msg) {
            $('#div_ws_message').append(msg + "<br>");
        };
        this.defiWS.OnWebsocketOpen = function () {
            $('#div_ws_message').append('* Connection open<br/>');
            $('#sendmessagecontent_box').removeAttr("disabled");
            $('#sendButton').removeAttr("disabled");
            $('#connectButton').attr("disabled", "disabled");
            $('#disconnectButton').removeAttr("disabled");
        };
        this.defiWS.OnWebsocketClose = function () {
            $('#div_ws_message').append('* Connection closed<br/>');
            $('#sendmessagecontent_box').attr("disabled", "disabled");
            $('#sendButton').attr("disabled", "disabled");
            $('#connectButton').removeAttr("disabled");
            $('#disconnectButton').attr("disabled", "disabled");
        };
    };
    DefiCOMWSTest.connectWebSocket = function () {
        this.defiWS.URL = $("#serverURL_box").val();
        this.defiWS.Connect();
    };
    ;
    DefiCOMWSTest.disconnectWebSocket = function () {
        this.defiWS.Close();
    };
    ;
    DefiCOMWSTest.input_DEFI_WS_SEND = function () {
        var key = $('#deficode_select').val();
        this.defiWS.SendWSSend(key, $('#deficode_flag').val());
        this.defiWS.EnableInterpolate(key);
    };
    ;
    DefiCOMWSTest.input_DEFI_WS_INTERVAL = function () {
        this.defiWS.SendWSInterval($('#interval_DEFI_WS_INTERVAL').val());
    };
    ;
    return DefiCOMWSTest;
}());
//# sourceMappingURL=DefiCOMWSInterpolateTest.js.map