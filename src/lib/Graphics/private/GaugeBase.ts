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

export class Gauge1DOptions
{
    public Max: number;
    public Min: number;

    constructor()
    {
        this.Max = 100;
        this.Min = 0;
    }
}

export abstract class Gauge1D extends PIXI.Container
{
    private gauge1DOptions: Gauge1DOptions;

    private invertDraw : boolean;
    private value : number;

    constructor(options? : Gauge1DOptions)
    {
        super();
        if (!(options instanceof Gauge1DOptions))
            this.gauge1DOptions = new Gauge1DOptions();
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

    get InvertDraw() : boolean { return this.invertDraw; }
    set InvertDraw(flag : boolean) { this.invertDraw = flag; }

    get DrawValue() : number
    {
        let drawVal : number;
        if( this.Value > this.Max)
            drawVal = this.Max;
        else if (this.Value < this.Min)
            drawVal = this.Min;
        else
            drawVal = this.Value

        if (this.InvertDraw)
            drawVal = this.Max - drawVal + this.Min;

        return drawVal;
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

