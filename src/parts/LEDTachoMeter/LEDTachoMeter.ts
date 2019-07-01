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
 
import {CircularProgressBar} from  '../../lib/Graphics/PIXIGauge';
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

export class LEDTachoMeter extends PIXI.Container
{
    private tachoProgressBar = new CircularProgressBar();
    private speedLabel : PIXI.BitmapText;
    private gasMilageLabel : PIXI.BitmapText;
    private tripLabel : PIXI.BitmapText;
    private fuelLabel : PIXI.BitmapText;
    private gearPosLabel : PIXI.BitmapText;

    private tacho = 0;
    private speed = 0;
    private gasMilage = 0;
    private trip = 0;
    private fuel = 0;
    private gearPos : string = "";

    static get RequestedTexturePath() : string[]
    {
        return ["img/LEDTachoMeterTexture.json", "img/LEDMeterFont_100px.fnt", "img/LEDMeterFont_88px.fnt", "img/LEDMeterFont_45px.fnt", "img/LEDMeterFont_30px.fnt"];
    }

    static get RequestedFontFamily() : string[]
    {
        return ["DSEG14ClassicItalic"]
    }

    static get RequestedFontCSSURL() : string[]
    {
        return ['font.css'];
    }

    get Tacho() : number { return this.tacho; }
    set Tacho(val : number)
    {
        this.tacho = val;
        this.tachoProgressBar.Value = val;
        this.changeRedZoneProgressBarColor();
        this.tachoProgressBar.update();
    }
    get Speed() { return this.speed; }
    set Speed(val : number)
    {
        this.speed = val;
        this.speedLabel.text = val.toFixed(0);
    }        
    get GasMilage() { return this.gasMilage; }
    set GasMilage(val : number)
    {
        this.gasMilage = val;
        if(val > 99)
            this.gasMilageLabel.text = "--.--";
        else
            this.gasMilageLabel.text = val.toFixed(2);
    }
    get Trip() { return this.trip }
    set Trip(val : number)
    {
        this.trip = val;
        this.tripLabel.text = val.toFixed(1);
    }
    get Fuel() { return this.fuel }
    set Fuel(val : number)
    {
        this.fuel = val;
        this.fuelLabel.text = val.toFixed(2);
    }

    get GearPos() { return this.gearPos }
    set GearPos(val : string)
    {
        this.gearPos = val;
        this.gearPosLabel.text = val;
    }

    constructor()
    {
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

        const tachoProgressBar = this.tachoProgressBar;
        tachoProgressBar.Options.Texture = PIXI.Texture.from("LEDTachoMeter_LED_Yellow");
        tachoProgressBar.Options.Center.set(300,300);
        tachoProgressBar.pivot.set(300,300);
        tachoProgressBar.position.set(300, 300);
        tachoProgressBar.Options.Radius = 300;
        tachoProgressBar.Options.InnerRadius = 200;
        tachoProgressBar.Options.Max = tachoMax;
        tachoProgressBar.Options.Min = tachoMin;
        tachoProgressBar.Value = tachoValDefault;
        tachoProgressBar.Options.OffsetAngle = 90;
        tachoProgressBar.Options.FullAngle = 270;
        tachoProgressBar.Options.AngleStep = 6;
        tachoProgressBar.updateForce();
        super.addChild(tachoProgressBar);

        const speedLabel = this.speedLabel = new PIXI.BitmapText(speedValDefault.toFixed(0), {font: {name:"DSEG14_Classic_88px"}, align : "right"});
        speedLabel.anchor = new PIXI.Point(1,0.5);
        speedLabel.position.set(410,230);
        super.addChild(speedLabel);

        const gasMilageLabel = this.gasMilageLabel = new PIXI.BitmapText(gasMilageValDefault.toFixed(2), {font: {name : "DSEG14_Classic_45px"}, align : "right"});
        gasMilageLabel.anchor = new PIXI.Point(1,0.5);
        gasMilageLabel.position.set(310,360);
        super.addChild(gasMilageLabel);

        const tripLabel = this.tripLabel = new PIXI.BitmapText(tripValDefault.toFixed(1), {font: {name : "DSEG14_Classic_30px"}, align : "right"});
        tripLabel.anchor = new PIXI.Point(1,0.5);
        tripLabel.position.set(510,355);
        super.addChild(tripLabel);

        const fuelLabel = this.fuelLabel = new PIXI.BitmapText(fuelValDefault.toFixed(2), {font: {name : "DSEG14_Classic_30px"}, align : "right"});
        fuelLabel.anchor = new PIXI.Point(1,0.5);
        fuelLabel.position.set(510,395);
        super.addChild(fuelLabel);

        const gearPosLabel = this.gearPosLabel = new PIXI.BitmapText("N", {font: {name : "DSEG14_Classic_100px"}, align : "right"});
        gearPosLabel.anchor = new PIXI.Point(1,0.5);
        gearPosLabel.text = "N";
        gearPosLabel.position.set(410,495);
        super.addChild(gearPosLabel);
    }

    private changeRedZoneProgressBarColor()
    {
        const redZoneTacho = 8000;
        if (this.tacho > redZoneTacho)
        {
            const redfilter = new PIXI.filters.ColorMatrixFilter();
            redfilter.hue(300, true);
            this.tachoProgressBar.filters = [redfilter];
        }
        else
            this.tachoProgressBar.filters = [];       
    }
}
