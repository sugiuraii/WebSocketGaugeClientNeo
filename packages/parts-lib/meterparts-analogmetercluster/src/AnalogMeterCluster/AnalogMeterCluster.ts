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
import { TrailLayer } from 'pixi-traillayer';

require("./AnalogMeterClusterTexture.json");
require("./AnalogMeterClusterTexture.png");
require("./AnalogMeterFont_115px.fnt");
require("./AnalogMeterFont_40px.fnt");
require("./AnalogMeterFont_35px.fnt");
require("./AnalogMeterFont_60px.fnt");

require("./AnalogMeterFont_115px_0.png");
require("./AnalogMeterFont_40px_0.png");
require("./AnalogMeterFont_35px_0.png");
require("./AnalogMeterFont_60px_0.png");

export type TachoMeterObjectName = "Needle" | "NeedleCap" | "LCDValueLabel" | "LCDBackLabel" | "LCDBase" | "BackLabel" | "ZoneBar" | "Background";
export type SpeedMeterObjectName = "Needle" | "NeedleCap" | "LCDValueLabel" | "LCDBackLabel" | "LCDBase" | "BackLabel" | "ZoneBar" | "Background";
export type BoostMeterObjectName = "Needle" | "BackLabel" |  "Background";

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

    private readonly tachoBackContainer = new PIXI.Container();
    private readonly speedBackContainer = new PIXI.Container();
    private readonly boostBackContainer = new PIXI.Container();
    private readonly tachoDisplayObjects: Map<TachoMeterObjectName, PIXI.DisplayObject> = new Map();
    private readonly speedDisplayObjects: Map<SpeedMeterObjectName, PIXI.DisplayObject> = new Map();
    private readonly boostDisplayObjects: Map<BoostMeterObjectName, PIXI.DisplayObject> = new Map();

    private tacho = 0;
    private speed = 0;
    private boost = 0;
    private waterTemp = 0;
    private gasMilage = 0;
    private trip = 0;
    private fuel = 0;
    private gearPos = "";

    private readonly trailAlpha : number;
    private readonly applyTrail : boolean;

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
    
    public set CacheBackContainerAsBitMap(value : boolean) { 
        this.tachoBackContainer.cacheAsBitmap = value;
        this.speedBackContainer.cacheAsBitmap = value;
        this.boostBackContainer.cacheAsBitmap = value;
    }
    public getTachoDisplayObjects(value : TachoMeterObjectName) : PIXI.DisplayObject { 
        if(this.tachoDisplayObjects.get(value) === undefined)
            throw new Error(value + "is not exists");
        else
            return this.tachoDisplayObjects.get(value)!;
    };
    public getSpeedDisplayObjects(value : SpeedMeterObjectName) : PIXI.DisplayObject { 
        if(this.speedDisplayObjects.get(value) === undefined)
            throw new Error(value + "is not exists");
        else
            return this.speedDisplayObjects.get(value)!;
    };
    public getBoostDisplayObjects(value : BoostMeterObjectName) : PIXI.DisplayObject { 
        if(this.boostDisplayObjects.get(value) === undefined)
            throw new Error(value + "is not exists");
        else
            return this.boostDisplayObjects.get(value)!;
    };

    private constructor(applyTrail : boolean, trailAlpha : number) {
        super();
        this.applyTrail = applyTrail;
        this.trailAlpha = trailAlpha;
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

        this.CacheBackContainerAsBitMap = true;
    }

    public static async create(applyTrail = true, trailAlpha = 0.95) {
        await Assets.load(["img/AnalogMeterClusterTexture.json", "img/AnalogMeterFont_115px.fnt", "img/AnalogMeterFont_40px.fnt", "img/AnalogMeterFont_35px.fnt", "img/AnalogMeterFont_60px.fnt"]);
        //await Assets.load('./fonts/DSEG14Classic-BoldItalic.ttf');
        const instance = new AnalogMeterCluster(applyTrail, trailAlpha);
        return instance;
    }

    private createTachoMeter(): { container: PIXI.Container, progressBar: CircularProgressBar, needleGauge: RotationNeedleGauge, gasmilageLabel: NumericIndicator, tripLabel: NumericIndicator, fuelLabel: NumericIndicator, gearPosLabel: NumericIndicator } {
        const tachoMax = 9000;
        const tachoMin = 0;
        const tachoValDefalut = 0;
        const containerCenter = new PIXI.Point(319, 319);

        const tachoContainer = new PIXI.Container();

        const backSprite = PIXI.Sprite.from("AnalogMeterCluster_layer_tacho_base.png");
        backSprite.anchor.set(0.5, 0.5);
        backSprite.position = containerCenter;
        this.tachoBackContainer.addChild(backSprite);

        const lcdBaseSprite = PIXI.Sprite.from("AnalogMeterCluster_layer_tacho_lcd_base.png");
        lcdBaseSprite.pivot.set(220, 220);
        lcdBaseSprite.position = containerCenter;        
        this.tachoBackContainer.addChild(lcdBaseSprite);

        const tachoTextSprite = PIXI.Sprite.from("AnalogMeterCluster_layer_tacho_tachotext.png");
        tachoTextSprite.anchor.set(0.5, 0.5);
        tachoTextSprite.position = containerCenter;        
        this.tachoBackContainer.addChild(tachoTextSprite);

        const lcdTextSprite = PIXI.Sprite.from("AnalogMeterCluster_layer_tacho_text_lcd_fixed.png");
        lcdTextSprite.position.set(335, 352);        
        this.tachoBackContainer.addChild(lcdTextSprite);

        tachoContainer.addChild(this.tachoBackContainer);

        // LCD value label and progressbar
        const lcdValueLabelContainer = new PIXI.Container();
        const gasMilageLabel = new BitmapTextNumericIndicator({ text: "0.00",  style: { fontFamily: "AnalogMeterFont_40px", fontSize: -40, align: "right"}});
        gasMilageLabel.NumberOfDecimalPlace = 2;
        gasMilageLabel.anchor.set(1, 0.5);
        gasMilageLabel.position.set(505, 353);
        gasMilageLabel.scale.set(0.9);
        lcdValueLabelContainer.addChild(gasMilageLabel);

        const tripLabel = new BitmapTextNumericIndicator({ text: "0.0",  style: { fontFamily: "AnalogMeterFont_35px", fontSize: -35, align: "right"}});
        tripLabel.NumberOfDecimalPlace = 1;
        tripLabel.anchor.set(1, 0.5);
        tripLabel.position.set(520, 395);
        tripLabel.text = "0.0";
        tripLabel.scale.set(0.9);
        lcdValueLabelContainer.addChild(tripLabel);

        const fuelLabel = new BitmapTextNumericIndicator({ text: "0.00",  style: { fontFamily: "AnalogMeterFont_35px", fontSize: -35, align: "right"}});
        fuelLabel.NumberOfDecimalPlace = 2;
        fuelLabel.anchor.set(1, 0.5);
        fuelLabel.position.set(520, 435);
        fuelLabel.text = "0.00";
        fuelLabel.scale.set(0.9);
        lcdValueLabelContainer.addChild(fuelLabel);

        const gearPosLabel = new BitmapTextNumericIndicator({ text: "N",  style: { fontFamily: "AnalogMeterFont_115px", fontSize: -115, align: "center"}});
        gearPosLabel.anchor.set(0.5, 0.5);
        gearPosLabel.position.set(377, 515);
        gearPosLabel.text = "N";
        gearPosLabel.scale.set(0.9);
        lcdValueLabelContainer.addChild(gearPosLabel);

        const tachoProgressBarOptions = new CircularProgressBarOptions();
        tachoProgressBarOptions.Texture = PIXI.Texture.from("AnalogMeterCluster_layer_tacho_lcd_bar.png");
        tachoProgressBarOptions.OffsetAngle = 90;
        tachoProgressBarOptions.FullAngle = 270;
        tachoProgressBarOptions.Max = tachoMax;
        tachoProgressBarOptions.Min = tachoMin;
        tachoProgressBarOptions.Radius = 192;
        tachoProgressBarOptions.InnerRadius = 160;
        tachoProgressBarOptions.Center.set(192, 192);
        const tachoProgressBar = new CircularProgressBar(tachoProgressBarOptions);
        tachoProgressBar.pivot.set(192, 192);
        tachoProgressBar.position.set(319, 319);
        lcdValueLabelContainer.addChild(tachoProgressBar);
        tachoProgressBar.Value = tachoValDefalut;
        tachoProgressBar.updateForce();

        tachoContainer.addChild(lcdValueLabelContainer);

        const tachoNeedleGaugeOptions = new RotationNeedleGaugeOptions();
        tachoNeedleGaugeOptions.Texture = PIXI.Texture.from("AnalogMeterCluster_layer_tacho_needle.png");
        tachoNeedleGaugeOptions.Max = tachoMax;
        tachoNeedleGaugeOptions.Min = tachoMin;
        tachoNeedleGaugeOptions.OffsetAngle = 90;
        tachoNeedleGaugeOptions.FullAngle = 270;
        const tachoNeedleGauge = new RotationNeedleGauge(tachoNeedleGaugeOptions);
        tachoNeedleGauge.pivot.set(33, 23);
        tachoNeedleGauge.position.set(319, 319);
        tachoNeedleGauge.Value = tachoValDefalut;
        tachoNeedleGauge.updateForce();
        if(this.applyTrail) {
            const trailLayer = new TrailLayer({height : 600, width : 600});
            trailLayer.addChild(tachoNeedleGauge);
            trailLayer.trailAlpha = this.trailAlpha;
            tachoContainer.addChild(trailLayer);
            this.tachoDisplayObjects.set("Needle", trailLayer);
            tachoNeedleGauge.SubFrameRenderCallback.push(() => trailLayer.updateTexture());
        } else {
            this.tachoDisplayObjects.set("Needle", tachoNeedleGauge);
            tachoContainer.addChild(tachoNeedleGauge);
        }

        const shaftSprite = PIXI.Sprite.from("AnalogMeterCluster_layer_tacho_needlecap.png");
        shaftSprite.anchor.set(0.5, 0.5);
        shaftSprite.position.set(319, 319);
        tachoContainer.addChild(shaftSprite);

        // Map object to display object map
        this.tachoDisplayObjects.set("NeedleCap", shaftSprite);
        this.tachoDisplayObjects.set("LCDValueLabel", lcdValueLabelContainer);
        this.tachoDisplayObjects.set("LCDBackLabel", lcdTextSprite);
        this.tachoDisplayObjects.set("BackLabel", tachoTextSprite);
        this.tachoDisplayObjects.set("LCDBase", lcdBaseSprite);
        this.tachoDisplayObjects.set("Background", backSprite);

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

        const backSprite = PIXI.Sprite.from("AnalogMeterCluster_layer_speed_base.png");
        backSprite.anchor.set(0.5, 0.5);
        backSprite.position.set(319,319);
        this.speedBackContainer.addChild(backSprite);

        const speedTextSprite = PIXI.Sprite.from("AnalogMeterCluster_layer_speed_text.png");
        speedTextSprite.anchor.set(1, 0.5);
        speedTextSprite.position.set(440,320);
        this.speedBackContainer.addChild(speedTextSprite);

        const lcdBaseSprite = PIXI.Sprite.from("AnalogMeterCluster_layer_speed_lcdbase.png");
        lcdBaseSprite.anchor.set(0.5, 0.5);
        lcdBaseSprite.position.set(319,319);
        this.speedBackContainer.addChild(lcdBaseSprite);

        const lcdTextSprite = PIXI.Sprite.from("AnalogMeterCluster_layer_speed_lcdtext_fixed.png");
        lcdTextSprite.anchor.set(1, 0.5);
        lcdTextSprite.position.set(365,345);
        this.speedBackContainer.addChild(lcdTextSprite);

        speedMeterContainer.addChild(this.speedBackContainer);

        const lcdValueLabelContainer = new PIXI.Container();
        const speedLabel = this.speedLabel = new BitmapTextNumericIndicator({ text: speedValDefault.toFixed(0),  style: { fontFamily: "AnalogMeterFont_60px", fontSize: -60, align: "center"}});
        speedLabel.NumberOfDecimalPlace = 0;
        speedLabel.anchor.set(1, 0.5);
        speedLabel.position.set(365, 432);
        speedLabel.scale.set(0.9);
        lcdValueLabelContainer.addChild(speedLabel);

        const waterTempProgressBarOptions = new CircularProgressBarOptions();
        waterTempProgressBarOptions.Texture = PIXI.Texture.from("AnalogMeterCluster_layer_speed_lcdbar.png");
        waterTempProgressBarOptions.Max = waterTempMax;
        waterTempProgressBarOptions.Min = waterTempMin;
        waterTempProgressBarOptions.Radius = 160;
        waterTempProgressBarOptions.InnerRadius = 120;
        waterTempProgressBarOptions.OffsetAngle = 165;
        waterTempProgressBarOptions.FullAngle = 120;
        waterTempProgressBarOptions.Center.set(160, 160);
        const waterTempProgressBar = new CircularProgressBar(waterTempProgressBarOptions);
        waterTempProgressBar.pivot.set(160, 160);
        waterTempProgressBar.position.set(319, 319);
        lcdValueLabelContainer.addChild(waterTempProgressBar);
        waterTempProgressBar.Value = waterTempValDefault;
        waterTempProgressBar.updateForce();

        speedMeterContainer.addChild(lcdValueLabelContainer);

        const speedNeedleGaugeOptions = new RotationNeedleGaugeOptions();
        speedNeedleGaugeOptions.Texture = PIXI.Texture.from("AnalogMeterCluster_layer_speed_needle.png");
        speedNeedleGaugeOptions.Max = speedMax;
        speedNeedleGaugeOptions.Min = speedMin;
        speedNeedleGaugeOptions.OffsetAngle = 75;
        speedNeedleGaugeOptions.FullAngle = 210;
        const speedNeedleGauge = new RotationNeedleGauge(speedNeedleGaugeOptions);
        speedNeedleGauge.pivot.set(35, 23);
        speedNeedleGauge.position.set(319, 319);
        speedNeedleGauge.Value = speedValDefault;
        speedNeedleGauge.updateForce();
        if(this.applyTrail) {
            const trailLayer = new TrailLayer({height : backSprite.height, width : backSprite.width});
            trailLayer.addChild(speedNeedleGauge);
            trailLayer.trailAlpha = this.trailAlpha;
            this.speedDisplayObjects.set("Needle", trailLayer);
            speedMeterContainer.addChild(trailLayer);
        } else {
            this.speedDisplayObjects.set("Needle", speedNeedleGauge);
            speedMeterContainer.addChild(speedNeedleGauge);
        }

        const shaftSprite = PIXI.Sprite.from("AnalogMeterCluster_layer_speed_needlecap.png");
        shaftSprite.anchor.set(0.5, 0.5);
        shaftSprite.position.set(319, 319);
        speedMeterContainer.addChild(shaftSprite);

        // Map object to display object map
        this.speedDisplayObjects.set("NeedleCap", shaftSprite);
        this.speedDisplayObjects.set("LCDValueLabel", lcdValueLabelContainer);
        this.speedDisplayObjects.set("LCDBackLabel", lcdTextSprite);
        this.speedDisplayObjects.set("BackLabel", speedTextSprite);
        this.speedDisplayObjects.set("LCDBase", lcdBaseSprite);
        this.speedDisplayObjects.set("Background", backSprite);

        return { container: speedMeterContainer, speedNeedleGauge: speedNeedleGauge, speedLabel: speedLabel, waterTempProgressBar: waterTempProgressBar };
    }

    private createBoostMeter(): { container: PIXI.Container, boostNeedleGauge: RotationNeedleGauge } {
        const boostMax = 2.0;
        const boostMin = -1.0;
        const boostValDefault = 0.0;

        const boostMeterContainer = new PIXI.Container();

        const backSprite = PIXI.Sprite.from("AnalogMeterCluster_layer_boost_base.png");
        this.boostBackContainer.addChild(backSprite);

        const textSprite = PIXI.Sprite.from("AnalogMeterCluster_layer_boost_text.png");
        textSprite.anchor.set(0, 0.5);
        textSprite.position.set(290,235);
        this.boostBackContainer.addChild(textSprite);

        boostMeterContainer.addChild(this.boostBackContainer);

        const boostNeedleGaugeOptions = new RotationNeedleGaugeOptions();
        boostNeedleGaugeOptions.Texture = PIXI.Texture.from("AnalogMeterCluster_layer_boost_needle.png");
        boostNeedleGaugeOptions.OffsetAngle = 30;
        boostNeedleGaugeOptions.FullAngle = 90;
        boostNeedleGaugeOptions.AntiClockwise = true;
        boostNeedleGaugeOptions.Max = boostMax;
        boostNeedleGaugeOptions.Min = boostMin;
        const boostNeedleGauge = new RotationNeedleGauge(boostNeedleGaugeOptions);
        boostNeedleGauge.pivot.set(105, 23);
        boostNeedleGauge.position.set(235, 235);
        boostNeedleGauge.Value = boostValDefault;
        boostNeedleGauge.updateForce();
        if(this.applyTrail) {
            const trailLayer = new TrailLayer({height : backSprite.height, width :backSprite.width});
            trailLayer.addChild(boostNeedleGauge);
            trailLayer.trailAlpha = this.trailAlpha;
            this.boostDisplayObjects.set("Needle", trailLayer);
            boostMeterContainer.addChild(trailLayer);
        } else {
            this.boostDisplayObjects.set("Needle", boostNeedleGauge);
            boostMeterContainer.addChild(boostNeedleGauge);
        }

        this.boostDisplayObjects.set("BackLabel", textSprite);
        this.boostDisplayObjects.set("Background", backSprite);

        return { container: boostMeterContainer, boostNeedleGauge: boostNeedleGauge };
    }
}