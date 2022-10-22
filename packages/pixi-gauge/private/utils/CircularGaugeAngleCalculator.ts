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

export interface ICircularGaugeOption {
    AntiClockwise: boolean;
    OffsetAngle: number;
    FullAngle: number;
    AngleStep: number;

    Max: number;
    Min: number;
}

export class CircularGaugeAngleCalculator {
    private readonly CircularGaugeOption : ICircularGaugeOption;
    private readonly SubFrameRenderAngleStep : number;

    private currentAngle : number;
        
    constructor(circularGaugeOption : ICircularGaugeOption, subFrameRenderAngleStep : number) {
        this.CircularGaugeOption = circularGaugeOption;
        this.SubFrameRenderAngleStep = subFrameRenderAngleStep;
        this.currentAngle = this.CircularGaugeOption.OffsetAngle;
    }

    public calcAndUpdate(value : number, skipStepCheck: boolean, doSubFrameRender: boolean, drawAngleUpdateCallback: (angle : number) => void){

        const anticlockwise: boolean = this.CircularGaugeOption.AntiClockwise;
        const offsetAngle: number = this.CircularGaugeOption.OffsetAngle;
        const fullAngle: number = this.CircularGaugeOption.FullAngle;
        const angleStep: number = this.CircularGaugeOption.AngleStep;

        const valueMax: number = this.CircularGaugeOption.Max;
        const valueMin: number = this.CircularGaugeOption.Min;

        const currentAngle: number = this.currentAngle;
        
        const subFrameRenderAngleStep = this.SubFrameRenderAngleStep;
        
        let angle: number;
        if (!anticlockwise)
            angle = (value - valueMin) / (valueMax - valueMin) * fullAngle + offsetAngle;
        else
            angle = -(value - valueMin) / (valueMax - valueMin) * fullAngle + offsetAngle;

        //Check angle displacement over the angleStep or not
        const deltaAngle: number = Math.abs(angle - currentAngle);
        if (!skipStepCheck && deltaAngle < angleStep)
            return;
        else {
            //Round into angle_resolution
            angle = Math.floor(angle / angleStep) * angleStep;

            if(doSubFrameRender) {
                if(deltaAngle > subFrameRenderAngleStep) {
                    const angleTickSign = (angle > currentAngle)?1:-1;
                    const angleTick = subFrameRenderAngleStep * angleTickSign;
                    for(let subFrameAngle = currentAngle; (angle - subFrameAngle)*angleTickSign > 0 ; subFrameAngle+=angleTick) {
                        drawAngleUpdateCallback(subFrameAngle);
                    }
                }
            }
            drawAngleUpdateCallback(angle);
        }
        return;
    }
}