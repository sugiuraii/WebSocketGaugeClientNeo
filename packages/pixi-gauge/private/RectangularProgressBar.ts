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
import { GaugeDirection, ILinearGaugeOption, ILinearGaugeSubFrameRenderOption, LinearGaugeDisplacementCalculator } from './utils/LinearGaugeDisplacementCalculator';

/**
 * Rectangular progressbar option class.
 */
export class RectangularProgressBarOptions extends ProgressBarOptions implements ILinearGaugeOption, ILinearGaugeSubFrameRenderOption {
    /**
     * Direction of gauge.
     */
    public GaugeDirection: GaugeDirection;
    /**
     * Progress bar mask width.
     */
    public Width: number;
    /**
     * Progress bar mask height.
     */
    public Height: number;
    /**
     * Pixel step to change progress bar. 
     */
    public PixelStep: number;
    /**
    * Minimum pixel jump step to call subframe render.
    */
    public SubFrameRenderPixelStep: number;
    /**
    * Max delta-pixel (displacement between render frames) to call subframe render.
    */
    public MaxDeltaPixelToRenderSubFrame: number;
    /**
    * Max number of subframe (to limit subframe rendereng to prevent performance drop)
    */
    public NumMaxSubframe: number;

    constructor() {
        super();
        this.GaugeDirection = "LeftToRight";
        this.Width = 100;
        this.Height = 100;
        this.PixelStep = 1;
        this.SubFrameRenderPixelStep = 2;
        this.MaxDeltaPixelToRenderSubFrame = 100;
        this.NumMaxSubframe = 5;
    }
}

/**
 * REctangular progressbar class.
 */
export class RectangularProgressBar extends ProgressBar {
    private readonly rectangularProgressBarOptions: RectangularProgressBarOptions;
    private readonly subFrameRenderCallback: Array<() => void> = [];
    private readonly displacementCalculator : LinearGaugeDisplacementCalculator;

    /**
     * @param options Option to set.
     */
    constructor(options: RectangularProgressBarOptions) {
        super(options);
        this.rectangularProgressBarOptions = options;
        this.displacementCalculator = new LinearGaugeDisplacementCalculator(options);
    }

    /**
     * Get Options.
     * @return Options.
     */
    get Options(): RectangularProgressBarOptions { return this.rectangularProgressBarOptions }
    
    /**
     * Call back function list to invoke subframe rendering.
     */
     get SubFrameRenderCallback() { return this.subFrameRenderCallback } 

    private readonly drawProgressBar = (displacement : number) => {
        const vertical: boolean = this.Options.GaugeDirection === "DownToUp" || this.Options.GaugeDirection === "UpToDown";
        const invertDirection: boolean = this.Options.GaugeDirection === "UpToDown" || this.Options.GaugeDirection === "RightToLeft";
        const maskHeight: number = this.Options.Height;
        const maskWidth: number = this.Options.Width;

        const spriteMask: PIXI.Graphics = this.SpriteMask;
        
        //Define mask rectangle parameters
        let drawMaskX: number, drawMaskY: number;
        let drawMaskHeight: number, drawMaskWidth: number;
        if (vertical) {
            drawMaskX = 0;
            drawMaskWidth = maskWidth;
            drawMaskHeight = displacement;
            if (invertDirection) //Up to down
                drawMaskY = 0;
            else //Down to Up
                drawMaskY = maskHeight - displacement;
        }
        else {
            drawMaskY = 0;
            drawMaskHeight = maskHeight;
            drawMaskWidth = displacement;
            if (invertDirection) //Right to left
                drawMaskX = maskWidth - displacement;
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

    /**
     * Update progress bar.
     * @param skipStepCheck Skip checking angle displacement over the angleStep or not.
     */
    protected _update(skipStepCheck: boolean): void {
        // Update texture reference of sprite.
        this.Sprite.texture = this.Options.Texture;
        this.displacementCalculator.calcAndUpdate(this.DrawValue, skipStepCheck, this.drawProgressBar, this.SubFrameRenderCallback);
    }
}