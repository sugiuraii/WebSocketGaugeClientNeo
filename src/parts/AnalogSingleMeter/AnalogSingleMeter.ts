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
 
import {RotationNeedleGauge} from '../../lib/Graphics/PIXIGauge';
import {RotationNeedleGaugeOptions} from '../../lib/Graphics/PIXIGauge';
import {NumericIndicator} from '../../lib/Graphics/PIXIGauge';

import * as PIXI from 'pixi.js';

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
export class AnalogSingleMeter extends PIXI.Container
{
    /**
     * Texture path required by this parts. (This static property will be refered to pre-load texture).
     */
    static get RequestedTexturePath() : string[]
    {
        // Note : Bitmap font(*.fnt file) sholud be treated as "Texture" (not Webfont).
        return ["img/AnalogSingleMeter.json", "img/Michroma_24px_Glow.fnt",  "img/Michroma_48px_Glow.fnt"];
    }
    
    /**
     * Font family name required by this parts. (This static property will be refered to pre-load webfont).
     */
    static get RequestedFontFamily() : string[]
    {
        // No webfont(truetype) is needed on this parts. Return null array.
        return [];
    }
    
    /**
     * CSS URL(filepath) to define webfont, required by this parts. (This static property will be refered to pre-load webfont).
     */
    static get RequestedFontCSSURL() : string[]
    {
        // No webfont(truetype) is needed on this parts. Return null array.
        return [];
    }
    
    /**
     * Needle gauge object.
     */
    private NeedleGauge: RotationNeedleGauge;
    
    /**
     * Get gauge value.
     * @return Gauge value.
     */
    public get Value() { return this.NeedleGauge.Value }
    
    /**
     * Set gauge value (and update needle gauge).
     * @param val The value to set.
     */
    public set Value(val: number) {
        this.NeedleGauge.Value = val;
        this.NeedleGauge.update();
    }  
        
    constructor()
    {
        super();
        //Create meter backplate.
        const meterBackPlate = this.createMeterBackPlate("Boost", ["-1.0","-0.5","0.0", "0.5", "1.0", "1.5", "2.0"], "x100kPa")
        
        //Create needle gauge.
        const needleGaugeOptions = new RotationNeedleGaugeOptions();
        needleGaugeOptions.Max = 2.0;
        needleGaugeOptions.Min = -1.0;
        needleGaugeOptions.OffsetAngle = 270;
        needleGaugeOptions.FullAngle = 270;
        needleGaugeOptions.Texture = PIXI.Texture.fromFrame("AnalogSingleMeter_Needle");
        const needleGauge = new RotationNeedleGauge(needleGaugeOptions);
        needleGauge.pivot.set(220, 15);
        needleGauge.position.set(210, 210);
        needleGauge.Value = 0;
        
        //Create needleCap
        const needleCap = PIXI.Sprite.fromFrame("AnalogSingleMeter_NeedleCap");
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
    private createMeterBackPlate(gaugeTitle : string, numberLabels : string[], unit : string) : PIXI.Container
    {  
        //Create MeterBase sprite
        const backSprite = PIXI.Sprite.fromFrame("AnalogSingleMeter_Base");

        //Create MeterGrid sprite
        const gridSprite = PIXI.Sprite.fromFrame("AnalogSingleMeter_Grid");
        
        //Create gauge title label
        const titleElem = new PIXI.extras.BitmapText(gaugeTitle, {font: {name : "Michroma", size : 48 }, align: "right"});
        titleElem.anchor = new PIXI.Point(1,0.5);
        titleElem.position.set(370,260);
        
        //Create gauge unit label
        const unitElem = new PIXI.extras.BitmapText(unit, {font: {name : "Michroma", size : 24 }, align: "center"});
        unitElem.anchor = new PIXI.Point(0.5,0.5);
        unitElem.position.set(210,150);

        //Create meter number label
        let numberElements: PIXI.extras.BitmapText[] = [];
        numberElements[0] = new PIXI.extras.BitmapText(numberLabels[0], {font: {name : "Michroma", size : 48 }, align: "center"});
        numberElements[0].anchor = new PIXI.Point(0.5,1);
        numberElements[0].position.set(210,372);
        numberElements[1] = new PIXI.extras.BitmapText(numberLabels[1], {font: {name : "Michroma", size : 48 }, align: "left"});
        numberElements[1].anchor = new PIXI.Point(0,1);
        numberElements[1].position.set(85,330);
        numberElements[2] = new PIXI.extras.BitmapText(numberLabels[2], {font: {name : "Michroma", size : 48 }, align: "left"});
        numberElements[2].anchor = new PIXI.Point(0,0.5);
        numberElements[2].position.set(52,210);
        numberElements[3] = new PIXI.extras.BitmapText(numberLabels[3], {font: {name : "Michroma", size : 48 }, align: "left"});
        numberElements[3].anchor = new PIXI.Point(0,0);
        numberElements[3].position.set(85, 90);
        numberElements[4] = new PIXI.extras.BitmapText(numberLabels[4], {font: {name : "Michroma", size : 48 }, align: "center"});
        numberElements[4].anchor = new PIXI.Point(0.5,0);
        numberElements[4].position.set(210,40);
        numberElements[5] = new PIXI.extras.BitmapText(numberLabels[5], {font: {name : "Michroma", size : 48 }, align: "right"});
        numberElements[5].anchor = new PIXI.Point(1,0);
        numberElements[5].position.set(335,90);
        numberElements[6] = new PIXI.extras.BitmapText(numberLabels[6], {font: {name : "Michroma", size : 48 }, align: "right"});
        numberElements[6].anchor = new PIXI.Point(1,0.5);
        numberElements[6].position.set(375,210);

        const baseContainer = new PIXI.Container();        
        baseContainer.addChild(backSprite);
        baseContainer.addChild(gridSprite);
        baseContainer.addChild(titleElem);
        baseContainer.addChild(unitElem);
        for (let i = 0; i < numberLabels.length; i++)
            baseContainer.addChild(numberElements[i]);
        
        baseContainer.cacheAsBitmap = true;
        return baseContainer;
    }
    
}