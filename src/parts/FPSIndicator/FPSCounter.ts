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
/// <reference path="../../lib/webpackRequire.ts" />
import * as PIXI from 'pixi.js';
require("./fpsCounterFont.fnt");
require("./fpsCounterFont_0.png");

const FPSBUFFER_LENGTH = 5;

export class FPSCounter extends PIXI.Container
{
    private fpsText: PIXI.extras.BitmapText;
    private fpsbuffer : number[] = new Array();
    
    static get RequestedTexturePath() : string[]
    {
        return ["img/fpsCounterFont.fnt"];
    }
    
    constructor()
    {
        super();
        this.fpsText = new PIXI.extras.BitmapText("0fps",{font: "fpsCounterFont", align : "left" });
        super.addChild(this.fpsText);
    }
    
    public setFPS(fps : number) : void
    {
        this.pushFPSBuffer(fps);
        const avgFPS = this.calcAverageFPS();
        this.fpsText.text = avgFPS.toFixed(0) + "fps";
    }
    
    private pushFPSBuffer(fps : number) : void
    {
        this.fpsbuffer.push(fps);
        if (this.fpsbuffer.length > FPSBUFFER_LENGTH)
            this.fpsbuffer.shift();
    }
    
    private calcAverageFPS() : number
    {
        let sum = 0;
        for (let i = 0; i < this.fpsbuffer.length; i++)
            sum += this.fpsbuffer[i];
            
        return sum / this.fpsbuffer.length;
    }
}