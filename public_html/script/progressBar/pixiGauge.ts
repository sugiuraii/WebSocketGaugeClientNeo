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
 
/// <reference path="../lib/pixi.js.d.ts" />

module webSocketGauge.lib.graphics
{
    abstract class Gauge1DOptions
    {
        public Max: number;
        public Min: number;
        public InterPolationAnimation: boolean;
        
        constructor()
        {
            this.Max = 100;
            this.Min = 0;
            this.InterPolationAnimation = false;
        }
    }
    
    abstract class Gauge1D extends PIXI.Container
    {
        private gauge1DOptions: Gauge1DOptions;
        
        private value : number;
        
        constructor(options? : Gauge1DOptions)
        {
            super();
            if !(options instanceof Gauge1DOptions)
                this.gauge1DOptions = new Gauge1DOptions;
            else
                this.gauge1DOptions = options;
                
            this.value = 0;
        }
        
        get Max(): number {return this.gauge1DOptions.Max;}      
        set Max(val : number) { this.gauge1DOptions.Max = val;}
        
        get Min() : number { return this.gauge1DOptions.Min;}
        set Min(val : number) { this.gauge1DOptions.Min = val;}
        
        get Value() : number { return this.value;}
        set Value(val : number) { this.value = val;}
        
        get InterpolatedAnimation(): boolean {return this.gauge1DOptions.InterPolationAnimation;}
        set InterpolatedAnimation(val: boolean) {this.gauge1DOptions.InterPolationAnimation = val;}
                
        /**
         * Apply value and update gauge.
         */
        public update() : void
        {
            this._update(false);
        }
        
        /**
         * Apply value and update gauge with skipping value step check.
         */
        public updateForce() : void
        {
            this._update(true);
        }
        
        /**
         * Function to update gauge state by value.
         */
        protected abstract _update(skipStepCheck : boolean) : void;
    }
    
    abstract class ProgressBarOptions extends Gauge1DOptions
    {
        public Texture: PIXI.Texture;
        constructor()
        {
            super();
        }
    }
    
    abstract class ProgressBar extends Gauge1D
    {
        private progressBarOptions: ProgressBarOptions;
        private sprite : PIXI.Sprite;
        private spriteMask : PIXI.Graphics;
        
        constructor(options?: ProgressBarOptions)
        {
            if !(options instanceof ProgressBarOptions)
            {
                this.progressBarOptions = new ProgressBarOptions();
            }
            else
            {
                this.progressBarOptions = options;
            }
            super(this.progressBarOptions);
            
            this.sprite = new PIXI.Sprite();
            this.spriteMask = new PIXI.Graphics();
            
            //Assign mask to sprite
            this.sprite.mask = this.spriteMask;            
            //Assign texture to sprite
            this.sprite.texture = this.progressBarOptions.Texture;

            //Assign spirite and mask to container
            super.addChild(this.sprite);
            super.addChild(this.spriteMask);
        }
        
        get Texture(): PIXI.Texture {return this.progressBarOptions.Texture; }
        set Texture(val: PIXI.Texture) 
        {
            this.progressBarOptions.Texture = val;
            this.sprite.texture = this.progressBarOptions.Texture;
        }
        
        get SpriteMask(): PIXI.Graphics { return this.spriteMask; }
        get Sprite(): PIXI.Sprite { return this.sprite; }

    }
    
    export class CircularProgressBarOptions extends ProgressBarOptions
    {
        public OffsetAngle : number;
        public FullAngle : number;
        public AngleStep : number;
        public AntiClockwise : boolean;
        public Center : PIXI.Point;
        public Radius : number;
        public InnerRadius : number;
        constructor()
        {
            super();
            this.OffsetAngle = 0;
            this.FullAngle = 360;
            this.AngleStep = 0.1;
            this.AntiClockwise = false;
            this.Center = new PIXI.Point(0,0);
        }
    }
    
    export class CircularProgressBar extends ProgressBar
    {
        private circularProgressBarOptions: CircularProgressBarOptions;

        private currAngle : number;
        
