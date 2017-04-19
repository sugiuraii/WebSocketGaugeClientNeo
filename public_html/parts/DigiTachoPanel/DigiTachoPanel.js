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
/// <reference path="../../script/lib/pixi.js.d.ts" />
/// <reference path="../../script/progressBar/pixiGauge.ts" />
/// <reference path="../../node_modules/@types/webfontloader/index.d.ts" />
var webSocketGauge;
(function (webSocketGauge) {
    var parts;
    (function (parts) {
        var RectangularProgressBar = webSocketGauge.lib.graphics.RectangularProgressBar;
        var DigiTachoPanel = (function (_super) {
            __extends(DigiTachoPanel, _super);
            function DigiTachoPanel() {
                var _this = _super.call(this) || this;
                _this.speed = 0;
                _this.tacho = 0;
                _this.gearPos = "N";
                _this.speedLabelTextStyle = new PIXI.TextStyle({
                    dropShadow: true,
                    dropShadowBlur: 10,
                    dropShadowColor: "white",
                    dropShadowDistance: 0,
                    fill: "white",
                    fontFamily: "FreeSans-Bold",
                    fontSize: 155,
                    align: "right",
                    letterSpacing: -3
                });
                _this.gearPosLabelTextStyle = new PIXI.TextStyle({
                    dropShadow: true,
                    dropShadowBlur: 10,
                    dropShadowColor: "white",
                    dropShadowDistance: 0,
                    fill: "white",
                    fontFamily: "AudioWide",
                    fontSize: 100,
                    align: "center"
                });
                _this.create();
                return _this;
            }
            Object.defineProperty(DigiTachoPanel, "RequestedTexturePath", {
                get: function () {
                    return ["/parts/DigiTachoPanel/DigiTachoTexture.json"];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DigiTachoPanel, "RequestedFontFamily", {
                get: function () {
                    return ["FreeSans-Bold", "AudioWide"];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DigiTachoPanel, "RequestedFontCSSURL", {
                get: function () {
                    return ['/parts/fonts/font.css'];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DigiTachoPanel.prototype, "Speed", {
                get: function () { return this.speed; },
                set: function (speed) {
                    this.speed = speed;
                    var roundedSpeed = Math.round(speed);
                    this.speedLabel.text = roundedSpeed.toString();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DigiTachoPanel.prototype, "Tacho", {
                get: function () { return this.tacho; },
                set: function (tacho) {
                    this.tacho = tacho;
                    this.tachoProgressBar.Value = tacho;
                    this.tachoProgressBar.update();
                },
                enumerable: true,
                configurable: true
            });
            DigiTachoPanel.prototype.create = function () {
                var backTexture = PIXI.Texture.fromFrame("DigiTachoBack");
                var tachoProgressBarTexture = PIXI.Texture.fromFrame("DigiTachoBar");
                //Create background sprite
                var backSprite = new PIXI.Sprite();
                backSprite.texture = backTexture;
                _super.prototype.addChild.call(this, backSprite);
                //Create tacho progress bar
                var tachoProgressBar = new RectangularProgressBar();
                this.tachoProgressBar = tachoProgressBar;
                tachoProgressBar.Texture = tachoProgressBarTexture;
                tachoProgressBar.position.set(10, 6);
                tachoProgressBar.Min = 0;
                tachoProgressBar.Max = 9000;
                tachoProgressBar.Vertical = false;
                tachoProgressBar.InvertDirection = false;
                tachoProgressBar.InvertDraw = false;
                tachoProgressBar.PixelStep = 16;
                tachoProgressBar.MaskHeight = 246;
                tachoProgressBar.MaskWidth = 577;
                _super.prototype.addChild.call(this, tachoProgressBar);
                var speedTextLabel = new PIXI.Text(this.speed.toString());
                this.speedLabel = speedTextLabel;
                speedTextLabel.style = this.speedLabelTextStyle;
                speedTextLabel.position.set(485, 320);
                speedTextLabel.anchor.set(1, 1);
                _super.prototype.addChild.call(this, speedTextLabel);
                var gearTextLabel = new PIXI.Text(this.gearPos);
                this.geasposLabel = gearTextLabel;
                gearTextLabel.style = this.gearPosLabelTextStyle;
                gearTextLabel.position.set(64, 55);
                gearTextLabel.anchor.set(0.5, 0.5);
                _super.prototype.addChild.call(this, gearTextLabel);
            };
            return DigiTachoPanel;
        }(PIXI.Container));
        parts.DigiTachoPanel = DigiTachoPanel;
    })(parts = webSocketGauge.parts || (webSocketGauge.parts = {}));
})(webSocketGauge || (webSocketGauge = {}));
//# sourceMappingURL=DigiTachoPanel.js.map