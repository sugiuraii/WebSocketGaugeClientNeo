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

import { CircularProgressBar, CircularProgressBarOptions, NumericIndicator, BitmapTextNumericIndicator } from 'pixi-gauge';
import { CircularPlacementCooridnateCalculator } from 'placement-coordinate-calc';
import * as PIXI from 'pixi.js';
import { Assets } from '@pixi/assets';

require("./LEDTachoMeterTexture.json");
require("./LEDTachoMeterTexture.png");
require("./LEDMeterFont_100px.fnt");
require("./LEDMeterFont_88px.fnt");
require("./LEDMeterFont_45px.fnt");
require("./LEDMeterFont_30px.fnt");
require("./LEDMeterFont_100px_0.png");
require("./LEDMeterFont_88px_0.png");
require("./LEDMeterFont_45px_0.png");
require("./LEDMeterFont_30px_0.png");
require("./LEDMeter_RPMFont_58px.fnt");
require("./LEDMeter_RPMFont_58px_0.png");

export type LEDTachoMeterObjectName = "ProgressBar" | "ValueLabel" | "BackLabel" | "RedZoneBar" | "Background";

export class LEDTachoMeter extends PIXI.Container {
    private tachoProgressBar : CircularProgressBar;
    private speedLabel: NumericIndicator;
    private gasMilageLabel: NumericIndicator;
    private tripLabel: NumericIndicator;
    private fuelLabel: NumericIndicator;
    private gearPosLabel: NumericIndicator;
    private readonly displayObjects: Map<LEDTachoMeterObjectName, PIXI.DisplayObject> = new Map();
    private readonly fixedBackContainer = new PIXI.Container();

    public set CacheBackContainerAsBitMap(value : boolean) { this.fixedBackContainer.cacheAsBitmap = value};
    public getDisplayObjects(value : LEDTachoMeterObjectName) : PIXI.DisplayObject { 
        if(this.displayObjects.get(value) === undefined)
            throw new Error(value + "is not exists");
        else
            return this.displayObjects.get(value)!;
    };

    private tacho = 0;
    private speed = 0;
    private gasMilage = 0;
    private trip = 0;
    private fuel = 0;
    private gearPos = "";

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

    public static async create() {
        await Assets.load(["img/LEDTachoMeterTexture.json", "img/LEDMeterFont_100px.fnt", "img/LEDMeterFont_88px.fnt", "img/LEDMeterFont_45px.fnt", "img/LEDMeterFont_30px.fnt", "img/LEDMeter_RPMFont_58px.fnt"]);
        const instance = new LEDTachoMeter();
        return instance;
    }

