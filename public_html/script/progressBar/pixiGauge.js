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
/// <reference path="../lib/pixi.js.d.ts" />
var webSocketGauge;
(function (webSocketGauge) {
    var lib;
    (function (lib) {
        var graphics;
        (function (graphics) {
            var Gauge1DOptions = (function () {
                function Gauge1DOptions() {
                    this.Max = 100;
                    this.Min = 0;
                    this.InterPolationAnimation = false;
                }
                return Gauge1DOptions;
            }());
            var Gauge1D = (function (_super) {
                __extends(Gauge1D, _super);
                function Gauge1D(options) {
                    var _this = _super.call(this) || this;
                    if (!(options instanceof Gauge1DOptions))
                        _this.gauge1DOptions = new Gauge1DOptions();
                    else
                        _this.gauge1DOptions = options;
                    _this.value = 0;
                    return _this;
                }
                Object.defineProperty(Gauge1D.prototype, "Max", {
                    get: function () { return this.gauge1DOptions.Max; },
                    set: function (val) { this.gauge1DOptions.Max = val; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Gauge1D.prototype, "Min", {
                    get: function () { return this.gauge1DOptions.Min; },
                    set: function (val) { this.gauge1DOptions.Min = val; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Gauge1D.prototype, "Value", {
                    get: function () { return this.value; },
                    set: function (val) { this.value = val; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Gauge1D.prototype, "InvertDraw", {
                    get: function () { return this.invertDraw; },
                    set: function (flag) { this.invertDraw = flag; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Gauge1D.prototype, "DrawValue", {
                    get: function () {
                        var drawVal;
                        if (this.Value > this.Max)
                            drawVal = this.Max;
                        else if (this.Value < this.Min)
                            drawVal = this.Min;
                        else
                            drawVal = this.Value;
                        if (this.InvertDraw)
                            drawVal = this.Max - drawVal + this.Min;
                        return drawVal;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Gauge1D.prototype, "InterpolatedAnimation", {
                    get: function () { return this.gauge1DOptions.InterPolationAnimation; },
                    set: function (val) { this.gauge1DOptions.InterPolationAnimation = val; },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Apply value and update gauge.
                 */
                Gauge1D.prototype.update = function () {
                    this._update(false);
                };
                /**
                 * Apply value and update gauge with skipping value step check.
                 */
                Gauge1D.prototype.updateForce = function () {
                    this._update(true);
                };
                return Gauge1D;
            }(PIXI.Container));
            var ProgressBarOptions = (function (_super) {
                __extends(ProgressBarOptions, _super);
                function ProgressBarOptions() {
                    return _super.call(this) || this;
                }
                return ProgressBarOptions;
            }(Gauge1DOptions));
            var ProgressBar = (function (_super) {
                __extends(ProgressBar, _super);
                function ProgressBar(options) {
                    var _this = this;
                    var progressBarOptions;
                    if (!(options instanceof ProgressBarOptions)) {
                        progressBarOptions = new ProgressBarOptions();
                    }
                    else {
                        progressBarOptions = options;
                    }
                    _this = _super.call(this, progressBarOptions) || this;
                    _this.progressBarOptions = progressBarOptions;
                    _this.sprite = new PIXI.Sprite();
                    _this.spriteMask = new PIXI.Graphics();
                    //Assign mask to sprite
                    _this.sprite.mask = _this.spriteMask;
                    //Assign texture to sprite
                    _this.sprite.texture = _this.progressBarOptions.Texture;
                    //Assign spirite and mask to container
                    _super.prototype.addChild.call(_this, _this.sprite);
                    _super.prototype.addChild.call(_this, _this.spriteMask);
                    return _this;
                }
                Object.defineProperty(ProgressBar.prototype, "Texture", {
                    get: function () { return this.progressBarOptions.Texture; },
                    set: function (val) {
                        this.progressBarOptions.Texture = val;
                        this.sprite.texture = this.progressBarOptions.Texture;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ProgressBar.prototype, "SpriteMask", {
                    get: function () { return this.spriteMask; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ProgressBar.prototype, "Sprite", {
                    get: function () { return this.sprite; },
                    enumerable: true,
                    configurable: true
                });
                return ProgressBar;
            }(Gauge1D));
            var CircularProgressBarOptions = (function (_super) {
                __extends(CircularProgressBarOptions, _super);
                function CircularProgressBarOptions() {
                    var _this = _super.call(this) || this;
                    _this.OffsetAngle = 0;
                    _this.FullAngle = 360;
                    _this.AngleStep = 0.1;
                    _this.AntiClockwise = false;
                    _this.Center = new PIXI.Point(0, 0);
                    return _this;
                }
                return CircularProgressBarOptions;
            }(ProgressBarOptions));
            graphics.CircularProgressBarOptions = CircularProgressBarOptions;
            var CircularProgressBar = (function (_super) {
                __extends(CircularProgressBar, _super);
                function CircularProgressBar(options) {
                    var _this = this;
                    var circularProgressBarOptions;
                    if (!(options instanceof CircularProgressBarOptions))
                        circularProgressBarOptions = new CircularProgressBarOptions();
                    else
                        circularProgressBarOptions = options;
                    _this = _super.call(this, circularProgressBarOptions) || this;
                    _this.circularProgressBarOptions = circularProgressBarOptions;
                    return _this;
                }
                Object.defineProperty(CircularProgressBar.prototype, "OffsetAngle", {
                    get: function () { return this.circularProgressBarOptions.OffsetAngle; },
                    set: function (val) { this.circularProgressBarOptions.OffsetAngle = val; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(CircularProgressBar.prototype, "FullAngle", {
                    get: function () { return this.circularProgressBarOptions.FullAngle; },
                    set: function (val) { this.circularProgressBarOptions.FullAngle = val; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(CircularProgressBar.prototype, "AngleStep", {
                    get: function () { return this.circularProgressBarOptions.AngleStep; },
                    set: function (val) { this.circularProgressBarOptions.AngleStep = val; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(CircularProgressBar.prototype, "AntiClockwise", {
                    get: function () { return this.circularProgressBarOptions.AntiClockwise; },
                    set: function (val) { this.circularProgressBarOptions.AntiClockwise = val; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(CircularProgressBar.prototype, "Center", {
                    get: function () { return this.circularProgressBarOptions.Center; },
                    set: function (val) { this.circularProgressBarOptions.Center = val; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(CircularProgressBar.prototype, "Radius", {
                    get: function () { return this.circularProgressBarOptions.Radius; },
                    set: function (val) { this.circularProgressBarOptions.Radius = val; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(CircularProgressBar.prototype, "InnerRadius", {
                    get: function () { return this.circularProgressBarOptions.InnerRadius; },
                    set: function (val) { this.circularProgressBarOptions.InnerRadius = val; },
                    enumerable: true,
                    configurable: true
                });
                CircularProgressBar.prototype._update = function (skipStepCheck) {
                    'use strict';
                    var centerPos = this.Center;
                    var radius = this.Radius;
                    var innerRadius = this.InnerRadius;
                    var anticlockwise = this.AntiClockwise;
                    var offsetAngle = this.OffsetAngle;
                    var fullAngle = this.FullAngle;
                    var angleStep = this.AngleStep;
                    var valueMax = this.Max;
                    var valueMin = this.Min;
                    var value = this.DrawValue;
                    var spriteMask = this.SpriteMask;
                    var currentAngle = this.currAngle;
                    var startAngleRad = Math.PI / 180 * offsetAngle;
                    var endAngle;
                    if (!anticlockwise)
                        endAngle = (value - valueMin) / (valueMax - valueMin) * fullAngle + offsetAngle;
                    else
                        endAngle = -(value - valueMin) / (valueMax - valueMin) * fullAngle + offsetAngle;
                    //Check angle displacement over the angleStep or not 
                    var deltaAngle = Math.abs(endAngle - currentAngle);
                    if (!skipStepCheck && deltaAngle < angleStep)
                        return;
                    else {
                        //Round into angleresolution
                        endAngle = Math.floor(endAngle / angleStep) * angleStep;
                        //Update currentAngle
                        this.currAngle = endAngle;
                    }
                    var endAngleRad = Math.PI / 180 * endAngle;
                    // Draw pie-shaped mask
                    spriteMask.clear();
                    spriteMask.beginFill(0x000000, 1);
                    spriteMask.arc(centerPos.x, centerPos.y, radius, startAngleRad, endAngleRad, anticlockwise);
                    spriteMask.arc(centerPos.x, centerPos.y, innerRadius, endAngleRad, startAngleRad, !anticlockwise);
                    spriteMask.endFill();
                    return;
                };
                return CircularProgressBar;
            }(ProgressBar));
            graphics.CircularProgressBar = CircularProgressBar;
            var RectangularProgressBarOptions = (function (_super) {
                __extends(RectangularProgressBarOptions, _super);
                function RectangularProgressBarOptions() {
                    var _this = _super.call(this) || this;
                    _this.Vertical = false;
                    _this.InvertDirection = false;
                    _this.MaskWidth = 100;
                    _this.MaskHeight = 100;
                    _this.PixelStep = 1;
                    return _this;
                }
                return RectangularProgressBarOptions;
            }(ProgressBarOptions));
            graphics.RectangularProgressBarOptions = RectangularProgressBarOptions;
            var RectangularProgressBar = (function (_super) {
                __extends(RectangularProgressBar, _super);
                function RectangularProgressBar(options) {
                    var _this = this;
                    var rectangularProgressBarOptions;
                    if (!(options instanceof RectangularProgressBarOptions))
                        rectangularProgressBarOptions = new RectangularProgressBarOptions();
                    else
                        rectangularProgressBarOptions = options;
                    _this = _super.call(this, rectangularProgressBarOptions) || this;
                    _this.rectangularProgressBarOptions = rectangularProgressBarOptions;
                    return _this;
                }
                Object.defineProperty(RectangularProgressBar.prototype, "Vertical", {
                    get: function () { return this.rectangularProgressBarOptions.Vertical; },
                    set: function (val) { this.rectangularProgressBarOptions.Vertical = val; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RectangularProgressBar.prototype, "InvertDirection", {
                    get: function () { return this.rectangularProgressBarOptions.InvertDirection; },
                    set: function (val) { this.rectangularProgressBarOptions.InvertDirection = val; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RectangularProgressBar.prototype, "MaskWidth", {
                    get: function () { return this.rectangularProgressBarOptions.MaskWidth; },
                    set: function (val) { this.rectangularProgressBarOptions.MaskWidth = val; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RectangularProgressBar.prototype, "MaskHeight", {
                    get: function () { return this.rectangularProgressBarOptions.MaskHeight; },
                    set: function (val) { this.rectangularProgressBarOptions.MaskHeight = val; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RectangularProgressBar.prototype, "PixelStep", {
                    get: function () { return this.rectangularProgressBarOptions.PixelStep; },
                    set: function (val) { this.rectangularProgressBarOptions.PixelStep = val; },
                    enumerable: true,
                    configurable: true
                });
                RectangularProgressBar.prototype._update = function (skipStepCheck) {
                    'use strict';
                    var maskHeight = this.MaskHeight;
                    var maskWidth = this.MaskWidth;
                    var currBarPixel = this.currBarPixel;
                    var pixelStep = this.PixelStep;
                    var valueMax = this.Max;
                    var valueMin = this.Min;
                    var value = this.DrawValue;
                    var spriteMask = this.SpriteMask;
                    var vertical = this.Vertical;
                    var invertDirection = this.InvertDirection;
                    var pixelRange;
                    if (vertical)
                        pixelRange = maskHeight;
                    else
                        pixelRange = maskWidth;
                    var barPixel = (value - valueMin) / (valueMax - valueMin) * pixelRange;
                    // Check deltaPixel over the pixelStep
                    var deltaPixel = Math.abs(barPixel - currBarPixel);
                    if (!skipStepCheck && deltaPixel < pixelStep)
                        return;
                    else {
                        //Round into pixelStep
                        barPixel = Math.floor(barPixel / pixelStep) * pixelStep;
                        this.currBarPixel = barPixel;
                    }
                    //Define mask rectangle parameters
                    var drawMaskX, drawMaskY;
                    var drawMaskHeight, drawMaskWidth;
                    if (vertical) {
                        drawMaskX = 0;
                        drawMaskWidth = maskWidth;
                        drawMaskHeight = barPixel;
                        if (invertDirection)
                            drawMaskY = 0;
                        else
                            drawMaskY = maskHeight - barPixel;
                    }
                    else {
                        drawMaskY = 0;
                        drawMaskHeight = maskHeight;
                        drawMaskWidth = barPixel;
                        if (invertDirection)
                            drawMaskX = maskWidth - barPixel;
                        else
                            drawMaskX = 0;
                    }
                    //Define mask
                    spriteMask.clear();
                    spriteMask.beginFill(0x000000, 1);
                    spriteMask.drawRect(drawMaskX, drawMaskY, drawMaskWidth, drawMaskHeight);
                    spriteMask.endFill();
                    return;
                };
                return RectangularProgressBar;
            }(ProgressBar));
            graphics.RectangularProgressBar = RectangularProgressBar;
            var NeedleGaugeOptions = (function (_super) {
                __extends(NeedleGaugeOptions, _super);
                function NeedleGaugeOptions() {
                    return _super.call(this) || this;
                }
                return NeedleGaugeOptions;
            }(Gauge1DOptions));
            var NeedleGauge = (function (_super) {
                __extends(NeedleGauge, _super);
                function NeedleGauge(options) {
                    var _this = this;
                    var needleGaugeOptions;
                    if (!(options instanceof NeedleGaugeOptions))
                        needleGaugeOptions = new NeedleGaugeOptions();
                    else
                        needleGaugeOptions = options;
                    _this = _super.call(this, needleGaugeOptions) || this;
                    _this.needleGaugeOptions = needleGaugeOptions;
                    _this.sprite = new PIXI.Sprite();
                    _this.sprite.texture = _this.needleGaugeOptions.Texture;
                    //Assign spirite and mask to container
                    _this.addChild(_this.sprite);
                    return _this;
                }
                Object.defineProperty(NeedleGauge.prototype, "Texture", {
                    get: function () { return this.needleGaugeOptions.Texture; },
                    set: function (val) {
                        this.needleGaugeOptions.Texture = val;
                        this.sprite.texture = this.needleGaugeOptions.Texture;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(NeedleGauge.prototype, "Sprite", {
                    get: function () { return this.sprite; },
                    enumerable: true,
                    configurable: true
                });
                return NeedleGauge;
            }(Gauge1D));
            var RotationNeedleGaugeOptions = (function (_super) {
                __extends(RotationNeedleGaugeOptions, _super);
                function RotationNeedleGaugeOptions() {
                    var _this = _super.call(this) || this;
                    _this.OffsetAngle = 0;
                    _this.FullAngle = 360;
                    _this.AngleStep = 0.1;
                    _this.AntiClockwise = false;
                    _this.Pivot = new PIXI.Point(0, 0);
                    return _this;
                }
                return RotationNeedleGaugeOptions;
            }(NeedleGaugeOptions));
            graphics.RotationNeedleGaugeOptions = RotationNeedleGaugeOptions;
            var RotationNeedleGauge = (function (_super) {
                __extends(RotationNeedleGauge, _super);
                function RotationNeedleGauge(options) {
                    var _this = this;
                    var rotationNeedleGaugeOptions;
                    if (!(options instanceof RotationNeedleGaugeOptions))
                        rotationNeedleGaugeOptions = new RotationNeedleGaugeOptions();
                    else
                        rotationNeedleGaugeOptions = options;
                    _this = _super.call(this, rotationNeedleGaugeOptions) || this;
                    _this.rotationNeedleGaugeOptions = rotationNeedleGaugeOptions;
                    //Set sprite pivot
                    _this.Sprite.pivot = _this.rotationNeedleGaugeOptions.Pivot;
                    return _this;
                }
                Object.defineProperty(RotationNeedleGauge.prototype, "OffsetAngle", {
                    get: function () { return this.rotationNeedleGaugeOptions.OffsetAngle; },
                    set: function (val) { this.rotationNeedleGaugeOptions.OffsetAngle = val; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RotationNeedleGauge.prototype, "FullAngle", {
                    get: function () { return this.rotationNeedleGaugeOptions.FullAngle; },
                    set: function (val) { this.rotationNeedleGaugeOptions.FullAngle = val; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RotationNeedleGauge.prototype, "AngleStep", {
                    get: function () { return this.rotationNeedleGaugeOptions.AngleStep; },
                    set: function (val) { this.rotationNeedleGaugeOptions.AngleStep = val; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RotationNeedleGauge.prototype, "AntiClockwise", {
                    get: function () { return this.rotationNeedleGaugeOptions.AntiClockwise; },
                    set: function (val) { this.rotationNeedleGaugeOptions.AntiClockwise = val; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RotationNeedleGauge.prototype, "Pivot", {
                    get: function () { return this.rotationNeedleGaugeOptions.Pivot; },
                    set: function (val) { this.rotationNeedleGaugeOptions.Pivot = val; },
                    enumerable: true,
                    configurable: true
                });
                RotationNeedleGauge.prototype._update = function (skipStepCheck) {
                    'use strict';
                    var anticlockwise = this.AntiClockwise;
                    var offsetAngle = this.OffsetAngle;
                    var fullAngle = this.FullAngle;
                    var angleStep = this.AngleStep;
                    var valueMax = this.Max;
                    var valueMin = this.Min;
                    var value = this.DrawValue;
                    var sprite = this.Sprite;
                    var currentAngle = this.currAngle;
                    var angle;
                    if (!anticlockwise)
                        angle = (value - valueMin) / (valueMax - valueMin) * fullAngle + offsetAngle;
                    else
                        angle = -(value - valueMin) / (valueMax - valueMin) * fullAngle + offsetAngle;
                    //Check angle displacement over the angleStep or not
                    var deltaAngle = Math.abs(angle - currentAngle);
                    if (!skipStepCheck && deltaAngle < angleStep)
                        return;
                    else {
                        //Round into angle_resolution
                        angle = Math.floor(angle / angleStep) * angleStep;
                        //Update currentAngle
                        this.currAngle = angle;
                    }
                    var angleRad = Math.PI / 180 * angle;
                    //Set sprite angle
                    sprite.rotation = angleRad;
                    return;
                };
                return RotationNeedleGauge;
            }(NeedleGauge));
            graphics.RotationNeedleGauge = RotationNeedleGauge;
        })(graphics = lib.graphics || (lib.graphics = {}));
    })(lib = webSocketGauge.lib || (webSocketGauge.lib = {}));
})(webSocketGauge || (webSocketGauge = {}));
//# sourceMappingURL=pixiGauge.js.map