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

/// <reference path="../script/lib/pixi.js.d.ts" />
/// <reference path="../script/progressBar/pixiGauge.ts" />
/// <reference path="../node_modules/@types/webfontloader/index.d.ts" />

import CircularProgressBar = webSocketGauge.lib.graphics.CircularProgressBar;
import CircularProgressBarOptions = webSocketGauge.lib.graphics.CircularProgressBarOptions;

module webSocketGauge.parts
{
    export class TextOption
    {
        public position = new PIXI.Point(0, 0);
        public anchor = new PIXI.Point(0, 0);
        public align : string = "left";
        public fontSize : number = 12;
        public letterSpaing : number = 0;
        constructor(position?: PIXI.Point, anchor? :  PIXI.Point, align? : string, fontsize? : number, letterSpacing? : number)
        {
            if(typeof(align) !== "undefined")
                this.align = align;
            if (typeof (fontsize) !== "undefined")
                this.fontSize = fontsize;
            if (typeof (letterSpacing) !== "undefined")
                this.letterSpaing = letterSpacing;
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
            returnObj.letterSpaing = this.letterSpaing;
            
            return returnObj;            
        }
    }
    
    export abstract class CircularGaugePanelBase extends PIXI.Container
    {
        private valueProgressBar: CircularProgressBar;
        protected valueTextLabel: PIXI.Text;
        protected masterTextStyle : PIXI.TextStyle;
        
        protected offsetAngle : number;
        protected fullAngle : number;
        protected min : number;
        protected max : number;
        protected angleStep : number;
        protected valueBarRadius : number;
        protected valueBarInnerRadius : number;        
        protected valueLabelOption: TextOption;

        protected titleLabel : string;
        protected titleLabelOption : TextOption;
        protected unitLabel : string;
        protected unitLabelOption: TextOption;
        
        protected axisLabel: string[];
        protected axisLabelOption: TextOption[];

        protected valueNumberRoundDigit : number = 1;
        
        protected redZoneBarEnable : boolean;
        protected yellowZoneBarEnable : boolean;
        protected greenZoneBarEnable : boolean;
                
        protected redZoneBarOffsetAngle : number;
        protected yellowZoneBarOffsetAngle : number;
        protected greenZoneBarOffsetAngle : number;
        protected redZoneBarFullAngle : number;
        protected yellowZoneBarFullAngle : number;
        protected greenZoneBarFullAngle : number;
        protected zoneBarRadius : number;
        
        protected centerPosition: PIXI.Point;
        
        public get Value() : number { return this.valueProgressBar.Value};
        public set Value(value : number)
        {
            this.valueProgressBar.Value = value;
            this.valueProgressBar.update();
            
             if (value.toFixed(this.valueNumberRoundDigit).toString() !== this.valueTextLabel.text)
                this.valueTextLabel.text = value.toFixed(this.valueNumberRoundDigit).toString();
        }
        
        private createValueProgressBar() : void
        {            
            const valueBarTexture = PIXI.loader.resources[FullCircularGauge.ValueBarTexturePath].texture;

            this.valueProgressBar = new CircularProgressBar();
            this.valueProgressBar.OffsetAngle = this.offsetAngle;
            this.valueProgressBar.FullAngle = this.fullAngle;
            this.valueProgressBar.Min = this.min;
            this.valueProgressBar.Max = this.max;
            this.valueProgressBar.AngleStep = this.angleStep;
            
            this.valueProgressBar.Center = this.centerPosition;
            this.valueProgressBar.Radius = this.valueBarRadius;
            this.valueProgressBar.InnerRadius = this.valueBarInnerRadius;
            
            this.valueProgressBar.Texture = valueBarTexture;
            super.addChild(this.valueProgressBar);
           
            this.valueTextLabel = new PIXI.Text(this.min.toFixed(this.valueNumberRoundDigit).toString());
            this.valueTextLabel.style = this.masterTextStyle.clone();
            const valueLabelOption = this.valueLabelOption;
            this.valueTextLabel.style.fontSize = valueLabelOption.fontSize;
            this.valueTextLabel.position = valueLabelOption.position;
            this.valueTextLabel.anchor.set(valueLabelOption.anchor.x, valueLabelOption.anchor.y);
            this.valueTextLabel.style.align = valueLabelOption.align;
            this.valueTextLabel.style.letterSpacing = valueLabelOption.letterSpaing;
            super.addChild(this.valueTextLabel);            
        }
        
