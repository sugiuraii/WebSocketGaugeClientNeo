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
import { CircularPlacementCooridnateCalculator } from 'placement-coordinate-calc';

import * as PIXI from 'pixi.js';
import { AnalogSingleMeterOption } from './AnalogSingleMeterOption';


// Define texture and bitmap font files to bundle by webpack file loader
require("./AnalogSingleMeterTexture.json");
require("./AnalogSingleMeterTexture.png");
require("./AnalogSingleMeter_18px.fnt");
require("./AnalogSingleMeter_18px_0.png");
require("./AnalogSingleMeter_36px.fnt");
require("./AnalogSingleMeter_36px_0.png");

export type AnalogSingleMeterObjectName = "Needle" | "NeedleCap" | "BackLabel" | "Grid" | "Background";

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
     * Reference of background container
     */
    private readonly backContainer: PIXI.Container;

    /**
     * Map of object name - displayobject
     * @see getDisplayObjects
     */
    private readonly displayObjects: Map<AnalogSingleMeterObjectName, PIXI.Container> = new Map();
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
        await PIXI.Assets.load(["img/AnalogSingleMeterTexture.json", "img/AnalogSingleMeter_18px.fnt", "img/AnalogSingleMeter_36px.fnt"]);
        const instance = new AnalogSingleMeter(option);
        return instance;
    }
    
    /**
     * Get referencce of parts.
     * @param value Object name to get reference.
     * @returns The reference of object.
     */
    public getDisplayObjects(value : AnalogSingleMeterObjectName) : PIXI.Container { 
        if(this.displayObjects.get(value) === undefined)
            throw new Error(value + "is not exists");
        else
            return this.displayObjects.get(value)!;
    };

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
        this.backContainer = meterBackPlate;

        //Create needle gauge.
        const needleGaugeOptions = new RotationNeedleGaugeOptions();
        needleGaugeOptions.Max = option.Max;
        needleGaugeOptions.Min = option.Min;
        needleGaugeOptions.OffsetAngle = 270;
        needleGaugeOptions.FullAngle = 270;
        needleGaugeOptions.Texture = PIXI.Texture.from("AnalogSingleMeter_layer_analogsinglemeter_needle.png");

        needleGaugeOptions.GaugeDrawConversionFucntion = option.GaugeDrawValConversionFunc;
        
        const needleGauge = new RotationNeedleGauge(needleGaugeOptions);
        needleGauge.pivot.set(200, 15);
        needleGauge.position.set(210, 210);
        needleGauge.Value = option.Min;

        //Create needleCap
        const needleCap = PIXI.Sprite.from("AnalogSingleMeter_layer_analogsinglemeter_needlecap.png");
        needleCap.pivot.set(50, 50);
        needleCap.position.set(210, 210);

        //Add each sub container to master container.
        this.addChild(meterBackPlate);
        this.addChild(needleGauge);
        this.addChild(needleCap);

        // Register objects to displayObjects map
        this.displayObjects.set("Needle", needleGauge);
        this.displayObjects.set("NeedleCap", needleCap);

        //Set reference of needleGauge to this.NeedleGauge.
        this.NeedleGauge = needleGauge;
    }

    /**
     * Create meter backplate (contains meter base, grid and text labels).
     * @return Container of meter backplate.
     */
    private createMeterBackPlate(gaugeTitle: string, numberLabels: string[], unit: string): PIXI.Container {
        //Create MeterBase sprite
        const backSprite = PIXI.Sprite.from("AnalogSingleMeter_layer_analogsinglemeter_base.png");

        //Create MeterGrid sprite
        const gridSprite = PIXI.Sprite.from("AnalogSingleMeter_layer_analogsinglemeter_grid.png");
        
        //Create gauge title label
        const titleElem = new PIXI.BitmapText({ text: gaugeTitle,  style: { fontFamily: "AnalogSingleMeter_36px", fontSize: -36, align: "right"}});
        titleElem.anchor.set(1, 0.5);
        titleElem.position.set(370, 260);

        //Create gauge unit label
        const unitElem = new PIXI.BitmapText({ text: unit,  style: { fontFamily: "AnalogSingleMeter_18px", fontSize: -18, align: "center"}});
        unitElem.anchor.set(0.5, 0.5);
        unitElem.position.set(210, 150);

        //Create meter number label
        const numberElements: PIXI.BitmapText[] = [];
        const place = new CircularPlacementCooridnateCalculator(175, {x: 210, y: 210});
        numberElements[0] = new PIXI.BitmapText({ text: numberLabels[0],  style: { fontFamily: "AnalogSingleMeter_36px", fontSize: -36, align: "center"}});
        numberElements[0].anchor.set(0.5, 1);
        numberElements[0].position.set(place.X(270), place.Y(270));
        numberElements[1] = new PIXI.BitmapText({ text: numberLabels[1],  style: { fontFamily: "AnalogSingleMeter_36px", fontSize: -36, align: "left"}});
        numberElements[1].anchor.set(0.1, 1);
        numberElements[1].position.set(place.X(225), place.Y(225));
        numberElements[2] = new PIXI.BitmapText({ text: numberLabels[2],  style: { fontFamily: "AnalogSingleMeter_36px", fontSize: -36, align: "left"}});
        numberElements[2].anchor.set(0, 0.5);
        numberElements[2].position.set(place.X(180), place.Y(180));
        numberElements[3] = new PIXI.BitmapText({ text: numberLabels[3],  style: { fontFamily: "AnalogSingleMeter_36px", fontSize: -36, align: "left"}});
        numberElements[3].anchor.set(0.1, 0);
        numberElements[3].position.set(place.X(135), place.Y(135));
        numberElements[4] = new PIXI.BitmapText({ text: numberLabels[4],  style: { fontFamily: "AnalogSingleMeter_36px", fontSize: -36, align: "center"}});
        numberElements[4].anchor.set(0.5, 0.1);
        numberElements[4].position.set(place.X(90), place.Y(90));
        numberElements[5] = new PIXI.BitmapText({ text: numberLabels[5],  style: { fontFamily: "AnalogSingleMeter_36px", fontSize: -36, align: "right"}});
        numberElements[5].anchor.set(0.9, 0);
        numberElements[5].position.set(place.X(45), place.Y(45));
        numberElements[6] = new PIXI.BitmapText({ text: numberLabels[6],  style: { fontFamily: "AnalogSingleMeter_36px", fontSize: -36, align: "right"}});
        numberElements[6].anchor.set(1, 0.5);
        numberElements[6].position.set(place.X(0), place.Y(0));

        // Merge backtexts fixedLabelContainer
        const fixedLabelContainer = new PIXI.Container();
        fixedLabelContainer.addChild(titleElem);
        fixedLabelContainer.addChild(unitElem);
        for (let i = 0; i < numberLabels.length; i++)
            fixedLabelContainer.addChild(numberElements[i]);

        // Assign objects to displayObjetcs map.
        this.displayObjects.set("Background", backSprite);
        this.displayObjects.set("Grid", gridSprite);
        this.displayObjects.set("BackLabel", fixedLabelContainer);
        
        // Create base container.
        const baseContainer = new PIXI.Container();
        baseContainer.addChild(backSprite);
        baseContainer.addChild(gridSprite)
        baseContainer.addChild(fixedLabelContainer);
        
        return baseContainer;
    }
}
