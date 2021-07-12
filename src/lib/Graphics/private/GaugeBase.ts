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

import * as PIXI from 'pixi.js';

/**
 * 1D Gauge option class.
 */
export class Gauge1DOptions {
    /**
     * Max value of gauge.
     */
    public Max: number;
    /**
     * Min value of gauge.
     */
    public Min: number;

    /**
     * Flag to set gauge full on value min (invert the direction of gauge Max to Min)
     * (On this flag is true, gauge move from Max to Min by increasing value)
     * (on this flag is false(default), gauge move from Min to Max by increasing value) 
     */
    public GagueFullOnValueMin: boolean;

    public GaugeDrawConversionFucntion : (x : number) => number = (x) => x;

    constructor() {
        this.Max = 100;
        this.Min = 0;
        this.GagueFullOnValueMin = false;
    }
}

/**
 * 1D gauge class.
 */
export abstract class Gauge1D extends PIXI.Container {
    private gauge1DOptions: Gauge1DOptions;

    private value: number;

    /**
     * @param options Option to set.
     */
    constructor(options: Gauge1DOptions) {
        super();
        this.gauge1DOptions = options;
        this.value = 0;
    }

    /**
     * Get Options.
     * @return Options.
     */
    get Options(): Gauge1DOptions { return this.gauge1DOptions }

    /**
     * Get gauge value.
     */
    get Value(): number { return this.value; }
    /**
     * Set gauge value.
     */
    set Value(val: number) { this.value = val; }

    /**
     * Get actual draw value (considering GaugeFullOnValueMin flag).
     */
    protected get DrawValue(): number {
        const Max = this.Options.Max;
        const Min = this.Options.Min;
        const Value = this.Value;
        const GaugeFullOnValueMin = this.Options.GagueFullOnValueMin;
        const conv = this.Options.GaugeDrawConversionFucntion;

        let drawVal = conv(Value);
        if (drawVal > Max)
            drawVal = Max;
        else if (drawVal < Min)
            drawVal = Min;

        if (GaugeFullOnValueMin)
            drawVal = Max - drawVal + Min;

        return drawVal;
    }

    /**
     * Apply value and update gauge.
     */
    public update(): void {
        this._update(false);
    }

    /**
     * Apply value and update gauge with skipping value step check.
     */
    public updateForce(): void {
        this._update(true);
    }

    /**
     * Function to update gauge state by value.
     */
    protected abstract _update(skipStepCheck: boolean): void;
}

