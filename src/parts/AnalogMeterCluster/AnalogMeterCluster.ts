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

import {CircularProgressBar} from '../../lib/Graphics/PIXIGauge';
import {CircularProgressBarOptions} from '../../lib/Graphics/PIXIGauge';
import {RotationNeedleGauge} from '../../lib/Graphics/PIXIGauge';
import {RotationNeedleGaugeOptions} from '../../lib/Graphics/PIXIGauge';
import {BitmapFontNumericIndicator} from '../../lib/Graphics/PIXIGauge';

import * as PIXI from 'pixi.js';

require("./AnalogMeterClusterTexture.json");
require("./AnalogMeterClusterTexture.png");
require("../fonts/font.css");
require("../fonts/DSEG_v030/DSEG14Classic-BoldItalic.ttf");
require("./AnalogMeterFont_115px.fnt");
require("./AnalogMeterFont_45px.fnt");
require("./AnalogMeterFont_40px.fnt");
require("./AnalogMeterFont_60px.fnt");

require("./AnalogMeterFont_115px_0.png");
require("./AnalogMeterFont_45px_0.png");
require("./AnalogMeterFont_40px_0.png");
require("./AnalogMeterFont_60px_0.png");

export class AnalogMeterCluster extends PIXI.Container
{
    private tachoProgressBar: CircularProgressBar;
    private waterTempProgressBar: CircularProgressBar;
    private tachoNeedleGauge: RotationNeedleGauge;
    private speedNeedleGauge: RotationNeedleGauge;
    private boostNeedleGauge: RotationNeedleGauge;

    private speedLabel: BitmapFontNumericIndicator;
    private gasMilageLabel: BitmapFontNumericIndicator;
    private tripLabel: BitmapFontNumericIndicator;
    private fuelLabel: BitmapFontNumericIndicator;
    private gearPosLabel: BitmapFontNumericIndicator;

    private tacho = 0;
    private speed = 0;
    private boost = 0;
    private waterTemp = 0;
    private gasMilage = 0;
    private trip = 0;
    private fuel = 0;
    private gearPos : string = "";

    get Tacho() : number { return this.tacho; }
    set Tacho(val : number)
    {
        this.tacho = val;
        this.tachoProgressBar.Value = val;
        this.tachoNeedleGauge.Value = val;
        this.tachoProgressBar.update();
        this.tachoNeedleGauge.update();
    }
    get Speed() { return this.speed; }
    set Speed(val : number)
    {
        this.speed = val;
        this.speedNeedleGauge.Value = val;
        this.speedNeedleGauge.update();
        this.speedLabel.Value = val;
    }
    get Boost() { return this.boost; }
    set Boost(val : number)
    {
        this.boost = val;
        this.boostNeedleGauge.Value = val;
        this.boostNeedleGauge.update();
    }

    get WaterTemp() { return this.waterTemp; }
    set WaterTemp(val : number)
    {
        this.waterTemp = val;
        this.waterTempProgressBar.Value = val;
        this.waterTempProgressBar.update();
    }

    get GasMilage() { return this.gasMilage; }
    set GasMilage(val : number)
    {
        this.gasMilage = val;
        if(val > 99)
            //Override indicator with '--.--' on abnormal gas milage.
            this.gasMilageLabel.text = "--.--";
        else
            this.gasMilageLabel.Value = val;
    }
    get Trip() { return this.trip }
    set Trip(val : number)
    {
        this.trip = val;
        this.tripLabel.Value = val;
    }
    get Fuel() { return this.fuel }
    set Fuel(val : number)
    {
        this.fuel = val;
        this.fuelLabel.Value = val;
    }

    get GearPos() { return this.gearPos }
    set GearPos(val : string)
    {
        this.gearPos = val;
        this.gearPosLabel.text = val;
    }

    static get RequestedTexturePath() : string[]
    {
        return ["img/AnalogMeterClusterTexture.json", "img/AnalogMeterFont_115px.fnt",  "img/AnalogMeterFont_45px.fnt", "img/AnalogMeterFont_40px.fnt", "img/AnalogMeterFont_60px.fnt"];
    }

    static get RequestedFontFamily() : string[]
    {
        return ["DSEG14ClassicItalic"]
    }

    static get RequestedFontCSSURL() : string[]
    {
        return ['font.css'];
    }