        private setDefaultAxisLabel(axisLabel : string[], axisLabelOption : TextOption[]) : void
        {
            for (let i : number; i < axisLabel.length; i++)
            {
                this.axisLabel.push(axisLabel[i]);
                this.axisLabelOption.push(axisLabelOption[i]);
            }
        }
        
        private createBackContainer(): void
        {   
            const backContainer = new PIXI.Container();
            //Unlock baked texture
            backContainer.cacheAsBitmap = false;
            
            const centerPosition = this.centerPosition;
            const zoneBarRadius = this.zoneBarRadius;
            
            //Add backSprite
            const backTexture = PIXI.loader.resources[FullCircularGauge.BackTexturePath].texture;
            const backSprite = new PIXI.Sprite();
            backSprite.texture = backTexture;
            backContainer.addChild(backSprite);
            
            //Add redzoneBar
            if (this.redZoneBarEnable)
            {
                const redZoneBarTexture = PIXI.loader.resources[FullCircularGauge.RedZoneBarTexturePath].texture;
                const redzoneBar = new CircularProgressBar();
                redzoneBar.OffsetAngle = this.redZoneBarOffsetAngle;
                redzoneBar.FullAngle = this.redZoneBarFullAngle;
                redzoneBar.Texture = redZoneBarTexture;
                redzoneBar.Value = redzoneBar.Max;
                redzoneBar.Center = centerPosition;
                redzoneBar.Radius = zoneBarRadius;
                redzoneBar.InnerRadius = 0;
                redzoneBar.updateForce();
                backContainer.addChild(redzoneBar);
            }
            
            //Add yellowzoneBar
            if (this.yellowZoneBarEnable)
            {
                const yellowZoneBarTexture = PIXI.loader.resources[FullCircularGauge.YellowZoneBarTexturePath].texture;
                const yellowzoneBar = new CircularProgressBar();
                yellowzoneBar.OffsetAngle = this.yellowZoneBarOffsetAngle;
                yellowzoneBar.FullAngle = this.yellowZoneBarFullAngle;
                yellowzoneBar.Texture = yellowZoneBarTexture;
                yellowzoneBar.Value = yellowzoneBar.Max;
                yellowzoneBar.Center = centerPosition;
                yellowzoneBar.Radius = zoneBarRadius;
                yellowzoneBar.InnerRadius = 0;
                yellowzoneBar.updateForce();
                backContainer.addChild(yellowzoneBar);
            }
            
            //Add greenZoneBar
            if (this.greenZoneBarEnable)
            {
                const greenZoneBarTexture = PIXI.loader.resources[FullCircularGauge.GreenZoneBarTexturePath].texture;
                const greenzoneBar = new CircularProgressBar();
                greenzoneBar.OffsetAngle = this.greenZoneBarOffsetAngle;
                greenzoneBar.FullAngle = this.greenZoneBarFullAngle;
                greenzoneBar.Texture = greenZoneBarTexture;
                greenzoneBar.Value = greenzoneBar.Max;
                greenzoneBar.Center = centerPosition;
                greenzoneBar.Radius = zoneBarRadius;
                greenzoneBar.InnerRadius = 0;
                greenzoneBar.updateForce();
                backContainer.addChild(greenzoneBar);
            }
            
            //Add gridSprite
            const gridTexture = PIXI.loader.resources[FullCircularGauge.GridTexturePath].texture;
            const gridSprite = new PIXI.Sprite();
            gridSprite.texture = gridTexture;
            backContainer.addChild(gridSprite);

            //Set Title and unit text
            const titleTextElem = new PIXI.Text(this.titleLabel);
            const titleTextOption = this.titleLabelOption;
            titleTextElem.style = this.masterTextStyle.clone();
            titleTextElem.style.fontSize = titleTextOption.fontSize;
            titleTextElem.style.align = titleTextOption.align;
            titleTextElem.anchor.set(titleTextOption.anchor.x, titleTextOption.anchor.y)
            titleTextElem.position.set(titleTextOption.position.x, titleTextOption.position.y);
            
            const unitTextElem = new PIXI.Text(this.unitLabel);
            const unitTextOption = this.unitLabelOption;
            unitTextElem.style = this.masterTextStyle.clone();
            unitTextElem.style.fontSize = unitTextOption.fontSize;
            unitTextElem.style.align = unitTextOption.align;
            unitTextElem.anchor.set(unitTextOption.anchor.x, unitTextOption.anchor.y);
            unitTextElem.position.set(unitTextOption.position.x, unitTextOption.position.y );
 
            backContainer.addChild(titleTextElem);
            backContainer.addChild(unitTextElem);
            
            //Set axis label
            for (let i = 0; i < this.axisLabelOption.length; i++)
            {
                const axisLabelOption = this.axisLabelOption[i];
                const axisLabelElem = new PIXI.Text(this.axisLabel[i]);
                axisLabelElem.style = this.masterTextStyle.clone();
                axisLabelElem.style.fontSize = axisLabelOption.fontSize;
                axisLabelElem.style.align = axisLabelOption.align;
                axisLabelElem.anchor.set(axisLabelOption.anchor.x, axisLabelOption.anchor.y);
                axisLabelElem.position.set(axisLabelOption.position.x, axisLabelOption.position.y);
                backContainer.addChild(axisLabelElem);
            }
            
            //Bake into texture
            backContainer.cacheAsBitmap = true;
            
            super.addChild(backContainer);
        }
    }
    
