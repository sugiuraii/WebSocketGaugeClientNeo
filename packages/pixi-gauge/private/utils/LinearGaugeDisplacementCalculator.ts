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

export type GaugeDirection =
    "LeftToRight" |
    "RightToLeft" |
    "DownToUp" |
    "UpToDown";


export interface ILinearGaugeOption {
    GaugeDirection : GaugeDirection;
    PixelRange : number;
    PixelStep: number;
    
    Max: number;
    Min: number;
}

export interface ILinearGaugeSubFrameRenderOption {
    SubFrameRenderPixelStep : number;
    MaxDeltaPixelToRenderSubFrame : number;
    NumMaxSubframe : number;
}

export class LinearGaugeDisplacementCalculator {
    private readonly LinearGaugeOption : ILinearGaugeOption
    private readonly SubFrameRenderOption : ILinearGaugeSubFrameRenderOption;

    private currentDisplacement : number;
        
    constructor(gaugeOption : ILinearGaugeOption & ILinearGaugeSubFrameRenderOption) {
        this.LinearGaugeOption = gaugeOption;
        this.SubFrameRenderOption = gaugeOption;

        this.currentDisplacement = 0;
    }

    public calcAndUpdate(value : number, skipStepCheck: boolean, drawUpdateCallback: (displacement : number) => void, subFrameRenderCallBack: Array<() => void>){
        const currentDisplacement: number = this.currentDisplacement;
        const pixelStep: number = this.LinearGaugeOption.PixelStep;
        
        const valueMax: number = this.LinearGaugeOption.Max;
        const valueMin: number = this.LinearGaugeOption.Min;

        const pixelRange: number = this.LinearGaugeOption.PixelRange;
        let displacement = (value - valueMin) / (valueMax - valueMin) * pixelRange;

        // Check deltaPixel over the pixelStep
        const deltaDisplacement: number = Math.abs(displacement - currentDisplacement);
        
        if (!skipStepCheck && deltaDisplacement < pixelStep)
            return;
        else {
            //Round into pixelStep
            displacement = Math.floor(displacement / pixelStep) * pixelStep;
            if(subFrameRenderCallBack.length != 0) {
                const subFrameRenderPixelStep = this.getReScaledSubFramePixelStepByNumMaxSubFrame(deltaDisplacement);
                if(deltaDisplacement > subFrameRenderPixelStep && deltaDisplacement < this.SubFrameRenderOption.MaxDeltaPixelToRenderSubFrame) {
                    const displacementTickSign = (displacement > currentDisplacement)?1:-1;
                    const tick = subFrameRenderPixelStep * displacementTickSign;
                    for(let subFrameDisplacement = currentDisplacement; (displacement - subFrameDisplacement)*displacementTickSign > 0 ; subFrameDisplacement+=tick) {
                        drawUpdateCallback(subFrameDisplacement);
                        subFrameRenderCallBack.forEach(f => f());
                    }
                }
            }
            drawUpdateCallback(displacement);
            this.currentDisplacement = displacement;
        }
    }

    private getReScaledSubFramePixelStepByNumMaxSubFrame(deltaDisplacement : number) {
        if(deltaDisplacement / this.SubFrameRenderOption.SubFrameRenderPixelStep < this.SubFrameRenderOption.NumMaxSubframe)
            return this.SubFrameRenderOption.SubFrameRenderPixelStep;
        else
            return deltaDisplacement / this.SubFrameRenderOption.NumMaxSubframe;
    }
}