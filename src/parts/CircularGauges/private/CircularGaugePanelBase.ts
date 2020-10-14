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

import { CircularProgressBar, CircularProgressBarOptions } from '../../../lib/Graphics/PIXIGauge';
import * as PIXI from 'pixi.js';

export class BitmapTextOption {
    public position = new PIXI.Point(0, 0);
    public anchor = new PIXI.Point(0, 0);
    public align = "left";
    public fontName = "FreeSans_90px";
    public fontSize = 90;

    constructor(position?: PIXI.Point, anchor?: PIXI.Point, align?: string) {
        if (typeof (align) !== "undefined")
            this.align = align;
        if (position instanceof PIXI.Point)
            this.position = position;
        if (anchor instanceof PIXI.Point)
            this.anchor = anchor;
    }

    clone(): TextOption {
        const returnObj = new TextOption();
        returnObj.position = this.position.clone();
        returnObj.anchor = this.anchor.clone();
        returnObj.align = this.align;

        return returnObj;
    }
}

export class TextOption {
    public position = new PIXI.Point(0, 0);
    public anchor = new PIXI.Point(0, 0);
    public align = "left";
    public fontSize = 12;
    public letterSpacing = 0;
    constructor(position?: PIXI.Point, anchor?: PIXI.Point, align?: string, fontsize?: number, letterSpacing?: number) {
        if (typeof (align) !== "undefined")
            this.align = align;
        if (typeof (fontsize) !== "undefined")
            this.fontSize = fontsize;
        if (typeof (letterSpacing) !== "undefined")
            this.letterSpacing = letterSpacing;
        if (position instanceof PIXI.Point)
            this.position = position;
        if (anchor instanceof PIXI.Point)
            this.anchor = anchor;
    }

    clone(): TextOption {
        const returnObj = new TextOption();
        returnObj.position = this.position.clone();
        returnObj.anchor = this.anchor.clone();
        returnObj.align = this.align;
        returnObj.fontSize = this.fontSize;
        returnObj.letterSpacing = this.letterSpacing;

        return returnObj;
    }
}

export abstract class CircularGaugePanelOptionBase {
    public ValueTextLabel: PIXI.BitmapText;
    public ValueTextLabelOption: BitmapTextOption = new BitmapTextOption();
    public ValueNumberRoundDigit = 1;

    public MasterTextStyle: PIXI.TextStyle;

    public OffsetAngle: number;
    public FullAngle: number;
    public Min: number;
    public Max: number;
    public GaugeFullOnValueMin: boolean;
    public AntiClockWise: boolean;
    public AngleStep: number;
    public ValueBarRadius: number;
    public ValueBarInnerRadius: number;

    public TitleLabel: string;
    public TitleLabelOption: TextOption;
    public UnitLabel: string;
    public UnitLabelOption: TextOption;

    public AxisLabel: string[] = [];
    public AxisLabelOption: TextOption[] = [];

    public RedZoneBarEnable: boolean;
    public YellowZoneBarEnable: boolean;
    public GreenZoneBarEnable: boolean;
    public RedZoneBarOffsetAngle: number;
    public YellowZoneBarOffsetAngle: number;
    public GreenZoneBarOffsetAngle: number;
    public RedZoneBarFullAngle: number;
    public YellowZoneBarFullAngle: number;
    public GreenZoneBarFullAngle: number;
    public ZoneBarRadius: number;

    public CenterPosition = new PIXI.Point();

    public RedZoneBarTexture: PIXI.Texture;
    public YellowZoneBarTexture: PIXI.Texture;
    public GreenZoneBarTexture: PIXI.Texture;
    public ValueBarTexture: PIXI.Texture;
    public BackTexture: PIXI.Texture;
    public GridTexture: PIXI.Texture;
}

export abstract class CircularGaugePanelBase extends PIXI.Container {
    private valueProgressBar: CircularProgressBar;
    private Options: CircularGaugePanelOptionBase;