        constructor(options?: CircularProgressBarOptions)
        {
            if !(options instanceof CircularProgressBarOptions)
                this.circularProgressBarOptions = new CircularProgressBarOptions();
            else
                this.circularProgressBarOptions = options;
            
            super(this.circularProgressBarOptions);
        }
        
        get OffsetAngle(): number {return this.circularProgressBarOptions.OffsetAngle; }
        set OffsetAngle(val: number) {this.circularProgressBarOptions.OffsetAngle = val; }
        get FullAngle(): number {return this.circularProgressBarOptions.FullAngle; }
        set FullAngle(val: number) {this.circularProgressBarOptions.FullAngle = val; }
        get AngleStep(): number {return this.circularProgressBarOptions.AngleStep; }
        set AngleStep(val: number) {this.circularProgressBarOptions.AngleStep = val; }
        get AntiClockwise(): boolean {return this.circularProgressBarOptions.AntiClockwise; }
        set AntiClockwise(val: boolean) {this.circularProgressBarOptions.AntiClockwise = val; }
        get Center(): PIXI.Point {return this.circularProgressBarOptions.Center; }
        set Center(val: PIXI.Point) {this.circularProgressBarOptions.Center = val; }
        get Radius(): number {return this.circularProgressBarOptions.Radius; }
        set Radius(val: number) {this.circularProgressBarOptions.Radius = val; }
        get InnerRadius(): number {return this.circularProgressBarOptions.InnerRadius; }
        set InnerRadius(val: number) {this.circularProgressBarOptions.InnerRadius = val; }
        
        protected _update(skipStepCheck : boolean): void
        {
            'use strict';
            const centerPos: PIXI.Point = this.Center;
            const radius : number = this.Radius;
            const innerRadius : number = this.InnerRadius;
            const anticlockwise: boolean = this.AntiClockwise;
            const offsetAngle : number = this.OffsetAngle;
            const fullAngle : number = this.FullAngle;
            const angleStep : number = this.AngleStep;

            const valueMax : number = this.Max;
            const valueMin : number = this.Min;
            const value : number = this.Value;

            const spriteMask: PIXI.Graphics = this.SpriteMask;

            const currentAngle : number = this.currAngle;
            const startAngleRad : number = Math.PI/180*offsetAngle;
            let endAngle  : number;

            if(!anticlockwise)
                endAngle = (value - valueMin)/(valueMax - valueMin) * fullAngle + offsetAngle;
            else
                endAngle = -(value - valueMin)/(valueMax - valueMin) * fullAngle + offsetAngle;

            //Check angle displacement over the angleStep or not 
            const deltaAngle: number = Math.abs(endAngle - currentAngle);
            if(!skipStepCheck && deltaAngle < angleStep)
                return;
            else
            {
                //Round into angleresolution
                endAngle = Math.floor(endAngle/angleStep) * angleStep;
                //Update currentAngle
                this.currAngle = endAngle;
            }

            const endAngleRad: number = Math.PI/180*endAngle;

            // Draw pie-shaped mask
            spriteMask.clear();
            spriteMask.beginFill(0x000000, 1);
            spriteMask.arc(centerPos.x, centerPos.y, radius ,startAngleRad, endAngleRad, anticlockwise);
            spriteMask.arc(centerPos.x, centerPos.y, innerRadius , endAngleRad, startAngleRad, !anticlockwise);    
            spriteMask.endFill();

            return;
        }
    }
    
    export class RectangularProgressBarOptions extends ProgressBarOptions
    {
        public Vertical : boolean;
        public InvertDirection : boolean;
        public MaskWidth : number;
        public MaskHeight : number;
        public PixelStep : number;
        
        constructor()
        {
            super();
            this.Vertical = false;
            this.InvertDirection = false;
            this.MaskWidth = 100;
            this.MaskHeight = 100;
            this.PixelStep = 1;
        }
    }
    
    export class RectangularProgressBar extends ProgressBar
    {
        private rectangularProgressBarOptions: RectangularProgressBarOptions;
        
