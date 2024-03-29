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

import { RectangularProgressBar, RectangularProgressBarOptions } from 'pixi-gauge';
import { BitmapTextNumericIndicator } from 'pixi-gauge';
import { NumericIndicator } from 'pixi-gauge';

import * as PIXI from 'pixi.js';
import { TrailLayer } from 'pixi-traillayer';

require("./DigiTachoMeterTexture.json");
require("./DigiTachoMeterTexture.png");

require("./SpeedMeterFont.fnt");
require("./SpeedMeterFont_0.png");
require("./GearPosFont.fnt");
require("./GearPosFont_0.png");

export type DigiTachoPanelObjectName = "TachoProgressBar" | "SpeedLabel" | "GearPosLabel" | "BackLabel" | "Grid" | "Background";

export class DigiTachoPanel extends PIXI.Container {
    private readonly displayObjects: Map<DigiTachoPanelObjectName, PIXI.Container> = new Map();
    private readonly fixedBackContainer: PIXI.Container;
    private tachoProgressBar: RectangularProgressBar;

    private speedLabel: NumericIndicator;
    private geasposLabel: PIXI.BitmapText;

    private speed = 0;
    private tacho = 0;
    private gearPos = "N";

    private readonly trailAlpha : number;
    private readonly applyTrail : boolean;

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

    public getDisplayObjects(value : DigiTachoPanelObjectName) : PIXI.Container { 
        if(this.displayObjects.get(value) === undefined)
            throw new Error(value + "is not exists");
        else
            return this.displayObjects.get(value)!;
    };

    public static async create(applyTrail = true, trailAlpha = 0.95) {
        await PIXI.Assets.load(["img/DigiTachoMeterTexture.json", "img/GearPosFont.fnt", "img/SpeedMeterFont.fnt"]);
        const progressBarTexture = await this.createProgressBarTexture();
        const instance = new DigiTachoPanel(applyTrail, trailAlpha, progressBarTexture);
        return instance;
    }

    private constructor(applyTrail : boolean, trailAlpha : number, progressBarTexture: PIXI.Texture) {
        super();
        this.applyTrail = applyTrail;
        this.trailAlpha = trailAlpha;
        const gaugeset = this.buildGaugeSet(progressBarTexture);
        this.tachoProgressBar = gaugeset.tachoProgressBar;
        this.speedLabel = gaugeset.speedLabel;
        this.geasposLabel = gaugeset.gearLabel;
        this.fixedBackContainer = gaugeset.fixedContainer;
    }

