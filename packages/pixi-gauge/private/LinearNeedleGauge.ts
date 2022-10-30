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

import { NeedleGauge, NeedleGaugeOptions } from './NeedleGaugeBase';
import { ILinearGaugeOption, ILinearGaugeSubFrameRenderOption, LinearGaugeDisplacementCalculator } from './utils/LinearGaugeDisplacementCalculator';
import * as PIXI from 'pixi.js';
import { GaugeDirection } from './GaugeBase';

/**
 * Rotation needle gauge option class.
 */
export class LinearNeedleGaugeOptions extends NeedleGaugeOptions implements ILinearGaugeOption, ILinearGaugeSubFrameRenderOption {
    /**
     * Direction of gauge.
     */
    public GaugeDirection: GaugeDirection;
    /**
     * Pixel range of the gauge displacement.
     */
    public PixelRange: number;
    /**
     * Pixel step to change progress bar. 
     */
    public PixelStep: number;
    /**
    * Minimum pixel jump step to call subframe render.
    */
    public SubFrameRenderPixelStep: number;
    /**
     * Max number of subframe (to limit subframe rendereng to prevent performance drop)
     */
    public NumMaxSubframe: number;
    /**
     * Max delta-pixel (pixel change between render frames) to call subframe render.
     */
    public MaxDeltaPixelToRenderSubFrame: number;

    /**
     * Offset coordinate of needle.
     */
    public Offset: PIXI.Point;

    constructor() {
        super();
        this.GaugeDirection = "LeftToRight";
        this.PixelRange = 100;
        this.PixelStep = 1;
        this.SubFrameRenderPixelStep = 1;
        this.MaxDeltaPixelToRenderSubFrame = 100;
        this.NumMaxSubframe = 5;
        this.Offset = new PIXI.Point(0, 0);
    }
}

export class LinearNeedleGauge extends NeedleGauge {
    private readonly linearNeedleGaugeOptions: LinearNeedleGaugeOptions;
    private readonly subFrameRenderCallback: Array<() => void> = [];

    private readonly displacementCalculator : LinearGaugeDisplacementCalculator;

    /**
     * Get Options.
     * @return Options.
     */
    get Options(): LinearNeedleGaugeOptions { return this.linearNeedleGaugeOptions }

    /**
     * Call back function list to invoke subframe rendering.
     */
    get SubFrameRenderCallback() { return this.subFrameRenderCallback }

    constructor(options: LinearNeedleGaugeOptions) {
        super(options);
        this.linearNeedleGaugeOptions = options;
        this.displacementCalculator = new LinearGaugeDisplacementCalculator(options);
    }

    private readonly calcRealDisplacement = (displacement: number) => {
        switch (this.linearNeedleGaugeOptions.GaugeDirection) {
            case "RightToLeft": 
                return new PIXI.Point(displacement, 0);
            case "LeftToRight":
                return new PIXI.Point(-displacement, 0);
            case "DownToUp":
                return new PIXI.Point(0, -displacement);
            case "UpToDown":
                return new PIXI.Point(0, displacement);
        }
    }

    private readonly drawUpdate = (displacement: number) => {
        const offset = this.linearNeedleGaugeOptions.Offset;
        const realDisplacement = this.calcRealDisplacement(displacement);

        this.Sprite.position = new PIXI.Point(offset.x + realDisplacement.x, offset.y + realDisplacement.y);
    };

    /**
     * Update gauge.
     * @param skipStepCheck Skip checking angle displacement over the angleStep or not.
     */
    protected _update(skipStepCheck: boolean): void {
        // Update texture reference of sprite.
        this.Sprite.texture = this.linearNeedleGaugeOptions.Texture;
        this.displacementCalculator.calcAndUpdate(this.DrawValue, skipStepCheck, this.drawUpdate, this.subFrameRenderCallback);
    }
}