    public get Value(): number { return this.valueProgressBar.Value }
    public set Value(value: number) {
        this.valueProgressBar.Value = value;
        this.valueProgressBar.update();

        if (value.toFixed(this.Options.ValueNumberRoundDigit).toString() !== this.Options.ValueTextLabel.text)
            this.Options.ValueTextLabel.text = value.toFixed(this.Options.ValueNumberRoundDigit).toString();
    }

    constructor(options: CircularGaugePanelOptionBase) {
        super();
        this.Options = options;
        this.createBackContainer();
        this.createValueProgressBar();
    }

    private createValueProgressBar(): void {
        const valueProgressBarOption = new CircularProgressBarOptions();
        valueProgressBarOption.OffsetAngle = this.Options.OffsetAngle;
        valueProgressBarOption.FullAngle = this.Options.FullAngle;
        valueProgressBarOption.Min = this.Options.Min;
        valueProgressBarOption.Max = this.Options.Max;
        valueProgressBarOption.AngleStep = this.Options.AngleStep;
        valueProgressBarOption.GagueFullOnValueMin = this.Options.GaugeFullOnValueMin;
        valueProgressBarOption.AntiClockwise = this.Options.AntiClockWise;

        valueProgressBarOption.Center = this.Options.CenterPosition;
        valueProgressBarOption.Radius = this.Options.ValueBarRadius;
        valueProgressBarOption.InnerRadius = this.Options.ValueBarInnerRadius;

        valueProgressBarOption.Texture = this.Options.ValueBarTexture;
        this.valueProgressBar = new CircularProgressBar(valueProgressBarOption);
        super.addChild(this.valueProgressBar);

        const valueTextLabelOption = this.Options.ValueTextLabelOption;
        const valueTextLabelStyle = {
            fontName: valueTextLabelOption.fontName, fontSize: valueTextLabelOption.fontSize, align: valueTextLabelOption.align
        };
        this.Options.ValueTextLabel = new PIXI.BitmapText(this.Options.Min.toFixed(this.Options.ValueNumberRoundDigit).toString(), valueTextLabelStyle);
        this.Options.ValueTextLabel.position = valueTextLabelOption.position;
        this.Options.ValueTextLabel.anchor = new PIXI.Point(valueTextLabelOption.anchor.x, valueTextLabelOption.anchor.y);
        super.addChild(this.Options.ValueTextLabel);
    }

    protected setAxisLabel(axisLabel: string[]): void {
        this.Options.AxisLabel = [];
        for (let i = 0; i < axisLabel.length; i++)
            this.Options.AxisLabel.push(axisLabel[i]);
    }
    protected setAxisLabelOption(axisLabelOption: TextOption[]): void {
        this.Options.AxisLabelOption = [];
        for (let i = 0; i < axisLabelOption.length; i++)
            this.Options.AxisLabelOption.push(axisLabelOption[i]);
    }

