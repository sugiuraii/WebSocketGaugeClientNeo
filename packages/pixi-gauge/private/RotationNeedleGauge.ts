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
import { CircularGaugeAngleCalculator, ICircularGaugeOption, ICircularGaugeSubFrameRenderOption } from './utils/CircularGaugeAngleCalculator';


/**
 * Rotation needle gauge option class.
 */
export class RotationNeedleGaugeOptions extends NeedleGaugeOptions implements ICircularGaugeOption, ICircularGaugeSubFrameRenderOption {
    /**
     * Offset angle (angle of value=Min)
     */
    public OffsetAngle: number;
    /**
     * Angle of value=Max.
     * (Actual rotation angle = OffsetAngle + FullAngle).
     */
    public FullAngle: number;
    /**
     * Angle tick step.
     */
    public AngleStep: number;
    /**
     * Rotation direction. (Anticlockwise drawing in true).
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

    constructor() {
        super();
        this.OffsetAngle = 0;
        this.FullAngle = 360;
        this.AngleStep = 0.1;
        this.AntiClockwise = false;
        this.SubFrameRenderAngleStep = 2;
        this.NumMaxSubframe = 5;
        this.MaxDeltaAngleToRenderSubFrame = 180;
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