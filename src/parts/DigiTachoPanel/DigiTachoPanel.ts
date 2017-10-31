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

 /// <reference path="../../lib/webpackRequire.ts" />
 
import {RectangularProgressBar} from '../../lib/Graphics/PIXIGauge';
import {BitmapFontNumericIndicator} from '../../lib/Graphics/PIXIGauge';

import * as PIXI from 'pixi.js';

require("./DigiTachoTexture.json");
require("./DigiTachoTexture.png");
//require("../fonts/font.css");
//require("../fonts/GNU-Freefonts/FreeSansBold.otf");
//require("../fonts/AudioWide/Audiowide-Regular.ttf");

require("./SpeedMeterFont.fnt");
require("./SpeedMeterFont_0.png");
require("./GearPosFont.fnt");
require ("./GearPosFont_0.png");

export class DigiTachoPanel extends PIXI.Container
{
    private tachoProgressBar: RectangularProgressBar;

    private speedLabel: BitmapFontNumericIndicator;
    private geasposLabel: PIXI.extras.BitmapText;

    private speed : number = 0;
    private tacho : number = 0;
    private gearPos : string = "N";

    static get RequestedTexturePath() : string[]
    {
        return ["img/DigiTachoTexture.json", "img/GearPosFont.fnt", "img/SpeedMeterFont.fnt"];
    }

    static get RequestedFontFamily() : string[]
    {
        return [];
    }

    static get RequestedFontCSSURL() : string[]
    {
        return [];
    }

    get Speed() : number { return this.speed;}
    set Speed(speed : number)
    {
        this.speed = speed;
        this.speedLabel.Value = speed;
    }

    get Tacho(): number {return this.tacho}
    set Tacho(tacho : number)
    {
        this.tacho = tacho;
        this.tachoProgressBar.Value = tacho;
        this.tachoProgressBar.update();
    }
    
    get GearPos(): string { return this.gearPos}
    set GearPos(gearPos : string)
    {
        this.gearPos = gearPos;
        this.geasposLabel.text = gearPos;
    }

    constructor()
    {
        super();
        this.create();
    }

    private create() : void
    {
        const backTexture = PIXI.Texture.fromFrame("DigiTachoBack");
        const tachoProgressBarTexture = PIXI.Texture.fromFrame("DigiTachoBar");

        //Create background sprite
        const backSprite = new PIXI.Sprite();
        backSprite.texture = backTexture;
        super.addChild(backSprite);

        //Create tacho progress bar
        const tachoProgressBar = new RectangularProgressBar();
        this.tachoProgressBar = tachoProgressBar;
        tachoProgressBar.Options.Texture = tachoProgressBarTexture;
        tachoProgressBar.position.set(10,6);
        tachoProgressBar.Options.Min = 0;
        tachoProgressBar.Options.Max = 9000;
        tachoProgressBar.Options.Vertical = false;
        tachoProgressBar.Options.InvertDirection = false;
        tachoProgressBar.Options.GagueFullOnValueMin = false;
        tachoProgressBar.Options.PixelStep = 8;
        tachoProgressBar.Options.MaskHeight = 246;
        tachoProgressBar.Options.MaskWidth = 577;
        super.addChild(tachoProgressBar);

        const speedTextLabel = new BitmapFontNumericIndicator(this.speed.toString(), {font : "FreeSans", align : "right"});
        this.speedLabel = speedTextLabel;
        speedTextLabel.position.set(485,320);
        speedTextLabel.anchor = new PIXI.Point(1,1);
        speedTextLabel.NumberOfDecimalPlace = 0;
        super.addChild(speedTextLabel);

        const gearTextLabel = new PIXI.extras.BitmapText(this.gearPos,{font : "Audiowide", align : "center"});
        this.geasposLabel = gearTextLabel;
        gearTextLabel.position.set(66, 62);
        gearTextLabel.anchor = new PIXI.Point(0.5, 0.5);
        super.addChild(gearTextLabel);
    }
}
