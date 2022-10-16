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

// Ref.) https://runstant.com/pentamania/projects/429b2f7c

import * as PIXI from 'pixi.js';
const DEFAULT_FADE_TIME = 0.93;

export class AfterImageLayer extends PIXI.Sprite {
    private afterImageTexture : PIXI.RenderTexture;
    private outputTexture : PIXI.RenderTexture;
    private spriteForFading = new PIXI.Sprite;
    private clearingSprite = new PIXI.Sprite(PIXI.Texture.EMPTY); // used for clearing texture

    constructor(width: number, height: number) {
        super();

        this.afterImageTexture = PIXI.RenderTexture.create({width : width, height : height});
        this.outputTexture = PIXI.RenderTexture.create({width : width, height : height});
        this.texture = this.afterImageTexture;
    }

    public updateTexture(renderer : PIXI.Renderer) {
        // Render faded texture
        this.spriteForFading.texture = this.outputTexture;
        renderer.render(this.spriteForFading, {renderTexture : this.afterImageTexture, clear : true});

        // Render container
        renderer.render(this, {renderTexture : this.outputTexture, clear : true});
    }

    public clearTexture(renderer : PIXI.Renderer) {
        renderer.render(this.clearingSprite, {renderTexture : this.outputTexture, clear : true});
    }

    public addFilter(f : PIXI.Filter) {
        if (!this.spriteForFading.filters) this.spriteForFading.filters = [];
        this.spriteForFading.filters = this.spriteForFading.filters.concat(f);
    }

    public set effectTint(v : number) {
        this.spriteForFading.tint = v;
    }

    public set fadeTime(v : number) {
        this.spriteForFading.alpha = v;
    }
}