    private constructor() {
        super();

        const tachoMax = 9000;
        const tachoMin = 0;
        const tachoValDefault = 4500;
        const speedValDefault = 95;
        const gasMilageValDefault = 12.0;
        const tripValDefault = 230.0;
        const fuelValDefault = 30.00;
        const backGroundContainer = new PIXI.Container();
        const backSprite = PIXI.Sprite.from("LEDTachoMeter_layer_base.png");
        backGroundContainer.addChild(backSprite);

        const redZoneOption = new CircularProgressBarOptions();
        redZoneOption.Texture = PIXI.Texture.from("LEDTachoMeter_layer_red.png");
        redZoneOption.Center.set(300, 300);
        redZoneOption.Radius = 300;
        redZoneOption.InnerRadius = 0;
        redZoneOption.Max = 9000;
        redZoneOption.Min = 0;
        redZoneOption.OffsetAngle = 0;
        redZoneOption.FullAngle = 270;
        redZoneOption.AntiClockwise = true;
        const redZone = new CircularProgressBar(redZoneOption);
        redZone.Value = 1000;
        redZone.updateForce();
        backGroundContainer.addChild(redZone);

        const ledDarkOption = new CircularProgressBarOptions();
        ledDarkOption.Texture = PIXI.Texture.from("LEDTachoMeter_layer_led_dark.png");
        ledDarkOption.Center.set(300, 300);
        ledDarkOption.Radius = 300;
        ledDarkOption.InnerRadius = 200;
        ledDarkOption.Max = 1;
        ledDarkOption.Min = 0;
        ledDarkOption.OffsetAngle = 0;
        ledDarkOption.FullAngle = 270;
        ledDarkOption.AntiClockwise = true;
        const ledDark = new CircularProgressBar(ledDarkOption);
        ledDark.Value = 1;
        ledDark.updateForce();
        backGroundContainer.addChild(ledDark);
        this.displayObjects.set("Background", backGroundContainer);
        this.fixedBackContainer.addChild(backGroundContainer);

        const backTextContainer = new PIXI.Container();
        const textSprite = PIXI.Sprite.from("LEDTachoMeter_layer_text_fixed.png");
        backTextContainer.addChild(textSprite);

        //Create meter number label
        const numberElements: PIXI.BitmapText[] = [];
        const place = new CircularPlacementCooridnateCalculator(197, {x: 300, y: 300});
        for(let num = 0; num <= 9; num++) {
            numberElements[num] = new PIXI.BitmapText({ text: String(num),  style: { fontFamily: "LEDMeter_RPMFont_58px", fontSize: -58, align: "center"}});
            numberElements[num].anchor.set(0.5, 0.5);
            const angle = 270 - num * 30;
            numberElements[num].position.set(place.X(angle), place.Y(angle));
            if(num >= 8)
                numberElements[num].tint = 0xffff00;
        }
        numberElements.forEach(e => backTextContainer.addChild(e));
        this.displayObjects.set("BackLabel", backTextContainer);
        this.fixedBackContainer.addChild(backTextContainer);
        super.addChild(this.fixedBackContainer);

        const tachoProgressBarOption = new CircularProgressBarOptions();
        tachoProgressBarOption.Texture = PIXI.Texture.from("LEDTachoMeter_layer_led_bright_white.png");
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
        tachoProgressBar.Sprite.tint = 0xffff00;
        this.displayObjects.set("ProgressBar", tachoProgressBar);
        super.addChild(tachoProgressBar);

        const valueLabelContainer = new PIXI.Container();
        const speedLabel = this.speedLabel = new BitmapTextNumericIndicator({ text: speedValDefault.toFixed(0),  style: { fontFamily: "LEDMeterFont_88px", fontSize: -88, align: "right"}});
        speedLabel.anchor.set(1, 0.5);
        speedLabel.position.set(410, 240);
        valueLabelContainer.addChild(speedLabel);

        const gasMilageLabel = this.gasMilageLabel = new BitmapTextNumericIndicator({ text: gasMilageValDefault.toFixed(2),  style: { fontFamily: "LEDMeterFont_45px", fontSize: -45, align: "right"}});
        gasMilageLabel.anchor.set(1, 0.5);
        gasMilageLabel.position.set(310, 360);
        valueLabelContainer.addChild(gasMilageLabel);

        const tripLabel = this.tripLabel = new BitmapTextNumericIndicator({ text: tripValDefault.toFixed(1),  style: { fontFamily: "LEDMeterFont_30px", fontSize: -30, align: "right"}});
        tripLabel.anchor.set(1, 0.5);
        tripLabel.position.set(510, 355);
        valueLabelContainer.addChild(tripLabel);

        const fuelLabel = this.fuelLabel = new BitmapTextNumericIndicator({ text: fuelValDefault.toFixed(2),  style: { fontFamily: "LEDMeterFont_30px", fontSize: -30, align: "right"}});
        fuelLabel.anchor.set(1, 0.5);
        fuelLabel.position.set(510, 395);
        valueLabelContainer.addChild(fuelLabel);

        const gearPosLabel = this.gearPosLabel = new BitmapTextNumericIndicator({ text: "N",  style: { fontFamily: "LEDMeterFont_100px", fontSize: -100, align: "right"}});
        gearPosLabel.anchor.set(1, 0.5);
        gearPosLabel.text = "N";
        gearPosLabel.position.set(410, 495);
        valueLabelContainer.addChild(gearPosLabel);
        
        this.displayObjects.set("ValueLabel",valueLabelContainer);
        super.addChild(valueLabelContainer);

        this.CacheBackContainerAsBitMap = true;
    }

    private changeRedZoneProgressBarColor() {
        const redZoneTacho = 8000;
        if (this.tacho > redZoneTacho) {
            const redfilter = new PIXI.ColorMatrixFilter();
            redfilter.hue(300, true);
            this.tachoProgressBar.filters = [redfilter];
        }
        else
            this.tachoProgressBar.filters = [];
    }
}
