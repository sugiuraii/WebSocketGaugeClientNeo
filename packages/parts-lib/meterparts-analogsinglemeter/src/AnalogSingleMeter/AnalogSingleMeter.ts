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

import { RotationNeedleGauge } from 'pixi-gauge';
import { RotationNeedleGaugeOptions } from 'pixi-gauge';

import * as PIXI from 'pixi.js';
import { Assets } from '@pixi/assets';
import { AnalogSingleMeterOption } from './AnalogSingleMeterOption';

// Define texture and bitmap font files to bundle by webpack file loader
require("./AnalogSingleMeter.json");
require("./AnalogSingleMeter_0.png");
require("./Michroma_24px_Glow.fnt");
require("./Michroma_24px_Glow_0.png");
require("./Michroma_48px_Glow.fnt");
require("./Michroma_48px_Glow_0.png");

/**
 * Analog single meter gauge example class
 */
export class AnalogSingleMeter extends PIXI.Container {
    /**
     * The variable option class to define the design (max, min, title and scale labels).
     * @see AnalogSingleMeterOption
     */
    private Option: AnalogSingleMeterOption;

    /**
     * Needle gauge object.
     */
    private NeedleGauge: RotationNeedleGauge;

    /**
     * Get gauge value.
     * @return Gauge value.
     */
    public get Value(): number { return this.NeedleGauge.Value }

    /**
     * Set gauge value (and update needle gauge).
     * @param val The value to set.
     */
    public set Value(val: number) {
        this.NeedleGauge.Value = val;
        this.NeedleGauge.update();
    }
    /**
     * Crate gauge.
     * @param option Option settings, 
     * @returns 
     */
    public static async create(option: AnalogSingleMeterOption) {
        await Assets.load(["img/AnalogSingleMeter.json", "img/Michroma_24px_Glow.fnt", "img/Michroma_48px_Glow.fnt"]);
        const instance = new AnalogSingleMeter(option);
        return instance;
    }

    /**
     * Construct AnalogSingleMeter class (called from create()).
     * @param option Meter setting option.
     */
    private constructor(option: AnalogSingleMeterOption) {
        // Call the constructor of PIXI.Container.
        super();

        // Set option
        this.Option = option;

        //Create meter backplate.
        const meterBackPlate = this.createMeterBackPlate(option.Title, option.ScaleLabel, option.Unit)

        //Create needle gauge.
        const needleGaugeOptions = new RotationNeedleGaugeOptions();
        needleGaugeOptions.Max = option.Max;
        needleGaugeOptions.Min = option.Min;
        needleGaugeOptions.OffsetAngle = 270;
        needleGaugeOptions.FullAngle = 270;
        needleGaugeOptions.Texture = PIXI.Texture.from("AnalogSingleMeter_Needle");

        needleGaugeOptions.GaugeDrawConversionFucntion = option.GaugeDrawValConversionFunc;
        
        const needleGauge = new RotationNeedleGauge(needleGaugeOptions);
        needleGauge.pivot.set(220, 15);
        needleGauge.position.set(210, 210);
        needleGauge.Value = option.Min;

        //Create needleCap
        const needleCap = PIXI.Sprite.from("AnalogSingleMeter_NeedleCap");
        needleCap.pivot.set(47, 47);
        needleCap.position.set(210, 210);

        //Add each sub container to master container.
        this.addChild(meterBackPlate);
        this.addChild(needleGauge);
        this.addChild(needleCap);

        //Set reference of needleGauge to this.NeedleGauge.
        this.NeedleGauge = needleGauge;
    }

    /**
     * Create meter backplate (contains meter base, grid and text labels).
     * @return Container of meter backplate.
     */
    private createMeterBackPlate(gaugeTitle: string, numberLabels: string[], unit: string): PIXI.Container {
        //Create MeterBase sprite
        const backSprite = PIXI.Sprite.from("AnalogSingleMeter_Base");

        //Create MeterGrid sprite
        const gridSprite = PIXI.Sprite.from("AnalogSingleMeter_Grid");

        //Create gauge title label
        const titleElem = new PIXI.BitmapText(gaugeTitle, { fontName: "Michroma", fontSize: 48, align: "right" });
        titleElem.anchor.set(1, 0.5);
        titleElem.position.set(370, 260);

        //Create gauge unit label
        const unitElem = new PIXI.BitmapText(unit, { fontName: "Michroma", fontSize: 24, align: "center" });
        unitElem.anchor.set(0.5, 0.5);
        unitElem.position.set(210, 150);

        //Create meter number label
        const numberElements: PIXI.BitmapText[] = [];
        numberElements[0] = new PIXI.BitmapText(numberLabels[0], { fontName: "Michroma", fontSize: 48, align: "center" });
        numberElements[0].anchor.set(0.5, 1);
        numberElements[0].position.set(210, 372);
        numberElements[1] = new PIXI.BitmapText(numberLabels[1], { fontName: "Michroma", fontSize: 48, align: "left" });
        numberElements[1].anchor.set(0, 1);
        numberElements[1].position.set(85, 330);
        numberElements[2] = new PIXI.BitmapText(numberLabels[2], { fontName: "Michroma", fontSize: 48, align: "left" });
        numberElements[2].anchor.set(0, 0.5);
        numberElements[2].position.set(52, 210);
        numberElements[3] = new PIXI.BitmapText(numberLabels[3], { fontName: "Michroma", fontSize: 48, align: "left" });
        numberElements[3].anchor.set(0, 0);
        numberElements[3].position.set(85, 90);
        numberElements[4] = new PIXI.BitmapText(numberLabels[4], { fontName: "Michroma", fontSize: 48, align: "center" });
        numberElements[4].anchor.set(0.5, 0);
        numberElements[4].position.set(210, 40);
        numberElements[5] = new PIXI.BitmapText(numberLabels[5], { fontName: "Michroma", fontSize: 48, align: "right" });
        numberElements[5].anchor.set(1, 0);
        numberElements[5].position.set(335, 90);
        numberElements[6] = new PIXI.BitmapText(numberLabels[6], { fontName: "Michroma", fontSize: 48, align: "right" });
        numberElements[6].anchor.set(1, 0.5);
        numberElements[6].position.set(375, 210);

        // Add all of elements to baseContainer.
        const baseContainer = new PIXI.Container();
        baseContainer.addChild(backSprite);
        baseContainer.addChild(gridSprite);
        baseContainer.addChild(titleElem);
        baseContainer.addChild(unitElem);
        for (let i = 0; i < numberLabels.length; i++)
            baseContainer.addChild(numberElements[i]);

        // "Baking" this container to single texture
        // This can speed up the rendering (since gpu dose not need to construct this constructor on every frame)
        baseContainer.cacheAsBitmap = true;
        return baseContainer;
    }
}