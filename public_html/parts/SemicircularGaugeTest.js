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
    WebFont.load({
        custom: {
            families: webSocketGauge.parts.ThrottleGaugePanel.RequestedFontFamily,
            urls: webSocketGauge.parts.ThrottleGaugePanel.RequestedFontCSSURL
        },
        active: function () { webSocketGauge.test.SemiCircularGaugeTest.preloadTexture(); }
    });
};
var webSocketGauge;
(function (webSocketGauge) {
    var test;
    (function (test) {
        var SemiCircularGaugeTest;
        (function (SemiCircularGaugeTest) {
            function preloadTexture() {
                PIXI.loader.add(webSocketGauge.parts.ThrottleGaugePanel.RequestedTexturePath);
                ;
                PIXI.loader.load(main);
            }
            SemiCircularGaugeTest.preloadTexture = preloadTexture;
            function main() {
                var app = new PIXI.Application(1366, 1366);
                document.body.appendChild(app.view);
                var gaugeArray = new Array();
                var index = 0;
                for (var j = 0; j < 6; j++) {
                    for (var i = 0; i < 6; i++) {
                        gaugeArray.push(new webSocketGauge.parts.ThrottleGaugePanel);
                        gaugeArray[index].pivot = new PIXI.Point(200, 200);
                        gaugeArray[index].scale.set(0.6, 0.6);
                        gaugeArray[index].position = new PIXI.Point(240 * i + 150, 200 * j + 150);
                        gaugeArray[index].Value = 0;
                        app.stage.addChild(gaugeArray[index]);
                        index++;
                    }
                }
                app.ticker.add(function () {
                    for (var i = 0; i < gaugeArray.length; i++) {
                        if (gaugeArray[i].Value + 1 >= 100)
                            gaugeArray[i].Value = 0;
                        else
                            gaugeArray[i].Value += 1;
                    }
                });
            }
        })(SemiCircularGaugeTest = test.SemiCircularGaugeTest || (test.SemiCircularGaugeTest = {}));
    })(test = webSocketGauge.test || (webSocketGauge.test = {}));
})(webSocketGauge || (webSocketGauge = {}));
//# sourceMappingURL=SemicircularGaugeTest.js.map