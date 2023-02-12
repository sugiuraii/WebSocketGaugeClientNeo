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

import { LinearInterpolator } from "./LinearInterpolator";
import { PIDInterpolator } from "./PIDInterpolator";

export interface Interpolator {
    setVal(value : number, period? : number, timestamp? : number) : void;
    getVal(timeStamp?: number): number;
    getRawVal() : number;
}

export type InterpolatorOption = {
    type : "Linear" | "PID",
    pidoption? : {Kp : number, Ki : number, Kd : number} 
}

export class InterpolatorFactory {
    public get(op : InterpolatorOption) {
        switch(op.type) {
            case "Linear":
                return this.getLinearInterpolator();
            case "PID":
                if(op.pidoption !== undefined)
                    return this.getPIDInterpolator(op.pidoption.Kp, op.pidoption.Ki, op.pidoption.Kd);
                else
                    throw Error("PID interpolator is set. Howver PID option is not defined.");
        }
    }

    private getLinearInterpolator() {
        return new LinearInterpolator();
    }

    private getPIDInterpolator(Kp : number, Ki : number, Kd: number) {
        return new PIDInterpolator(Kp, Ki, Kd);
    }
}