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
            var Gauge1D = (function () {
                function Gauge1D() {
                    this.container = new PIXI.Container();
                    this.max = 100;
                    this.min = 0;
                    this.value = 0;
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
                Object.defineProperty(Gauge1D.prototype, "Container", {
                    get: function () { return this.container; },
                    enumerable: true,
                    configurable: true
                });
                ;
                /**
                 * Get container.
                 * @return {PIXI.Container} container.
                 */
                Gauge1D.prototype.getContainer = function () {
                    return this.Container;
                };
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
            }());
            graphics.Gauge1D = Gauge1D;
            var ProgressBar = (function (_super) {
                __extends(ProgressBar, _super);
                function ProgressBar() {
                    var _this = _super.call(this) || this;
                    _this.sprite = new PIXI.Sprite();
                    _this.mask = new PIXI.Graphics();
                    //Assign mask to sprite
                    _this.sprite.mask = _this.mask;
                    //Assign spirite and mask to container
                    _this.Container.addChild(_this.sprite);
                    _this.Container.addChild(_this.mask);
                    return _this;
                }
                Object.defineProperty(ProgressBar.prototype, "Texture", {
                    get: function () { return this.sprite.texture; },
                    set: function (val) { this.sprite.texture = val; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ProgressBar.prototype, "Mask", {
                    get: function () { return this.mask; },
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
            graphics.ProgressBar = ProgressBar;
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
                    var mask = this.Mask;
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
                    mask.clear();
                    mask.beginFill(0x000000, 1);
                    mask.arc(centerPos.x, centerPos.y, radius, startAngleRad, endAngleRad, anticlockwise);
                    mask.arc(centerPos.x, centerPos.y, innerRadius, endAngleRad, startAngleRad, !anticlockwise);
                    mask.endFill();
                    return;
                };
                return CircularProgressBar;
            }(ProgressBar));
            graphics.CircularProgressBar = CircularProgressBar;
        })(graphics = lib.graphics || (lib.graphics = {}));
    })(lib = webSocketGauge.lib || (webSocketGauge.lib = {}));
})(webSocketGauge || (webSocketGauge = {}));
//# sourceMappingURL=pixiGauge.js.map