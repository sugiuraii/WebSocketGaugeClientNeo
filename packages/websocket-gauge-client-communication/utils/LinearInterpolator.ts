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
 
const UpdatePeriodCalcMethod =
{
    Direct : "Direct",
    Average : "Average",
    Median : "Median"
} as const;

type UpdatePeriodCalcMethod = typeof UpdatePeriodCalcMethod[keyof typeof UpdatePeriodCalcMethod];

export class LinearInterpolator
{
    public static UpdatePeriodCalcMethod: UpdatePeriodCalcMethod = UpdatePeriodCalcMethod.Median;
    public static UpdatePeriodBufferLength  = 10;

    private lastUpdateTimeStamp : number;
    private lastValue : number;
    private value : number;
    private valUpdatePeriod : number;

    private updatePeriodAveragingQueue: MovingAverageQueue;

    constructor()
    {
        //Set default value to avoid return "undefined" on getVal
        this.lastUpdateTimeStamp = performance.now();
        this.valUpdatePeriod = 0.03; //temporally set to 30ms
        this.lastValue = 0; 
        this.value = 0;

        this.updatePeriodAveragingQueue = new MovingAverageQueue(LinearInterpolator.UpdatePeriodBufferLength);
    }

    /**
     * Set value to buffer.
     * @param value value to store.
     * @param period value update period.
     * @param timestamp timestamp of value update.
     */
    public setVal(value : number, period? : number, timestamp? : number) : void
    {
        //Calculate value update period
        let currentPeriod : number;
        if (typeof(period) === "number")
            currentPeriod = period;
        else if(typeof(timestamp) === "number")
            currentPeriod = timestamp - this.lastUpdateTimeStamp;
        else
            currentPeriod = performance.now() - this.lastUpdateTimeStamp;

        //Calculate average/median of valueUpdate period
        switch (LinearInterpolator.UpdatePeriodCalcMethod)
        {
            case UpdatePeriodCalcMethod.Direct:
                this.valUpdatePeriod = currentPeriod;
                break;
            case UpdatePeriodCalcMethod.Median:
                this.updatePeriodAveragingQueue.add(currentPeriod);
                this.valUpdatePeriod = this.updatePeriodAveragingQueue.getMedian();
                break;
            case UpdatePeriodCalcMethod.Average:
                this.updatePeriodAveragingQueue.add(currentPeriod);
                this.valUpdatePeriod = this.updatePeriodAveragingQueue.getAverage();
                break;
        }

        // Store lastUpdateTimeStamp
        if (typeof(timestamp) === "number" )
            this.lastUpdateTimeStamp = timestamp;
        else
            this.lastUpdateTimeStamp = performance.now();

        this.lastValue = this.value;
        this.value = value;
    }

    public getVal(timeStamp?: number): number
    {
        let actualTimeStamp : number
        if(!(typeof(timeStamp) === "number"))
            actualTimeStamp = performance.now();
        else
            actualTimeStamp = timeStamp;

        let interpolateFactor = (actualTimeStamp - this.lastUpdateTimeStamp) / this.valUpdatePeriod;
        if(interpolateFactor > 1)
            interpolateFactor = 1;
        if(interpolateFactor < 0)
            interpolateFactor = 0;
        const interpolatedVal : number = this.lastValue + (this.value - this.lastValue)*interpolateFactor;

        return interpolatedVal;
    }

    public getRawVal() : number
    {
        return this.value;
    }
}

class MovingAverageQueue
{
    private readonly queueLength : number;
    private valArray : number[];

    constructor(queueLength : number)
    {
        this.queueLength = queueLength;
        this.valArray = [];
    }

    /**
     * Add value to buffer queue.
     * @param value value to add.
     */
    public add(value : number) : void
    {
        //Discard one oldest item
        if (this.valArray.length == this.queueLength)
            this.valArray.shift();

        this.valArray.push(value);
    }

    /**
     * Get moving average.
     */
    public getAverage() : number
    {
        const length : number = this.valArray.length;
        let temp  = 0;
        for(let i = 0; i < length; i++)
            temp += this.valArray[i];

        if (length === 0)
            return 1;

        return temp/length;
    }

    /**
     * Get movinig median.
     */
    public getMedian() : number
    {
        // Copy to temporary array
        const temp : number[] = new Array(this.valArray.length);
        for (let i = 0; i < this.valArray.length; i++)
            temp[i] = this.valArray[i];
        
        // perform sort
        temp.sort(function(a,b){return a-b;});
        
        const length = temp.length;
        const half : number = (temp.length/2)|0;

        if (length === 0)
            return 1;

        if(length % 2)
            return temp[half];
        else
            return (temp[half-1] + temp[half])/2;
    }
}
