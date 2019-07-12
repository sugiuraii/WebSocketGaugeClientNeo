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

import {Gauge1DOptions} from './GaugeBase'
import {Gauge1D} from './GaugeBase'
import * as PIXI from 'pixi.js';

/**
 * Needle gauge option class.
 */
class NeedleGaugeOptions extends Gauge1DOptions
{
    /**
     * Texture of gauge needle.
     */
    public Texture: PIXI.Texture;
    constructor()
    {
        super();
    }
}

/**
 * Needle gauge class.
 */
abstract class NeedleGauge extends Gauge1D
{
    private needleGaugeOptions: NeedleGaugeOptions;

    private sprite : PIXI.Sprite;

    constructor(options?: NeedleGaugeOptions)
    {
        let needleGaugeOptions: NeedleGaugeOptions;
        if (!(options instanceof NeedleGaugeOptions))
            needleGaugeOptions = new NeedleGaugeOptions();
        else
            needleGaugeOptions = options;
        super(needleGaugeOptions);
        this.needleGaugeOptions = needleGaugeOptions;

        this.sprite = new PIXI.Sprite();
        this.sprite.texture = this.needleGaugeOptions.Texture;

        //Assign spirite and mask to container
        this.addChild(this.sprite);
    }
    
    /**
     * Get Options.
     * @return Options.
     */
    get Options() {return this.needleGaugeOptions}
    
    get Sprite(): PIXI.Sprite { return this.sprite; }
}

/**
 * Rotation needle gauge option class.
 */
export class RotationNeedleGaugeOptions extends NeedleGaugeOptions
{
    /**
     * Offset angle (angle of value=Min)
     */
    public OffsetAngle : number;
    /**
     * Angle of value=Max.
     * (Actual rotation angle = OffsetAngle + FullAngle).
     */
    public FullAngle : number;
    /**
     * Angle tick step.
     */
    public AngleStep : number;
    /**
     * Rotation direction. (Anticlockwise drawing in true).
     */
    public AntiClockwise : boolean;
    constructor()
    {
        super();
        this.OffsetAngle = 0;
        this.FullAngle = 360;
        this.AngleStep = 0.1;
        this.AntiClockwise = false;
    }
}

export class RotationNeedleGauge extends NeedleGauge
{
    private rotationNeedleGaugeOptions: RotationNeedleGaugeOptions;

    private currAngle : number;

    /**
     * Get Options.
     * @return Options.
     */
    get Options() {return this.rotationNeedleGaugeOptions}

    constructor(options?: RotationNeedleGaugeOptions)
    {
        let rotationNeedleGaugeOptions: RotationNeedleGaugeOptions;
        if (!(options instanceof RotationNeedleGaugeOptions))
            rotationNeedleGaugeOptions = new RotationNeedleGaugeOptions();
        else
            rotationNeedleGaugeOptions = options;
        super(rotationNeedleGaugeOptions);
        this.rotationNeedleGaugeOptions = rotationNeedleGaugeOptions;
    }

    /**
     * Update gauge.
     * @param skipStepCheck Skip checking angle displacement over the angleStep or not.
     */
    protected _update(skipStepCheck: boolean): void
    {
        // Update texture reference of sprite.
        this.Sprite.texture = this.rotationNeedleGaugeOptions.Texture;
        
        const anticlockwise: boolean = this.Options.AntiClockwise;
        const offsetAngle : number = this.Options.OffsetAngle;
        const fullAngle : number = this.Options.FullAngle;
        const angleStep : number = this.Options.AngleStep;

        const valueMax : number = this.Options.Max;
        const valueMin : number = this.Options.Min;
        const value : number = this.DrawValue;

        const currentAngle: number= this.currAngle;
        let angle: number;
        if(!anticlockwise)
            angle = (value - valueMin)/(valueMax - valueMin) * fullAngle + offsetAngle;
        else
            angle = -(value - valueMin)/(valueMax - valueMin) * fullAngle + offsetAngle;

        //Check angle displacement over the angleStep or not
        const deltaAngle: number = Math.abs(angle - currentAngle);
        if(!skipStepCheck && deltaAngle < angleStep)
            return;
        else
        {
            //Round into angle_resolution
            angle = Math.floor(angle/angleStep) * angleStep;
            //Update currentAngle
            this.currAngle = angle;
        }

        const angleRad: number = Math.PI/180*angle;

        //Set container angle
        this.rotation = angleRad;

        return;
    }
}