        private currBarPixel : number;
                
        constructor(options?: RectangularProgressBarOptions)
        {
            if !(options instanceof RectangularProgressBarOptions)
                this.rectangularProgressBarOptions = new RectangularProgressBarOptions();
            else
                this.rectangularProgressBarOptions = options;
            super(this.rectangularProgressBarOptions);
        }
        
        get Vertical() : boolean { return this.rectangularProgressBarOptions.Vertical; }
        set Vertical(val : boolean) { this.rectangularProgressBarOptions.Vertical = val; }
        get InvertDirection(): boolean {return this.rectangularProgressBarOptions.InvertDirection; }
        set InvertDirection(val : boolean) { this.rectangularProgressBarOptions.InvertDirection = val; }
        get MaskWidth(): number {return this.rectangularProgressBarOptions.MaskWidth; }
        set MaskWidth(val: number) {this.rectangularProgressBarOptions.MaskWidth = val; }
        get MaskHeight(): number {return this.rectangularProgressBarOptions.MaskHeight; }
        set MaskHeight(val: number) {this.rectangularProgressBarOptions.MaskHeight = val; }
        get PixelStep(): number {return this.rectangularProgressBarOptions.PixelStep; }
        set PixelStep(val: number) {this.rectangularProgressBarOptions.PixelStep = val; }
        
        protected _update(skipStepCheck : boolean) : void
        {
            'use strict';
            const maskHeight: number = this.MaskHeight;
            const maskWidth: number = this.MaskWidth;
            const currBarPixel: number = this.currBarPixel;
            const pixelStep: number = this.PixelStep;

            const valueMax: number = this.Max;
            const valueMin: number = this.Min;
            const value: number = this.Value;

            const spriteMask: PIXI.Graphics = this.SpriteMask;

            const vertical: boolean = this.Vertical;
            const invertDirection: boolean = this.InvertDirection;

            let pixelRange: number;
            if(vertical)
                pixelRange = maskHeight;
            else
                pixelRange = maskWidth;

            let barPixel = (value - valueMin)/(valueMax - valueMin)*pixelRange;

            // Check deltaPixel over the pixelStep
            const deltaPixel: number = Math.abs(barPixel - currBarPixel);
            if(!skipStepCheck && deltaPixel < pixelStep )
                return;
            else
            {
                //Round into pixelStep
                barPixel = Math.floor(barPixel/pixelStep) * pixelStep;
                this.currBarPixel = barPixel;
            }

            //Define mask rectangle parameters
            let drawMaskX: number, drawMaskY: number;
            let drawMaskHeight: number, drawMaskWidth: number;
            if(vertical)
            {
                drawMaskX = 0;
                drawMaskWidth = maskWidth;
                drawMaskHeight = barPixel;
                if(invertDirection) //Up to down
                    drawMaskY = 0;
                else //Down to Up
                    drawMaskY = maskHeight - barPixel;
            }
            else
            {
                drawMaskY = 0;
                drawMaskHeight = maskHeight;
                drawMaskWidth = barPixel;
                if(invertDirection) //Right to left
                    drawMaskX = maskWidth - barPixel;
                else //Left to right
                    drawMaskX = 0;
            }

            //Define mask
            spriteMask.clear();
            spriteMask.beginFill(0x000000, 1);
            spriteMask.drawRect(drawMaskX, drawMaskY, drawMaskWidth, drawMaskHeight);
            spriteMask.endFill();

            return;
        }
    }
    
    abstract class NeedleGaugeOptions extends Gauge1DOptions
    {
        public Texture: PIXI.Texture;
        constructor()
        {
            super();
        }
    }
    abstract class NeedleGauge extends Gauge1D
    {
        private needleGaugeOptions: NeedleGaugeOptions;
        
        private sprite : PIXI.Sprite;
        
        constructor(options?: NeedleGaugeOptions)
        {
            if !(options instanceof NeedleGaugeOptions)
                this.needleGaugeOptions = new NeedleGaugeOptions();
            else
                this.needleGaugeOptions = options;
            super(this.needleGaugeOptions);
            
            this.sprite = new PIXI.Sprite();
            this.sprite.texture = this.needleGaugeOptions.Texture;
                        
            //Assign spirite and mask to container
            this.addChild(this.sprite);
        }
        
