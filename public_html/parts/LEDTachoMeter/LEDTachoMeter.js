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
        var CircularProgressBar = webSocketGauge.lib.graphics.CircularProgressBar;
        var LEDTachoMeter = (function (_super) {
            __extends(LEDTachoMeter, _super);
            function LEDTachoMeter() {
                var _this = _super.call(this) || this;
                _this.tachoProgressBar = new CircularProgressBar();
                _this.speedLabel = new PIXI.Text();
                _this.gasMilageLabel = new PIXI.Text();
                _this.tripLabel = new PIXI.Text();
                _this.fuelLabel = new PIXI.Text();
                _this.gearPosLabel = new PIXI.Text();
                _this.tacho = 0;
                _this.speed = 0;
                _this.gasMilage = 0;
                _this.trip = 0;
                _this.fuel = 0;
                _this.gearPos = "";
                _this.masterTextStyle = new PIXI.TextStyle({
                    dropShadow: true,
                    dropShadowBlur: 15,
                    dropShadowColor: "white",
                    dropShadowDistance: 0,
                    align: "right",
                    fill: "white",
                    fontFamily: "DSEG14ClassicItalic"
                });
                var tachoMax = 9000;
                var tachoMin = 0;
                var tachoValDefault = 4500;
                var speedValDefault = 95;
                var gasMilageValDefault = 12.0;
                var tripValDefault = 230.0;
                var fuelValDefault = 30.00;
                var backSprite = PIXI.Sprite.fromFrame("LEDTachoMeter_Base");
                _super.prototype.addChild.call(_this, backSprite);
                var tachoProgressBar = _this.tachoProgressBar;
                tachoProgressBar.Texture = PIXI.Texture.fromFrame("LEDTachoMeter_LED_Yellow");
                tachoProgressBar.Center.set(300, 300);
                tachoProgressBar.pivot.set(300, 300);
                tachoProgressBar.position.set(300, 300);
                tachoProgressBar.Radius = 300;
                tachoProgressBar.InnerRadius = 200;
                tachoProgressBar.Max = tachoMax;
                tachoProgressBar.Min = tachoMin;
                tachoProgressBar.Value = tachoValDefault;
                tachoProgressBar.OffsetAngle = 90;
                tachoProgressBar.FullAngle = 270;
                tachoProgressBar.AngleStep = 6;
                tachoProgressBar.updateForce();
                _super.prototype.addChild.call(_this, tachoProgressBar);
                var speedLabel = _this.speedLabel;
                speedLabel.style = _this.masterTextStyle.clone();
                speedLabel.style.fontSize = 88;
                speedLabel.anchor.set(1, 0.5);
                speedLabel.text = speedValDefault.toFixed(0);
                speedLabel.position.set(410, 230);
                _super.prototype.addChild.call(_this, speedLabel);
                var gasMilageLabel = _this.gasMilageLabel;
                gasMilageLabel.style = _this.masterTextStyle.clone();
                gasMilageLabel.style.fontSize = 45;
                gasMilageLabel.anchor.set(1, 0.5);
                gasMilageLabel.text = gasMilageValDefault.toFixed(2);
                gasMilageLabel.position.set(310, 360);
                _super.prototype.addChild.call(_this, gasMilageLabel);
                var tripLabel = _this.tripLabel;
                tripLabel.style = _this.masterTextStyle.clone();
                tripLabel.style.fontSize = 30;
                tripLabel.anchor.set(1, 0.5);
                tripLabel.text = tripValDefault.toFixed(1);
                tripLabel.position.set(510, 355);
                _super.prototype.addChild.call(_this, tripLabel);
                var fuelLabel = _this.fuelLabel;
                fuelLabel.style = _this.masterTextStyle.clone();
                fuelLabel.style.fontSize = 30;
                fuelLabel.anchor.set(1, 0.5);
                fuelLabel.text = fuelValDefault.toFixed(2);
                fuelLabel.position.set(510, 395);
                _super.prototype.addChild.call(_this, fuelLabel);
                var gearPosLabel = _this.gearPosLabel;
                gearPosLabel.style = _this.masterTextStyle.clone();
                gearPosLabel.style.fontSize = 100;
                gearPosLabel.anchor.set(1, 0.5);
                gearPosLabel.text = "N";
                gearPosLabel.position.set(410, 495);
                _super.prototype.addChild.call(_this, gearPosLabel);
                return _this;
            }
            Object.defineProperty(LEDTachoMeter, "RequestedTexturePath", {
                get: function () {
                    return ["/parts/LEDTachoMeter/LEDTachoMeterTexture.json"];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LEDTachoMeter, "RequestedFontFamily", {
                get: function () {
                    return ["DSEG14ClassicItalic"];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LEDTachoMeter, "RequestedFontCSSURL", {
                get: function () {
                    return ['/parts/fonts/font.css'];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LEDTachoMeter.prototype, "Tacho", {
                get: function () { return this.tacho; },
                set: function (val) {
                    this.tacho = val;
                    this.tachoProgressBar.Value = val;
                    this.changeRedZoneProgressBarColor();
                    this.tachoProgressBar.update();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LEDTachoMeter.prototype, "Speed", {
                get: function () { return this.speed; },
                set: function (val) {
                    this.speed = val;
                    this.speedLabel.text = val.toFixed(0);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LEDTachoMeter.prototype, "GasMilage", {
                get: function () { return this.gasMilage; },
                set: function (val) {
                    this.gasMilage = val;
                    this.gasMilageLabel.text = val.toFixed(2);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LEDTachoMeter.prototype, "Trip", {
                get: function () { return this.trip; },
                set: function (val) {
                    this.trip = val;
                    this.tripLabel.text = val.toFixed(1);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LEDTachoMeter.prototype, "Fuel", {
                get: function () { return this.fuel; },
                set: function (val) {
                    this.fuel = val;
                    this.fuelLabel.text = val.toFixed(2);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LEDTachoMeter.prototype, "GearPos", {
                get: function () { return this.gearPos; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LEDTachoMeter.prototype, "GeasPos", {
                set: function (val) {
                    this.gearPos = val;
                    this.gearPosLabel.text = val;
                },
                enumerable: true,
                configurable: true
            });
            LEDTachoMeter.prototype.changeRedZoneProgressBarColor = function () {
                var redZoneTacho = 8000;
                if (this.tacho > redZoneTacho) {
                    var redfilter = new PIXI.filters.ColorMatrixFilter();
                    redfilter.hue(300);
                    this.tachoProgressBar.filters = [redfilter];
                }
                else
                    this.tachoProgressBar.filters = [];
            };
            return LEDTachoMeter;
        }(PIXI.Container));
        parts.LEDTachoMeter = LEDTachoMeter;
    })(parts = webSocketGauge.parts || (webSocketGauge.parts = {}));
})(webSocketGauge || (webSocketGauge = {}));
//# sourceMappingURL=LEDTachoMeter.js.map