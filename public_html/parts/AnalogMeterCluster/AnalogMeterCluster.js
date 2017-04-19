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
        var AnalogMeterCluster;
        (function (AnalogMeterCluster_1) {
            var CircularProgressBar = webSocketGauge.lib.graphics.CircularProgressBar;
            var RotationNeedleGauge = webSocketGauge.lib.graphics.RotationNeedleGauge;
            var AnalogMeterCluster = (function (_super) {
                __extends(AnalogMeterCluster, _super);
                function AnalogMeterCluster() {
                    var _this = _super.call(this) || this;
                    _this.tachoProgressBar = new CircularProgressBar();
                    _this.waterTempProgressBar = new CircularProgressBar();
                    _this.tachoNeedleGauge = new RotationNeedleGauge();
                    _this.speedNeedleGauge = new RotationNeedleGauge();
                    _this.boostNeedleGauge = new RotationNeedleGauge();
                    _this.speedLabel = new PIXI.Text();
                    _this.gasMilageLabel = new PIXI.Text();
                    _this.tripLabel = new PIXI.Text();
                    _this.fuelLabel = new PIXI.Text();
                    _this.gearPosLabel = new PIXI.Text();
                    _this.tacho = 0;
                    _this.speed = 0;
                    _this.boost = 0;
                    _this.waterTemp = 0;
                    _this.gasMilage = 0;
                    _this.trip = 0;
                    _this.fuel = 0;
                    _this.gearPos = "";
                    _this.masterTextStyle = new PIXI.TextStyle({
                        fill: "black",
                        align: "right",
                        fontFamily: "DSEG14ClassicItalic"
                    });
                    var TachoMeter = _this.createTachoMeter();
                    var SpeedMeter = _this.createSpeedMeter();
                    var BoostMeter = _this.createBoostMeter();
                    TachoMeter.position.set(345, 0);
                    BoostMeter.position.set(615, 80);
                    _super.prototype.addChild.call(_this, SpeedMeter);
                    _super.prototype.addChild.call(_this, BoostMeter);
                    _super.prototype.addChild.call(_this, TachoMeter);
                    return _this;
                }
                Object.defineProperty(AnalogMeterCluster.prototype, "Tacho", {
                    get: function () { return this.tacho; },
                    set: function (val) {
                        this.tacho = val;
                        this.tachoProgressBar.Value = val;
                        this.tachoNeedleGauge.Value = val;
                        this.tachoProgressBar.update();
                        this.tachoNeedleGauge.update();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AnalogMeterCluster.prototype, "Speed", {
                    get: function () { return this.speed; },
                    set: function (val) {
                        this.speed = val;
                        this.speedNeedleGauge.Value = val;
                        this.speedNeedleGauge.update();
                        this.speedLabel.text = val.toFixed(0);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AnalogMeterCluster.prototype, "Boost", {
                    get: function () { return this.boost; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AnalogMeterCluster.prototype, "Boosr", {
                    set: function (val) {
                        this.boost = val;
                        this.boostNeedleGauge.Value = val;
                        this.boostNeedleGauge.update();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AnalogMeterCluster.prototype, "WaterTemp", {
                    get: function () { return this.waterTemp; },
                    set: function (val) {
                        this.waterTemp = val;
                        this.waterTempProgressBar.Value = val;
                        this.waterTempProgressBar.update();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AnalogMeterCluster.prototype, "GasMilage", {
                    get: function () { return this.gasMilage; },
                    set: function (val) {
                        this.gasMilage = val;
                        this.gasMilageLabel.text = val.toFixed(2);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AnalogMeterCluster.prototype, "Trip", {
                    get: function () { return this.trip; },
                    set: function (val) {
                        this.trip = val;
                        this.tripLabel.text = val.toFixed(1);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AnalogMeterCluster.prototype, "Fuel", {
                    get: function () { return this.fuel; },
                    set: function (val) {
                        this.fuel = val;
                        this.fuelLabel.text = val.toFixed(2);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AnalogMeterCluster.prototype, "GearPos", {
                    get: function () { return this.gearPos; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AnalogMeterCluster.prototype, "GeasPos", {
                    set: function (val) {
                        this.gearPos = val;
                        this.gearPosLabel.text = val;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AnalogMeterCluster, "RequestedTexturePath", {
                    get: function () {
                        return ["/parts/AnalogMeterCluster/AnalogMeterClusterTexture.json"];
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AnalogMeterCluster, "RequestedFontFamily", {
                    get: function () {
                        return ["DSEG14ClassicItalic"];
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AnalogMeterCluster, "RequestedFontCSSURL", {
                    get: function () {
                        return ['/parts/fonts/font.css'];
                    },
                    enumerable: true,
                    configurable: true
                });
                AnalogMeterCluster.prototype.createTachoMeter = function () {
                    var tachoMax = 9000;
                    var tachoMin = 0;
                    var tachoValDefalut = 4500;
                    var tachoContainer = new PIXI.Container();
                    var backSprite = PIXI.Sprite.fromFrame("AnalogTachoMeter_Base");
                    tachoContainer.addChild(backSprite);
                    var tachoProgressBar = this.tachoProgressBar;
                    tachoProgressBar.Texture = PIXI.Texture.fromFrame("AnalogTachoMeter_Bar");
                    tachoProgressBar.OffsetAngle = 90;
                    tachoProgressBar.FullAngle = 270;
                    tachoProgressBar.Max = tachoMax;
                    tachoProgressBar.Min = tachoMin;
                    tachoProgressBar.Value = tachoValDefalut;
                    tachoProgressBar.Radius = 193;
                    tachoProgressBar.InnerRadius = 160;
                    tachoProgressBar.Center.set(193, 193);
                    tachoProgressBar.pivot.set(193, 193);
                    tachoProgressBar.position.set(300, 300);
                    tachoContainer.addChild(tachoProgressBar);
                    tachoProgressBar.updateForce();
                    var tachoMeter = this.tachoNeedleGauge;
                    tachoMeter.Texture = PIXI.Texture.fromFrame("AnalogTachoMeter_Needle");
                    tachoMeter.Max = tachoMax;
                    tachoMeter.Min = tachoMin;
                    tachoMeter.Value = tachoValDefalut;
                    tachoMeter.OffsetAngle = 90;
                    tachoMeter.FullAngle = 270;
                    tachoMeter.pivot.set(15, 15);
                    tachoMeter.position.set(300, 300);
                    tachoContainer.addChild(tachoMeter);
                    tachoMeter.updateForce();
                    var shaftSprite = PIXI.Sprite.fromFrame("AnalogTachoMeter_NeedleCap");
                    shaftSprite.pivot.set(72, 72);
                    shaftSprite.position.set(300, 300);
                    tachoContainer.addChild(shaftSprite);
                    var gasMilageLabel = this.gasMilageLabel;
                    gasMilageLabel.style = this.masterTextStyle.clone();
                    gasMilageLabel.style.fontSize = 35;
                    gasMilageLabel.anchor.set(1, 0.5);
                    gasMilageLabel.position.set(490, 335);
                    gasMilageLabel.text = "12.00";
                    tachoContainer.addChild(gasMilageLabel);
                    var tripLabel = this.tripLabel;
                    tripLabel.style = this.masterTextStyle.clone();
                    tripLabel.style.fontSize = 30;
                    tripLabel.anchor.set(1, 0.5);
                    tripLabel.position.set(505, 380);
                    tripLabel.text = "125.0";
                    tachoContainer.addChild(tripLabel);
                    var fuelLabel = this.fuelLabel;
                    fuelLabel.style = this.masterTextStyle.clone();
                    fuelLabel.style.fontSize = 30;
                    fuelLabel.anchor.set(1, 0.5);
                    fuelLabel.position.set(505, 418);
                    fuelLabel.text = "25.00";
                    tachoContainer.addChild(fuelLabel);
                    var gearPosLabel = this.gearPosLabel;
                    gearPosLabel.style = this.masterTextStyle.clone();
                    gearPosLabel.style.fontSize = 105;
                    gearPosLabel.anchor.set(0.5, 0.5);
                    gearPosLabel.position.set(358, 493);
                    gearPosLabel.text = "6";
                    tachoContainer.addChild(gearPosLabel);
                    return tachoContainer;
                };
                AnalogMeterCluster.prototype.createSpeedMeter = function () {
                    var speedMax = 280;
                    var speedMin = 0;
                    var speedValDefault = 90;
                    var waterTempMax = 140;
                    var waterTempMin = 60;
                    var waterTempValDefault = 90;
                    var speedMeterContainer = new PIXI.Container();
                    var backSprite = PIXI.Sprite.fromFrame("AnalogSpeedMeter_Base");
                    speedMeterContainer.addChild(backSprite);
                    var speedLabel = this.speedLabel;
                    speedLabel.style = this.masterTextStyle.clone();
                    speedLabel.style.fontSize = 50;
                    speedLabel.text = speedValDefault.toFixed(0);
                    speedLabel.anchor.set(1, 0.5);
                    speedLabel.position.set(355, 407);
                    speedMeterContainer.addChild(speedLabel);
                    var waterTempProgressBar = this.waterTempProgressBar;
                    waterTempProgressBar.Texture = PIXI.Texture.fromFrame("AnalogSpeedMeter_Bar");
                    waterTempProgressBar.Max = waterTempMax;
                    waterTempProgressBar.Min = waterTempMin;
                    waterTempProgressBar.Value = waterTempValDefault;
                    waterTempProgressBar.Radius = 162;
                    waterTempProgressBar.InnerRadius = 120;
                    waterTempProgressBar.OffsetAngle = 165;
                    waterTempProgressBar.FullAngle = 120;
                    waterTempProgressBar.Center.set(162, 162);
                    waterTempProgressBar.pivot.set(162, 162);
                    waterTempProgressBar.position.set(300, 300);
                    waterTempProgressBar.updateForce();
                    speedMeterContainer.addChild(waterTempProgressBar);
                    var speedNeedleGauge = this.speedNeedleGauge;
                    speedNeedleGauge.Texture = PIXI.Texture.fromFrame("AnalogSpeedMeter_Needle");
                    speedNeedleGauge.Max = speedMax;
                    speedNeedleGauge.Min = speedMin;
                    speedNeedleGauge.Value = speedValDefault;
                    speedNeedleGauge.OffsetAngle = 75;
                    speedNeedleGauge.FullAngle = 210;
                    speedNeedleGauge.pivot.set(15, 15);
                    speedNeedleGauge.position.set(300, 300);
                    speedMeterContainer.addChild(speedNeedleGauge);
                    speedNeedleGauge.updateForce();
                    var shaftSprite = PIXI.Sprite.fromFrame("AnalogSpeedMeter_NeedleCap");
                    shaftSprite.anchor.set(0.5, 0.5);
                    shaftSprite.position.set(300, 300);
                    speedMeterContainer.addChild(shaftSprite);
                    return speedMeterContainer;
                };
                AnalogMeterCluster.prototype.createBoostMeter = function () {
                    var boostMax = 2.0;
                    var boostMin = -1.0;
                    var boostValDefault = 0.0;
                    var boostMeterContainer = new PIXI.Container();
                    var backSprite = PIXI.Sprite.fromFrame("BoostMeter_Base");
                    boostMeterContainer.addChild(backSprite);
                    var boostNeedleGauge = this.boostNeedleGauge;
                    boostNeedleGauge.Texture = PIXI.Texture.fromFrame("BoostMeter_Needle");
                    boostNeedleGauge.OffsetAngle = 30;
                    boostNeedleGauge.FullAngle = 90;
                    boostNeedleGauge.AntiClockwise = true;
                    boostNeedleGauge.Max = boostMax;
                    boostNeedleGauge.Min = boostMin;
                    boostNeedleGauge.Value = boostValDefault;
                    boostNeedleGauge.pivot.set(90, 15);
                    boostNeedleGauge.position.set(220, 220);
                    boostNeedleGauge.updateForce();
                    boostMeterContainer.addChild(boostNeedleGauge);
                    return boostMeterContainer;
                };
                return AnalogMeterCluster;
            }(PIXI.Container));
            AnalogMeterCluster_1.AnalogMeterCluster = AnalogMeterCluster;
        })(AnalogMeterCluster = parts.AnalogMeterCluster || (parts.AnalogMeterCluster = {}));
    })(parts = webSocketGauge.parts || (webSocketGauge.parts = {}));
})(webSocketGauge || (webSocketGauge = {}));
//# sourceMappingURL=AnalogMeterCluster.js.map