    constructor()
    {
        super();
        const TachoMeter: PIXI.Container = this.createTachoMeter();
        const SpeedMeter: PIXI.Container = this.createSpeedMeter();
        const BoostMeter: PIXI.Container = this.createBoostMeter();
        TachoMeter.position.set(345,0);
        BoostMeter.position.set(615,80);

        super.addChild(SpeedMeter);
        super.addChild(BoostMeter);
        super.addChild(TachoMeter);            
    }

    private createTachoMeter(): PIXI.Container
    {
        const tachoMax = 9000;
        const tachoMin = 0;
        const tachoValDefalut = 0;

        const tachoContainer = new PIXI.Container();
        const backSprite = PIXI.Sprite.from("AnalogTachoMeter_Base");
        tachoContainer.addChild(backSprite);
        
        const tachoProgressBarOptions = new CircularProgressBarOptions();
        tachoProgressBarOptions.Texture = PIXI.Texture.from("AnalogTachoMeter_Bar");
        tachoProgressBarOptions.OffsetAngle = 90;
        tachoProgressBarOptions.FullAngle = 270;
        tachoProgressBarOptions.Max = tachoMax;
        tachoProgressBarOptions.Min = tachoMin;
        tachoProgressBarOptions.Radius = 193;
        tachoProgressBarOptions.InnerRadius = 160;
        tachoProgressBarOptions.Center.set(193,193);
        this.tachoProgressBar = new CircularProgressBar(tachoProgressBarOptions);
        this.tachoProgressBar.pivot.set(193, 193);
        this.tachoProgressBar.position.set(300,300);
        tachoContainer.addChild(this.tachoProgressBar);
        this.tachoProgressBar.Value = tachoValDefalut;
        this.tachoProgressBar.updateForce();
                
        const tachoNeedleGaugeOptions = new RotationNeedleGaugeOptions();
        tachoNeedleGaugeOptions.Texture = PIXI.Texture.from("AnalogTachoMeter_Needle");
        tachoNeedleGaugeOptions.Max = tachoMax;
        tachoNeedleGaugeOptions.Min = tachoMin;
        tachoNeedleGaugeOptions.OffsetAngle = 90;
        tachoNeedleGaugeOptions.FullAngle = 270;
        this.tachoNeedleGauge = new RotationNeedleGauge(tachoNeedleGaugeOptions);
        this.tachoNeedleGauge.pivot.set(15,15);
        this.tachoNeedleGauge.position.set(300,300);
        tachoContainer.addChild(this.tachoNeedleGauge);
        this.tachoNeedleGauge.Value = tachoValDefalut; 
        this.tachoNeedleGauge.updateForce();

        const shaftSprite = PIXI.Sprite.from("AnalogTachoMeter_NeedleCap");
        shaftSprite.pivot.set(72,72);
        shaftSprite.position.set(300,300);
        tachoContainer.addChild(shaftSprite);

        const gasMilageLabel = this.gasMilageLabel = new BitmapFontNumericIndicator("0.00", {font : {name : "DSEG14_Classic_45px", size: 45}, align : "right"});
        gasMilageLabel.NumberOfDecimalPlace = 2;
        gasMilageLabel.anchor = new PIXI.Point(1,0.5);
        gasMilageLabel.position.set(495,335);
        gasMilageLabel.scale.set(0.9);
        tachoContainer.addChild(gasMilageLabel);

        const tripLabel = this.tripLabel = new BitmapFontNumericIndicator("0.0", {font : {name : "DSEG14_Classic_40px", size:40}, align : "right"});
        tripLabel.NumberOfDecimalPlace = 1;
        tripLabel.anchor = new PIXI.Point(1,0.5);
        tripLabel.position = new PIXI.Point(505,378);
        tripLabel.text = "0.0";
        tripLabel.scale.set(0.9);
        tachoContainer.addChild(tripLabel);

        const fuelLabel = this.fuelLabel = new BitmapFontNumericIndicator("0.00", {font : {name: "DSEG14_Classic_40px", size: 40}, align : "right"});
        fuelLabel.NumberOfDecimalPlace = 2;
        fuelLabel.anchor = new PIXI.Point(1,0.5);
        fuelLabel.position = new PIXI.Point(505,420);
        fuelLabel.text = "0.00";
        fuelLabel.scale.set(0.9);
        tachoContainer.addChild(fuelLabel);

        const gearPosLabel = this.gearPosLabel = new BitmapFontNumericIndicator("N", {font : {name: "DSEG14_Classic_115px", size: 115}, align : "center"});
        gearPosLabel.anchor = new PIXI.Point(0.5,0.5);
        gearPosLabel.position = new PIXI.Point(358,493);
        gearPosLabel.text = "N";
        gearPosLabel.scale.set(0.9);
        tachoContainer.addChild(gearPosLabel);

        return tachoContainer;
    }

