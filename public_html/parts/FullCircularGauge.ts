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
        public text : string;
        public position = new PIXI.Point(0, 0);
        public anchor = new PIXI.Point(0, 0);
        public align : string;
        public fontSize : number;
        constructor(text?: string, position?: PIXI.Point, anchor? :  PIXI.Point, align? : string, fontsize? : number)
        {
            if(typeof(text) !== "undefined")
                this.text = text;
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
            returnObj.text = this.text;
            returnObj.position = this.position.clone();
            returnObj.anchor = this.anchor.clone();
            returnObj.align = this.align;
            returnObj.fontSize = this.fontSize;
            
            return returnObj;            
        }
    }
    export class FullCircularGaugeOptions extends CircularProgressBarOptions
    {       
        public RedZoneBarEnable : boolean = true;
        public YellowZoneBarEnable : boolean = true;
        public GreenZoneBarEnable : boolean = true;
        
        public RedZoneBarOffsetAngle : number = 315;
        public YellowZoneBarOffsetAngle : number = 270;
        public GreenZoneBarOffsetAngle : number = 90;
        public RedZoneBarFullAngle : number = 40;
        public YellowZoneBarFullAngle : number = 45;
        public GreenZoneBarFullAngle : number = 45;
        
        public MasterTextStyle = new PIXI.TextStyle(
        {
            dropShadow : true,
            dropShadowBlur: 10,
            dropShadowColor: "white",
            dropShadowDistance: 0,
            fill : "white",
            fontFamily: "FreeSans-Bold"
        });
        public TitleLabelOption = new TextOption("TURBO BOOST", new PIXI.Point(200, 370), new PIXI.Point(0.5, 0.5), "center", 38);
        public UnitLabelOption = new TextOption("x100kpa", new PIXI.Point(200, 235), new PIXI.Point(0.5, 0.5), "center", 23);
        
        public AxisLabelOption: TextOption[] = new Array();

        public ValueNumberRoundDigit : number = 1;
        
        constructor()
        {
            super();
            this.createDefaultAxisLabel();
            this.OffsetAngle = 90;
            this.FullAngle = 270;
            this.Min = -1.0;
            this.Max = 2.0;
            this.AngleStep = 0.1;
            this.Center.set(200,200);
            this.Radius = 150;
            this.InnerRadius = 50;
        }
        
        private createDefaultAxisLabel()
        {
            const axisLabelFontSize = 30;
            this.AxisLabelOption.push(new TextOption("-1.0", new PIXI.Point(207, 335), new PIXI.Point(0, 0.5), "left", axisLabelFontSize));
            this.AxisLabelOption.push(new TextOption("-0.5", new PIXI.Point(90, 310), new PIXI.Point(1, 0.5), "right", axisLabelFontSize));
            this.AxisLabelOption.push(new TextOption("0", new PIXI.Point(45, 193), new PIXI.Point(1, 0.5), "right", axisLabelFontSize));
            this.AxisLabelOption.push(new TextOption("+0.5", new PIXI.Point(90, 75), new PIXI.Point(1, 0.5), "right", axisLabelFontSize));
            this.AxisLabelOption.push(new TextOption("+1.0", new PIXI.Point(200, 40), new PIXI.Point(0.5, 1), "center", axisLabelFontSize));
            this.AxisLabelOption.push(new TextOption("+1.5", new PIXI.Point(310, 75), new PIXI.Point(0, 0.5), "left", axisLabelFontSize));
            this.AxisLabelOption.push(new TextOption("+2.0", new PIXI.Point(340, 195), new PIXI.Point(0.5, 0), "center", axisLabelFontSize));
        }
        
    }
    export class FullCircularGauge extends PIXI.Container
    {
        private gaugeOption: FullCircularGaugeOptions = new FullCircularGaugeOptions();
        private valueProgressBar: CircularProgressBar;
        private valueTextLabel: PIXI.Text;
                        
        public static preloadTextures()
        {
            PIXI.loader.add("FullCircularGauge_RedZone_Bar.png")
            .add("FullCircularGauge_GreenZone_Bar.png")
            .add("FullCircularGauge_YellowZone_Bar.png")
            .add("FullCircularGauge_Back.png")
            .add("FullCircularGauge_Grid.png")
            .add("FullCircularGauge_Shaft.png")
            .add("FullCircularGauge_ValueBar.png")
        }
        
        public create()
        {
            const backContainer = this.createBackContainer();
            super.addChild(backContainer);
            
            const option = this.gaugeOption; 
            const valueBarTexture = PIXI.loader.resources["FullCircularGauge_ValueBar.png"].texture;

            this.valueProgressBar = new CircularProgressBar(option);
            this.valueProgressBar.Texture = valueBarTexture;
            super.addChild(this.valueProgressBar);
           
            this.valueTextLabel = new PIXI.Text(option.Min.toFixed(option.ValueNumberRoundDigit).toString());
            this.valueTextLabel.style = option.MasterTextStyle.clone();
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
            
             if (value.toFixed(this.gaugeOption.ValueNumberRoundDigit).toString() !== this.valueTextLabel.text)
                this.valueTextLabel.text = value.toFixed(this.gaugeOption.ValueNumberRoundDigit).toString();
                
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

            const option = this.gaugeOption 
            //Setup Textures
            const redZoneBarTexture = PIXI.loader.resources["FullCircularGauge_RedZone_Bar.png"].texture;
            const greenZoneBarTexture = PIXI.loader.resources["FullCircularGauge_GreenZone_Bar.png"].texture;
            const yellowZoneBarTexture = PIXI.loader.resources["FullCircularGauge_YellowZone_Bar.png"].texture;            
            const backTexture = PIXI.loader.resources["FullCircularGauge_Back.png"].texture;
            const gridTexture = PIXI.loader.resources["FullCircularGauge_Grid.png"].texture;
            const shaftTexture = PIXI.loader.resources["FullCircularGauge_Shaft.png"].texture;
 
            const redzoneBar = new CircularProgressBar();
            redzoneBar.OffsetAngle = option.RedZoneBarOffsetAngle;
            redzoneBar.FullAngle = option.RedZoneBarFullAngle;
            redzoneBar.Texture = redZoneBarTexture;
            redzoneBar.Value = redzoneBar.Max;
            redzoneBar.Center.set(200,200);
            redzoneBar.Radius = 200;
            redzoneBar.InnerRadius = 0;
            redzoneBar.updateForce();
            
            const yellowzoneBar = new CircularProgressBar();
            yellowzoneBar.OffsetAngle = option.YellowZoneBarOffsetAngle;
            yellowzoneBar.FullAngle = option.YellowZoneBarFullAngle;
            yellowzoneBar.Texture = yellowZoneBarTexture;
            yellowzoneBar.Value = yellowzoneBar.Max;
            yellowzoneBar.Center = redzoneBar.Center.clone();
            yellowzoneBar.Radius = redzoneBar.Radius;
            yellowzoneBar.InnerRadius = redzoneBar.InnerRadius;
            yellowzoneBar.updateForce();

            const greenzoneBar = new CircularProgressBar();
            greenzoneBar.OffsetAngle = option.GreenZoneBarOffsetAngle;
            greenzoneBar.FullAngle = option.GreenZoneBarFullAngle;
            greenzoneBar.Texture = greenZoneBarTexture;
            greenzoneBar.Value = greenzoneBar.Max;
            greenzoneBar.Center = redzoneBar.Center.clone();
            greenzoneBar.Radius = redzoneBar.Radius;
            greenzoneBar.InnerRadius = redzoneBar.InnerRadius;
            greenzoneBar.updateForce();
            
            const backSprite = new PIXI.Sprite();
            backSprite.texture = backTexture;
            
            const gridSprite = new PIXI.Sprite();
            gridSprite.texture = gridTexture;
            const shaftSprite = new PIXI.Sprite();
            shaftSprite.texture = shaftTexture;
            
            //Assing container to items
            backContainer.addChild(backSprite);
            backContainer.addChild(redzoneBar);
            backContainer.addChild(yellowzoneBar);
            backContainer.addChild(greenzoneBar);
            backContainer.addChild(gridSprite);
            backContainer.addChild(shaftSprite);
            
            //Set Title and unit text
            const titleTextElem = new PIXI.Text(this.gaugeOption.TitleLabelOption.text);
            const titleTextOption = this.gaugeOption.TitleLabelOption;
            titleTextElem.style = this.gaugeOption.MasterTextStyle.clone();
            titleTextElem.style.fontSize = titleTextOption.fontSize;
            titleTextElem.style.align = titleTextOption.align;
            titleTextElem.anchor.set(titleTextOption.anchor.x, titleTextOption.anchor.y)
            titleTextElem.position.set(titleTextOption.position.x, titleTextOption.position.y);
            
            const unitTextElem = new PIXI.Text(this.gaugeOption.UnitLabelOption.text);
            const unitTextOption = this.gaugeOption.UnitLabelOption;
            unitTextElem.style = this.gaugeOption.MasterTextStyle.clone();
            unitTextElem.style.fontSize = unitTextOption.fontSize;
            unitTextElem.style.align = unitTextOption.align;
            unitTextElem.anchor.set(unitTextOption.anchor.x, unitTextOption.anchor.y);
            unitTextElem.position.set(unitTextOption.position.x, unitTextOption.position.y );
 
            backContainer.addChild(titleTextElem);
            backContainer.addChild(unitTextElem);
            
            //Set axis label
            for (let i = 0; i < this.gaugeOption.AxisLabelOption.length; i++)
            {
                const axisLabelOption = this.gaugeOption.AxisLabelOption[i];
                const axisLabelElem = new PIXI.Text(axisLabelOption.text);
                axisLabelElem.style = this.gaugeOption.MasterTextStyle.clone();
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
    }    
}

