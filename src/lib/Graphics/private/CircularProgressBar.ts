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

export class CircularProgressBarOptions extends ProgressBarOptions
{
    public OffsetAngle : number;
    public FullAngle : number;
    public AngleStep : number;
    public AntiClockwise : boolean;
    public Center : PIXI.Point;
    public Radius : number;
    public InnerRadius : number;
    constructor()
    {
        super();
        this.OffsetAngle = 0;
        this.FullAngle = 360;
        this.AngleStep = 0.1;
        this.AntiClockwise = false;
        this.Center = new PIXI.Point(0,0);
    }
}

export class CircularProgressBar extends ProgressBar
{
    private circularProgressBarOptions: CircularProgressBarOptions;

    private currAngle : number;

    constructor(options?: CircularProgressBarOptions)
    {
        let circularProgressBarOptions: CircularProgressBarOptions;
        if (!(options instanceof CircularProgressBarOptions))
            circularProgressBarOptions = new CircularProgressBarOptions();
        else
            circularProgressBarOptions = options;

        super(circularProgressBarOptions);
        this.circularProgressBarOptions = circularProgressBarOptions;
    }

    get OffsetAngle(): number {return this.circularProgressBarOptions.OffsetAngle; }
    set OffsetAngle(val: number) {this.circularProgressBarOptions.OffsetAngle = val; }
    get FullAngle(): number {return this.circularProgressBarOptions.FullAngle; }
    set FullAngle(val: number) {this.circularProgressBarOptions.FullAngle = val; }
    get AngleStep(): number {return this.circularProgressBarOptions.AngleStep; }
    set AngleStep(val: number) {this.circularProgressBarOptions.AngleStep = val; }
    get AntiClockwise(): boolean {return this.circularProgressBarOptions.AntiClockwise; }
    set AntiClockwise(val: boolean) {this.circularProgressBarOptions.AntiClockwise = val; }
    get Center(): PIXI.Point {return this.circularProgressBarOptions.Center; }
    set Center(val: PIXI.Point) {this.circularProgressBarOptions.Center = val; }
    get Radius(): number {return this.circularProgressBarOptions.Radius; }
    set Radius(val: number) {this.circularProgressBarOptions.Radius = val; }
    get InnerRadius(): number {return this.circularProgressBarOptions.InnerRadius; }
    set InnerRadius(val: number) {this.circularProgressBarOptions.InnerRadius = val; }

    protected _update(skipStepCheck : boolean): void
    {
        'use strict';
        const centerPos: PIXI.Point = this.Center;
        const radius : number = this.Radius;
        const innerRadius : number = this.InnerRadius;
        const anticlockwise: boolean = this.AntiClockwise;
        const offsetAngle : number = this.OffsetAngle;
        const fullAngle : number = this.FullAngle;
        const angleStep : number = this.AngleStep;

        const valueMax : number = this.Max;
        const valueMin : number = this.Min;
        const value : number = this.DrawValue;

        const spriteMask: PIXI.Graphics = this.SpriteMask;

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
        spriteMask.clear();
        spriteMask.beginFill(0x000000, 1);
        spriteMask.arc(centerPos.x, centerPos.y, radius ,startAngleRad, endAngleRad, anticlockwise);
        spriteMask.arc(centerPos.x, centerPos.y, innerRadius , endAngleRad, startAngleRad, !anticlockwise);    
        spriteMask.endFill();

        return;
    }
}
