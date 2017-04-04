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
var CircularProgressBar = webSocketGauge.lib.graphics.CircularProgressBar;
var CircularProgressBarOptions = webSocketGauge.lib.graphics.CircularProgressBarOptions;
var webSocketGauge;
(function (webSocketGauge) {
    var parts;
    (function (parts) {
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
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.valueLabelOption = new TextOption();
                _this.axisLabel = new Array();
                _this.axisLabelOption = new Array();
                _this.valueNumberRoundDigit = 1;
                _this.centerPosition = new PIXI.Point();
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
            CircularGaugePanelBase.prototype.initialize = function () {
                this.createBackContainer();
                this.createValueProgressBar();
            };
            CircularGaugePanelBase.prototype.createValueProgressBar = function () {
                var valueBarTexture = PIXI.loader.resources[FullCircularGauge.ValueBarTexturePath].texture;
                this.valueProgressBar = new CircularProgressBar();
                this.valueProgressBar.OffsetAngle = this.offsetAngle;
                this.valueProgressBar.FullAngle = this.fullAngle;
                this.valueProgressBar.Min = this.min;
                this.valueProgressBar.Max = this.max;
                this.valueProgressBar.AngleStep = this.angleStep;
                this.valueProgressBar.Center = this.centerPosition;
                this.valueProgressBar.Radius = this.valueBarRadius;
                this.valueProgressBar.InnerRadius = this.valueBarInnerRadius;
                this.valueProgressBar.Texture = valueBarTexture;
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
            CircularGaugePanelBase.prototype.setDefaultAxisLabel = function (axisLabel, axisLabelOption) {
                for (var i = void 0; i < axisLabel.length; i++) {
                    this.axisLabel.push(axisLabel[i]);
                    this.axisLabelOption.push(axisLabelOption[i]);
                }
            };
            CircularGaugePanelBase.prototype.createBackContainer = function () {
                var backContainer = new PIXI.Container();
                //Unlock baked texture
                backContainer.cacheAsBitmap = false;
                var centerPosition = this.centerPosition;
                var zoneBarRadius = this.zoneBarRadius;
                //Add backSprite
                var backTexture = PIXI.loader.resources[FullCircularGauge.BackTexturePath].texture;
                var backSprite = new PIXI.Sprite();
                backSprite.texture = backTexture;
                backContainer.addChild(backSprite);
                //Add redzoneBar
                if (this.redZoneBarEnable) {
                    var redZoneBarTexture = PIXI.loader.resources[FullCircularGauge.RedZoneBarTexturePath].texture;
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
                    var yellowZoneBarTexture = PIXI.loader.resources[FullCircularGauge.YellowZoneBarTexturePath].texture;
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
                    var greenZoneBarTexture = PIXI.loader.resources[FullCircularGauge.GreenZoneBarTexturePath].texture;
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
                var gridTexture = PIXI.loader.resources[FullCircularGauge.GridTexturePath].texture;
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
                //Bake into texture
                backContainer.cacheAsBitmap = true;
                _super.prototype.addChild.call(this, backContainer);
            };
            return CircularGaugePanelBase;
        }(PIXI.Container));
        parts.CircularGaugePanelBase = CircularGaugePanelBase;
        var FullCircularGauge = (function (_super) {
            __extends(FullCircularGauge, _super);
            function FullCircularGauge() {
                var _this = _super.call(this) || this;
                _this.masterTextStyle = new PIXI.TextStyle({
                    dropShadow: true,
                    dropShadowBlur: 10,
                    dropShadowColor: "white",
                    dropShadowDistance: 0,
                    fill: "white",
                    fontFamily: "FreeSans-Bold"
                });
                _this.offsetAngle = 90;
                _this.fullAngle = 270;
                _this.min = -1.0;
                _this.max = 2.0;
                _this.angleStep = 0.1;
                _this.valueBarRadius = 150;
                _this.valueBarInnerRadius = 50;
                _this.valueLabelOption.position.set(200, 185);
                _this.valueLabelOption.fontSize = 80;
                _this.valueLabelOption.position.set(200, 185);
                _this.valueLabelOption.anchor.set(0.5, 0.5);
                _this.valueLabelOption.align = "center";
                _this.valueLabelOption.letterSpacing = -3;
                _this.zoneBarRadius = 200;
                _this.centerPosition.set(200, 200);
                _this.titleLabel = "TURBO BOOST";
                _this.titleLabelOption = new TextOption(new PIXI.Point(200, 370), new PIXI.Point(0.5, 0.5), "center", 38);
                _this.unitLabel = "x100kPa";
                _this.unitLabelOption = new TextOption(new PIXI.Point(200, 235), new PIXI.Point(0.5, 0.5), "center", 23);
                _this.valueNumberRoundDigit = 1;
                _this.redZoneBarEnable = true;
                _this.yellowZoneBarEnable = true;
                _this.greenZoneBarEnable = true;
                _this.redZoneBarOffsetAngle = 315;
                _this.yellowZoneBarOffsetAngle = 270;
                _this.greenZoneBarOffsetAngle = 90;
                _this.redZoneBarFullAngle = 40;
                _this.yellowZoneBarFullAngle = 45;
                _this.greenZoneBarFullAngle = 90;
                _this.createDefaultAxisLabel();
                _this.initialize();
                return _this;
            }
            FullCircularGauge.preloadTextures = function () {
                PIXI.loader.add(FullCircularGauge.RedZoneBarTexturePath)
                    .add(FullCircularGauge.GreenZoneBarTexturePath)
                    .add(FullCircularGauge.YellowZoneBarTexturePath)
                    .add(FullCircularGauge.BackTexturePath)
                    .add(FullCircularGauge.GridTexturePath)
                    .add(FullCircularGauge.ValueBarTexturePath);
            };
            FullCircularGauge.prototype.createDefaultAxisLabel = function () {
                var axisLabelFontSize = 30;
                this.axisLabel.push("-1.0");
                this.axisLabelOption.push(new TextOption(new PIXI.Point(207, 335), new PIXI.Point(0, 0.5), "left", axisLabelFontSize));
                this.axisLabel.push("-0.5");
                this.axisLabelOption.push(new TextOption(new PIXI.Point(90, 310), new PIXI.Point(1, 0.5), "right", axisLabelFontSize));
                this.axisLabel.push("0");
                this.axisLabelOption.push(new TextOption(new PIXI.Point(45, 193), new PIXI.Point(1, 0.5), "right", axisLabelFontSize));
                this.axisLabel.push("+0.5");
                this.axisLabelOption.push(new TextOption(new PIXI.Point(90, 75), new PIXI.Point(1, 0.5), "right", axisLabelFontSize));
                this.axisLabel.push("+1.0");
                this.axisLabelOption.push(new TextOption(new PIXI.Point(200, 40), new PIXI.Point(0.5, 1), "center", axisLabelFontSize));
                this.axisLabel.push("+1.5");
                this.axisLabelOption.push(new TextOption(new PIXI.Point(310, 75), new PIXI.Point(0, 0.5), "left", axisLabelFontSize));
                this.axisLabel.push("+2.0");
                this.axisLabelOption.push(new TextOption(new PIXI.Point(340, 195), new PIXI.Point(0.5, 0), "center", axisLabelFontSize));
            };
            return FullCircularGauge;
        }(CircularGaugePanelBase));
        FullCircularGauge.RedZoneBarTexturePath = "FullCircularGauge_RedZone_Bar.png";
        FullCircularGauge.YellowZoneBarTexturePath = "FullCircularGauge_YellowZone_Bar.png";
        FullCircularGauge.GreenZoneBarTexturePath = "FullCircularGauge_GreenZone_Bar.png";
        FullCircularGauge.ValueBarTexturePath = "FullCircularGauge_ValueBar.png";
        FullCircularGauge.BackTexturePath = "FullCircularGauge_Back.png";
        FullCircularGauge.GridTexturePath = "FullCircularGauge_Grid.png";
        parts.FullCircularGauge = FullCircularGauge;
    })(parts = webSocketGauge.parts || (webSocketGauge.parts = {}));
})(webSocketGauge || (webSocketGauge = {}));
//# sourceMappingURL=FullCircularGauge.js.map