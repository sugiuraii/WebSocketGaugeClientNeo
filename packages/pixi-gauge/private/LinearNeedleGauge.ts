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
import { GaugeDirection, ILinearGaugeOption, ILinearGaugeSubFrameRenderOption } from './utils/LinearGaugeDisplacementCalculator';


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

    constructor() {
        super();
        this.GaugeDirection = "LeftToRight";
        this.PixelRange = 100;
        this.PixelStep = 1;
        this.SubFrameRenderPixelStep = 1;
        this.MaxDeltaPixelToRenderSubFrame = 100;
        this.NumMaxSubframe = 5;
    }
}

export class RotationNeedleGauge extends NeedleGauge {
    private readonly rotationNeedleGaugeOptions: RotationNeedleGaugeOptions;
    private readonly subFrameRenderCallback: Array<() => void> = [];

    private readonly circularGaugeAngleCalculator: CircularGaugeAngleCalculator;

    /**
     * Get Options.
     * @return Options.
     */
    get Options(): RotationNeedleGaugeOptions { return this.rotationNeedleGaugeOptions }

    /**
     * Call back function list to invoke subframe rendering.
     */
    get SubFrameRenderCallback() { return this.subFrameRenderCallback }

    constructor(options: RotationNeedleGaugeOptions) {
        super(options);
        this.rotationNeedleGaugeOptions = options;
        this.circularGaugeAngleCalculator = new CircularGaugeAngleCalculator(options);
    }

    private readonly drawAngleUpdate = (angle: number) => {
        const angleRad: number = Math.PI / 180 * angle;
        this.rotation = angleRad;
    };

    /**
     * Update gauge.
     * @param skipStepCheck Skip checking angle displacement over the angleStep or not.
     */
    protected _update(skipStepCheck: boolean): void {
        // Update texture reference of sprite.
        this.Sprite.texture = this.rotationNeedleGaugeOptions.Texture;
        this.circularGaugeAngleCalculator.calcAndUpdate(this.DrawValue, skipStepCheck, this.drawAngleUpdate, this.subFrameRenderCallback);
    }
}