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
        public align : string;
        public fontSize : number;
        constructor(position?: PIXI.Point, anchor? :  PIXI.Point, align? : string, fontsize? : number)
        {
            if(typeof(align) !== "undefined")
                this.align = align;
            if (typeof (fontsize) !== "undefined")
                this.fontSize = fontsize;
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
            
            return returnObj;            
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
        public static ShaftTextturePath : string = "FullCircularGauge_Shaft.png";
        
        public static preloadTextures()
        {
            PIXI.loader.add(FullCircularGauge.RedZoneBarTexturePath)
                .add(FullCircularGauge.GreenZoneBarTexturePath)
                .add(FullCircularGauge.YellowZoneBarTexturePath)
                .add(FullCircularGauge.BackTexturePath)
                .add(FullCircularGauge.GridTexturePath)
                .add(FullCircularGauge.ShaftTextturePath)
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
            
            //Add shaftSprite
            const shaftTexture = PIXI.loader.resources[FullCircularGauge.ShaftTextturePath].texture;
            const shaftSprite = new PIXI.Sprite();
            shaftSprite.texture = shaftTexture;
            backContainer.addChild(shaftSprite);

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

