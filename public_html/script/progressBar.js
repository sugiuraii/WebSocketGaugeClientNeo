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

/* global PIXI */

var PixiCustom1DGauge = function()
{
    'use strict';
    /**
     * @private
     */
    this._sprite = new PIXI.Sprite();
    /**
     * @private
     */
    this._max;
    /**
     * @private
     */
    this._min;
    /**
     * @private
     */
    this._value;
    /**
     * @private
     */
    this._InterpolatedAnimation = false;
    
    var self = this;
    /*
    this.Anchor;
    Object.defineProperty(this, "Anchor",
    {
        get : function() {return self._sprite.anchor; }
    });
    this.Position;
    Object.defineProperty(this, "Position",
    {
        get : function() {return self._sprite.position; }
    });
    */
    this.Sprite;
    Object.defineProperty(this, "Sprite",
    {
        get : function(){ return self._sprite;}
    });
    this.Texture;
    Object.defineProperty(this, "Texture",
    {
        get : function(){ return self._sprite.texture; },
        set : function(texture){self._sprite.texture = texture;}
    });
    this.Max;
    Object.defineProperty(this, "Max",
    {
        get : function(){return self._max;},
        set : function(val){ self._max = val;}
    });
    this.Min;
    Object.defineProperty(this, "Min",
    {
        get : function(){return self._min;},
        set : function(val){ self._min = val;}
    });
    this.Value;
    Object.defineProperty(this, "Value",
    {
        get : function(){return self._value;},
        set : function(val){ self._value = val;}
    }); 
    this.InterpolatedAnimation;
    Object.defineProperty(this, "InterpolatedAnimation",
    {
        get : function(){return self._InterpolatedAnimation;},
        set : function(flag){ self._InterpolatedAnimation = flag;}        
    });
};

PixiCustom1DGauge.prototype.getSprite = function()
{
    'use strict';
    return this._sprite;
};

PixiCustom1DGauge.prototype.getContainer = function()
{
    'use strict';
    var container = new PIXI.Container();
    container.addChild(this._sprite);
    container.addChild(this._mask);
    
    return container;
};

PixiCustom1DGauge.prototype.getStage = function()
{
    'use strict';
    var stage = new PIXI.Stage(0x66FF99);
    stage.addChild(this._sprite);
    stage.addChild(this._mask);
    
    return stage;
};

PixiCustom1DGauge.prototype.draw = function()
{
    'use strict';
    this._update();
};

var PixiCustomProgressBar = function()
{
    'use strict';
    PixiCustom1DGauge.call(this);
    this._mask = new PIXI.Graphics();
    this._sprite.mask = this._mask;
};
Object.setPrototypeOf(PixiCustomProgressBar.prototype, PixiCustom1DGauge.prototype);

var PixiCircularCustomProgressBar = function()
{
    'use strict';
    var self = this;
    PixiCustomProgressBar.call(this);
    
    /**
     * @private
     */
    this._offsetAngle = 0;
    /**
     * @private
     */
    this._fullAngle = 360;
    /**
     * @private
     */
    this._angleStep = 0.1;
    /**
     * @private
     */
    this._antiClockwise = false;
    /**
     * @private
     */
    this._pieCenterPosition = new PIXI.Point(0,0);
    /**
     * @private
     */
    this._radius;
    /**
     * @private
     */
    this._innerRadius;
    
    /**
     * @private
     */
    this._currAngle;
    
    this.OffsetAngle;
    Object.defineProperty(this, "OffsetAngle",
    {
        get : function(){ return self._offsetAngle; },
        set : function(val){ self._offsetAngle = val;}
    });
    this.FullAngle;
    Object.defineProperty(this, "FullAngle",
    {
        get : function(){ return self._fullAngle; },
        set : function(val){ self._fullAngle = val;}
    });
    this.AngleStep;
    Object.defineProperty(this, "AngleStep",
    {
        get : function() { return self.angleStep; },
        set : function(val) { self._angleStep = val; }
    });
    this.AntiClockwise;
    Object.defineProperty(this, "AntiClockwise",
    {
        get : function(){ return self._antiClockwise; },
        set : function(flag){ self._antiClockwise = flag;}
    });
    this.Radius;
    Object.defineProperty(this, "Radius",
    {
        get : function(){ return self._radius; },
        set : function(val){ self._radius = val;}
    });
    this.InnerRadius;
    Object.defineProperty(this, "InnerRadius",
    {
        get : function(){ return self._innerRadius; },
        set : function(val){ self._innerRadius = val;}
    });
    this.PieCenterPosition;
    Object.defineProperty(this, "PieCenterPosition",
    {
        get : function(){ return self._pieCenterPosition; },
        set : function(val){ self._pieCenterPosition = val; }
    });
};
Object.setPrototypeOf(PixiCircularCustomProgressBar.prototype, PixiCustomProgressBar.prototype);

/**
 * Update pie shaped mask to create the circular progressbar shape.
 * @param {boolean} skipAngleStepCheck
 * @private
 */
PixiCircularCustomProgressBar.prototype._update = function(skipAngleStepCheck)
{
    'use strict';
    var centerPos = this._pieCenterPosition;
    var radius = this._radius;
    var innerRadius = this._innerRadius;
    var anticlockwise = this._antiClockwise;
    var offsetAngle = this._offsetAngle;
    var fullAngle = this._fullAngle;
    var angleStep = this._angleStep;
    
    var valueMax = this._max;
    var valueMin = this._min;
    var value = this._value;
    
    var mask = this._mask;
    
    var startAngleRad = Math.PI/180*offsetAngle;
    var endAngle = (value - valueMin)/(valueMax - valueMin) * fullAngle + offsetAngle;
    var currentAngle = this._currAngle;
    
    //Check angle displacement over the angleStep or not 
    if(!skipAngleStepCheck && Math.abs(endAngle - currentAngle) < angleStep)
        return;
    else
    {
        //Round into angle_resolution
        endAngle = Math.floor(endAngle/angleStep) * angleStep;
        //Update currentAngle
        this._currAngle = endAngle;
    }
 
    var endAngleRad = Math.PI/180*endAngle;
    
    // Draw pie-shaped mask
    mask.clear();
    mask.beginFill();
    mask.arc(centerPos.x, centerPos.y, radius ,startAngleRad, endAngleRad, anticlockwise);
    mask.arc(centerPos.x, centerPos.y, innerRadius , endAngleRad, startAngleRad, !anticlockwise);    
    mask.endFill();
    
    return;
};