        get Texture(): PIXI.Texture {return this.needleGaugeOptions.Texture; }
        set Texture(val: PIXI.Texture) 
        {
            this.needleGaugeOptions.Texture = val;
            this.sprite.texture = this.needleGaugeOptions.Texture;
        }
        
        get Sprite(): PIXI.Sprite { return this.sprite; }
    }
    
    export class RotationNeedleGaugeOptions extends NeedleGaugeOptions
    {
        public OffsetAngle : number;
        public FullAngle : number;
        public AngleStep : number;
        public AntiClockwise : boolean;
        public Pivot: PIXI.Point;
        constructor()
        {
            super();
            this.OffsetAngle = 0;
            this.FullAngle = 360;
            this.AngleStep = 0.1;
            this.AntiClockwise = false;
            this.Pivot = new PIXI.Point();
        }
    }
    
    export class RotationNeedleGauge extends NeedleGauge
    {
        private rotationNeedleGaugeOptions: RotationNeedleGaugeOptions;
        
        private currAngle : number;
        
        constructor(options?: RotationNeedleGaugeOptions)
        {
            if !(options instanceof RotationNeedleGaugeOptions)
                this.rotationNeedleGaugeOptions = new RotationNeedleGaugeOptions();
            else
                this.rotationNeedleGaugeOptions = options;
            super(this.rotationNeedleGaugeOptions);
            
            //Set sprite pivot
            this.Sprite.pivot = this.rotationNeedleGaugeOptions.Pivot;
        }
        
        get OffsetAngle() : number { return this.rotationNeedleGaugeOptions.OffsetAngle; }
        set OffsetAngle(val: number) { this.rotationNeedleGaugeOptions.OffsetAngle = val; }
        get FullAngle() : number { return this.rotationNeedleGaugeOptions.FullAngle; }
        set FullAngle(val: number) { this.rotationNeedleGaugeOptions.FullAngle = val; }
        get AngleStep(): number {return this.rotationNeedleGaugeOptions.AngleStep; }
        set AngleStep(val: number) {this.rotationNeedleGaugeOptions.AngleStep = val; }
        get AntiClockwise(): boolean {return this.rotationNeedleGaugeOptions.AntiClockwise; }
        set AntiClockwise(val: boolean) {this.rotationNeedleGaugeOptions.AntiClockwise = val; }
        get Pivot(): PIXI.Point {return this.rotationNeedleGaugeOptions.Pivot; }
        set Pivot(val: PIXI.Point) {this.rotationNeedleGaugeOptions.Pivot = val; }
        
        protected _update(skipStepCheck: boolean): void
        {
            'use strict';
            const anticlockwise : boolean = this.AntiClockwise;
            const offsetAngle : number = this.OffsetAngle;
            const fullAngle : number = this.FullAngle;
            const angleStep : number = this.AngleStep;

            const valueMax : number = this.Max;
            const valueMin : number = this.Min;
            const value : number = this.Value;

            const sprite: PIXI.Sprite = this.Sprite;

            const currentAngle: number= this.currAngle;
            let angle: number;
            if(!anticlockwise)
                angle = (value - valueMin)/(valueMax - valueMin) * fullAngle + offsetAngle;
            else
                angle = -(value - valueMin)/(valueMax - valueMin) * fullAngle + offsetAngle;

            //Check angle displacement over the angleStep or not
            const deltaAngle: number = Math.abs(angle - currentAngle);
            if(!skipStepCheck && deltaAngle < angleStep)
                return;
            else
            {
                //Round into angle_resolution
                angle = Math.floor(angle/angleStep) * angleStep;
                //Update currentAngle
                this.currAngle = angle;
            }

            const angleRad: number = Math.PI/180*angle;

            //Set sprite angle
            sprite.rotation = angleRad;

            return;
        }
    }    
}

