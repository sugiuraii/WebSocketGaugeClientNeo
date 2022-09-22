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

import { RectangularProgressBar, RectangularProgressBarOptions } from 'lib/Graphics/PIXIGauge';
import * as PIXI from 'pixi.js';
import { Assets } from '@pixi/assets';

require("./MilageGraphTexture.json");
require("./MilageGraphTexture.png");
require("../fonts/font.css");
require("../fonts/GNU-Freefonts/FreeSansBold.otf");

require("./MilageGraphFont_45px.fnt");
require("./MilageGraphFont_45px_0.png");
require("./MilageGraphFont_68px.fnt");
require("./MilageGraphFont_68px_0.png");

export class MilageGraphPanel extends PIXI.Container {
    private momentGasMilageBar: RectangularProgressBar;
    private sectGasMilageBar: { [spankey: string]: RectangularProgressBar } = {};
    private tripLabel: PIXI.BitmapText;
    private fuelLabel: PIXI.BitmapText;
    private gasMilageLabel: PIXI.BitmapText;

    private momentGasMilage = 0;
    private trip = 0;
    private fuel = 0;
    private gasMilage = 0;
    private sectGasMilage: { [spankey: string]: number } = {};

    private sectSpan: string[] = ["5min", "10min", "15min", "20min", "25min", "30min"];

    public get MomentGasMilage(): number { return this.momentGasMilage }
    public set MomentGasMilage(val: number) {
        this.momentGasMilage = val;
        this.momentGasMilageBar.Value = val;
        this.momentGasMilageBar.update();
    }

    public get Fuel(): number { return this.fuel }
    public set Fuel(val: number) {
        this.fuel = val;
        this.fuelLabel.text = this.fuel.toFixed(2)
    }

    public get Trip(): number { return this.trip }
    public set Trip(val: number) {
        this.trip = val;
        this.tripLabel.text = this.trip.toFixed(1);
    }

    public get GasMilage(): number { return this.gasMilage }
    public set GasMilage(val: number) {
        this.gasMilage = val;
        if (val > 99)
            this.gasMilageLabel.text = "--.-";
        else
            this.gasMilageLabel.text = this.gasMilage.toFixed(1);
    }

    public setSectGasMllage(sectspan: string, gasMilage: number): void {
        this.sectGasMilage[sectspan] = gasMilage;
        this.sectGasMilageBar[sectspan].Value = this.sectGasMilage[sectspan];
        this.sectGasMilageBar[sectspan].update();
    }
    public getSectGasMllage(sectspan: string): number {
        return this.sectGasMilage[sectspan];
    }

    public static async create() {
        await Assets.load(["img/MilageGraphTexture.json", "img/MilageGraphFont_45px.fnt", "img/MilageGraphFont_68px.fnt"]);
        await Assets.load(["./fonts/FreeSansBold.otf"]);
        const instance = new MilageGraphPanel();
        return instance;
    }

    private constructor() {
        super();

        const backTexture = PIXI.Texture.from("MilageGraph_Back");
        const backSprite = new PIXI.Sprite(backTexture);
        super.addChild(backSprite);

        const momentGasMilageBarOption = new RectangularProgressBarOptions();
        momentGasMilageBarOption.Texture = PIXI.Texture.from("MilageGraph_valueBar2");
        momentGasMilageBarOption.Vertical = true;
        momentGasMilageBarOption.MaskWidth = 40;
        momentGasMilageBarOption.MaskHeight = 240;
        momentGasMilageBarOption.Max = 20;
        momentGasMilageBarOption.Min = 0;

        this.momentGasMilageBar = new RectangularProgressBar(momentGasMilageBarOption);
        this.momentGasMilageBar.position.set(411, 17);
        super.addChild(this.momentGasMilageBar);

        //Sect fuelTrip progressbar
        const sectGasMilageBarTexture = PIXI.Texture.from("MilageGraph_valueBar1");
        for (let i = 0; i < this.sectSpan.length; i++) {
            const spankey: string = this.sectSpan[i];
            const sectGasMilageBarOption = new RectangularProgressBarOptions();
            sectGasMilageBarOption.Texture = sectGasMilageBarTexture;
            sectGasMilageBarOption.Vertical = true;
            sectGasMilageBarOption.MaskWidth = 30;
            sectGasMilageBarOption.MaskHeight = 240;
            sectGasMilageBarOption.Max = 20;
            sectGasMilageBarOption.Min = 0;
            this.sectGasMilageBar[spankey] = new RectangularProgressBar(sectGasMilageBarOption);
            this.sectGasMilage[spankey] = 0;
            super.addChild(this.sectGasMilageBar[spankey]);
        }
        this.sectGasMilageBar["30min"].position.set(72, 17);
        this.sectGasMilageBar["25min"].position.set(130, 17);
        this.sectGasMilageBar["20min"].position.set(187, 17);
        this.sectGasMilageBar["15min"].position.set(245, 17);
        this.sectGasMilageBar["10min"].position.set(303, 17);
        this.sectGasMilageBar["5min"].position.set(360, 17);

        this.tripLabel = new PIXI.BitmapText("0.0", { fontName: "FreeSans_45px", fontSize: 45, align: "right" });
        this.tripLabel.anchor.set(1, 1);
        this.tripLabel.position.set(600, 115);
        super.addChild(this.tripLabel);

        this.fuelLabel = new PIXI.BitmapText("0.00", { fontName: "FreeSans_45px", fontSize: 45, align: "right" });
        this.fuelLabel.anchor.set(1, 1);
        this.fuelLabel.position.set(600, 170);
        super.addChild(this.fuelLabel);

        this.gasMilageLabel = new PIXI.BitmapText("0.00", { fontName: "FreeSans_68px", fontSize: 68, align: "right" });
        this.gasMilageLabel.anchor.set(1, 1);
        this.gasMilageLabel.position.set(625, 270);
        super.addChild(this.gasMilageLabel);
    }
}