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

import { CircularProgressBar } from 'pixi-gauge';
import { CircularProgressBarOptions } from 'pixi-gauge';
import { RotationNeedleGauge } from 'pixi-gauge';
import { RotationNeedleGaugeOptions } from 'pixi-gauge';
import { BitmapTextNumericIndicator } from 'pixi-gauge';
import { NumericIndicator } from 'pixi-gauge';

import * as PIXI from 'pixi.js';
import { Assets } from '@pixi/assets';
import { TrailLayer } from 'lib/TrailMaker/TrailLayer';

require("./AnalogMeterClusterTexture.json");
require("./AnalogMeterClusterTexture.png");
require("./AnalogMeterFont_115px.fnt");
require("./AnalogMeterFont_45px.fnt");
require("./AnalogMeterFont_40px.fnt");
require("./AnalogMeterFont_60px.fnt");

require("./AnalogMeterFont_115px_0.png");
require("./AnalogMeterFont_45px_0.png");
require("./AnalogMeterFont_40px_0.png");
require("./AnalogMeterFont_60px_0.png");

const TRAIL_ALPHA = 0.6;

export class AnalogMeterCluster extends PIXI.Container {
    private tachoProgressBar: CircularProgressBar;
    private waterTempProgressBar: CircularProgressBar;
    private tachoNeedleGauge: RotationNeedleGauge;
    private speedNeedleGauge: RotationNeedleGauge;
    private boostNeedleGauge: RotationNeedleGauge;

    private speedLabel: NumericIndicator;
    private gasMilageLabel: NumericIndicator;
    private tripLabel: NumericIndicator;
    private fuelLabel: NumericIndicator;
    private gearPosLabel: NumericIndicator;

    private tacho = 0;
    private speed = 0;
    private boost = 0;
    private waterTemp = 0;
    private gasMilage = 0;
    private trip = 0;
    private fuel = 0;
    private gearPos = "";

    get Tacho(): number { return this.tacho; }
    set Tacho(val: number) {
        this.tacho = val;
        this.tachoProgressBar.Value = val;
        this.tachoNeedleGauge.Value = val;
        this.tachoProgressBar.update();
        this.tachoNeedleGauge.update();
    }
    get Speed(): number { return this.speed; }
    set Speed(val: number) {
        this.speed = val;
        this.speedNeedleGauge.Value = val;
        this.speedNeedleGauge.update();
        this.speedLabel.Value = val;
    }
    get Boost(): number { return this.boost; }
    set Boost(val: number) {
        this.boost = val;
        this.boostNeedleGauge.Value = val;
        this.boostNeedleGauge.update();
    }

    get WaterTemp(): number { return this.waterTemp; }
    set WaterTemp(val: number) {
        this.waterTemp = val;
        this.waterTempProgressBar.Value = val;
        this.waterTempProgressBar.update();
    }

    get GasMilage(): number { return this.gasMilage; }
    set GasMilage(val: number) {
        this.gasMilage = val;
        if (val > 99)
            //Override indicator with '--.--' on abnormal gas milage.
            this.gasMilageLabel.text = "--.--";
        else
            this.gasMilageLabel.Value = val;
    }
    get Trip(): number { return this.trip }
    set Trip(val: number) {
        this.trip = val;
        this.tripLabel.Value = val;
    }
    get Fuel(): number { return this.fuel }
    set Fuel(val: number) {
        this.fuel = val;
        this.fuelLabel.Value = val;
    }

    get GearPos(): string { return this.gearPos }
    set GearPos(val: string) {
        this.gearPos = val;
        this.gearPosLabel.text = val;
    }
    
    private constructor() {
        super();
        
        const TachoMeter = this.createTachoMeter();
        const SpeedMeter = this.createSpeedMeter();
        const BoostMeter = this.createBoostMeter();
        TachoMeter.container.position.set(345, 0);
        BoostMeter.container.position.set(615, 80);

        super.addChild(SpeedMeter.container);
        super.addChild(BoostMeter.container);
        super.addChild(TachoMeter.container);

        this.tachoProgressBar = TachoMeter.progressBar;
        this.tachoNeedleGauge = TachoMeter.needleGauge;
        this.gasMilageLabel = TachoMeter.gasmilageLabel;
        this.tripLabel = TachoMeter.tripLabel;
        this.fuelLabel = TachoMeter.fuelLabel;
        this.gearPosLabel = TachoMeter.gearPosLabel;

        this.speedNeedleGauge = SpeedMeter.speedNeedleGauge;
        this.speedLabel = SpeedMeter.speedLabel;
        this.waterTempProgressBar = SpeedMeter.waterTempProgressBar;

        this.boostNeedleGauge = BoostMeter.boostNeedleGauge;
    }

