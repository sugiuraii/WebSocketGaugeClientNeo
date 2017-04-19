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
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var webSocketGauge;
(function (webSocketGauge) {
    var parts;
    (function (parts) {
        var RectangularProgressBar = webSocketGauge.lib.graphics.RectangularProgressBar;
        var MilageGraphPanel = (function (_super) {
            __extends(MilageGraphPanel, _super);
            function MilageGraphPanel() {
                var _this = _super.call(this) || this;
                _this.momentGasMilageBar = new RectangularProgressBar();
                _this.sectGasMilageBar = {};
                _this.tripLabel = new PIXI.Text();
                _this.fuelLabel = new PIXI.Text();
                _this.gasMilageLabel = new PIXI.Text();
                _this.momentGasMilage = 0;
                _this.trip = 0;
                _this.fuel = 0;
                _this.gasMilage = 0;
                _this.sectGasMilage = {};
                _this.sectSpan = ["5min", "10min", "15min", "20min", "25min", "30min"];
                _this.masterTextStyle = new PIXI.TextStyle({
                    dropShadow: true,
                    dropShadowBlur: 10,
                    dropShadowColor: "white",
                    dropShadowDistance: 0,
                    fill: "white",
                    fontFamily: "FreeSans-Bold",
                    align: "right",
                    letterSpacing: -3
                });
                //Initialize array fields
                for (var span in _this.sectSpan) {
                    _this.sectGasMilageBar[span] = new RectangularProgressBar();
                    _this.sectGasMilage[span] = 0;
                }
                _this.create();
                return _this;
            }
            Object.defineProperty(MilageGraphPanel, "RequestedTexturePath", {
                get: function () {
                    return ["/parts/GasMilageGraph/MilageGraphTexture.json"];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MilageGraphPanel, "RequestedFontFamily", {
                get: function () {
                    return ["FreeSans-Bold"];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MilageGraphPanel, "RequestedFontCSSURL", {
                get: function () {
                    return ['/parts/fonts/font.css'];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MilageGraphPanel.prototype, "MomentGasMilage", {
                get: function () { return this.momentGasMilage; },
                set: function (val) {
                    this.momentGasMilage = val;
                    this.momentGasMilageBar.Value = val;
                    this.momentGasMilageBar.update();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MilageGraphPanel.prototype, "Fuel", {
                get: function () { return this.fuel; },
                set: function (val) {
                    this.fuel = val;
                    this.fuelLabel.text = this.fuel.toFixed(2);
                },
                enumerable: true,
                configurable: true
            });
            ;
            Object.defineProperty(MilageGraphPanel.prototype, "Trip", {
                get: function () { return this.trip; },
                set: function (val) {
                    this.trip = val;
                    this.tripLabel.text = this.trip.toFixed(1);
                },
                enumerable: true,
                configurable: true
            });
            ;
            Object.defineProperty(MilageGraphPanel.prototype, "GasMilage", {
                get: function () { return this.gasMilage; },
                set: function (val) {
                    this.gasMilage = val;
                    this.gasMilageLabel.text = this.gasMilage.toFixed(1);
                },
                enumerable: true,
                configurable: true
            });
            MilageGraphPanel.prototype.setSectGasMllage = function (sectspan, gasMilage) {
                this.sectGasMilage[sectspan] = gasMilage;
                this.sectGasMilageBar[sectspan].Value = this.sectGasMilage[sectspan];
                this.sectGasMilageBar[sectspan].update();
            };
            MilageGraphPanel.prototype.getSectGasMllage = function (sectspan) {
                return this.sectGasMilage[sectspan];
            };
            MilageGraphPanel.prototype.create = function () {
                var backTexture = PIXI.Texture.fromFrame("MilageGraph_Back");
                var backSprite = new PIXI.Sprite(backTexture);
                _super.prototype.addChild.call(this, backSprite);
                var momentGasMilageTexture = PIXI.Texture.fromFrame("MilageGraph_valueBar2");
                this.momentGasMilageBar.Texture = momentGasMilageTexture;
                this.momentGasMilageBar.Vertical = true;
                this.momentGasMilageBar.MaskWidth = 40;
                this.momentGasMilageBar.MaskHeight = 240;
                this.momentGasMilageBar.Max = 20;
                this.momentGasMilageBar.Min = 0;
                this.momentGasMilageBar.position.set(411, 17);
                _super.prototype.addChild.call(this, this.momentGasMilageBar);
                //Sect fuelTrip progressbar
                var sectGasMilageBarTexture = PIXI.Texture.fromFrame("MilageGraph_valueBar1");
                for (var i = 0; i < this.sectSpan.length; i++) {
                    var spankey = this.sectSpan[i];
                    this.sectGasMilageBar[spankey] = new RectangularProgressBar();
                    this.sectGasMilageBar[spankey].Texture = sectGasMilageBarTexture;
                    this.sectGasMilageBar[spankey].Vertical = true;
                    this.sectGasMilageBar[spankey].MaskWidth = 30;
                    this.sectGasMilageBar[spankey].MaskHeight = 240;
                    this.sectGasMilageBar[spankey].Max = 20;
                    this.sectGasMilageBar[spankey].Min = 0;
                    _super.prototype.addChild.call(this, this.sectGasMilageBar[spankey]);
                }
                this.sectGasMilageBar["30min"].position.set(72, 17);
                this.sectGasMilageBar["25min"].position.set(130, 17);
                this.sectGasMilageBar["20min"].position.set(187, 17);
                this.sectGasMilageBar["15min"].position.set(245, 17);
                this.sectGasMilageBar["10min"].position.set(303, 17);
                this.sectGasMilageBar["5min"].position.set(360, 17);
                this.tripLabel.style = this.masterTextStyle.clone();
                this.tripLabel.style.fontSize = 35;
                this.tripLabel.anchor.set(1, 1);
                this.tripLabel.position.set(600, 110);
                _super.prototype.addChild.call(this, this.tripLabel);
                this.fuelLabel.style = this.masterTextStyle.clone();
                this.fuelLabel.style.fontSize = 35;
                this.fuelLabel.anchor.set(1, 1);
                this.fuelLabel.position.set(600, 165);
                _super.prototype.addChild.call(this, this.fuelLabel);
                this.gasMilageLabel.style = this.masterTextStyle.clone();
                this.gasMilageLabel.style.fontSize = 58;
                this.gasMilageLabel.anchor.set(1, 1);
                this.gasMilageLabel.position.set(625, 260);
                _super.prototype.addChild.call(this, this.gasMilageLabel);
            };
            return MilageGraphPanel;
        }(PIXI.Container));
        parts.MilageGraphPanel = MilageGraphPanel;
    })(parts = webSocketGauge.parts || (webSocketGauge.parts = {}));
})(webSocketGauge || (webSocketGauge = {}));
//# sourceMappingURL=MilageGraph.js.map