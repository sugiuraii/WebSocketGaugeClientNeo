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
            var Gauge1D = (function (_super) {
                __extends(Gauge1D, _super);
                function Gauge1D() {
                    var _this = _super.call(this) || this;
                    _this.max = 100;
                    _this.min = 0;
                    _this.value = 0;
                    return _this;
                }
                Object.defineProperty(Gauge1D.prototype, "Max", {
                    get: function () { return this.max; },
                    set: function (val) { this.max = val; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Gauge1D.prototype, "Min", {
                    get: function () { return this.min; },
                    set: function (val) { this.min = val; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Gauge1D.prototype, "Value", {
                    get: function () { return this.value; },
                    set: function (val) { this.value = val; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Gauge1D.prototype, "InterpolatedAnimation", {
                    get: function () { return this.interPolationAnimaton; },
                    set: function (val) { this.interPolationAnimaton = val; },
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
            var ProgressBar = (function (_super) {
                __extends(ProgressBar, _super);
                function ProgressBar() {
                    var _this = _super.call(this) || this;
                    _this.sprite = new PIXI.Sprite();
                    _this.spriteMask = new PIXI.Graphics();
                    //Assign mask to sprite
                    _this.sprite.mask = _this.spriteMask;
                    //Assign spirite and mask to container
                    _super.prototype.addChild.call(_this, _this.sprite);
                    _super.prototype.addChild.call(_this, _this.spriteMask);
                    return _this;
                }
                Object.defineProperty(ProgressBar.prototype, "Texture", {
                    get: function () { return this.sprite.texture; },
                    set: function (val) { this.sprite.texture = val; },
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
            var CircularProgressBar = (function (_super) {
                __extends(CircularProgressBar, _super);
                function CircularProgressBar() {
                    var _this = _super.call(this) || this;
                    _this.offsetAngle = 0;
                    _this.fullAngle = 360;
                    _this.angleStep = 0.1;
                    _this.antiClockwise = false;
                    _this.center = new PIXI.Point(0, 0);
                    return _this;
                }
                Object.defineProperty(CircularProgressBar.prototype, "OffsetAngle", {
                    get: function () { return this.offsetAngle; },
                    set: function (val) { this.offsetAngle = val; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(CircularProgressBar.prototype, "FullAngle", {
                    get: function () { return this.fullAngle; },
                    set: function (val) { this.fullAngle = val; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(CircularProgressBar.prototype, "AngleStep", {
                    get: function () { return this.angleStep; },
                    set: function (val) { this.angleStep = val; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(CircularProgressBar.prototype, "AntiClockwise", {
                    get: function () { return this.antiClockwise; },
                    set: function (val) { this.antiClockwise = val; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(CircularProgressBar.prototype, "Center", {
                    get: function () { return this.center; },
                    set: function (val) { this.center = val; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(CircularProgressBar.prototype, "Radius", {
                    get: function () { return this.radius; },
                    set: function (val) { this.radius = val; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(CircularProgressBar.prototype, "InnerRadius", {
                    get: function () { return this.innerRadius; },
                    set: function (val) { this.innerRadius = val; },
                    enumerable: true,
                    configurable: true
                });
                CircularProgressBar.prototype._update = function (skipStepCheck) {
                    'use strict';
                    var centerPos = this.center;
                    var radius = this.radius;
                    var innerRadius = this.innerRadius;
                    var anticlockwise = this.antiClockwise;
                    var offsetAngle = this.offsetAngle;
                    var fullAngle = this.fullAngle;
                    var angleStep = this.angleStep;
                    var valueMax = this.Max;
                    var valueMin = this.Min;
                    var value = this.Value;
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
            var RectangularProgressBar = (function (_super) {
                __extends(RectangularProgressBar, _super);
                function RectangularProgressBar() {
                    var _this = _super.call(this) || this;
                    _this.vertical = false;
                    _this.invertDirection = false;
                    _this.maskWidth = 100;
                    _this.maskHeight = 100;
                    _this.pixelStep = 1;
                    return _this;
                }
                Object.defineProperty(RectangularProgressBar.prototype, "Vertical", {
                    get: function () { return this.vertical; },
                    set: function (val) { this.vertical = val; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RectangularProgressBar.prototype, "InvertDirection", {
                    get: function () { return this.invertDirection; },
                    set: function (val) { this.invertDirection = val; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RectangularProgressBar.prototype, "MaskWidth", {
                    get: function () { return this.maskWidth; },
                    set: function (val) { this.maskWidth = val; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RectangularProgressBar.prototype, "MaskHeight", {
                    get: function () { return this.maskHeight; },
                    set: function (val) { this.maskHeight = val; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RectangularProgressBar.prototype, "PixelStep", {
                    get: function () { return this.pixelStep; },
                    set: function (val) { this.pixelStep = val; },
                    enumerable: true,
                    configurable: true
                });
                RectangularProgressBar.prototype._update = function (skipStepCheck) {
                    'use strict';
                    var maskHeight = this.maskHeight;
                    var maskWidth = this.maskWidth;
                    var currBarPixel = this.currBarPixel;
                    var pixelStep = this.pixelStep;
                    var valueMax = this.Max;
                    var valueMin = this.Min;
                    var value = this.Value;
                    var spriteMask = this.SpriteMask;
                    var vertical = this.vertical;
                    var invertDirection = this.invertDirection;
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
            var NeedleGauge = (function (_super) {
                __extends(NeedleGauge, _super);
                function NeedleGauge() {
                    var _this = _super.call(this) || this;
                    _this.sprite = new PIXI.Sprite();
                    //Assign spirite and mask to container
                    _this.addChild(_this.sprite);
                    return _this;
                }
                Object.defineProperty(NeedleGauge.prototype, "Texture", {
                    get: function () { return this.sprite.texture; },
                    set: function (val) { this.sprite.texture = val; },
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
            var RotationNeedleGauge = (function (_super) {
                __extends(RotationNeedleGauge, _super);
                function RotationNeedleGauge() {
                    var _this = _super.call(this) || this;
                    _this.offsetAngle = 0;
                    _this.fullAngle = 360;
                    _this.angleStep = 0.1;
                    _this.antiClockwise = false;
                    return _this;
                }
                Object.defineProperty(RotationNeedleGauge.prototype, "OffsetAngle", {
                    get: function () { return this.offsetAngle; },
                    set: function (val) { this.offsetAngle = val; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RotationNeedleGauge.prototype, "FullAngle", {
                    get: function () { return this.fullAngle; },
                    set: function (val) { this.fullAngle = val; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RotationNeedleGauge.prototype, "AngleStep", {
                    get: function () { return this.angleStep; },
                    set: function (val) { this.angleStep = val; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RotationNeedleGauge.prototype, "AntiClockwise", {
                    get: function () { return this.antiClockwise; },
                    set: function (val) { this.antiClockwise = val; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RotationNeedleGauge.prototype, "Pivot", {
                    get: function () { return this.Sprite.pivot; },
                    set: function (val) { this.Sprite.pivot = val; },
                    enumerable: true,
                    configurable: true
                });
                RotationNeedleGauge.prototype._update = function (skipStepCheck) {
                    'use strict';
                    var anticlockwise = this.antiClockwise;
                    var offsetAngle = this.offsetAngle;
                    var fullAngle = this.fullAngle;
                    var angleStep = this.angleStep;
                    var valueMax = this.Max;
                    var valueMin = this.Min;
                    var value = this.Value;
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