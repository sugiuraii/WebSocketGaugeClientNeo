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
/// <reference path="./FullCircularGauge.ts" />
window.onload = function () {
    webSocketGauge.parts.FullCircularGauge.preloadTextures();
    WebFont.load({
        custom: {
            families: ['FreeSans-Bold'],
            urls: ['./font.css']
        },
        active: function () { PIXI.loader.load(main); }
    });
};
function main() {
    var app = new PIXI.Application(1366, 768);
    document.body.appendChild(app.view);
    var gaugeArray = new Array();
    var index = 0;
    for (var j = 0; j < 3; j++) {
        for (var i = 0; i < 3; i++) {
            gaugeArray.push(new webSocketGauge.parts.FullCircularGauge());
            gaugeArray[index].create();
            gaugeArray[index].mainContainer.pivot = new PIXI.Point(200, 200);
            gaugeArray[index].mainContainer.scale.set(0.6, 0.6);
            gaugeArray[index].mainContainer.position = new PIXI.Point(250 * i + 150, 250 * j + 150);
            app.stage.addChild(gaugeArray[index].mainContainer);
            index++;
        }
    }
    app.ticker.add(function () {
        for (var i = 0; i < gaugeArray.length; i++) {
            if (gaugeArray[i].getVal() + 0.01 >= 2.0)
                gaugeArray[i].setVal(-1.0);
            else
                gaugeArray[i].setVal(gaugeArray[i].getVal() + 0.1);
        }
    });
}
//# sourceMappingURL=FullCircularGaugeTest.js.map