    public static async create() {
        await Assets.load(["img/AnalogMeterClusterTexture.json", "img/AnalogMeterFont_115px.fnt", "img/AnalogMeterFont_45px.fnt", "img/AnalogMeterFont_40px.fnt", "img/AnalogMeterFont_60px.fnt"]);
        //await Assets.load('./fonts/DSEG14Classic-BoldItalic.ttf');
        const instance = new AnalogMeterCluster();
        return instance;
    }

    private createTachoMeter(): { container: PIXI.Container, progressBar: CircularProgressBar, needleGauge: RotationNeedleGauge, gasmilageLabel: NumericIndicator, tripLabel: NumericIndicator, fuelLabel: NumericIndicator, gearPosLabel: NumericIndicator } {
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
        tachoProgressBarOptions.Center.set(193, 193);
        const tachoProgressBar = new CircularProgressBar(tachoProgressBarOptions);
        tachoProgressBar.pivot.set(193, 193);
        tachoProgressBar.position.set(300, 300);
        tachoContainer.addChild(tachoProgressBar);
        tachoProgressBar.Value = tachoValDefalut;
        tachoProgressBar.updateForce();

        const tachoNeedleGaugeOptions = new RotationNeedleGaugeOptions();
        tachoNeedleGaugeOptions.Texture = PIXI.Texture.from("AnalogTachoMeter_Needle");
        tachoNeedleGaugeOptions.Max = tachoMax;
        tachoNeedleGaugeOptions.Min = tachoMin;
        tachoNeedleGaugeOptions.OffsetAngle = 90;
        tachoNeedleGaugeOptions.FullAngle = 270;
        const tachoNeedleGauge = new RotationNeedleGauge(tachoNeedleGaugeOptions);
        tachoNeedleGauge.pivot.set(15, 15);
        tachoNeedleGauge.position.set(300, 300);
        tachoNeedleGauge.Value = tachoValDefalut;
        tachoNeedleGauge.updateForce();

        const trailLayer = new TrailLayer({height : 600, width : 600});
        trailLayer.addChild(tachoNeedleGauge);
        trailLayer.trailAlpha = TRAIL_ALPHA;
        tachoContainer.addChild(trailLayer);

        const shaftSprite = PIXI.Sprite.from("AnalogTachoMeter_NeedleCap");
        shaftSprite.pivot.set(72, 72);
        shaftSprite.position.set(300, 300);
        tachoContainer.addChild(shaftSprite);

        const gasMilageLabel = new BitmapTextNumericIndicator("0.00", { fontName: "DSEG14_Classic_45px", fontSize: 45, align: "right" });
        gasMilageLabel.NumberOfDecimalPlace = 2;
        gasMilageLabel.anchor.set(1, 0.5);
        gasMilageLabel.position.set(495, 335);
        gasMilageLabel.scale.set(0.9);
        tachoContainer.addChild(gasMilageLabel);

        const tripLabel = new BitmapTextNumericIndicator("0.0", { fontName: "DSEG14_Classic_40px", fontSize: 40, align: "right" });
        tripLabel.NumberOfDecimalPlace = 1;
        tripLabel.anchor.set(1, 0.5);
        tripLabel.position.set(505, 378);
        tripLabel.text = "0.0";
        tripLabel.scale.set(0.9);
        tachoContainer.addChild(tripLabel);

        const fuelLabel = new BitmapTextNumericIndicator("0.00", { fontName: "DSEG14_Classic_40px", fontSize: 40, align: "right" });
        fuelLabel.NumberOfDecimalPlace = 2;
        fuelLabel.anchor.set(1, 0.5);
        fuelLabel.position.set(505, 420);
        fuelLabel.text = "0.00";
        fuelLabel.scale.set(0.9);
        tachoContainer.addChild(fuelLabel);

        const gearPosLabel = new BitmapTextNumericIndicator("N", { fontName: "DSEG14_Classic_115px", fontSize: 115, align: "center" });
        gearPosLabel.anchor.set(0.5, 0.5);
        gearPosLabel.position.set(358, 493);
        gearPosLabel.text = "N";
        gearPosLabel.scale.set(0.9);
        tachoContainer.addChild(gearPosLabel);

        return { container: tachoContainer, progressBar: tachoProgressBar, needleGauge: tachoNeedleGauge, gasmilageLabel: gasMilageLabel, tripLabel: tripLabel, fuelLabel: fuelLabel, gearPosLabel: gearPosLabel };
    }

