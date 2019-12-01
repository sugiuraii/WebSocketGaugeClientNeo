/* 
 * The MIT License
 *
 * Copyright 2017 kuniaki.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
/// <reference path="../lib/webpackRequire.ts" />

import {DefiCOMWebsocket} from '../lib/WebSocket/WebSocketCommunication';
import {DefiParameterCode} from '../lib/WebSocket/WebSocketCommunication';
import {DefiArduinoCOMWSTestBase} from './base/DefiArduinoWSTestBase';

import * as $ from "jquery";
require('./DefiCOMWSInterpolateTest.html');

window.onload = () => {
    let wsTest = new DefiCOMWSTestInterpolate();
    wsTest.main();
}

class DefiCOMWSTestInterpolate extends DefiArduinoCOMWSTestBase{
    
    constructor()
    {
        const webSocket = new DefiCOMWebsocket();
        super(webSocket);
        this.defaultPortNo = 2012;
    }

    public main(): void {
        super.main();
        window.requestAnimationFrame((timestamp: number) => this.showInterpolateVal(timestamp));
    }

    protected setParameterCodeSelectBox() {
        for (let code in DefiParameterCode)
            $('#codeSelect').append($('<option>').html(code).val(code));
    }

    public showInterpolateVal(timestamp: number) {
        $('#divInterpolatedVAL').html("");
        for (let key in DefiParameterCode) {
            const val: number = this.WebSocket.getVal(key, timestamp);
            if (typeof (val) !== "undefined")
                $('#divInterpolatedVAL').append(key + " : " + val + "<br>");
        }
        window.requestAnimationFrame((timestamp: number) => this.showInterpolateVal(timestamp));
    }
} 
