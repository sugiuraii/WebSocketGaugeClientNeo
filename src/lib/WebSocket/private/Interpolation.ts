/* 
 * Copyright (c) 2017, kuniaki
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * * Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

export enum UpdatePeriodCalcMethod
{
    Direct,
    Average,
    Median
}

export class VALInterpolationBuffer
{
    public static UpdatePeriodCalcMethod: UpdatePeriodCalcMethod = UpdatePeriodCalcMethod.Median;
    public static UpdatePeriodBufferLength : number = 10;

    private lastUpdateTimeStamp : number;
    private lastValue : number;
    private value : number;
    private valUpdatePeriod : number;

    private updatePeriodAveragingQueue: MovingAverageQueue;

    private interpolateEnabled : boolean = false;

    constructor()
    {
        //Set default value to avoid return "undefined" on getVal
        this.lastUpdateTimeStamp = performance.now();
        this.valUpdatePeriod = 0.03; //temporally set to 30ms
        this.lastValue = 0; 
        this.value = 0;

        this.updatePeriodAveragingQueue = new MovingAverageQueue(VALInterpolationBuffer.UpdatePeriodBufferLength);
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
        switch (VALInterpolationBuffer.UpdatePeriodCalcMethod)
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

    public get InterpolateEnabled() {return this.interpolateEnabled;}
    public set InterpolateEnabled(flag) {this.interpolateEnabled = flag;}

    public getVal(timeStamp?: number): number
    {
        if (!this.InterpolateEnabled)
            return this.value;

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
        this.valArray = new Array();
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
        let temp : number = 0;
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
