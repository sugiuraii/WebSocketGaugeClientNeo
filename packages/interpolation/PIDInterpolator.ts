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

import { Interpolator } from "./Interpolator";

const NodePIDController = require("node-pid-controller")
export class PIDInterpolator implements Interpolator {
    private readonly PIDController;
    private CurrentInterpolatedVal = 0;
    private RawVal = 0;
    private isFirstSetVal = true;

    constructor(Kp : number, Ki : number, Kd : number) {
        this.PIDController = new NodePIDController({
            k_p: Kp,
            k_i: Ki,
            k_d: Kd
          });
    }
    
    public setVal(value: number, _period?: number | undefined, _timestamp?: number | undefined): void {
        this.RawVal = value;
        if(this.isFirstSetVal) {
            this.CurrentInterpolatedVal = value;
            this.isFirstSetVal = false;
        }
        this.PIDController.setTarget(value);
    }

    public getVal(_timeStamp?: number | undefined): number {
        const correction = this.PIDController.update(this.CurrentInterpolatedVal);
        this.CurrentInterpolatedVal += correction;
        return this.CurrentInterpolatedVal;
    }
    public getRawVal(): number {
        return this.RawVal;
    }
}