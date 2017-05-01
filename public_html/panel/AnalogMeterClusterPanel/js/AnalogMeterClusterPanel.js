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
/// <reference path="../../../parts/AnalogMeterCluster/AnalogMeterCluster.ts" />
window.onload = function () {
    webSocketGauge.panel.AnalogMeterClusterPanel.preloadFont();
};
var webSocketGauge;
(function (webSocketGauge) {
    var panel;
    (function (panel) {
        var AnalogMeterClusterPanel;
        (function (AnalogMeterClusterPanel) {
            var AnalogMeterCluster = webSocketGauge.parts.AnalogMeterCluster.AnalogMeterCluster;
            function preloadFont() {
                WebFont.load({
                    custom: {
                        families: AnalogMeterCluster.RequestedFontFamily,
                        urls: AnalogMeterCluster.RequestedFontCSSURL
                    },
                    active: function () { preloadTexture(); }
                });
            }
            AnalogMeterClusterPanel.preloadFont = preloadFont;
            function preloadTexture() {
                PIXI.loader.add(AnalogMeterCluster.RequestedTexturePath[0]);
                PIXI.loader.load(main);
            }
            AnalogMeterClusterPanel.preloadTexture = preloadTexture;
            function main() {
                var app = new PIXI.Application(1366, 1366);
                document.body.appendChild(app.view);
                var meterCluster = new AnalogMeterCluster();
                app.stage.addChild(meterCluster);
                app.ticker.add(function () {
                    meterCluster.Speed += 1;
                    if (meterCluster.Speed > 280)
                        meterCluster.Speed = 0;
                });
            }
        })(AnalogMeterClusterPanel = panel.AnalogMeterClusterPanel || (panel.AnalogMeterClusterPanel = {}));
    })(panel = webSocketGauge.panel || (webSocketGauge.panel = {}));
})(webSocketGauge || (webSocketGauge = {}));
//# sourceMappingURL=AnalogMeterClusterPanel.js.map