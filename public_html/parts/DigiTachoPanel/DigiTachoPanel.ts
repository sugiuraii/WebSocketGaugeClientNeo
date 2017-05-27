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
 
import {RectangularProgressBar} from '../../lib/Graphics/PIXIGauge';
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

    private speedLabel: PIXI.extras.BitmapText;
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
        const roundedSpeed : number = Math.round(speed);
        this.speedLabel.text = roundedSpeed.toString();
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
        tachoProgressBar.Texture = tachoProgressBarTexture;
        tachoProgressBar.position.set(10,6);
        tachoProgressBar.Min = 0;
        tachoProgressBar.Max = 9000;
        tachoProgressBar.Vertical = false;
        tachoProgressBar.InvertDirection = false;
        tachoProgressBar.InvertDraw = false;
        tachoProgressBar.PixelStep = 8;
        tachoProgressBar.MaskHeight = 246;
        tachoProgressBar.MaskWidth = 577;
        super.addChild(tachoProgressBar);

        const speedTextLabel = new PIXI.extras.BitmapText(this.speed.toString(), {font : "FreeSans", align : "right"});
        this.speedLabel = speedTextLabel;
        speedTextLabel.position.set(485,320);
        speedTextLabel.anchor = new PIXI.Point(1,1);
        super.addChild(speedTextLabel);

        const gearTextLabel = new PIXI.extras.BitmapText(this.gearPos,{font : "Audiowide", align : "center"});
        this.geasposLabel = gearTextLabel;
        gearTextLabel.position.set(66, 62);
        gearTextLabel.anchor = new PIXI.Point(0.5, 0.5);
        super.addChild(gearTextLabel);
    }
}
