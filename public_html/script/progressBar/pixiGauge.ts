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
    abstract class Gauge1D
    {
        private max : number;
        private min : number;
        private value : number;
        private interPolationAnimaton : boolean;
        private container : PIXI.Container;
        constructor()
        {
            this.container = new PIXI.Container();
            this.max = 100;
            this.min = 0;
            this.value = 0;
        }
        
        get Max() : number {return this.max;}      
        set Max(val : number) { this.max = val}
        
        get Min() : number { return this.min;}
        set Min(val : number) { this.min = val}
        
        get Value() : number { return this.value;}
        set Value(val : number) { this.value = val;}
        
        get InterpolatedAnimation(): boolean {return this.interPolationAnimaton;}
        set InterpolatedAnimation(val: boolean) {this.interPolationAnimaton = val;}
        
        get Container(): PIXI.Container { return this.container;};
        
        /**
         * Get container.
         * @return {PIXI.Container} container.
         */
        public getContainer(): PIXI.Container
        {
            return this.Container;
        }
        
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
    
    abstract class ProgressBar extends Gauge1D
    {
        private sprite : PIXI.Sprite;
        private mask : PIXI.Graphics;
        
        constructor()
        {
            super();
            this.sprite = new PIXI.Sprite();
            this.mask = new PIXI.Graphics();
            
            //Assign mask to sprite
            this.sprite.mask = this.mask;            
            //Assign spirite and mask to container
            this.Container.addChild(this.sprite);
            this.Container.addChild(this.mask);
        }
        
        get Texture(): PIXI.Texture {return this.sprite.texture; }
        set Texture(val: PIXI.Texture) {this.sprite.texture = val;}
        
        get Mask(): PIXI.Graphics { return this.mask; }
        get Sprite(): PIXI.Sprite { return this.sprite; }

    }
    
    export class CircularProgressBar extends ProgressBar
    {
        private offsetAngle : number;
        private fullAngle : number;
        private angleStep : number;
        private antiClockwise : boolean;
        private center : PIXI.Point;
        private radius : number;
        private innerRadius : number;

        private currAngle : number;
        
        constructor()
        {
            super();
            this.offsetAngle = 0;
            this.fullAngle = 360;
            this.angleStep = 0.1;
            this.antiClockwise = false;
            this.center = new PIXI.Point(0,0);
        }
        
        get OffsetAngle() : number { return this.offsetAngle; }
        set OffsetAngle(val: number) { this.offsetAngle = val; }
        get FullAngle() : number { return this.fullAngle; }
        set FullAngle(val: number) { this.fullAngle = val; }
        get AngleStep(): number {return this.angleStep; }
        set AngleStep(val: number) {this.angleStep = val; }
        get AntiClockwise(): boolean {return this.antiClockwise; }
        set AntiClockwise(val: boolean) {this.antiClockwise = val; }
        get Center() : PIXI.Point { return this.center; }
        set Center(val: PIXI.Point) { this.center = val; }
        get Radius() : number { return this.radius; }
        set Radius(val: number) { this.radius = val; }
        get InnerRadius(): number {return this.innerRadius; }
        set InnerRadius(val: number) {this.innerRadius = val; }
        
        protected _update(skipStepCheck : boolean): void
        {
            'use strict';
            const centerPos: PIXI.Point = this.center;
            const radius : number = this.radius;
            const innerRadius : number = this.innerRadius;
            const anticlockwise: boolean = this.antiClockwise;
            const offsetAngle : number = this.offsetAngle;
            const fullAngle : number = this.fullAngle;
            const angleStep : number = this.angleStep;

            const valueMax : number = this.Max;
            const valueMin : number = this.Min;
            const value : number = this.Value;

            const mask: PIXI.Graphics = this.Mask;

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
            mask.clear();
            mask.beginFill(0x000000, 1);
            mask.arc(centerPos.x, centerPos.y, radius ,startAngleRad, endAngleRad, anticlockwise);
            mask.arc(centerPos.x, centerPos.y, innerRadius , endAngleRad, startAngleRad, !anticlockwise);    
            mask.endFill();

            return;
        }
    }
    
    export class RectangularProgressBar extends ProgressBar
    {
        private currBarPixel : number;
        
        private vertical : boolean;
        private invertDirection : boolean;
        private width : number;
        private height : number;
        private pixelStep : number;
        
        constructor()
        {
            super();
            this.vertical = false;
            this.invertDirection = false;
            this.width = 100;
            this.height = 100;
            this.pixelStep = 1;
        }
        
        get Vertical() : boolean { return this.vertical; }
        set Vertical(val : boolean) { this.vertical = val; }
        get InvertDirection(): boolean {return this.invertDirection; }
        set InvertDirection(val : boolean) { this.invertDirection = val; }
        get Width(): number {return this.width; }
        set Width(val: number) {this.width = val; }
        get Height(): number {return this.height; }
        set Height(val: number) {this.height = val; }
        get PixelStep(): number {return this.pixelStep; }
        set PixelStep(val: number) {this.pixelStep = val; }
        
        protected _update(skipStepCheck : boolean) : void
        {
            'use strict';
            const height: number = this.height;
            const width: number = this.width;
            const currBarPixel: number = this.currBarPixel;
            const pixelStep: number = this.pixelStep;

            const valueMax: number = this.Max;
            const valueMin: number = this.Min;
            const value: number = this.Value;

            const mask: PIXI.Graphics = this.Mask;

            const vertical: boolean = this.vertical;
            const invertDirection: boolean = this.invertDirection;

            let pixelRange: number;
            if(vertical)
                pixelRange = height;
            else
                pixelRange = width;

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
            let maskX: number, maskY: number;
            let maskHeight: number, maskWidth: number;
            if(vertical)
            {
                maskX = 0;
                maskWidth = width;
                maskHeight = barPixel;
                if(invertDirection) //Up to down
                    maskY = 0;
                else //Down to Up
                    maskY = height - barPixel;
            }
            else
            {
                maskY = 0;
                maskHeight = height;
                maskWidth = barPixel;
                if(invertDirection) //Right to left
                    maskX = width - barPixel;
                else //Left to right
                    maskX = 0;
            }

            //Define mask
            mask.clear();
            mask.beginFill(0x000000, 1);
            mask.drawRect(maskX, maskY, maskWidth, maskHeight);
            mask.endFill();

            return;
        }
    }
    
    abstract class NeedleGauge extends Gauge1D
    {
        private sprite : PIXI.Sprite;
        
        constructor()
        {
            super();
            this.sprite = new PIXI.Sprite();
                        
            //Assign spirite and mask to container
            this.Container.addChild(this.sprite);
        }
        
        get Texture(): PIXI.Texture {return this.sprite.texture; }
        set Texture(val: PIXI.Texture) {this.sprite.texture = val;}
        
        get Sprite(): PIXI.Sprite { return this.sprite; }
    }
    
    export class RotationNeedleGauge extends NeedleGauge
    {
        private offsetAngle : number;
        private fullAngle : number;
        private angleStep : number;
        private antiClockwise : boolean;
        
        private currAngle : number;
        
        constructor()
        {
            super();
            this.offsetAngle = 0;
            this.fullAngle = 360;
            this.angleStep = 0.1;
            this.antiClockwise = false;
        }
        
        get OffsetAngle() : number { return this.offsetAngle; }
        set OffsetAngle(val: number) { this.offsetAngle = val; }
        get FullAngle() : number { return this.fullAngle; }
        set FullAngle(val: number) { this.fullAngle = val; }
        get AngleStep(): number {return this.angleStep; }
        set AngleStep(val: number) {this.angleStep = val; }
        get AntiClockwise(): boolean {return this.antiClockwise; }
        set AntiClockwise(val: boolean) {this.antiClockwise = val; }
        get Pivot(): PIXI.Point {return this.Sprite.pivot; }
        set Pivot(val: PIXI.Point) {this.Sprite.pivot = val; }
        
        protected _update(skipStepCheck: boolean): void
        {
            'use strict';
            const anticlockwise : boolean = this.antiClockwise;
            const offsetAngle : number = this.offsetAngle;
            const fullAngle : number = this.fullAngle;
            const angleStep : number = this.angleStep;

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

