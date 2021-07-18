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

import { RectangularProgressBar, RectangularProgressBarOptions } from '../../lib/Graphics/PIXIGauge';
import { BitmapTextNumericIndicator } from '../../lib/Graphics/PIXIGauge';
import { NumericIndicator } from '../../lib/Graphics/PIXIGauge';

import * as PIXI from 'pixi.js';

require("./DigiTachoTexture.json");
require("./DigiTachoTexture.png");
//require("../fonts/font.css");
//require("../fonts/GNU-Freefonts/FreeSansBold.otf");
//require("../fonts/AudioWide/Audiowide-Regular.ttf");

require("./SpeedMeterFont.fnt");
require("./SpeedMeterFont_0.png");
require("./GearPosFont.fnt");
require("./GearPosFont_0.png");

export class DigiTachoPanel extends PIXI.Container {
    private tachoProgressBar: RectangularProgressBar;

    private speedLabel: NumericIndicator;
    private geasposLabel: PIXI.BitmapText;

    private speed = 0;
    private tacho = 0;
    private gearPos = "N";

    static get RequestedTexturePath(): string[] {
        return ["img/DigiTachoTexture.json", "img/GearPosFont.fnt", "img/SpeedMeterFont.fnt"];
    }

    static get RequestedFontFamily(): string[] {
        return [];
    }

    static get RequestedFontCSSURL(): string[] {
        return [];
    }

    get Speed(): number { return this.speed; }
    set Speed(speed: number) {
        this.speed = speed;
        this.speedLabel.Value = speed;
    }

    get Tacho(): number { return this.tacho }
    set Tacho(tacho: number) {
        this.tacho = tacho;
        this.tachoProgressBar.Value = tacho;
        this.tachoProgressBar.update();
    }

    get GearPos(): string { return this.gearPos }
    set GearPos(gearPos: string) {
        this.gearPos = gearPos;
        this.geasposLabel.text = gearPos;
    }

    constructor() {
        super();
        const gaugeset = this.create();
        this.tachoProgressBar = gaugeset.tachoProgressBar;
        this.speedLabel = gaugeset.speedLabel;
        this.geasposLabel = gaugeset.gearLabel;
    }

    private create(): { tachoProgressBar: RectangularProgressBar, speedLabel: BitmapTextNumericIndicator, gearLabel: PIXI.BitmapText } {
        const backTexture = PIXI.Texture.from("DigiTachoBack");
        const tachoProgressBarTexture = PIXI.Texture.from("DigiTachoBar");

        //Create background sprite
        const backSprite = new PIXI.Sprite();
        backSprite.texture = backTexture;
        super.addChild(backSprite);

        //Create tacho progress bar
        const tachoProgressBarOption = new RectangularProgressBarOptions();
        tachoProgressBarOption.Texture = tachoProgressBarTexture;
        tachoProgressBarOption.Min = 0;
        tachoProgressBarOption.Max = 9000;
        tachoProgressBarOption.Vertical = false;
        tachoProgressBarOption.InvertDirection = false;
        tachoProgressBarOption.GagueFullOnValueMin = false;
        tachoProgressBarOption.PixelStep = 8;
        tachoProgressBarOption.MaskHeight = 246;
        tachoProgressBarOption.MaskWidth = 577;

        const tachoProgressBar = new RectangularProgressBar(tachoProgressBarOption);
        tachoProgressBar.position.set(10, 6);

        super.addChild(tachoProgressBar);

        const speedTextLabel = new BitmapTextNumericIndicator(this.speed.toString(), { fontName: "FreeSans", fontSize: 185, align: "right" });
        speedTextLabel.position.set(485, 320);
        speedTextLabel.anchor.set(1, 1);
        speedTextLabel.NumberOfDecimalPlace = 0;
        super.addChild(speedTextLabel);

        const gearTextLabel = new PIXI.BitmapText(this.gearPos, { fontName: "Audiowide", fontSize: 125, align: "center" });
        gearTextLabel.position.set(66, 62);
        gearTextLabel.anchor.set(0.5, 0.5);
        super.addChild(gearTextLabel);

        return {tachoProgressBar : tachoProgressBar, speedLabel : speedTextLabel, gearLabel : gearTextLabel} ;
    }
}
