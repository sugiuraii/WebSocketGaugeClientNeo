/* 
 * Copyright (c) 2017, kuniaki
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * * Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */
 
import {CircularProgressBar} from  '../../../lib/Graphics/PIXIGauge';
import * as PIXI from 'pixi.js';

export class BitmapTextOption
{
    public position = new PIXI.Point(0, 0);
    public anchor = new PIXI.Point(0, 0);
    public align : string = "left";
    public fontName = "FreeSans_90px";

    constructor(position?: PIXI.Point, anchor? :  PIXI.Point, align? : string)
    {
        if(typeof(align) !== "undefined")
            this.align = align;
        if (position instanceof PIXI.Point)
            this.position = position;
        if (anchor instanceof PIXI.Point)
            this.anchor = anchor;
    }

    clone() : TextOption
    {
        const returnObj = new TextOption();
        returnObj.position = this.position.clone();
        returnObj.anchor = this.anchor.clone();
        returnObj.align = this.align;

        return returnObj;            
    }    
}

export class TextOption
{
    public position = new PIXI.Point(0, 0);
    public anchor = new PIXI.Point(0, 0);
    public align : string = "left";
    public fontSize : number = 12;
    public letterSpacing : number = 0;
    constructor(position?: PIXI.Point, anchor? :  PIXI.Point, align? : string, fontsize? : number, letterSpacing? : number)
    {
        if(typeof(align) !== "undefined")
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

    clone() : TextOption
    {
        const returnObj = new TextOption();
        returnObj.position = this.position.clone();
        returnObj.anchor = this.anchor.clone();
        returnObj.align = this.align;
        returnObj.fontSize = this.fontSize;
        returnObj.letterSpacing = this.letterSpacing;

        return returnObj;            
    }
}

export abstract class CircularGaugePanelOptionBase
{
    public ValueTextLabel: PIXI.extras.BitmapText;
    public ValueTextLabelOption: BitmapTextOption = new BitmapTextOption();
    public ValueNumberRoundDigit : number = 1;
    
    public MasterTextStyle : PIXI.TextStyle;

    public OffsetAngle : number;
    public FullAngle : number;
    public Min : number;
    public Max : number;
    public InvertDraw : boolean;
    public AntiClockWise : boolean;
    public AngleStep : number;
    public ValueBarRadius : number;
    public ValueBarInnerRadius : number;        

    public TitleLabel : string;
    public TitleLabelOption : TextOption;
    public UnitLabel : string;
    public UnitLabelOption: TextOption;

    public AxisLabel: string[] = new Array();
    public AxisLabelOption: TextOption[] = new Array();

    public RedZoneBarEnable : boolean;
    public YellowZoneBarEnable : boolean;
    public GreenZoneBarEnable : boolean;
    public RedZoneBarOffsetAngle : number;
    public YellowZoneBarOffsetAngle : number;
    public GreenZoneBarOffsetAngle : number;
    public RedZoneBarFullAngle : number;
    public YellowZoneBarFullAngle : number;
    public GreenZoneBarFullAngle : number;
    public ZoneBarRadius : number;

    public CenterPosition = new PIXI.Point();

    public RedZoneBarTexture : PIXI.Texture;
    public YellowZoneBarTexture : PIXI.Texture;
    public GreenZoneBarTexture : PIXI.Texture;
    public ValueBarTexture : PIXI.Texture;
    public BackTexture : PIXI.Texture;
    public GridTexture : PIXI.Texture;
}

export abstract class CircularGaugePanelBase extends PIXI.Container
{
    private valueProgressBar: CircularProgressBar;
    private Options: CircularGaugePanelOptionBase;
    
    public get Value() : number { return this.valueProgressBar.Value};
    public set Value(value : number)
    {
        this.valueProgressBar.Value = value;
        this.valueProgressBar.update();

        if (value.toFixed(this.Options.ValueNumberRoundDigit).toString() !== this.Options.ValueTextLabel.text)
            this.Options.ValueTextLabel.text = value.toFixed(this.Options.ValueNumberRoundDigit).toString();
    }

    protected abstract setOption() : void;

    constructor(options: CircularGaugePanelOptionBase)
    {
        super();
        this.Options = options;
        this.createBackContainer();
        this.createValueProgressBar();
    }

