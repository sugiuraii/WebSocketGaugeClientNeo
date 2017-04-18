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
/// <reference path="../script/lib/pixi.js.d.ts" />
/// <reference path="../script/progressBar/pixiGauge.ts" />
/// <reference path="../node_modules/@types/webfontloader/index.d.ts" />
var webSocketGauge;
(function (webSocketGauge) {
    var parts;
    (function (parts) {
        var CircularProgressBar = webSocketGauge.lib.graphics.CircularProgressBar;
        var RectangularProgressBar = webSocketGauge.lib.graphics.RectangularProgressBar;
        var TextOption = (function () {
            function TextOption(position, anchor, align, fontsize, letterSpacing) {
                this.position = new PIXI.Point(0, 0);
                this.anchor = new PIXI.Point(0, 0);
                this.align = "left";
                this.fontSize = 12;
                this.letterSpacing = 0;
                if (typeof (align) !== "undefined")
                    this.align = align;
                if (typeof (fontsize) !== "undefined")
                    this.fontSize = fontsize;
                if (typeof (letterSpacing) !== "undefined")
                    this.letterSpacing = letterSpacing;
                if (position instanceof PIXI.Point)
                    this.position = position;
                if (anchor instanceof PIXI.Point)
                    this.anchor = anchor;
            }
            TextOption.prototype.clone = function () {
                var returnObj = new TextOption();
                returnObj.position = this.position.clone();
                returnObj.anchor = this.anchor.clone();
                returnObj.align = this.align;
                returnObj.fontSize = this.fontSize;
                returnObj.letterSpacing = this.letterSpacing;
                return returnObj;
            };
            return TextOption;
        }());
        parts.TextOption = TextOption;
        var CircularGaugePanelBase = (function (_super) {
            __extends(CircularGaugePanelBase, _super);
            function CircularGaugePanelBase() {
                var _this = _super.call(this) || this;
                _this.valueLabelOption = new TextOption();
                _this.axisLabel = new Array();
                _this.axisLabelOption = new Array();
                _this.valueNumberRoundDigit = 1;
                _this.centerPosition = new PIXI.Point();
                _this.setOption();
                _this.createBackContainer();
                _this.createValueProgressBar();
                return _this;
            }
            Object.defineProperty(CircularGaugePanelBase.prototype, "Value", {
                get: function () { return this.valueProgressBar.Value; },
                set: function (value) {
                    this.valueProgressBar.Value = value;
                    this.valueProgressBar.update();
                    if (value.toFixed(this.valueNumberRoundDigit).toString() !== this.valueTextLabel.text)
                        this.valueTextLabel.text = value.toFixed(this.valueNumberRoundDigit).toString();
                },
                enumerable: true,
                configurable: true
            });
            ;
            CircularGaugePanelBase.prototype.createValueProgressBar = function () {
                this.valueProgressBar = new CircularProgressBar();
                this.valueProgressBar.OffsetAngle = this.offsetAngle;
                this.valueProgressBar.FullAngle = this.fullAngle;
                this.valueProgressBar.Min = this.min;
                this.valueProgressBar.Max = this.max;
                this.valueProgressBar.AngleStep = this.angleStep;
                this.valueProgressBar.InvertDraw = this.invertDraw;
                this.valueProgressBar.AntiClockwise = this.antiClockWise;
                this.valueProgressBar.Center = this.centerPosition;
                this.valueProgressBar.Radius = this.valueBarRadius;
                this.valueProgressBar.InnerRadius = this.valueBarInnerRadius;
                this.valueProgressBar.Texture = this.ValueBarTexture;
                _super.prototype.addChild.call(this, this.valueProgressBar);
                this.valueTextLabel = new PIXI.Text(this.min.toFixed(this.valueNumberRoundDigit).toString());
                this.valueTextLabel.style = this.masterTextStyle.clone();
                var valueLabelOption = this.valueLabelOption;
                this.valueTextLabel.style.fontSize = valueLabelOption.fontSize;
                this.valueTextLabel.position = valueLabelOption.position;
                this.valueTextLabel.anchor.set(valueLabelOption.anchor.x, valueLabelOption.anchor.y);
                this.valueTextLabel.style.align = valueLabelOption.align;
                this.valueTextLabel.style.letterSpacing = valueLabelOption.letterSpacing;
                _super.prototype.addChild.call(this, this.valueTextLabel);
            };
            CircularGaugePanelBase.prototype.setAxisLabel = function (axisLabel) {
                this.axisLabel = new Array();
                for (var i = 0; i < axisLabel.length; i++)
                    this.axisLabel.push(axisLabel[i]);
            };
            CircularGaugePanelBase.prototype.setAxisLabelOption = function (axisLabelOption) {
                this.axisLabelOption = new Array();
                for (var i = 0; i < axisLabelOption.length; i++)
                    this.axisLabelOption.push(axisLabelOption[i]);
            };
            CircularGaugePanelBase.prototype.createBackContainer = function () {
                var backContainer = new PIXI.Container();
                //Unlock baked texture
                backContainer.cacheAsBitmap = false;
                var centerPosition = this.centerPosition;
                var zoneBarRadius = this.zoneBarRadius;
                //Add backSprite
                var backTexture = this.BackTexture;
                var backSprite = new PIXI.Sprite();
                backSprite.texture = backTexture;
                backContainer.addChild(backSprite);
                //Add redzoneBar
                if (this.redZoneBarEnable) {
                    var redZoneBarTexture = this.RedZoneBarTexture;
                    var redzoneBar = new CircularProgressBar();
                    redzoneBar.OffsetAngle = this.redZoneBarOffsetAngle;
                    redzoneBar.FullAngle = this.redZoneBarFullAngle;
                    redzoneBar.Texture = redZoneBarTexture;
                    redzoneBar.Value = redzoneBar.Max;
                    redzoneBar.Center = centerPosition;
                    redzoneBar.Radius = zoneBarRadius;
                    redzoneBar.InnerRadius = 0;
                    redzoneBar.updateForce();
                    backContainer.addChild(redzoneBar);
                }
                //Add yellowzoneBar
                if (this.yellowZoneBarEnable) {
                    var yellowZoneBarTexture = this.YellowZoneBarTexture;
                    var yellowzoneBar = new CircularProgressBar();
                    yellowzoneBar.OffsetAngle = this.yellowZoneBarOffsetAngle;
                    yellowzoneBar.FullAngle = this.yellowZoneBarFullAngle;
                    yellowzoneBar.Texture = yellowZoneBarTexture;
                    yellowzoneBar.Value = yellowzoneBar.Max;
                    yellowzoneBar.Center = centerPosition;
                    yellowzoneBar.Radius = zoneBarRadius;
                    yellowzoneBar.InnerRadius = 0;
                    yellowzoneBar.updateForce();
                    backContainer.addChild(yellowzoneBar);
                }
                //Add greenZoneBar
                if (this.greenZoneBarEnable) {
                    var greenZoneBarTexture = this.GreenZoneBarTexture;
                    var greenzoneBar = new CircularProgressBar();
                    greenzoneBar.OffsetAngle = this.greenZoneBarOffsetAngle;
                    greenzoneBar.FullAngle = this.greenZoneBarFullAngle;
                    greenzoneBar.Texture = greenZoneBarTexture;
                    greenzoneBar.Value = greenzoneBar.Max;
                    greenzoneBar.Center = centerPosition;
                    greenzoneBar.Radius = zoneBarRadius;
                    greenzoneBar.InnerRadius = 0;
                    greenzoneBar.updateForce();
                    backContainer.addChild(greenzoneBar);
                }
                //Add gridSprite
                var gridTexture = this.GridTexture;
                var gridSprite = new PIXI.Sprite();
                gridSprite.texture = gridTexture;
                backContainer.addChild(gridSprite);
                //Set Title and unit text
                var titleTextElem = new PIXI.Text(this.titleLabel);
                var titleTextOption = this.titleLabelOption;
                titleTextElem.style = this.masterTextStyle.clone();
                titleTextElem.style.fontSize = titleTextOption.fontSize;
                titleTextElem.style.align = titleTextOption.align;
                titleTextElem.anchor.set(titleTextOption.anchor.x, titleTextOption.anchor.y);
                titleTextElem.position.set(titleTextOption.position.x, titleTextOption.position.y);
                var unitTextElem = new PIXI.Text(this.unitLabel);
                var unitTextOption = this.unitLabelOption;
                unitTextElem.style = this.masterTextStyle.clone();
                unitTextElem.style.fontSize = unitTextOption.fontSize;
                unitTextElem.style.align = unitTextOption.align;
                unitTextElem.anchor.set(unitTextOption.anchor.x, unitTextOption.anchor.y);
                unitTextElem.position.set(unitTextOption.position.x, unitTextOption.position.y);
                backContainer.addChild(titleTextElem);
                backContainer.addChild(unitTextElem);
                //Set axis label
                for (var i = 0; i < this.axisLabelOption.length; i++) {
                    var axisLabelOption = this.axisLabelOption[i];
                    var axisLabelElem = new PIXI.Text(this.axisLabel[i]);
                    axisLabelElem.style = this.masterTextStyle.clone();
                    axisLabelElem.style.fontSize = axisLabelOption.fontSize;
                    axisLabelElem.style.align = axisLabelOption.align;
                    axisLabelElem.anchor.set(axisLabelOption.anchor.x, axisLabelOption.anchor.y);
                    axisLabelElem.position.set(axisLabelOption.position.x, axisLabelOption.position.y);
                    backContainer.addChild(axisLabelElem);
                }
                this.addChild(backContainer);
                //Bake into texture
                backContainer.cacheAsBitmap = true;
            };
            return CircularGaugePanelBase;
        }(PIXI.Container));
        parts.CircularGaugePanelBase = CircularGaugePanelBase;
        var SemiCircularGauge = (function (_super) {
            __extends(SemiCircularGauge, _super);
            function SemiCircularGauge() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object.defineProperty(SemiCircularGauge, "RequestedTexturePath", {
                get: function () {
                    return ["SemiCircularGaugeTexture.json"];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SemiCircularGauge, "RequestedFontFamily", {
                get: function () {
                    return ["FreeSans-Bold"];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SemiCircularGauge, "RequestedFontCSSURL", {
                get: function () {
                    return ['./font.css'];
                },
                enumerable: true,
                configurable: true
            });
            SemiCircularGauge.prototype.setOption = function () {
                this.RedZoneBarTexture = PIXI.Texture.fromFrame("SemiCircular_Gauge1_Redzone_Bar");
                this.YellowZoneBarTexture = PIXI.Texture.fromFrame("SemiCircular_Gauge1_Yellowzone_Bar");
                this.GreenZoneBarTexture = PIXI.Texture.fromFrame("SemiCircular_Gauge1_Greenzone_Bar");
                this.ValueBarTexture = PIXI.Texture.fromFrame("SemiCircular_Gauge1_Value_Bar");
                this.BackTexture = PIXI.Texture.fromFrame("SemiCircular_Gauge1_Back");
                this.GridTexture = PIXI.Texture.fromFrame("SemiCircular_Gauge1_Grid");
                this.masterTextStyle = new PIXI.TextStyle({
                    dropShadow: true,
                    dropShadowBlur: 15,
                    dropShadowColor: "white",
                    dropShadowDistance: 0,
                    fill: "white",
                    fontFamily: "FreeSans-Bold"
                });
                this.offsetAngle = 180;
                this.fullAngle = 180;
                this.min = 0;
                this.max = 100;
                this.angleStep = 0.1;
                this.valueBarRadius = 200;
                this.valueBarInnerRadius = 0;
                this.valueLabelOption.position.set(200, 185);
                this.valueLabelOption.fontSize = 90;
                this.valueLabelOption.position.set(200, 185);
                this.valueLabelOption.anchor.set(0.5, 0.5);
                this.valueLabelOption.align = "center";
                this.valueLabelOption.letterSpacing = -3;
                this.zoneBarRadius = 200;
                this.centerPosition.set(200, 195);
                this.titleLabel = "THROTTLE";
                this.titleLabelOption = new TextOption(new PIXI.Point(200, 266), new PIXI.Point(0.5, 0.5), "center", 42);
                this.unitLabel = "%";
                this.unitLabelOption = new TextOption(new PIXI.Point(200, 235), new PIXI.Point(0.5, 0.5), "center", 23);
                this.valueNumberRoundDigit = 0;
                this.redZoneBarEnable = true;
                this.yellowZoneBarEnable = true;
                this.greenZoneBarEnable = true;
                this.redZoneBarOffsetAngle = 315;
                this.redZoneBarFullAngle = 45;
                this.yellowZoneBarOffsetAngle = 270;
                this.yellowZoneBarFullAngle = 45;
                this.greenZoneBarOffsetAngle = 180;
                this.greenZoneBarFullAngle = 45;
                var axisLabelFontSize = 38;
                this.setAxisLabel(["0",
                    "25",
                    "50",
                    "75",
                    "100",
                ]);
                this.setAxisLabelOption([
                    new TextOption(new PIXI.Point(60, 195), new PIXI.Point(0.5, 0), "center", axisLabelFontSize),
                    new TextOption(new PIXI.Point(90, 75), new PIXI.Point(1, 0.5), "right", axisLabelFontSize),
                    new TextOption(new PIXI.Point(200, 40), new PIXI.Point(0.5, 1), "center", axisLabelFontSize),
                    new TextOption(new PIXI.Point(310, 75), new PIXI.Point(0, 0.5), "left", axisLabelFontSize),
                    new TextOption(new PIXI.Point(340, 195), new PIXI.Point(0.5, 0), "center", axisLabelFontSize)
                ]);
            };
            return SemiCircularGauge;
        }(CircularGaugePanelBase));
        parts.SemiCircularGauge = SemiCircularGauge;
        var FullCircularGauge = (function (_super) {
            __extends(FullCircularGauge, _super);
            function FullCircularGauge() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object.defineProperty(FullCircularGauge, "RequestedTexturePath", {
                get: function () {
                    return ["FullCircularGaugeTexture.json"];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FullCircularGauge, "RequestedFontFamily", {
                get: function () {
                    return ["FreeSans-Bold"];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FullCircularGauge, "RequestedFontCSSURL", {
                get: function () {
                    return ['./font.css'];
                },
                enumerable: true,
                configurable: true
            });
            FullCircularGauge.prototype.setOption = function () {
                this.RedZoneBarTexture = PIXI.Texture.fromFrame("FullCircularGauge_RedZone_Bar");
                this.YellowZoneBarTexture = PIXI.Texture.fromFrame("FullCircularGauge_YellowZone_Bar");
                this.GreenZoneBarTexture = PIXI.Texture.fromFrame("FullCircularGauge_GreenZone_Bar");
                this.ValueBarTexture = PIXI.Texture.fromFrame("FullCircularGauge_ValueBar");
                this.BackTexture = PIXI.Texture.fromFrame("FullCircularGauge_Back");
                this.GridTexture = PIXI.Texture.fromFrame("FullCircularGauge_Grid");
                this.masterTextStyle = new PIXI.TextStyle({
                    dropShadow: true,
                    dropShadowBlur: 10,
                    dropShadowColor: "white",
                    dropShadowDistance: 0,
                    fill: "white",
                    fontFamily: "FreeSans-Bold"
                });
                this.offsetAngle = 90;
                this.fullAngle = 270;
                this.min = -1.0;
                this.max = 2.0;
                this.angleStep = 0.1;
                this.valueBarRadius = 150;
                this.valueBarInnerRadius = 50;
                this.valueLabelOption.position.set(200, 185);
                this.valueLabelOption.fontSize = 80;
                this.valueLabelOption.position.set(200, 185);
                this.valueLabelOption.anchor.set(0.5, 0.5);
                this.valueLabelOption.align = "center";
                this.valueLabelOption.letterSpacing = -3;
                this.zoneBarRadius = 200;
                this.centerPosition.set(200, 200);
                this.titleLabel = "TURBO BOOST";
                this.titleLabelOption = new TextOption(new PIXI.Point(200, 370), new PIXI.Point(0.5, 0.5), "center", 38);
                this.unitLabel = "x100kPa";
                this.unitLabelOption = new TextOption(new PIXI.Point(200, 235), new PIXI.Point(0.5, 0.5), "center", 23);
                this.valueNumberRoundDigit = 1;
                this.redZoneBarEnable = true;
                this.yellowZoneBarEnable = true;
                this.greenZoneBarEnable = true;
                this.redZoneBarOffsetAngle = 315;
                this.yellowZoneBarOffsetAngle = 270;
                this.greenZoneBarOffsetAngle = 90;
                this.redZoneBarFullAngle = 40;
                this.yellowZoneBarFullAngle = 45;
                this.greenZoneBarFullAngle = 90;
                var axisLabelFontSize = 30;
                this.setAxisLabel(["-1.0",
                    "-0.5",
                    "0",
                    "+0.5",
                    "+1.0",
                    "+1.5",
                    "+2.0"
                ]);
                this.setAxisLabelOption([
                    new TextOption(new PIXI.Point(207, 335), new PIXI.Point(0, 0.5), "left", axisLabelFontSize),
                    new TextOption(new PIXI.Point(90, 310), new PIXI.Point(1, 0.5), "right", axisLabelFontSize),
                    new TextOption(new PIXI.Point(45, 193), new PIXI.Point(1, 0.5), "right", axisLabelFontSize),
                    new TextOption(new PIXI.Point(90, 75), new PIXI.Point(1, 0.5), "right", axisLabelFontSize),
                    new TextOption(new PIXI.Point(200, 40), new PIXI.Point(0.5, 1), "center", axisLabelFontSize),
                    new TextOption(new PIXI.Point(310, 75), new PIXI.Point(0, 0.5), "left", axisLabelFontSize),
                    new TextOption(new PIXI.Point(340, 195), new PIXI.Point(0.5, 0), "center", axisLabelFontSize)
                ]);
            };
            return FullCircularGauge;
        }(CircularGaugePanelBase));
        parts.FullCircularGauge = FullCircularGauge;
        var BoostGaugePanel = (function (_super) {
            __extends(BoostGaugePanel, _super);
            function BoostGaugePanel() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            BoostGaugePanel.prototype.setOption = function () {
                _super.prototype.setOption.call(this);
                this.titleLabel = "TURBO BOOST";
                this.min = -1.0;
                this.max = 2.0;
                this.setAxisLabel(["-1.0",
                    "-0.5",
                    "0",
                    "+0.5",
                    "+1.0",
                    "+1.5",
                    "+2.0"
                ]);
            };
            return BoostGaugePanel;
        }(FullCircularGauge));
        parts.BoostGaugePanel = BoostGaugePanel;
        var AirFuelGaugePanel = (function (_super) {
            __extends(AirFuelGaugePanel, _super);
            function AirFuelGaugePanel() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            AirFuelGaugePanel.prototype.setOption = function () {
                _super.prototype.setOption.call(this);
                this.titleLabel = "Air/Fuel Ratio";
                this.min = 8;
                this.max = 20;
                this.redZoneBarOffsetAngle = 315;
                this.redZoneBarFullAngle = 45;
                this.yellowZoneBarOffsetAngle = 225;
                this.yellowZoneBarFullAngle = 90;
                this.greenZoneBarOffsetAngle = 135;
                this.greenZoneBarFullAngle = 90;
                this.invertDraw = true;
                this.unitLabel = "A/F";
                this.setAxisLabel(["20",
                    "18",
                    "16",
                    "14",
                    "12",
                    "10",
                    "8"
                ]);
            };
            return AirFuelGaugePanel;
        }(FullCircularGauge));
        parts.AirFuelGaugePanel = AirFuelGaugePanel;
        var ThrottleGaugePanel = (function (_super) {
            __extends(ThrottleGaugePanel, _super);
            function ThrottleGaugePanel() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            ThrottleGaugePanel.prototype.setOption = function () {
                _super.prototype.setOption.call(this);
                this.titleLabel = "THROTTLE";
                this.min = 0;
                this.max = 100;
                this.unitLabel = "%";
                this.redZoneBarEnable = false;
                this.yellowZoneBarEnable = false;
                this.greenZoneBarEnable = false;
                this.setAxisLabel(["0", "25", "50", "75", "100"]);
            };
            return ThrottleGaugePanel;
        }(SemiCircularGauge));
        parts.ThrottleGaugePanel = ThrottleGaugePanel;
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
                    return ["DigiTachoTexture.json"];
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
                    return ['./font.css'];
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
                    return ["MilageGraphTexture.json"];
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
                    return ['./font.css'];
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
//# sourceMappingURL=FullCircularGauge.js.map