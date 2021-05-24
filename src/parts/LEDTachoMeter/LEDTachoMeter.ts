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

import { CircularProgressBar, CircularProgressBarOptions, NumericIndicator, BitmapTextNumericIndicator } from '../../lib/Graphics/PIXIGauge';
import * as PIXI from 'pixi.js';

require("./LEDTachoMeterTexture.json");
require("./LEDTachoMeterTexture.png");
require("../fonts/font.css");
require("../fonts/DSEG_v030/DSEG14Classic-BoldItalic.ttf");
require("./LEDMeterFont_100px.fnt");
require("./LEDMeterFont_88px.fnt");
require("./LEDMeterFont_45px.fnt");
require("./LEDMeterFont_30px.fnt");
require("./LEDMeterFont_100px_0.png");
require("./LEDMeterFont_88px_0.png");
require("./LEDMeterFont_45px_0.png");
require("./LEDMeterFont_30px_0.png");

export class LEDTachoMeter extends PIXI.Container {
    private tachoProgressBar : CircularProgressBar;
    private speedLabel: NumericIndicator;
    private gasMilageLabel: NumericIndicator;
    private tripLabel: NumericIndicator;
    private fuelLabel: NumericIndicator;
    private gearPosLabel: NumericIndicator;

    private tacho = 0;
    private speed = 0;
    private gasMilage = 0;
    private trip = 0;
    private fuel = 0;
    private gearPos = "";

    static get RequestedTexturePath(): string[] {
        return ["img/LEDTachoMeterTexture.json", "img/LEDMeterFont_100px.fnt", "img/LEDMeterFont_88px.fnt", "img/LEDMeterFont_45px.fnt", "img/LEDMeterFont_30px.fnt"];
    }

    static get RequestedFontFamily(): string[] {
        return ["DSEG14ClassicItalic"]
    }

    static get RequestedFontCSSURL(): string[] {
        return ['font.css'];
    }

    get Tacho(): number { return this.tacho; }
    set Tacho(val: number) {
        this.tacho = val;
        this.tachoProgressBar.Value = val;
        this.changeRedZoneProgressBarColor();
        this.tachoProgressBar.update();
    }
    get Speed(): number { return this.speed; }
    set Speed(val: number) {
        this.speed = val;
        this.speedLabel.text = val.toFixed(0);
    }
    get GasMilage(): number { return this.gasMilage; }
    set GasMilage(val: number) {
        this.gasMilage = val;
        if (val > 99)
            this.gasMilageLabel.text = "--.--";
        else
            this.gasMilageLabel.text = val.toFixed(2);
    }
    get Trip(): number { return this.trip }
    set Trip(val: number) {
        this.trip = val;
        this.tripLabel.text = val.toFixed(1);
    }
    get Fuel(): number { return this.fuel }
    set Fuel(val: number) {
        this.fuel = val;
        this.fuelLabel.text = val.toFixed(2);
    }

    get GearPos(): string { return this.gearPos }
    set GearPos(val: string) {
        this.gearPos = val;
        this.gearPosLabel.text = val;
    }

    constructor() {
        super();

        const tachoMax = 9000;
        const tachoMin = 0;
        const tachoValDefault = 4500;
        const speedValDefault = 95;
        const gasMilageValDefault = 12.0;
        const tripValDefault = 230.0;
        const fuelValDefault = 30.00;

        const backSprite = PIXI.Sprite.from("LEDTachoMeter_Base");
        super.addChild(backSprite);

        const tachoProgressBarOption = new CircularProgressBarOptions();
        tachoProgressBarOption.Texture = PIXI.Texture.from("LEDTachoMeter_LED_Yellow");
        tachoProgressBarOption.Center.set(300, 300);
        tachoProgressBarOption.Radius = 300;
        tachoProgressBarOption.InnerRadius = 200;
        tachoProgressBarOption.Max = tachoMax;
        tachoProgressBarOption.Min = tachoMin;
        tachoProgressBarOption.OffsetAngle = 90;
        tachoProgressBarOption.FullAngle = 270;
        tachoProgressBarOption.AngleStep = 6;

        const tachoProgressBar = new CircularProgressBar(tachoProgressBarOption);
        tachoProgressBar.pivot.set(300, 300);
        tachoProgressBar.position.set(300, 300);
        tachoProgressBar.Value = tachoValDefault;
        tachoProgressBar.updateForce();
        this.tachoProgressBar = tachoProgressBar;
        super.addChild(tachoProgressBar);

        const speedLabel = this.speedLabel = new BitmapTextNumericIndicator(speedValDefault.toFixed(0), { fontName: "DSEG14_Classic_88px", fontSize: 88, align: "right" });
        speedLabel.anchor.set(1, 0.5);
        speedLabel.position.set(410, 230);
        super.addChild(speedLabel);

        const gasMilageLabel = this.gasMilageLabel = new BitmapTextNumericIndicator(gasMilageValDefault.toFixed(2), { fontName: "DSEG14_Classic_45px", fontSize: 45, align: "right" });
        gasMilageLabel.anchor.set(1, 0.5);
        gasMilageLabel.position.set(310, 360);
        super.addChild(gasMilageLabel);

        const tripLabel = this.tripLabel = new BitmapTextNumericIndicator(tripValDefault.toFixed(1), { fontName: "DSEG14_Classic_30px", fontSize: 30, align: "right" });
        tripLabel.anchor.set(1, 0.5);
        tripLabel.position.set(510, 355);
        super.addChild(tripLabel);

        const fuelLabel = this.fuelLabel = new BitmapTextNumericIndicator(fuelValDefault.toFixed(2), { fontName: "DSEG14_Classic_30px", fontSize: 30, align: "right" });
        fuelLabel.anchor.set(1, 0.5);
        fuelLabel.position.set(510, 395);
        super.addChild(fuelLabel);

        const gearPosLabel = this.gearPosLabel = new BitmapTextNumericIndicator("N", { fontName: "DSEG14_Classic_100px", fontSize: 100, align: "right" });
        gearPosLabel.anchor.set(1, 0.5);
        gearPosLabel.text = "N";
        gearPosLabel.position.set(410, 495);
        super.addChild(gearPosLabel);
    }

    private changeRedZoneProgressBarColor() {
        const redZoneTacho = 8000;
        if (this.tacho > redZoneTacho) {
            const redfilter = new PIXI.filters.ColorMatrixFilter();
            redfilter.hue(300, true);
            this.tachoProgressBar.filters = [redfilter];
        }
        else
            this.tachoProgressBar.filters = [];
    }
}