    private createBackContainer(): void {
        const backContainer = new PIXI.Container();
        //Unlock baked texture
        backContainer.cacheAsBitmap = false;

        const centerPosition = this.Options.CenterPosition;
        const zoneBarRadius = this.Options.ZoneBarRadius;

        //Add backSprite
        const backTexture = this.Options.BackTexture;
        const backSprite = new PIXI.Sprite();
        backSprite.texture = backTexture;
        backContainer.addChild(backSprite);

        //Add redzoneBar
        if (this.Options.RedZoneBarEnable) {
            const redZoneBarTexture = this.Options.RedZoneBarTexture;
            const redzoneBarOption = new CircularProgressBarOptions();
            redzoneBarOption.OffsetAngle = this.Options.RedZoneBarOffsetAngle;
            redzoneBarOption.FullAngle = this.Options.RedZoneBarFullAngle;
            redzoneBarOption.Texture = redZoneBarTexture;
            redzoneBarOption.Center = centerPosition;
            redzoneBarOption.Radius = zoneBarRadius;
            redzoneBarOption.InnerRadius = 0;
            const redzoneBar = new CircularProgressBar(redzoneBarOption);
            redzoneBar.Value = redzoneBarOption.Max;
            redzoneBar.updateForce();
            backContainer.addChild(redzoneBar);
        }

        //Add yellowzoneBar
        if (this.Options.YellowZoneBarEnable) {
            const yellowZoneBarTexture = this.Options.YellowZoneBarTexture;
            const yellowzoneBarOption = new CircularProgressBarOptions();
            yellowzoneBarOption.OffsetAngle = this.Options.YellowZoneBarOffsetAngle;
            yellowzoneBarOption.FullAngle = this.Options.YellowZoneBarFullAngle;
            yellowzoneBarOption.Texture = yellowZoneBarTexture;
            yellowzoneBarOption.Center = centerPosition;
            yellowzoneBarOption.Radius = zoneBarRadius;
            yellowzoneBarOption.InnerRadius = 0;
            const yellowzoneBar = new CircularProgressBar(yellowzoneBarOption);
            yellowzoneBar.Value = yellowzoneBarOption.Max;
            yellowzoneBar.updateForce();
            backContainer.addChild(yellowzoneBar);
        }

        //Add greenZoneBar
        if (this.Options.GreenZoneBarEnable) {
            const greenZoneBarTexture = this.Options.GreenZoneBarTexture;
            const greenzoneBarOption = new CircularProgressBarOptions();
            greenzoneBarOption.OffsetAngle = this.Options.GreenZoneBarOffsetAngle;
            greenzoneBarOption.FullAngle = this.Options.GreenZoneBarFullAngle;
            greenzoneBarOption.Texture = greenZoneBarTexture;
            greenzoneBarOption.Center = centerPosition;
            greenzoneBarOption.Radius = zoneBarRadius;
            greenzoneBarOption.InnerRadius = 0;
            const greenzoneBar = new CircularProgressBar(greenzoneBarOption);
            greenzoneBar.Value = greenzoneBarOption.Max;
            greenzoneBar.updateForce();
            backContainer.addChild(greenzoneBar);
        }

        //Add gridSprite
        const gridTexture = this.Options.GridTexture;
        const gridSprite = new PIXI.Sprite();
        gridSprite.texture = gridTexture;
        backContainer.addChild(gridSprite);

        //Set Title and unit text
        const titleTextElem = new PIXI.Text(this.Options.TitleLabel);
        const titleTextOption = this.Options.TitleLabelOption;
        titleTextElem.style = this.Options.MasterTextStyle.clone();
        titleTextElem.style.fontSize = titleTextOption.fontSize;
        titleTextElem.style.align = titleTextOption.align;
        titleTextElem.anchor.set(titleTextOption.anchor.x, titleTextOption.anchor.y)
        titleTextElem.position.set(titleTextOption.position.x, titleTextOption.position.y);

        const unitTextElem = new PIXI.Text(this.Options.UnitLabel);
        const unitTextOption = this.Options.UnitLabelOption;
        unitTextElem.style = this.Options.MasterTextStyle.clone();
        unitTextElem.style.fontSize = unitTextOption.fontSize;
        unitTextElem.style.align = unitTextOption.align;
        unitTextElem.anchor.set(unitTextOption.anchor.x, unitTextOption.anchor.y);
        unitTextElem.position.set(unitTextOption.position.x, unitTextOption.position.y);

        backContainer.addChild(titleTextElem);
        backContainer.addChild(unitTextElem);

        //Set axis label
        for (let i = 0; i < this.Options.AxisLabelOption.length; i++) {
            const axisLabelOption = this.Options.AxisLabelOption[i];
            const axisLabelElem = new PIXI.Text(this.Options.AxisLabel[i]);
            axisLabelElem.style = this.Options.MasterTextStyle.clone();
            axisLabelElem.style.fontSize = axisLabelOption.fontSize;
            axisLabelElem.style.align = axisLabelOption.align;
            axisLabelElem.anchor.set(axisLabelOption.anchor.x, axisLabelOption.anchor.y);
            axisLabelElem.position.set(axisLabelOption.position.x, axisLabelOption.position.y);
            backContainer.addChild(axisLabelElem);
        }
        this.addChild(backContainer);

        //Bake into texture
        backContainer.cacheAsBitmap = true;
    }
}