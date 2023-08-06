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

/**
 * Setting option class for AnalogSingleMeter
 */
export class AnalogSingleMeterOption {
    /**
     * Gauge Max.
     */
    public Max: number;
    /**
     * Gauge Min.
     */
    public Min: number;
    /**
     * Gauge Title
     */
    public Title: string;
    /**
     * Gauge unit
     */
    public Unit: string;
    /**
     * Gauge scale numbers (7 ticks).
     */
    public ScaleLabel: string[];

    public GaugeDrawValConversionFunc : (x: number) => number;
    
    /**
     * Construct AnalogSingleMeterOption with default settings.
     */
    constructor() {
        this.Max = 2.0;
        this.Min = -1.0;
        this.Title = "Boost";
        this.Unit = "x100kPa";
        this.ScaleLabel = ["-1.0", "-0.5", "0.0", "0.5", "1.0", "1.5", "2.0"];
        this.GaugeDrawValConversionFunc = (x) => x;
    }
}
