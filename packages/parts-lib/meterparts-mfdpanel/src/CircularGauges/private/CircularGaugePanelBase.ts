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

import { CircularProgressBar, CircularProgressBarOptions } from 'pixi-gauge';
import * as PIXI from 'pixi.js';

export class BitmapTextOption {
    public position = new PIXI.Point(0, 0);
    public anchor = new PIXI.Point(0, 0);
    public align: PIXI.TextStyleAlign = "left";
    public fontName = "CircularGaugeLabel";
    public fontSize = -77;
    public letterSpacing = -5;

    constructor(position?: PIXI.Point, anchor?: PIXI.Point, align?: PIXI.TextStyleAlign) {
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
    public align: PIXI.TextStyleAlign = 'left';
    public fontSize = 12;
    public letterSpacing = 0;
    constructor(position?: PIXI.Point, anchor?: PIXI.Point, align?: PIXI.TextStyleAlign, fontsize?: number, letterSpacing?: number) {
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
    public ValueTextLabelOption: BitmapTextOption;
    public ValueNumberRoundDigit = 1;

    public MasterTextStyle: PIXI.TextStyle;

    public OffsetAngle = 0;
    public FullAngle = 180;
    public Min = 0;
    public Max = 100;
    public GaugeFullOnValueMin = false;
    public AntiClockWise = false;
    public AngleStep = 1;
    public ValueBarRadius = 100;
    public ValueBarInnerRadius = 50;
    public GaugeDrawValConversionFunc : (x: number) => number = (x) => x;

    public TitleLabel = "";
    public TitleLabelOption = new TextOption();
    public UnitLabel = "";
    public UnitLabelOption = new TextOption();

    public AxisLabel: string[] = [];
    public AxisLabelOption: TextOption[] = [];

    public RedZoneBarEnable = false;
    public YellowZoneBarEnable = false;
    public GreenZoneBarEnable = false;
    public RedZoneBarOffsetAngle = 135;
    public YellowZoneBarOffsetAngle = 90;
    public GreenZoneBarOffsetAngle = 45;
    public RedZoneBarFullAngle = 45;
    public YellowZoneBarFullAngle = 45;
    public GreenZoneBarFullAngle = 45;
    public ZoneBarRadius = 100;

    public CenterPosition = new PIXI.Point();

    public RedZoneBarTextureName = "";
    public YellowZoneBarTextureName = "";
    public GreenZoneBarTextureName = "";
    public ValueBarTextureName = "";
    public BackTextureName = "";
    public GridTextureName = "";

    constructor() {
        this.MasterTextStyle = new PIXI.TextStyle(
            {
                dropShadow: true,
                dropShadowBlur: 15,
                padding: 15,
                dropShadowColor: "#FFFFFF",
                dropShadowDistance: 0,
                fill: "white",
                fontFamily: "Freesansbold"
            });
        this.ValueTextLabelOption = new BitmapTextOption();
    }
}
export type CircularProgressBarObjectName = "ProgressBar" | "ValueLabel" | "BackLabel" | "Grid" | "ZoneBar" | "Background";

export abstract class CircularGaugePanelBase extends PIXI.Container {
    private readonly valueTextLabel: PIXI.BitmapText;
    private readonly valueProgressBar: CircularProgressBar;
    private readonly backContainer : PIXI.Container;
    private readonly displayObjects: Map<CircularProgressBarObjectName, PIXI.DisplayObject> = new Map();

    private Options: CircularGaugePanelOptionBase;

    public get Value(): number { return this.valueProgressBar.Value }
    public set Value(value: number) {
        this.valueProgressBar.Value = value;
        this.valueProgressBar.update();

        if (value.toFixed(this.Options.ValueNumberRoundDigit).toString() !== this.valueTextLabel.text)
            this.valueTextLabel.text = value.toFixed(this.Options.ValueNumberRoundDigit).toString();
    }

    public set CacheBackContainerAsBitMap(value : boolean) { this.backContainer.cacheAsBitmap = value};
    public getDisplayObjects(value : CircularProgressBarObjectName) : PIXI.DisplayObject { 
        if(this.displayObjects.get(value) === undefined)
            throw new Error(value + "is not exists");
        else
            return this.displayObjects.get(value)!;
    };
        

    constructor(options: CircularGaugePanelOptionBase) {
        super();
        this.Options = options;
        this.backContainer = this.createBackContainer();
        const ValueProgressBar = this.createValueProgressBar();
        this.valueProgressBar = ValueProgressBar.progressBar;
        this.valueTextLabel = ValueProgressBar.valueLabel;
        this.displayObjects.set("ProgressBar", ValueProgressBar.progressBar);
        this.displayObjects.set("ValueLabel",ValueProgressBar.valueLabel);
    }

    private createValueProgressBar(): { progressBar: CircularProgressBar, valueLabel: PIXI.BitmapText } {
        const valueProgressBarOption = new CircularProgressBarOptions();
        valueProgressBarOption.OffsetAngle = this.Options.OffsetAngle;
        valueProgressBarOption.FullAngle = this.Options.FullAngle;
        valueProgressBarOption.Min = this.Options.Min;
        valueProgressBarOption.Max = this.Options.Max;
        valueProgressBarOption.AngleStep = this.Options.AngleStep;
        valueProgressBarOption.GagueFullOnValueMin = this.Options.GaugeFullOnValueMin;
        valueProgressBarOption.AntiClockwise = this.Options.AntiClockWise;
        valueProgressBarOption.GaugeDrawConversionFucntion = this.Options.GaugeDrawValConversionFunc;

        valueProgressBarOption.Center = this.Options.CenterPosition;
        valueProgressBarOption.Radius = this.Options.ValueBarRadius;
        valueProgressBarOption.InnerRadius = this.Options.ValueBarInnerRadius;

        valueProgressBarOption.Texture = PIXI.Texture.from(this.Options.ValueBarTextureName);
        const valueProgressBar = new CircularProgressBar(valueProgressBarOption);
        super.addChild(valueProgressBar);

        const valueTextLabelOption = this.Options.ValueTextLabelOption;
        const valueTextLabelStyle = {
            fontName: valueTextLabelOption.fontName, fontSize: valueTextLabelOption.fontSize, align: valueTextLabelOption.align, letterSpacing: valueTextLabelOption.letterSpacing
        };
        const valueTextLabel = new PIXI.BitmapText(this.Options.Min.toFixed(this.Options.ValueNumberRoundDigit).toString(), valueTextLabelStyle);
        valueTextLabel.position.set(valueTextLabelOption.position.x, valueTextLabelOption.position.y);
        valueTextLabel.anchor.set(valueTextLabelOption.anchor.x, valueTextLabelOption.anchor.y);
        super.addChild(valueTextLabel);

        return { progressBar: valueProgressBar, valueLabel: valueTextLabel };
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

    private createBackContainer(): PIXI.Container {
        const backContainer = new PIXI.Container();
        //Unlock baked texture
        backContainer.cacheAsBitmap = false;

        const centerPosition = this.Options.CenterPosition;
        const zoneBarRadius = this.Options.ZoneBarRadius;

        //Add backSprite
        const backTexture = this.Options.BackTextureName;
        const backSprite = new PIXI.Sprite();
        backSprite.texture = PIXI.Texture.from(backTexture);
        backContainer.addChild(backSprite);
        this.displayObjects.set("Background", backSprite);

        const zonebarContainer = new PIXI.Container();
        //Add redzoneBar
        if (this.Options.RedZoneBarEnable) {
            const redZoneBarTexture = this.Options.RedZoneBarTextureName;
            const redzoneBarOption = new CircularProgressBarOptions();
            redzoneBarOption.OffsetAngle = this.Options.RedZoneBarOffsetAngle;
            redzoneBarOption.FullAngle = this.Options.RedZoneBarFullAngle;
            redzoneBarOption.Texture = PIXI.Texture.from(redZoneBarTexture);
            redzoneBarOption.Center = centerPosition;
            redzoneBarOption.Radius = zoneBarRadius;
            redzoneBarOption.InnerRadius = 0;
            const redzoneBar = new CircularProgressBar(redzoneBarOption);
            redzoneBar.Value = redzoneBarOption.Max;
            redzoneBar.updateForce();
            backContainer.addChild(redzoneBar);
            zonebarContainer.addChild(redzoneBar);
        }

        //Add yellowzoneBar
        if (this.Options.YellowZoneBarEnable) {
            const yellowZoneBarTexture = this.Options.YellowZoneBarTextureName;
            const yellowzoneBarOption = new CircularProgressBarOptions();
            yellowzoneBarOption.OffsetAngle = this.Options.YellowZoneBarOffsetAngle;
            yellowzoneBarOption.FullAngle = this.Options.YellowZoneBarFullAngle;
            yellowzoneBarOption.Texture = PIXI.Texture.from(yellowZoneBarTexture);
            yellowzoneBarOption.Center = centerPosition;
            yellowzoneBarOption.Radius = zoneBarRadius;
            yellowzoneBarOption.InnerRadius = 0;
            const yellowzoneBar = new CircularProgressBar(yellowzoneBarOption);
            yellowzoneBar.Value = yellowzoneBarOption.Max;
            yellowzoneBar.updateForce();
            backContainer.addChild(yellowzoneBar);
            zonebarContainer.addChild(yellowzoneBar);
        }

        //Add greenZoneBar
        if (this.Options.GreenZoneBarEnable) {
            const greenZoneBarTexture = this.Options.GreenZoneBarTextureName;
            const greenzoneBarOption = new CircularProgressBarOptions();
            greenzoneBarOption.OffsetAngle = this.Options.GreenZoneBarOffsetAngle;
            greenzoneBarOption.FullAngle = this.Options.GreenZoneBarFullAngle;
            greenzoneBarOption.Texture = PIXI.Texture.from(greenZoneBarTexture);
            greenzoneBarOption.Center = centerPosition;
            greenzoneBarOption.Radius = zoneBarRadius;
            greenzoneBarOption.InnerRadius = 0;
            const greenzoneBar = new CircularProgressBar(greenzoneBarOption);
            greenzoneBar.Value = greenzoneBarOption.Max;
            greenzoneBar.updateForce();
            backContainer.addChild(greenzoneBar);
            zonebarContainer.addChild(greenzoneBar);
        }
        this.displayObjects.set("ZoneBar", zonebarContainer);

        //Add gridSprite
        const gridTexture = this.Options.GridTextureName;
        const gridSprite = new PIXI.Sprite();
        gridSprite.texture = PIXI.Texture.from(gridTexture);
        backContainer.addChild(gridSprite);
        this.displayObjects.set("Grid", gridSprite);

        const backLabel = new PIXI.Container();
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
        backLabel.addChild(titleTextElem);
        backLabel.addChild(unitTextElem);

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
            backLabel.addChild(axisLabelElem);
        }
        this.addChild(backContainer);
        this.displayObjects.set("BackLabel", backLabel);

        //Bake into texture
        backContainer.cacheAsBitmapResolution = 3; // Manually set bitmap cache resolution to avoid redzone bar glitch in Firefox.
        backContainer.cacheAsBitmap = true;
        return backContainer;
    }
}