    export class FullCircularGauge extends PIXI.Container
    {
        private valueProgressBar: CircularProgressBar;
        private valueTextLabel: PIXI.Text;
        
        public MasterTextStyle = new PIXI.TextStyle(
        {
            dropShadow : true,
            dropShadowBlur: 10,
            dropShadowColor: "white",
            dropShadowDistance: 0,
            fill : "white",
            fontFamily: "FreeSans-Bold"
        });
        
        public OffsetAngle = 90;
        public FullAngle = 270;
        public Min = -1.0;
        public Max = 2.0;
        public AngleStep = 0.1;
        
        public TitleLabel = "TURBO BOOST";
        public TitleLabelOption = new TextOption(new PIXI.Point(200, 370), new PIXI.Point(0.5, 0.5), "center", 38);
        public UnitLabel = "x100kPa";
        public UnitLabelOption = new TextOption(new PIXI.Point(200, 235), new PIXI.Point(0.5, 0.5), "center", 23);
        
        public AxisLabel: string[] = new Array();
        public AxisLabelOption: TextOption[] = new Array();

        public ValueNumberRoundDigit : number = 1;
        
        public RedZoneBarEnable : boolean = true;
        public YellowZoneBarEnable : boolean = true;
        public GreenZoneBarEnable : boolean = true;
                
        public RedZoneBarOffsetAngle : number = 315;
        public YellowZoneBarOffsetAngle : number = 270;
        public GreenZoneBarOffsetAngle : number = 90;
        public RedZoneBarFullAngle : number = 40;
        public YellowZoneBarFullAngle : number = 45;
        public GreenZoneBarFullAngle : number = 90;
        
        public static RedZoneBarTexturePath : string = "FullCircularGauge_RedZone_Bar.png";
        public static YellowZoneBarTexturePath : string = "FullCircularGauge_YellowZone_Bar.png";
        public static GreenZoneBarTexturePath : string = "FullCircularGauge_GreenZone_Bar.png";
        public static ValueBarTexturePath : string = "FullCircularGauge_ValueBar.png";
        public static BackTexturePath : string = "FullCircularGauge_Back.png";
        public static GridTexturePath : string = "FullCircularGauge_Grid.png";
        
        public static preloadTextures()
        {
            PIXI.loader.add(FullCircularGauge.RedZoneBarTexturePath)
                .add(FullCircularGauge.GreenZoneBarTexturePath)
                .add(FullCircularGauge.YellowZoneBarTexturePath)
                .add(FullCircularGauge.BackTexturePath)
                .add(FullCircularGauge.GridTexturePath)
                .add(FullCircularGauge.ValueBarTexturePath);
        }
        
        constructor()
        {
            super();
            this.createDefaultAxisLabel();
        }
        