    private createSpeedMeter(): PIXI.Container
    {
        const speedMax = 280;
        const speedMin = 0;
        const speedValDefault = 0;
        const waterTempMax = 140;
        const waterTempMin = 60;
        const waterTempValDefault = 0;

        const speedMeterContainer = new PIXI.Container();            

        const backSprite = PIXI.Sprite.from("AnalogSpeedMeter_Base");
        speedMeterContainer.addChild(backSprite);

        const speedLabel = this.speedLabel = new BitmapFontNumericIndicator(speedValDefault.toFixed(0), {font : {name : "DSEG14_Classic_60px", size: 60}, align : "center"});
        speedLabel.NumberOfDecimalPlace = 0;
        speedLabel.anchor = new PIXI.Point(1,0.5);
        speedLabel.position.set(355,407);
        speedLabel.scale.set(0.9);
        speedMeterContainer.addChild(speedLabel);

        const waterTempProgressBarOptions = new CircularProgressBarOptions();
        waterTempProgressBarOptions.Texture = PIXI.Texture.from("AnalogSpeedMeter_Bar");
        waterTempProgressBarOptions.Max = waterTempMax;
        waterTempProgressBarOptions.Min = waterTempMin;

        waterTempProgressBarOptions.Radius = 162;
        waterTempProgressBarOptions.InnerRadius = 120;
        waterTempProgressBarOptions.OffsetAngle = 165;
        waterTempProgressBarOptions.FullAngle = 120;
        waterTempProgressBarOptions.Center.set(162,162);
        this.waterTempProgressBar = new CircularProgressBar(waterTempProgressBarOptions);        
        this.waterTempProgressBar.pivot.set(162,162);
        this.waterTempProgressBar.position.set(300,300);
        speedMeterContainer.addChild(this.waterTempProgressBar);
        this.waterTempProgressBar.Value = waterTempValDefault;
        this.waterTempProgressBar.updateForce();
 
        const speedNeedleGaugeOptions = new RotationNeedleGaugeOptions();
        speedNeedleGaugeOptions.Texture = PIXI.Texture.from("AnalogSpeedMeter_Needle");
        speedNeedleGaugeOptions.Max = speedMax;
        speedNeedleGaugeOptions.Min = speedMin;
        speedNeedleGaugeOptions.OffsetAngle = 75;
        speedNeedleGaugeOptions.FullAngle = 210;
        this.speedNeedleGauge = new RotationNeedleGauge(speedNeedleGaugeOptions);
        this.speedNeedleGauge.pivot.set(15,15);
        this.speedNeedleGauge.position.set(300,300);
        speedMeterContainer.addChild(this.speedNeedleGauge);
        this.speedNeedleGauge.Value = speedValDefault;
        this.speedNeedleGauge.updateForce();

        const shaftSprite = PIXI.Sprite.from("AnalogSpeedMeter_NeedleCap");
        shaftSprite.anchor.set(0.5,0.5);
        shaftSprite.position.set(300,300);
        speedMeterContainer.addChild(shaftSprite);

        return speedMeterContainer;
    }

    private createBoostMeter() : PIXI.Container
    {
        const boostMax = 2.0;
        const boostMin = -1.0;
        const boostValDefault = 0.0;

        const boostMeterContainer = new PIXI.Container();

        const backSprite = PIXI.Sprite.from("BoostMeter_Base");
        boostMeterContainer.addChild(backSprite);

        const boostNeedleGaugeOptions = new RotationNeedleGaugeOptions();
        boostNeedleGaugeOptions.Texture = PIXI.Texture.from("BoostMeter_Needle");
        boostNeedleGaugeOptions.OffsetAngle = 30;
        boostNeedleGaugeOptions.FullAngle = 90;
        boostNeedleGaugeOptions.AntiClockwise = true;
        boostNeedleGaugeOptions.Max = boostMax;
        boostNeedleGaugeOptions.Min = boostMin;
        this.boostNeedleGauge = new RotationNeedleGauge(boostNeedleGaugeOptions);
        this.boostNeedleGauge.pivot.set(90,15);
        this.boostNeedleGauge.position.set(220,220);
        this.boostNeedleGauge.Value = boostValDefault;
        this.boostNeedleGauge.updateForce();
        boostMeterContainer.addChild(this.boostNeedleGauge);

        return boostMeterContainer;
    }
}