    private createValueProgressBar() : void
    {            
        this.valueProgressBar = new CircularProgressBar();
        this.valueProgressBar.OffsetAngle = this.Options.OffsetAngle;
        this.valueProgressBar.FullAngle = this.Options.FullAngle;
        this.valueProgressBar.Min = this.Options.Min;
        this.valueProgressBar.Max = this.Options.Max;
        this.valueProgressBar.AngleStep = this.Options.AngleStep;
        this.valueProgressBar.InvertDraw = this.Options.InvertDraw;
        this.valueProgressBar.AntiClockwise = this.Options.AntiClockWise;

        this.valueProgressBar.Center = this.Options.CenterPosition;
        this.valueProgressBar.Radius = this.Options.ValueBarRadius;
        this.valueProgressBar.InnerRadius = this.Options.ValueBarInnerRadius;

        this.valueProgressBar.Texture = this.Options.ValueBarTexture;
        super.addChild(this.valueProgressBar);
        
        const valueTextLabelOption = this.Options.ValueTextLabelOption;
        const valueTextLabelStyle: PIXI.extras.IBitmapTextStyle = {
            font: valueTextLabelOption.fontName,
            align: valueTextLabelOption.align
        };
        this.Options.ValueTextLabel = new PIXI.extras.BitmapText(this.Options.Min.toFixed(this.Options.ValueNumberRoundDigit).toString(), valueTextLabelStyle);
        this.Options.ValueTextLabel.position = valueTextLabelOption.position;
        this.Options.ValueTextLabel.anchor = new PIXI.Point(valueTextLabelOption.anchor.x, valueTextLabelOption.anchor.y);
        super.addChild(this.Options.ValueTextLabel);            
    }

    protected setAxisLabel(axisLabel : string[]) : void
    {
        this.Options.AxisLabel = new Array();
        for (let i = 0; i < axisLabel.length; i++)
            this.Options.AxisLabel.push(axisLabel[i]);
    }
    protected setAxisLabelOption(axisLabelOption : TextOption[]) : void
    {
        this.Options.AxisLabelOption = new Array(); 
        for (let i = 0; i < axisLabelOption.length; i++)
            this.Options.AxisLabelOption.push(axisLabelOption[i]);
    }

    private createBackContainer(): void
    {   
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
        if (this.Options.RedZoneBarEnable)
        {
            const redZoneBarTexture = this.Options.RedZoneBarTexture;
            const redzoneBar = new CircularProgressBar();
            redzoneBar.OffsetAngle = this.Options.RedZoneBarOffsetAngle;
            redzoneBar.FullAngle = this.Options.RedZoneBarFullAngle;
            redzoneBar.Texture = redZoneBarTexture;
            redzoneBar.Value = redzoneBar.Max;
            redzoneBar.Center = centerPosition;
            redzoneBar.Radius = zoneBarRadius;
            redzoneBar.InnerRadius = 0;
            redzoneBar.updateForce();
            backContainer.addChild(redzoneBar);
        }

        //Add yellowzoneBar
        if (this.Options.YellowZoneBarEnable)
        {
            const yellowZoneBarTexture = this.Options.YellowZoneBarTexture;
            const yellowzoneBar = new CircularProgressBar();
            yellowzoneBar.OffsetAngle = this.Options.YellowZoneBarOffsetAngle;
            yellowzoneBar.FullAngle = this.Options.YellowZoneBarFullAngle;
            yellowzoneBar.Texture = yellowZoneBarTexture;
            yellowzoneBar.Value = yellowzoneBar.Max;
            yellowzoneBar.Center = centerPosition;
            yellowzoneBar.Radius = zoneBarRadius;
            yellowzoneBar.InnerRadius = 0;
            yellowzoneBar.updateForce();
            backContainer.addChild(yellowzoneBar);
        }

        //Add greenZoneBar
        if (this.Options.GreenZoneBarEnable)
        {
            const greenZoneBarTexture = this.Options.GreenZoneBarTexture;
            const greenzoneBar = new CircularProgressBar();
            greenzoneBar.OffsetAngle = this.Options.GreenZoneBarOffsetAngle;
            greenzoneBar.FullAngle = this.Options.GreenZoneBarFullAngle;
            greenzoneBar.Texture = greenZoneBarTexture;
            greenzoneBar.Value = greenzoneBar.Max;
            greenzoneBar.Center = centerPosition;
            greenzoneBar.Radius = zoneBarRadius;
            greenzoneBar.InnerRadius = 0;
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
        unitTextElem.position.set(unitTextOption.position.x, unitTextOption.position.y );

        backContainer.addChild(titleTextElem);
        backContainer.addChild(unitTextElem);

        //Set axis label
        for (let i = 0; i < this.Options.AxisLabelOption.length; i++)
        {
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
};