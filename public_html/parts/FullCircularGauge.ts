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

window.onload = function()
{
    webSocketGauge.parts.FullCircularGauge.preloadTextures();
    WebFont.load({        
        custom: 
            { 
                families: [ 'FreeSans-Bold' ], 
                urls: ['./font.css' ] 
            },
        active : function(){PIXI.loader.load(main);}
    });
}

function main()
{
    const app = new PIXI.Application(1366,768);
    document.body.appendChild(app.view);
    let gaugeArray : webSocketGauge.parts.FullCircularGauge[] = new Array();
    let index = 0;
    for (let j = 0; j < 2; j++)
    {
        for (let i = 0; i < 3 ; i++)
        {
            gaugeArray.push(new webSocketGauge.parts.FullCircularGauge());
            gaugeArray[index].create();
            gaugeArray[index].mainContainer.pivot = new PIXI.Point(400,400);
            gaugeArray[index].mainContainer.scale = new PIXI.Point(0.3, 0.3);
            gaugeArray[index].mainContainer.position = new PIXI.Point(250*i+200,250*j+200);
            app.stage.addChild(gaugeArray[index].mainContainer);
            index++;
        }
    }
    app.ticker.add(() => {
        for (let i = 0; i < gaugeArray.length; i++)
        {
            if(gaugeArray[i].getVal() + 0.01 >= 2.0)
                gaugeArray[i].setVal(-1.0);
            else           
                gaugeArray[i].setVal(gaugeArray[i].getVal() + 0.03*(i+1));
        }
        });
}

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
        
        public RedZoneBarTexture : PIXI.Texture;
        public GreenZoneBarTexture: PIXI.Texture;
        public YellowZoneBarTexture: PIXI.Texture;
        public ValueBarTexture: PIXI.Texture;
        
        public BackTexture: PIXI.Texture;
        public GridTexture: PIXI.Texture;
        public ShaftTexture: PIXI.Texture;
        
        public RedZoneBarOffsetAngle : number = 315;
        public YellowZoneBarOffsetAngle : number = 270;
        public GreenZoneBarOffsetAngle : number = 90;
        public RedZoneBarFullAngle : number = 40;
        public YellowZoneBarFullAngle : number = 45;
        public GreenZoneBarFullAngle : number = 45;
        
        public MasterTextStyle = new PIXI.TextStyle(
        {
            dropShadow : true,
            dropShadowBlur: 20,
            dropShadowColor: "white",
            dropShadowDistance: 0,
            fill : "white",
            fontFamily: "FreeSans-Bold"
        });
        public TitleLabelOption = new TextOption("TURBO BOOST", new PIXI.Point(400, 740), new PIXI.Point(0.5, 0.5), "center", 75);
        public UnitLabelOption = new TextOption("x100kpa", new PIXI.Point(400, 470), new PIXI.Point(0.5, 0.5), "center", 45);
        
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
            this.Center.set(400,400);
            this.Radius = 300;
            this.InnerRadius = 100;
        }
        
        private createDefaultAxisLabel()
        {
            const axisLabelFontSize = 55;
            this.AxisLabelOption.push(new TextOption("-1.0", new PIXI.Point(415, 670), new PIXI.Point(0, 0.5), "left", axisLabelFontSize));
            this.AxisLabelOption.push(new TextOption("-0.5", new PIXI.Point(180, 620), new PIXI.Point(1, 0.5), "right", axisLabelFontSize));
            this.AxisLabelOption.push(new TextOption("0", new PIXI.Point(90, 385), new PIXI.Point(1, 0.5), "right", axisLabelFontSize));
            this.AxisLabelOption.push(new TextOption("+0.5", new PIXI.Point(180, 150), new PIXI.Point(1, 0.5), "right", axisLabelFontSize));
            this.AxisLabelOption.push(new TextOption("+1.0", new PIXI.Point(400, 80), new PIXI.Point(0.5, 1), "center", axisLabelFontSize));
            this.AxisLabelOption.push(new TextOption("+1.5", new PIXI.Point(620, 150), new PIXI.Point(0, 0.5), "left", axisLabelFontSize));
            this.AxisLabelOption.push(new TextOption("+2.0", new PIXI.Point(680, 390), new PIXI.Point(0.5, 0), "center", axisLabelFontSize));
        }
        
    }
    export class FullCircularGauge
    {
        private gaugeOption: FullCircularGaugeOptions = new FullCircularGaugeOptions();
        private progressBar: CircularProgressBar;
        private valueTextLabel: PIXI.Text;
        public backContainer: PIXI.Container;
        public mainContainer: PIXI.Container;
        
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
            this.mainContainer = new PIXI.Container();
            this.createBackTexture();
            this.mainContainer.addChild(this.backContainer);
            
            const option = this.gaugeOption; 
            option.ValueBarTexture = PIXI.loader.resources["FullCircularGauge_ValueBar.png"].texture;

            this.progressBar = new CircularProgressBar(option);
            this.progressBar.Texture = option.ValueBarTexture;
            this.mainContainer.addChild(this.progressBar);
            
            this.valueTextLabel = new PIXI.Text(option.Min.toFixed(option.ValueNumberRoundDigit).toString());
            this.valueTextLabel.style = option.MasterTextStyle.clone();
            this.valueTextLabel.style.fontSize = 160;
            this.valueTextLabel.position.set(400,370);
            this.valueTextLabel.anchor.set(0.5,0.5);
            this.valueTextLabel.style.align = "center";
            this.valueTextLabel.style.letterSpacing = -6;
            this.mainContainer.addChild(this.valueTextLabel);
        }
        
        public setVal(value : number)
        {
            this.progressBar.Value = value;
            this.progressBar.update();
            if (value.toFixed(this.gaugeOption.ValueNumberRoundDigit).toString() !== this.valueTextLabel.text)
                this.valueTextLabel.text = value.toFixed(this.gaugeOption.ValueNumberRoundDigit).toString();
        }
        public getVal():number
        {
            return this.progressBar.Value;
        }
        public createBackTexture()
        {   
            const backContainer = this.backContainer = new PIXI.Container();
            //Unlock baked texture
            backContainer.cacheAsBitmap = false;

            const option = this.gaugeOption 
            //Setup Textures
            option.RedZoneBarTexture = PIXI.loader.resources["FullCircularGauge_RedZone_Bar.png"].texture;
            option.GreenZoneBarTexture = PIXI.loader.resources["FullCircularGauge_GreenZone_Bar.png"].texture;
            option.YellowZoneBarTexture = PIXI.loader.resources["FullCircularGauge_YellowZone_Bar.png"].texture;            
            option.BackTexture = PIXI.loader.resources["FullCircularGauge_Back.png"].texture;
            option.GridTexture = PIXI.loader.resources["FullCircularGauge_Grid.png"].texture;
            option.ShaftTexture = PIXI.loader.resources["FullCircularGauge_Shaft.png"].texture;
 
            const redzoneBar = new CircularProgressBar();
            redzoneBar.OffsetAngle = option.RedZoneBarOffsetAngle;
            redzoneBar.FullAngle = option.RedZoneBarFullAngle;
            redzoneBar.Texture = option.RedZoneBarTexture;
            redzoneBar.Value = redzoneBar.Max;
            redzoneBar.Center.set(400,400);
            redzoneBar.Radius = 400;
            redzoneBar.InnerRadius = 0;
            redzoneBar.updateForce();
            
            const yellowzoneBar = new CircularProgressBar();
            yellowzoneBar.OffsetAngle = option.YellowZoneBarOffsetAngle;
            yellowzoneBar.FullAngle = option.YellowZoneBarFullAngle;
            yellowzoneBar.Texture = option.YellowZoneBarTexture;
            yellowzoneBar.Value = yellowzoneBar.Max;
            yellowzoneBar.Center.set(400,400);
            yellowzoneBar.Radius = 400;
            yellowzoneBar.InnerRadius = 0;
            yellowzoneBar.updateForce();

            const greenzoneBar = new CircularProgressBar();
            greenzoneBar.OffsetAngle = option.GreenZoneBarOffsetAngle;
            greenzoneBar.FullAngle = option.GreenZoneBarFullAngle;
            greenzoneBar.Texture = option.GreenZoneBarTexture;
            greenzoneBar.Value = greenzoneBar.Max;
            greenzoneBar.Center.set(400,400);
            greenzoneBar.Radius = 400;
            greenzoneBar.InnerRadius = 0;
            greenzoneBar.updateForce();
            
            const backSprite = new PIXI.Sprite();
            backSprite.texture = option.BackTexture;
            
            const gridSprite = new PIXI.Sprite();
            gridSprite.texture = option.GridTexture;
            const shaftSprite = new PIXI.Sprite();
            shaftSprite.texture = option.ShaftTexture;
            
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
        }
    }    
}