        public create()
        {
            const backContainer = this.createBackContainer();
            super.addChild(backContainer);
            
            const valueBarTexture = PIXI.loader.resources[FullCircularGauge.ValueBarTexturePath].texture;

            this.valueProgressBar = new CircularProgressBar();
            this.valueProgressBar.OffsetAngle = this.OffsetAngle;
            this.valueProgressBar.FullAngle = this.FullAngle;
            this.valueProgressBar.Min = this.Min;
            this.valueProgressBar.Max = this.Max;
            this.valueProgressBar.AngleStep = this.AngleStep;
            
            this.valueProgressBar.Center.set(200,200);
            this.valueProgressBar.Radius = 150;
            this.valueProgressBar.InnerRadius = 50;
            
            this.valueProgressBar.Texture = valueBarTexture;
            super.addChild(this.valueProgressBar);
           
            this.valueTextLabel = new PIXI.Text(this.Min.toFixed(this.ValueNumberRoundDigit).toString());
            this.valueTextLabel.style = this.MasterTextStyle.clone();
            this.valueTextLabel.style.fontSize = 80;
            this.valueTextLabel.position.set(200,185);
            this.valueTextLabel.anchor.set(0.5,0.5);
            this.valueTextLabel.style.align = "center";
            this.valueTextLabel.style.letterSpacing = -3;
            super.addChild(this.valueTextLabel);
            
        }
        
        public setVal(value : number)
        {
            this.valueProgressBar.Value = value;
            this.valueProgressBar.update();
            
             if (value.toFixed(this.ValueNumberRoundDigit).toString() !== this.valueTextLabel.text)
                this.valueTextLabel.text = value.toFixed(this.ValueNumberRoundDigit).toString();
                
        }
        public getVal():number
        {
            return this.valueProgressBar.Value;
        }
        private createBackContainer(): PIXI.Container
        {   
            const backContainer = new PIXI.Container();
            //Unlock baked texture
            backContainer.cacheAsBitmap = false;
            
            const centerPosition = new PIXI.Point(200,200);
            const zoneBarRadius = 200;
            
            //Add backSprite
            const backTexture = PIXI.loader.resources[FullCircularGauge.BackTexturePath].texture;
            const backSprite = new PIXI.Sprite();
            backSprite.texture = backTexture;
            backContainer.addChild(backSprite);
            
            //Add redzoneBar
            if (this.RedZoneBarEnable)
            {
                const redZoneBarTexture = PIXI.loader.resources[FullCircularGauge.RedZoneBarTexturePath].texture;
                const redzoneBar = new CircularProgressBar();
                redzoneBar.OffsetAngle = this.RedZoneBarOffsetAngle;
                redzoneBar.FullAngle = this.RedZoneBarFullAngle;
                redzoneBar.Texture = redZoneBarTexture;
                redzoneBar.Value = redzoneBar.Max;
                redzoneBar.Center = centerPosition;
                redzoneBar.Radius = zoneBarRadius;
                redzoneBar.InnerRadius = 0;
                redzoneBar.updateForce();
                backContainer.addChild(redzoneBar);
            }
            
            //Add yellowzoneBar
            if (this.YellowZoneBarEnable)
            {
                const yellowZoneBarTexture = PIXI.loader.resources[FullCircularGauge.YellowZoneBarTexturePath].texture;
                const yellowzoneBar = new CircularProgressBar();
                yellowzoneBar.OffsetAngle = this.YellowZoneBarOffsetAngle;
                yellowzoneBar.FullAngle = this.YellowZoneBarFullAngle;
                yellowzoneBar.Texture = yellowZoneBarTexture;
                yellowzoneBar.Value = yellowzoneBar.Max;
                yellowzoneBar.Center = centerPosition;
                yellowzoneBar.Radius = zoneBarRadius;
                yellowzoneBar.InnerRadius = 0;
                yellowzoneBar.updateForce();
                backContainer.addChild(yellowzoneBar);
            }
            
            //Add greenZoneBar
            if (this.GreenZoneBarEnable)
            {
                const greenZoneBarTexture = PIXI.loader.resources[FullCircularGauge.GreenZoneBarTexturePath].texture;
                const greenzoneBar = new CircularProgressBar();
                greenzoneBar.OffsetAngle = this.GreenZoneBarOffsetAngle;
                greenzoneBar.FullAngle = this.GreenZoneBarFullAngle;
                greenzoneBar.Texture = greenZoneBarTexture;
                greenzoneBar.Value = greenzoneBar.Max;
                greenzoneBar.Center = centerPosition;
                greenzoneBar.Radius = zoneBarRadius;
                greenzoneBar.InnerRadius = 0;
                greenzoneBar.updateForce();
                backContainer.addChild(greenzoneBar);
            }
            
            //Add gridSprite
            const gridTexture = PIXI.loader.resources[FullCircularGauge.GridTexturePath].texture;
            const gridSprite = new PIXI.Sprite();
            gridSprite.texture = gridTexture;
            backContainer.addChild(gridSprite);

            //Set Title and unit text
            const titleTextElem = new PIXI.Text(this.TitleLabel);
            const titleTextOption = this.TitleLabelOption;
            titleTextElem.style = this.MasterTextStyle.clone();
            titleTextElem.style.fontSize = titleTextOption.fontSize;
            titleTextElem.style.align = titleTextOption.align;
            titleTextElem.anchor.set(titleTextOption.anchor.x, titleTextOption.anchor.y)
            titleTextElem.position.set(titleTextOption.position.x, titleTextOption.position.y);
            
            const unitTextElem = new PIXI.Text(this.UnitLabel);
            const unitTextOption = this.UnitLabelOption;
            unitTextElem.style = this.MasterTextStyle.clone();
            unitTextElem.style.fontSize = unitTextOption.fontSize;
            unitTextElem.style.align = unitTextOption.align;
            unitTextElem.anchor.set(unitTextOption.anchor.x, unitTextOption.anchor.y);
            unitTextElem.position.set(unitTextOption.position.x, unitTextOption.position.y );
 
            backContainer.addChild(titleTextElem);
            backContainer.addChild(unitTextElem);
            
            //Set axis label
            for (let i = 0; i < this.AxisLabelOption.length; i++)
            {
                const axisLabelOption = this.AxisLabelOption[i];
                const axisLabelElem = new PIXI.Text(this.AxisLabel[i]);
                axisLabelElem.style = this.MasterTextStyle.clone();
                axisLabelElem.style.fontSize = axisLabelOption.fontSize;
                axisLabelElem.style.align = axisLabelOption.align;
                axisLabelElem.anchor.set(axisLabelOption.anchor.x, axisLabelOption.anchor.y);
                axisLabelElem.position.set(axisLabelOption.position.x, axisLabelOption.position.y);
                backContainer.addChild(axisLabelElem);
            }
            
            //Bake into texture
            backContainer.cacheAsBitmap = true;
            
            return backContainer;
        }
        
