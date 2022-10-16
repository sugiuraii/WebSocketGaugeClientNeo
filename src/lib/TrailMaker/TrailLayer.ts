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

export class TrailLayer extends PIXI.Sprite {
    private static app : PIXI.Application;
    public static setApp (app : PIXI.Application) {
        this.app = app;
    }
    
    private trailImageTexture : PIXI.RenderTexture;
    private outputTexture : PIXI.RenderTexture;
    private readonly trailSprite = new PIXI.Sprite;
    private readonly clearingSprite = new PIXI.Sprite(PIXI.Texture.EMPTY); // used for clearing texture

    constructor(bufferTextureSize : {width: number, height: number}) {
        super();
        
        this.trailImageTexture = PIXI.RenderTexture.create(bufferTextureSize);
        this.outputTexture = PIXI.RenderTexture.create(bufferTextureSize);
        this.texture = this.trailImageTexture;
        this.trailAlpha = 0.8;
        TrailLayer.app.ticker.add(() => this.updateTexture(TrailLayer.app.renderer));
    }

    private updateTexture(renderer : PIXI.Renderer | PIXI.AbstractRenderer) {
        // Render faded texture
        this.trailSprite.texture = this.outputTexture;
        renderer.render(this.trailSprite, {renderTexture : this.trailImageTexture, clear : true});

        // Render container
        renderer.render(this, {renderTexture : this.outputTexture, clear : true});
    }

    public clear() {
        const renderer = TrailLayer.app.renderer;
        renderer.render(this.clearingSprite, {renderTexture : this.outputTexture, clear : true});
    }

    public get TrailSprite() {
        return this.trailSprite;
    }

    public addFilter(f : PIXI.Filter) {
        if (!this.trailSprite.filters) this.trailSprite.filters = [];
        this.trailSprite.filters = this.trailSprite.filters.concat(f);
    }

    public set trailTint(v : number) {
        this.trailSprite.tint = v;
    }

    public set trailAlpha(v : number) {
        this.trailSprite.alpha = v;
    }
}
