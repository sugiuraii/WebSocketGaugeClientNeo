/* 
 * The MIT License
 *
 * Copyright 2017 kuniaki.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
import { ProgressBarOptions } from './ProgressBarBase'
import { ProgressBar } from './ProgressBarBase'
import * as PIXI from 'pixi.js';

/**
 * Option class for CircularProgressBar.
 */
export class CircularProgressBarOptions extends ProgressBarOptions {
    /**
     * Offset angle (angle of value=Min)
     */
    public OffsetAngle: number;
    /**
     * Drawing angle of value=Max.
     * (Actual progress bar drawing angle = OffsetAngle + FullAngle).
     */
    public FullAngle: number;
    /**
     * Angle tick step.
     */
    public AngleStep: number;
    /**
     * Drawing direction. (Anticlockwise drawing in true).
     */
    public AntiClockwise: boolean;
    /**
     * Center position.
     */
    public Center: PIXI.Point;
    /**
     * Outer clipping radius of progress bar.
     */
    public Radius: number;
    /**
     * Inner clipping radius of progress bar.
     */
    public InnerRadius: number;
    constructor() {
        super();
        this.OffsetAngle = 0;
        this.FullAngle = 360;
        this.AngleStep = 0.1;
        this.AntiClockwise = false;
        this.Center = new PIXI.Point(0, 0);
        this.Radius = 0;
        this.InnerRadius = 0;
    }
}

/**
 * Circular progressbar class.
 */
export class CircularProgressBar extends ProgressBar {
    private circularProgressbarOptions: CircularProgressBarOptions;

    private currAngle: number;

    /**
     * @param options CircularProgressBarOption to set.
     */
    constructor(options: CircularProgressBarOptions) {
        super(options);
        this.circularProgressbarOptions = options;
        this.currAngle = options.OffsetAngle;
    }

    /**
     * Get Options.
     * @return Options.
     */
    get Options(): CircularProgressBarOptions { return this.circularProgressbarOptions }

    /**
     * Update progress bar.
     * @param skipStepCheck Skip checking angle displacement over the angleStep or not.
     */
    protected _update(skipStepCheck: boolean): void {
        // Update texture reference of sprite.
        this.Sprite.texture = this.Options.Texture;

        const centerPos: PIXI.Point = this.Options.Center;
        const radius: number = this.Options.Radius;
        const innerRadius: number = this.Options.InnerRadius;
        const anticlockwise: boolean = this.Options.AntiClockwise;
        const offsetAngle: number = this.Options.OffsetAngle;
        const fullAngle: number = this.Options.FullAngle;
        const angleStep: number = this.Options.AngleStep;

        const valueMax: number = this.Options.Max;
        const valueMin: number = this.Options.Min;
        const value: number = this.DrawValue;

        const spriteMask: PIXI.Graphics = this.SpriteMask;

        const currentAngle: number = this.currAngle;
        const startAngleRad: number = Math.PI / 180 * offsetAngle;
        let endAngle: number;

        if (!anticlockwise)
            endAngle = (value - valueMin) / (valueMax - valueMin) * fullAngle + offsetAngle;
        else
            endAngle = -(value - valueMin) / (valueMax - valueMin) * fullAngle + offsetAngle;

        //Check angle displacement over the angleStep or not 
        const deltaAngle: number = Math.abs(endAngle - currentAngle);
        if (!skipStepCheck && deltaAngle < angleStep)
            return;
        else {
            //Round into angleresolution
            endAngle = Math.floor(endAngle / angleStep) * angleStep;
            //Update currentAngle
            this.currAngle = endAngle;
        }

        const endAngleRad: number = Math.PI / 180 * endAngle;

        // Draw pie-shaped mask
        spriteMask.clear();
        spriteMask.beginFill(0x000000, 1);
        spriteMask.arc(centerPos.x, centerPos.y, radius, startAngleRad, endAngleRad, anticlockwise);
        spriteMask.arc(centerPos.x, centerPos.y, innerRadius, endAngleRad, startAngleRad, !anticlockwise);
        spriteMask.endFill();

        return;
    }
}
