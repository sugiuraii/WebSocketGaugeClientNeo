/* 
 * The MIT License
 *
 * Copyright 2017 sz2.
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
import { CircularGaugeAngleCalculator, ICircularGaugeOption, ICircularGaugeSubFrameRenderOption } from './utils/CircularGaugeAngleCalculator';

/**
 * Option class for CircularProgressBar.
 */
export class CircularProgressBarOptions extends ProgressBarOptions implements ICircularGaugeOption, ICircularGaugeSubFrameRenderOption  {
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
     * Minimum angle jump step to call subframe render.
     */
    public SubFrameRenderAngleStep: number;
    /**
     * Max number of subframe (to limit subframe rendereng to prevent performance drop)
     */
    public NumMaxSubframe: number;
    /**
     * Max delta-angle (angle change between render frames) to call subframe render.
     */
    public MaxDeltaAngleToRenderSubFrame: number;
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

        this.SubFrameRenderAngleStep = 2;
        this.NumMaxSubframe = 5;
        this.MaxDeltaAngleToRenderSubFrame = 180;
    }
}

/**
 * Circular progressbar class.
 */
export class CircularProgressBar extends ProgressBar {
    private circularProgressbarOptions: CircularProgressBarOptions;
    private readonly subFrameRenderCallback: Array<() => void> = []; 
    private readonly circularGaugeAngleCalculator : CircularGaugeAngleCalculator;

    /**
     * @param options CircularProgressBarOption to set.
     */
    constructor(options: CircularProgressBarOptions) {
        super(options);
        this.circularProgressbarOptions = options;
        this.circularGaugeAngleCalculator = new CircularGaugeAngleCalculator(options);
    }

    /**
     * Get Options.
     * @return Options.
     */
    get Options(): CircularProgressBarOptions { return this.circularProgressbarOptions }

    /**
     * Call back function list to invoke subframe rendering.
     */
    get SubFrameRenderCallback() { return this.subFrameRenderCallback } 

    private readonly drawProgressBar = (startAngle : number, endAngle : number, anticlockwise : boolean) => {
        const centerPos = this.Options.Center;
        const radius = this.Options.Radius;
        const innerRadius = this.Options.InnerRadius;

        const spriteMask = this.SpriteMask;

        const startAngleRad = Math.PI / 180 * startAngle;
        const endAngleRad: number = Math.PI / 180 * endAngle;

        // Draw pie-shaped mask
        const startPointX = centerPos.x + Math.cos(startAngleRad)*radius;
        const startPointY = centerPos.y + Math.sin(startAngleRad)*radius;
        spriteMask.clear();
        spriteMask.fill(0x000000);
        spriteMask.moveTo(startPointX, startPointY);
        spriteMask.arc(centerPos.x, centerPos.y, radius, startAngleRad, endAngleRad, anticlockwise);
        spriteMask.arc(centerPos.x, centerPos.y, innerRadius, endAngleRad, startAngleRad, !anticlockwise);

        return;
    };
    /**
     * Update progress bar.
     * @param skipStepCheck Skip checking angle displacement over the angleStep or not.
     */
    protected _update(skipStepCheck: boolean): void {
        // Update texture reference of sprite.
        this.Sprite.texture = this.Options.Texture;
        const startAngle = this.Options.OffsetAngle;
        const anticlockwise = this.Options.AntiClockwise;
        const drawAngleUpdate = (endAngle : number) => {
            this.drawProgressBar(startAngle, endAngle, anticlockwise);
        };
        this.circularGaugeAngleCalculator.calcAndUpdate(this.DrawValue, skipStepCheck, drawAngleUpdate, this.subFrameRenderCallback);
    }
}