    private createSpeedMeter(): { container: PIXI.Container, speedNeedleGauge: RotationNeedleGauge, speedLabel: NumericIndicator, waterTempProgressBar: CircularProgressBar } {
        const speedMax = 280;
        const speedMin = 0;
        const speedValDefault = 0;
        const waterTempMax = 140;
        const waterTempMin = 60;
        const waterTempValDefault = 0;

        const speedMeterContainer = new PIXI.Container();

        const backSprite = PIXI.Sprite.from("AnalogSpeedMeter_Base");
        speedMeterContainer.addChild(backSprite);

        const speedLabel = this.speedLabel = new BitmapTextNumericIndicator(speedValDefault.toFixed(0), { fontName: "DSEG14_Classic_60px", fontSize: 60, align: "center" });
        speedLabel.NumberOfDecimalPlace = 0;
        speedLabel.anchor.set(1, 0.5);
        speedLabel.position.set(355, 407);
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
        waterTempProgressBarOptions.Center.set(162, 162);
        const waterTempProgressBar = new CircularProgressBar(waterTempProgressBarOptions);
        waterTempProgressBar.pivot.set(162, 162);
        waterTempProgressBar.position.set(300, 300);
        speedMeterContainer.addChild(waterTempProgressBar);
        waterTempProgressBar.Value = waterTempValDefault;
        waterTempProgressBar.updateForce();

        const speedNeedleGaugeOptions = new RotationNeedleGaugeOptions();
        speedNeedleGaugeOptions.Texture = PIXI.Texture.from("AnalogSpeedMeter_Needle");
        speedNeedleGaugeOptions.Max = speedMax;
        speedNeedleGaugeOptions.Min = speedMin;
        speedNeedleGaugeOptions.OffsetAngle = 75;
        speedNeedleGaugeOptions.FullAngle = 210;
        const speedNeedleGauge = new RotationNeedleGauge(speedNeedleGaugeOptions);
        speedNeedleGauge.pivot.set(15, 15);
        speedNeedleGauge.position.set(300, 300);
        speedNeedleGauge.Value = speedValDefault;
        speedNeedleGauge.updateForce();

        const trailLayer = new TrailLayer({height : backSprite.height, width : backSprite.width});
        trailLayer.addChild(speedNeedleGauge);
        trailLayer.trailAlpha = TRAIL_ALPHA;
        speedMeterContainer.addChild(trailLayer);

        const shaftSprite = PIXI.Sprite.from("AnalogSpeedMeter_NeedleCap");
        shaftSprite.anchor.set(0.5, 0.5);
        shaftSprite.position.set(300, 300);
        speedMeterContainer.addChild(shaftSprite);

        return { container: speedMeterContainer, speedNeedleGauge: speedNeedleGauge, speedLabel: speedLabel, waterTempProgressBar: waterTempProgressBar };
    }

    private createBoostMeter(): { container: PIXI.Container, boostNeedleGauge: RotationNeedleGauge } {
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
        const boostNeedleGauge = new RotationNeedleGauge(boostNeedleGaugeOptions);
        boostNeedleGauge.pivot.set(90, 15);
        boostNeedleGauge.position.set(220, 220);
        boostNeedleGauge.Value = boostValDefault;
        boostNeedleGauge.updateForce();

        const trailLayer = new TrailLayer({height : backSprite.height, width :backSprite.width});
        trailLayer.addChild(boostNeedleGauge);
        trailLayer.trailAlpha = TRAIL_ALPHA;
        boostMeterContainer.addChild(trailLayer);

        return { container: boostMeterContainer, boostNeedleGauge: boostNeedleGauge };
    }
}