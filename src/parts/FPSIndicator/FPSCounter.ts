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

import * as PIXI from 'pixi.js';
require("./fpsCounterFont.fnt");
require("./fpsCounterFont_0.png");

const FPSBUFFER_LENGTH = 5;

export class FPSCounter extends PIXI.Container {
    private fpsText: PIXI.BitmapText;
    private fpsbuffer: number[] = [];

    static get RequestedTexturePath(): string[] {
        return ["img/fpsCounterFont.fnt"];
    }

    constructor() {
        super();
        this.fpsText = new PIXI.BitmapText("0fps", { fontName: "fpsCounterFont", fontSize: 32, align: "left" });
        super.addChild(this.fpsText);
    }

    public setFPS(fps: number): void {
        this.pushFPSBuffer(fps);
        const avgFPS = this.calcAverageFPS();
        this.fpsText.text = avgFPS.toFixed(0) + "fps";
    }

    private pushFPSBuffer(fps: number): void {
        this.fpsbuffer.push(fps);
        if (this.fpsbuffer.length > FPSBUFFER_LENGTH)
            this.fpsbuffer.shift();
    }

    private calcAverageFPS(): number {
        let sum = 0;
        for (let i = 0; i < this.fpsbuffer.length; i++)
            sum += this.fpsbuffer[i];

        return sum / this.fpsbuffer.length;
    }
}