        private createDefaultAxisLabel()
        {
            const axisLabelFontSize = 30;
            this.AxisLabel.push("-1.0");
            this.AxisLabelOption.push(new TextOption(new PIXI.Point(207, 335), new PIXI.Point(0, 0.5), "left", axisLabelFontSize));
            this.AxisLabel.push("-0.5");
            this.AxisLabelOption.push(new TextOption(new PIXI.Point(90, 310), new PIXI.Point(1, 0.5), "right", axisLabelFontSize));
            this.AxisLabel.push("0");
            this.AxisLabelOption.push(new TextOption(new PIXI.Point(45, 193), new PIXI.Point(1, 0.5), "right", axisLabelFontSize));
            this.AxisLabel.push("+0.5");
            this.AxisLabelOption.push(new TextOption(new PIXI.Point(90, 75), new PIXI.Point(1, 0.5), "right", axisLabelFontSize));
            this.AxisLabel.push("+1.0");
            this.AxisLabelOption.push(new TextOption(new PIXI.Point(200, 40), new PIXI.Point(0.5, 1), "center", axisLabelFontSize));
            this.AxisLabel.push("+1.5");
            this.AxisLabelOption.push(new TextOption(new PIXI.Point(310, 75), new PIXI.Point(0, 0.5), "left", axisLabelFontSize));
            this.AxisLabel.push("+2.0");
            this.AxisLabelOption.push(new TextOption(new PIXI.Point(340, 195), new PIXI.Point(0.5, 0), "center", axisLabelFontSize));
        }
    }    
}

