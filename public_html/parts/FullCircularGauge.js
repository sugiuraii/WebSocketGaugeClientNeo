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
        for (var i = 0; i < 4; i++) {
            gaugeArray.push(new webSocketGauge.parts.FullCircularGauge());
            gaugeArray[index].create();
            gaugeArray[index].mainContainer.pivot = new PIXI.Point(200, 200);
            gaugeArray[index].mainContainer.scale.set(0.7, 0.7);
            gaugeArray[index].mainContainer.position = new PIXI.Point(300 * i + 200, 300 * j + 200);
            app.stage.addChild(gaugeArray[index].mainContainer);
            index++;
        }
    }
    app.ticker.add(function () {
        for (var i = 0; i < gaugeArray.length; i++) {
            if (gaugeArray[i].getVal() + 0.01 >= 2.0)
                gaugeArray[i].setVal(-1.0);
            else
                gaugeArray[i].setVal(gaugeArray[i].getVal() + 0.03 * (i + 1));
        }
    });
}
var webSocketGauge;
(function (webSocketGauge) {
    var parts;
    (function (parts) {
        var TextOption = (function () {
            function TextOption(text, position, anchor, align, fontsize) {
                this.position = new PIXI.Point(0, 0);
                this.anchor = new PIXI.Point(0, 0);
                if (typeof (text) !== "undefined")
                    this.text = text;
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
                returnObj.text = this.text;
                returnObj.position = this.position.clone();
                returnObj.anchor = this.anchor.clone();
                returnObj.align = this.align;
                returnObj.fontSize = this.fontSize;
                return returnObj;
            };
            return TextOption;
        }());
        parts.TextOption = TextOption;
        var FullCircularGaugeOptions = (function (_super) {
            __extends(FullCircularGaugeOptions, _super);
            function FullCircularGaugeOptions() {
                var _this = _super.call(this) || this;
                _this.RedZoneBarEnable = true;
                _this.YellowZoneBarEnable = true;
                _this.GreenZoneBarEnable = true;
                _this.RedZoneBarOffsetAngle = 315;
                _this.YellowZoneBarOffsetAngle = 270;
                _this.GreenZoneBarOffsetAngle = 90;
                _this.RedZoneBarFullAngle = 40;
                _this.YellowZoneBarFullAngle = 45;
                _this.GreenZoneBarFullAngle = 45;
                _this.MasterTextStyle = new PIXI.TextStyle({
                    dropShadow: true,
                    dropShadowBlur: 10,
                    dropShadowColor: "white",
                    dropShadowDistance: 0,
                    fill: "white",
                    fontFamily: "FreeSans-Bold"
                });
                _this.TitleLabelOption = new TextOption("TURBO BOOST", new PIXI.Point(400 / 2, 740 / 2), new PIXI.Point(0.5, 0.5), "center", 75 / 2);
                _this.UnitLabelOption = new TextOption("x100kpa", new PIXI.Point(400 / 2, 470 / 2), new PIXI.Point(0.5, 0.5), "center", 45 / 2);
                _this.AxisLabelOption = new Array();
                _this.ValueNumberRoundDigit = 1;
                _this.createDefaultAxisLabel();
                _this.OffsetAngle = 90;
                _this.FullAngle = 270;
                _this.Min = -1.0;
                _this.Max = 2.0;
                _this.AngleStep = 0.1;
                _this.Center.set(400 / 2, 400 / 2);
                _this.Radius = 300 / 2;
                _this.InnerRadius = 100 / 2;
                return _this;
            }
            FullCircularGaugeOptions.prototype.createDefaultAxisLabel = function () {
                var axisLabelFontSize = 55 / 2;
                this.AxisLabelOption.push(new TextOption("-1.0", new PIXI.Point(415 / 2, 670 / 2), new PIXI.Point(0, 0.5), "left", axisLabelFontSize));
                this.AxisLabelOption.push(new TextOption("-0.5", new PIXI.Point(180 / 2, 620 / 2), new PIXI.Point(1, 0.5), "right", axisLabelFontSize));
                this.AxisLabelOption.push(new TextOption("0", new PIXI.Point(90 / 2, 385 / 2), new PIXI.Point(1, 0.5), "right", axisLabelFontSize));
                this.AxisLabelOption.push(new TextOption("+0.5", new PIXI.Point(180 / 2, 150 / 2), new PIXI.Point(1, 0.5), "right", axisLabelFontSize));
                this.AxisLabelOption.push(new TextOption("+1.0", new PIXI.Point(400 / 2, 80 / 2), new PIXI.Point(0.5, 1), "center", axisLabelFontSize));
                this.AxisLabelOption.push(new TextOption("+1.5", new PIXI.Point(620 / 2, 150 / 2), new PIXI.Point(0, 0.5), "left", axisLabelFontSize));
                this.AxisLabelOption.push(new TextOption("+2.0", new PIXI.Point(680 / 2, 390 / 2), new PIXI.Point(0.5, 0), "center", axisLabelFontSize));
            };
            return FullCircularGaugeOptions;
        }(CircularProgressBarOptions));
        parts.FullCircularGaugeOptions = FullCircularGaugeOptions;
        var FullCircularGauge = (function () {
            function FullCircularGauge() {
                this.gaugeOption = new FullCircularGaugeOptions();
            }
            FullCircularGauge.preloadTextures = function () {
                PIXI.loader.add("FullCircularGauge_RedZone_Bar.png")
                    .add("FullCircularGauge_GreenZone_Bar.png")
                    .add("FullCircularGauge_YellowZone_Bar.png")
                    .add("FullCircularGauge_Back.png")
                    .add("FullCircularGauge_Grid.png")
                    .add("FullCircularGauge_Shaft.png")
                    .add("FullCircularGauge_ValueBar.png");
            };
            FullCircularGauge.prototype.create = function () {
                this.mainContainer = new PIXI.Container();
                this.createBackTexture();
                this.mainContainer.addChild(this.backContainer);
                var option = this.gaugeOption;
                option.ValueBarTexture = PIXI.loader.resources["FullCircularGauge_ValueBar.png"].texture;
                this.progressBar = new CircularProgressBar(option);
                this.progressBar.Texture = option.ValueBarTexture;
                this.mainContainer.addChild(this.progressBar);
                this.valueTextLabel = new PIXI.Text(option.Min.toFixed(option.ValueNumberRoundDigit).toString());
                this.valueTextLabel.style = option.MasterTextStyle.clone();
                this.valueTextLabel.style.fontSize = 160 / 2;
                this.valueTextLabel.position.set(400 / 2, 370 / 2);
                this.valueTextLabel.anchor.set(0.5, 0.5);
                this.valueTextLabel.style.align = "center";
                this.valueTextLabel.style.letterSpacing = -6 / 2;
                this.mainContainer.addChild(this.valueTextLabel);
            };
            FullCircularGauge.prototype.setVal = function (value) {
                this.progressBar.Value = value;
                this.progressBar.update();
                if (value.toFixed(this.gaugeOption.ValueNumberRoundDigit).toString() !== this.valueTextLabel.text)
                    this.valueTextLabel.text = value.toFixed(this.gaugeOption.ValueNumberRoundDigit).toString();
            };
            FullCircularGauge.prototype.getVal = function () {
                return this.progressBar.Value;
            };
            FullCircularGauge.prototype.createBackTexture = function () {
                var backContainer = this.backContainer = new PIXI.Container();
                //Unlock baked texture
                backContainer.cacheAsBitmap = false;
                var option = this.gaugeOption;
                //Setup Textures
                option.RedZoneBarTexture = PIXI.loader.resources["FullCircularGauge_RedZone_Bar.png"].texture;
                option.GreenZoneBarTexture = PIXI.loader.resources["FullCircularGauge_GreenZone_Bar.png"].texture;
                option.YellowZoneBarTexture = PIXI.loader.resources["FullCircularGauge_YellowZone_Bar.png"].texture;
                option.BackTexture = PIXI.loader.resources["FullCircularGauge_Back.png"].texture;
                option.GridTexture = PIXI.loader.resources["FullCircularGauge_Grid.png"].texture;
                option.ShaftTexture = PIXI.loader.resources["FullCircularGauge_Shaft.png"].texture;
                var redzoneBar = new CircularProgressBar();
                redzoneBar.OffsetAngle = option.RedZoneBarOffsetAngle;
                redzoneBar.FullAngle = option.RedZoneBarFullAngle;
                redzoneBar.Texture = option.RedZoneBarTexture;
                redzoneBar.Value = redzoneBar.Max;
                redzoneBar.Center.set(400 / 2, 400 / 2);
                redzoneBar.Radius = 400 / 2;
                redzoneBar.InnerRadius = 0;
                redzoneBar.updateForce();
                var yellowzoneBar = new CircularProgressBar();
                yellowzoneBar.OffsetAngle = option.YellowZoneBarOffsetAngle;
                yellowzoneBar.FullAngle = option.YellowZoneBarFullAngle;
                yellowzoneBar.Texture = option.YellowZoneBarTexture;
                yellowzoneBar.Value = yellowzoneBar.Max;
                yellowzoneBar.Center.set(400 / 2, 400 / 2);
                yellowzoneBar.Radius = 400 / 2;
                yellowzoneBar.InnerRadius = 0;
                yellowzoneBar.updateForce();
                var greenzoneBar = new CircularProgressBar();
                greenzoneBar.OffsetAngle = option.GreenZoneBarOffsetAngle;
                greenzoneBar.FullAngle = option.GreenZoneBarFullAngle;
                greenzoneBar.Texture = option.GreenZoneBarTexture;
                greenzoneBar.Value = greenzoneBar.Max;
                greenzoneBar.Center.set(400 / 2, 400 / 2);
                greenzoneBar.Radius = 400 / 2;
                greenzoneBar.InnerRadius = 0;
                greenzoneBar.updateForce();
                var backSprite = new PIXI.Sprite();
                backSprite.texture = option.BackTexture;
                var gridSprite = new PIXI.Sprite();
                gridSprite.texture = option.GridTexture;
                var shaftSprite = new PIXI.Sprite();
                shaftSprite.texture = option.ShaftTexture;
                //Assing container to items
                backContainer.addChild(backSprite);
                backContainer.addChild(redzoneBar);
                backContainer.addChild(yellowzoneBar);
                backContainer.addChild(greenzoneBar);
                backContainer.addChild(gridSprite);
                backContainer.addChild(shaftSprite);
                //Set Title and unit text
                var titleTextElem = new PIXI.Text(this.gaugeOption.TitleLabelOption.text);
                var titleTextOption = this.gaugeOption.TitleLabelOption;
                titleTextElem.style = this.gaugeOption.MasterTextStyle.clone();
                titleTextElem.style.fontSize = titleTextOption.fontSize;
                titleTextElem.style.align = titleTextOption.align;
                titleTextElem.anchor.set(titleTextOption.anchor.x, titleTextOption.anchor.y);
                titleTextElem.position.set(titleTextOption.position.x, titleTextOption.position.y);
                var unitTextElem = new PIXI.Text(this.gaugeOption.UnitLabelOption.text);
                var unitTextOption = this.gaugeOption.UnitLabelOption;
                unitTextElem.style = this.gaugeOption.MasterTextStyle.clone();
                unitTextElem.style.fontSize = unitTextOption.fontSize;
                unitTextElem.style.align = unitTextOption.align;
                unitTextElem.anchor.set(unitTextOption.anchor.x, unitTextOption.anchor.y);
                unitTextElem.position.set(unitTextOption.position.x, unitTextOption.position.y);
                backContainer.addChild(titleTextElem);
                backContainer.addChild(unitTextElem);
                //Set axis label
                for (var i = 0; i < this.gaugeOption.AxisLabelOption.length; i++) {
                    var axisLabelOption = this.gaugeOption.AxisLabelOption[i];
                    var axisLabelElem = new PIXI.Text(axisLabelOption.text);
                    axisLabelElem.style = this.gaugeOption.MasterTextStyle.clone();
                    axisLabelElem.style.fontSize = axisLabelOption.fontSize;
                    axisLabelElem.style.align = axisLabelOption.align;
                    axisLabelElem.anchor.set(axisLabelOption.anchor.x, axisLabelOption.anchor.y);
                    axisLabelElem.position.set(axisLabelOption.position.x, axisLabelOption.position.y);
                    backContainer.addChild(axisLabelElem);
                }
                //Bake into texture
                backContainer.cacheAsBitmap = true;
            };
            return FullCircularGauge;
        }());
        parts.FullCircularGauge = FullCircularGauge;
    })(parts = webSocketGauge.parts || (webSocketGauge.parts = {}));
})(webSocketGauge || (webSocketGauge = {}));
//# sourceMappingURL=FullCircularGauge.js.map