    private static async createProgressBarTexture(): Promise<PIXI.Texture> {
        // Set coordinate of DigiTachoMeter_layer_digitachometer_led_dark at the spritesheet.
        const imgframe = {"x":11,"y":310,"w":574,"h":245};
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext("2d");
            canvas.width = imgframe.w;
            canvas.height = imgframe.h;
            if(ctx !== null) {
                const img = new Image();
                img.src = "img/DigiTachoMeterTexture.png";
                const lineargradient = ctx.createLinearGradient(0, 0, imgframe.w, 0);
                lineargradient.addColorStop(0, '#00fff0ff');
                lineargradient.addColorStop(0.2, '#00ff00ff');
                lineargradient.addColorStop(0.43, '#ffff00ff');
                lineargradient.addColorStop(0.86, '#ffff00ff');
                lineargradient.addColorStop(0.88, '#ff0000ff');
                lineargradient.addColorStop(1,    '#ff0000ff');
                img.onload = () => {
                    ctx.fillStyle = lineargradient;
                    ctx.fillRect(0, 0, imgframe.w, imgframe.h);
                    ctx.globalCompositeOperation = "destination-in";
                    ctx.drawImage(img, imgframe.x, imgframe.y, imgframe.w, imgframe.h, 0, 0, imgframe.w, imgframe.h); // Refer DigiTachoDarkBar
                    ctx.globalCompositeOperation = "lighten";
                    ctx.drawImage(img, imgframe.x, imgframe.y, imgframe.w, imgframe.h, 0, 0, imgframe.w, imgframe.h); // Refer DigiTachoDarkBar
                    resolve(PIXI.Texture.from(canvas));
                };
            } else {
                reject(new Error("Canvas.getContext() returns null"));
            }    
        })
    };

    private buildGaugeSet(tachoProgressBarTexture: PIXI.Texture): { tachoProgressBar: RectangularProgressBar, speedLabel: BitmapTextNumericIndicator, gearLabel: PIXI.BitmapText, fixedContainer: PIXI.Container } {
        const backGroundContainer = new PIXI.Container();
        const backTexture = PIXI.Texture.from("DigiTachoMeter_layer_digitachometer_back.png");
        const gridTexture = PIXI.Texture.from("DigiTachoMeter_layer_digitachometer_grid.png");
        const backTextTexture = PIXI.Texture.from("DigiTachoMeter_layer_digitachometer_text.png");
        const darkBarTexture = PIXI.Texture.from("DigiTachoMeter_layer_digitachometer_led_dark.png");
        //Create background sprite
        const backSprite = new PIXI.Sprite();
        backSprite.texture = backTexture;
        backGroundContainer.addChild(backSprite);

        const darkBarSprite = new PIXI.Sprite();
        darkBarSprite.texture = darkBarTexture ;
        backGroundContainer.addChild(darkBarSprite);
        this.displayObjects.set("Background", backGroundContainer);
        
        const gridSprite = new PIXI.Sprite();
        gridSprite.texture = gridTexture;
        this.displayObjects.set("Grid", gridSprite);

        const backTextSprite = new PIXI.Sprite();
        backTextSprite.texture = backTextTexture;
        this.displayObjects.set("BackLabel", backTextSprite);

        const fixedContainer = new PIXI.Container();
        fixedContainer.addChild(backGroundContainer);
        fixedContainer.addChild(gridSprite);
        fixedContainer.addChild(backTextSprite);
        super.addChild(fixedContainer);
        
        //Create tacho progress bar
        const tachoProgressBarOption = new RectangularProgressBarOptions();
        tachoProgressBarOption.Texture = tachoProgressBarTexture;
        tachoProgressBarOption.Min = 0;
        tachoProgressBarOption.Max = 9000;
        tachoProgressBarOption.GaugeDirection = "LeftToRight";
        tachoProgressBarOption.GagueFullOnValueMin = false;
        tachoProgressBarOption.PixelStep = 8;
        tachoProgressBarOption.Height = 245;
        tachoProgressBarOption.Width = 574;

        const tachoProgressBar = new RectangularProgressBar(tachoProgressBarOption);
        tachoProgressBar.position.set(11, 7);
        
        if(this.applyTrail) {
            const trailLayer = new TrailLayer({height : backSprite.height, width : backSprite.width});
            trailLayer.addChild(tachoProgressBar);
            trailLayer.trailAlpha = this.trailAlpha;
            this.displayObjects.set("TachoProgressBar", trailLayer);
            super.addChild(trailLayer);
        } else {
            this.displayObjects.set("TachoProgressBar", tachoProgressBar);
            super.addChild(tachoProgressBar);
        }

        const speedTextLabel = new BitmapTextNumericIndicator({ text: this.speed.toString(),  style: { fontFamily: "DigiTacho_SpeedMeter", fontSize: -170, align: "right", letterSpacing: -5}});
        speedTextLabel.position.set(485, 360);
        speedTextLabel.anchor.set(1, 1);
        speedTextLabel.NumberOfDecimalPlace = 0;
        this.displayObjects.set("SpeedLabel", speedTextLabel);
        super.addChild(speedTextLabel);

        const gearTextLabel = new PIXI.BitmapText({ text: this.gearPos,  style: { fontFamily: "DigiTacho_GearPos", fontSize: -101, align: "center"}});
        gearTextLabel.anchor.set(0.5, 0.5);
        gearTextLabel.position.set(64, 47);
        this.displayObjects.set("GearPosLabel", gearTextLabel);
        super.addChild(gearTextLabel);

        return {tachoProgressBar : tachoProgressBar, speedLabel : speedTextLabel, gearLabel : gearTextLabel, fixedContainer: fixedContainer} ;
    }
}
