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

export class GearPositionCalculator
{
    private readonly gearPositionJudgeFunctions : Array<{gear : number, judgeFunction : (ratio : number) => boolean}>
    private readonly finalGearRatio : number;
    private readonly tireCircumference : number;

    /**
     * Constructor of GearPositionCalculator 
     * @param finalGearRatio Final gear ratio
     * @param tireCircumference Tire circumference (in mm)
     * @param gearPositionJudgeFunctions gear postion judge functions.
     */
    constructor(finalGearRatio : number, tireCircumference : number, gearPositionJudgeFunctions : Array<{gear : number, judgeFunction : (ratio : number) => boolean}>)
    {
        this.finalGearRatio = finalGearRatio;
        this.tireCircumference = tireCircumference;
        this.gearPositionJudgeFunctions = gearPositionJudgeFunctions;
    }

    public getGearRatio(rev : number, speed : number) : number
    {
        return this.tireCircumference * rev * 60 / (speed * this.finalGearRatio * 1e6);
    }

    public getGearPosition(rev : number, speed : number) : number | undefined
    {
        const gearRatio = this.getGearRatio(rev, speed);
        for(const f of this.gearPositionJudgeFunctions)
        {
            if(f.judgeFunction(gearRatio))
            return f.gear;
        }
        return undefined;
    }
}

export function CalcTireCircumference(tireWidth : number, flatRatio : number, tireInchSize : number) : number
{
    return (tireWidth * flatRatio/100 * 2 + tireInchSize * 25.4) * Math.PI;
}
