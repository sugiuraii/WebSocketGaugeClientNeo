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
// Need to set the priority of updateTexture() between NORMAL(=> for ticker.add()) and LOW (= rendering of application) 
const PRIORITY_OF_UPDATETEXTURE_TICKER = PIXI.UPDATE_PRIORITY.LOW + 5;

export class TrailLayer extends PIXI.Sprite {
    private static app: PIXI.Application;
    public static setApp(app: PIXI.Application) {
        this.app = app;
    }

    private frontTrailImageTexture: PIXI.RenderTexture;
    private backBufferTexture: PIXI.RenderTexture;
    private readonly trailSprite = new PIXI.Sprite;
    private readonly clearingSprite = new PIXI.Sprite(PIXI.Texture.EMPTY); // used for clearing texture
    private trailAlphaSetInterval_ = 0;
    private trailAlpha_ = 1;
    private trailAlphaCount = 0;
    constructor(bufferTextureSize: { width: number, height: number }) {
        super();

        this.frontTrailImageTexture = PIXI.RenderTexture.create(bufferTextureSize);
        this.backBufferTexture = PIXI.RenderTexture.create(bufferTextureSize);
        this.texture = this.frontTrailImageTexture;

        if (TrailLayer.app === undefined)
            throw Error("PIXI app is null on constructing TrailLayer. Call TralLayer.setApp() before constructing TrailLayer.");
        else
            TrailLayer.app.ticker.add(() => this.updateTexture(), undefined, PRIORITY_OF_UPDATETEXTURE_TICKER); // Insert updateTexture priority -1 from NORMAL
    }

    /**
     * Update trail images (need to be called on every frames, by ticker.)
    */
    public updateTexture() {
        const renderer = TrailLayer.app.renderer;
        // Recall backBuffer texture (which stores the image of previous frame)
        this.trailSprite.texture = this.backBufferTexture;
        // Set alpha of trail image (to fade trail image)
        if (this.trailAlphaCount >= this.trailAlphaSetInterval_) {
            this.trailSprite.alpha = this.trailAlpha_;
            this.trailAlphaCount = 0;
        } else {
            this.trailAlphaCount++;
            this.trailSprite.alpha = 1;
        }
        // Render trail image to frontTrailImageTexture
        renderer.render(this.trailSprite, { renderTexture: this.frontTrailImageTexture, clear: true });

        // Store the image of this container to backBufferTexure (to reuse on next frame)
        renderer.render(this, { renderTexture: this.backBufferTexture, clear: true });
    }

    /**
     * Clear and reset the buffer.
     */
    public clear() {
        const renderer = TrailLayer.app.renderer;
        renderer.render(this.clearingSprite, { renderTexture: this.backBufferTexture, clear: true });
    }
    /**
     * Get the access of the Sprite of trail image
     */
    public get TrailSprite() {
        return this.trailSprite;
    }
    /**
     * Set filter to trail image sprite.
     * @param f Filter to apply.
     */
    public addFilter(f: PIXI.Filter) {
        if (!this.trailSprite.filters) this.trailSprite.filters = [];
        this.trailSprite.filters = this.trailSprite.filters.concat(f);
    }

    /**
     * Set the ting of trail image
     * @param v Tint to apply.
     */
    public set trailTint(v: number) {
        this.trailSprite.tint = v;
    }
    /**
     * Set the alpha level of trail sprite.
     * @param v Alpha of the trail image to set.
     */
    public set trailAlpha(v: number) {
        this.trailAlpha_ = v;
    }
    /**
    * Set the interval to apply transparent to trail sprite. Default is 0. Increasing this thicken trail images.
    * @param v Interval to set trail alpha.
    */
    public set trailAlphaInterval(v: number) {
        this.trailAlphaSetInterval_ = v;
    }
}
