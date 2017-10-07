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

import {ProgressBarOptions} from './ProgressBarBase'
import {ProgressBar} from './ProgressBarBase'

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
        let rectangularProgressBarOptions: RectangularProgressBarOptions;
        if (!(options instanceof RectangularProgressBarOptions))
            rectangularProgressBarOptions = new RectangularProgressBarOptions();
        else
            rectangularProgressBarOptions = options;
        super(rectangularProgressBarOptions);
        this.rectangularProgressBarOptions = rectangularProgressBarOptions;
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
        const value: number = this.DrawValue;

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