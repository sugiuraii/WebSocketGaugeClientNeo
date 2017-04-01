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
            function TextOption(position, anchor, align, fontsize) {
                this.position = new PIXI.Point(0, 0);
                this.anchor = new PIXI.Point(0, 0);
                if (typeof (align) !== "undefined")
                    this.align = align;
                if (typeof (fontsize) !== "undefined")
                    this.fontSize = fontsize;
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
                return returnObj;
            };
            return TextOption;
        }());
        parts.TextOption = TextOption;
        var CircularGaugePanelOptionBase = (function (_super) {
            __extends(CircularGaugePanelOptionBase, _super);
            function CircularGaugePanelOptionBase() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return CircularGaugePanelOptionBase;
        }(CircularProgressBarOptions));
        parts.CircularGaugePanelOptionBase = CircularGaugePanelOptionBase;
        var FullCircularGaugeOption = (function (_super) {
            __extends(FullCircularGaugeOption, _super);
            function FullCircularGaugeOption() {
                var _this = _super.call(this) || this;
                _this.MasterTextStyle = new PIXI.TextStyle({
                    dropShadow: true,
                    dropShadowBlur: 10,
                    dropShadowColor: "white",
                    dropShadowDistance: 0,
                    fill: "white",
                    fontFamily: "FreeSans-Bold"
                });
                _this.TitleLabel = "TURBO BOOST";
                _this.TitleLabelOption = new TextOption(new PIXI.Point(200, 370), new PIXI.Point(0.5, 0.5), "center", 38);
                _this.UnitLabel = "x100kPa";
                _this.UnitLabelOption = new TextOption(new PIXI.Point(200, 235), new PIXI.Point(0.5, 0.5), "center", 23);
                _this.AxisLabel = new Array();
                _this.AxisLabelOption = new Array();
                _this.ValueNumberRoundDigit = 1;
                _this.RedZoneBarEnable = true;
                _this.YellowZoneBarEnable = true;
                _this.GreenZoneBarEnable = true;
                _this.RedZoneBarOffsetAngle = 315;
                _this.YellowZoneBarOffsetAngle = 270;
                _this.GreenZoneBarOffsetAngle = 90;
                _this.RedZoneBarFullAngle = 40;
                _this.YellowZoneBarFullAngle = 45;
                _this.GreenZoneBarFullAngle = 90;
                _this.createDefaultAxisLabel();
                _this.OffsetAngle = 90;
                _this.FullAngle = 270;
                _this.Min = -1.0;
                _this.Max = 2.0;
                _this.AngleStep = 0.1;
                _this.Center.set(200, 200);
                _this.Radius = 150;
                _this.InnerRadius = 50;
                return _this;
            }
            FullCircularGaugeOption.prototype.createDefaultAxisLabel = function () {
                var axisLabelFontSize = 30;
                this.AxisLabel.push("-1.0");
                this.AxisLabelOption.push(new TextOption(new PIXI.Point(207, 335), new PIXI.Point(0, 0.5), "left", axisLabelFontSize));
                this.AxisLabel.push("-0.5");
                this.AxisLabelOption.push(new TextOption(new PIXI.Point(90, 310), new PIXI.Point(1, 0.5), "right", axisLabelFontSize));
                this.AxisLabel.push("0");
                this.AxisLabelOption.push(new TextOption(new PIXI.Point(45, 193), new PIXI.Point(1, 0.5), "right", axisLabelFontSize));
                this.AxisLabel.push("+0.5");
                this.AxisLabelOption.push(new TextOption(new PIXI.Point(90, 75), new PIXI.Point(1, 0.5), "right", axisLabelFontSize));
                this.AxisLabel.push("+1.0");
                this.AxisLabelOption.push(new TextOption(new PIXI.Point(200, 40), new PIXI.Point(0.5, 1), "center", axisLabelFontSize));
                this.AxisLabel.push("+1.5");
                this.AxisLabelOption.push(new TextOption(new PIXI.Point(310, 75), new PIXI.Point(0, 0.5), "left", axisLabelFontSize));
                this.AxisLabel.push("+2.0");
                this.AxisLabelOption.push(new TextOption(new PIXI.Point(340, 195), new PIXI.Point(0.5, 0), "center", axisLabelFontSize));
            };
            return FullCircularGaugeOption;
        }(CircularGaugePanelOptionBase));
        FullCircularGaugeOption.RedZoneBarTexturePath = "FullCircularGauge_RedZone_Bar.png";
        FullCircularGaugeOption.YellowZoneBarTexturePath = "FullCircularGauge_YellowZone_Bar.png";
        FullCircularGaugeOption.GreenZoneBarTexturePath = "FullCircularGauge_GreenZone_Bar.png";
        FullCircularGaugeOption.ValueBarTexturePath = "FullCircularGauge_ValueBar.png";
        FullCircularGaugeOption.BackTexturePath = "FullCircularGauge_Back.png";
        FullCircularGaugeOption.GridTexturePath = "FullCircularGauge_Grid.png";
        FullCircularGaugeOption.ShaftTextturePath = "FullCircularGauge_Shaft.png";
        parts.FullCircularGaugeOption = FullCircularGaugeOption;
        var FullCircularGauge = (function (_super) {
            __extends(FullCircularGauge, _super);
            function FullCircularGauge() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.gaugeOption = new FullCircularGaugeOption();
                return _this;
            }
            FullCircularGauge.preloadTextures = function () {
                PIXI.loader.add(FullCircularGaugeOption.RedZoneBarTexturePath)
                    .add(FullCircularGaugeOption.GreenZoneBarTexturePath)
                    .add(FullCircularGaugeOption.YellowZoneBarTexturePath)
                    .add(FullCircularGaugeOption.BackTexturePath)
                    .add(FullCircularGaugeOption.GridTexturePath)
                    .add(FullCircularGaugeOption.ShaftTextturePath)
                    .add(FullCircularGaugeOption.ValueBarTexturePath);
            };
            FullCircularGauge.prototype.create = function () {
                var backContainer = this.createBackContainer();
                _super.prototype.addChild.call(this, backContainer);
                var option = this.gaugeOption;
                var valueBarTexture = PIXI.loader.resources[FullCircularGaugeOption.ValueBarTexturePath].texture;
                this.valueProgressBar = new CircularProgressBar(option);
                this.valueProgressBar.Texture = valueBarTexture;
                _super.prototype.addChild.call(this, this.valueProgressBar);
                this.valueTextLabel = new PIXI.Text(option.Min.toFixed(option.ValueNumberRoundDigit).toString());
                this.valueTextLabel.style = option.MasterTextStyle.clone();
                this.valueTextLabel.style.fontSize = 80;
                this.valueTextLabel.position.set(200, 185);
                this.valueTextLabel.anchor.set(0.5, 0.5);
                this.valueTextLabel.style.align = "center";
                this.valueTextLabel.style.letterSpacing = -3;
                _super.prototype.addChild.call(this, this.valueTextLabel);
            };
            FullCircularGauge.prototype.setVal = function (value) {
                this.valueProgressBar.Value = value;
                this.valueProgressBar.update();
                if (value.toFixed(this.gaugeOption.ValueNumberRoundDigit).toString() !== this.valueTextLabel.text)
                    this.valueTextLabel.text = value.toFixed(this.gaugeOption.ValueNumberRoundDigit).toString();
            };
            FullCircularGauge.prototype.getVal = function () {
                return this.valueProgressBar.Value;
            };
            FullCircularGauge.prototype.createBackContainer = function () {
                var backContainer = new PIXI.Container();
                //Unlock baked texture
                backContainer.cacheAsBitmap = false;
                var centerPosition = new PIXI.Point(200, 200);
                var zoneBarRadius = 200;
                var option = this.gaugeOption;
                //Add backSprite
                var backTexture = PIXI.loader.resources[FullCircularGaugeOption.BackTexturePath].texture;
                var backSprite = new PIXI.Sprite();
                backSprite.texture = backTexture;
                backContainer.addChild(backSprite);
                //Add redzoneBar
                if (option.RedZoneBarEnable) {
                    var redZoneBarTexture = PIXI.loader.resources[FullCircularGaugeOption.RedZoneBarTexturePath].texture;
                    var redzoneBar = new CircularProgressBar();
                    redzoneBar.OffsetAngle = option.RedZoneBarOffsetAngle;
                    redzoneBar.FullAngle = option.RedZoneBarFullAngle;
                    redzoneBar.Texture = redZoneBarTexture;
                    redzoneBar.Value = redzoneBar.Max;
                    redzoneBar.Center = centerPosition;
                    redzoneBar.Radius = zoneBarRadius;
                    redzoneBar.InnerRadius = 0;
                    redzoneBar.updateForce();
                    backContainer.addChild(redzoneBar);
                }
                //Add yellowzoneBar
                if (option.YellowZoneBarEnable) {
                    var yellowZoneBarTexture = PIXI.loader.resources[FullCircularGaugeOption.YellowZoneBarTexturePath].texture;
                    var yellowzoneBar = new CircularProgressBar();
                    yellowzoneBar.OffsetAngle = option.YellowZoneBarOffsetAngle;
                    yellowzoneBar.FullAngle = option.YellowZoneBarFullAngle;
                    yellowzoneBar.Texture = yellowZoneBarTexture;
                    yellowzoneBar.Value = yellowzoneBar.Max;
                    yellowzoneBar.Center = centerPosition;
                    yellowzoneBar.Radius = zoneBarRadius;
                    yellowzoneBar.InnerRadius = 0;
                    yellowzoneBar.updateForce();
                    backContainer.addChild(yellowzoneBar);
                }
                //Add greenZoneBar
                if (option.GreenZoneBarEnable) {
                    var greenZoneBarTexture = PIXI.loader.resources[FullCircularGaugeOption.GreenZoneBarTexturePath].texture;
                    var greenzoneBar = new CircularProgressBar();
                    greenzoneBar.OffsetAngle = option.GreenZoneBarOffsetAngle;
                    greenzoneBar.FullAngle = option.GreenZoneBarFullAngle;
                    greenzoneBar.Texture = greenZoneBarTexture;
                    greenzoneBar.Value = greenzoneBar.Max;
                    greenzoneBar.Center = centerPosition;
                    greenzoneBar.Radius = zoneBarRadius;
                    greenzoneBar.InnerRadius = 0;
                    greenzoneBar.updateForce();
                    backContainer.addChild(greenzoneBar);
                }
                //Add gridSprite
                var gridTexture = PIXI.loader.resources[FullCircularGaugeOption.GridTexturePath].texture;
                var gridSprite = new PIXI.Sprite();
                gridSprite.texture = gridTexture;
                backContainer.addChild(gridSprite);
                //Add shaftSprite
                var shaftTexture = PIXI.loader.resources[FullCircularGaugeOption.ShaftTextturePath].texture;
                var shaftSprite = new PIXI.Sprite();
                shaftSprite.texture = shaftTexture;
                backContainer.addChild(shaftSprite);
                //Set Title and unit text
                var titleTextElem = new PIXI.Text(option.TitleLabel);
                var titleTextOption = option.TitleLabelOption;
                titleTextElem.style = option.MasterTextStyle.clone();
                titleTextElem.style.fontSize = titleTextOption.fontSize;
                titleTextElem.style.align = titleTextOption.align;
                titleTextElem.anchor.set(titleTextOption.anchor.x, titleTextOption.anchor.y);
                titleTextElem.position.set(titleTextOption.position.x, titleTextOption.position.y);
                var unitTextElem = new PIXI.Text(option.UnitLabel);
                var unitTextOption = option.UnitLabelOption;
                unitTextElem.style = option.MasterTextStyle.clone();
                unitTextElem.style.fontSize = unitTextOption.fontSize;
                unitTextElem.style.align = unitTextOption.align;
                unitTextElem.anchor.set(unitTextOption.anchor.x, unitTextOption.anchor.y);
                unitTextElem.position.set(unitTextOption.position.x, unitTextOption.position.y);
                backContainer.addChild(titleTextElem);
                backContainer.addChild(unitTextElem);
                //Set axis label
                for (var i = 0; i < option.AxisLabelOption.length; i++) {
                    var axisLabelOption = option.AxisLabelOption[i];
                    var axisLabelElem = new PIXI.Text(option.AxisLabel[i]);
                    axisLabelElem.style = option.MasterTextStyle.clone();
                    axisLabelElem.style.fontSize = axisLabelOption.fontSize;
                    axisLabelElem.style.align = axisLabelOption.align;
                    axisLabelElem.anchor.set(axisLabelOption.anchor.x, axisLabelOption.anchor.y);
                    axisLabelElem.position.set(axisLabelOption.position.x, axisLabelOption.position.y);
                    backContainer.addChild(axisLabelElem);
                }
                //Bake into texture
                backContainer.cacheAsBitmap = true;
                return backContainer;
            };
            return FullCircularGauge;
        }(PIXI.Container));
        parts.FullCircularGauge = FullCircularGauge;
    })(parts = webSocketGauge.parts || (webSocketGauge.parts = {}));
})(webSocketGauge || (webSocketGauge = {}));
//# sourceMappingURL=FullCircularGauge.js.map