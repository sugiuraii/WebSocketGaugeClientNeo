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

/// <reference path="../../script/lib/pixi.js.d.ts" />
/// <reference path="../../script/progressBar/pixiGauge.ts" />
/// <reference path="../../node_modules/@types/webfontloader/index.d.ts" />

module webSocketGauge.parts
{
    import CircularProgressBar = webSocketGauge.lib.graphics.CircularProgressBar;
    
    export class LEDTachoMeter extends PIXI.Container
    {
        private tachoProgressBar = new CircularProgressBar();
        private speedLabel = new PIXI.Text();
        private gasMilageLabel = new PIXI.Text();
        private tripLabel = new PIXI.Text();
        private fuelLabel = new PIXI.Text();
        private gearPosLabel = new PIXI.Text();
        
        private tacho = 0;
        private speed = 0;
        private gasMilage = 0;
        private trip = 0;
        private fuel = 0;
        private gearPos : string = "";
        
        private masterTextStyle = new PIXI.TextStyle(
        {       
            dropShadow : true,
            dropShadowBlur: 15,
            dropShadowColor: "white",
            dropShadowDistance: 0,
            align : "right",
            fill : "white",
            fontFamily: "DSEG14ClassicItalic"
        });
        
        static get RequestedTexturePath() : string[]
        {
            return ["/parts/LEDTachoMeter/LEDTachoMeterTexture.json"];
        }
        
        static get RequestedFontFamily() : string[]
        {
            return ["DSEG14ClassicItalic"]
        }
        
        static get RequestedFontCSSURL() : string[]
        {
            return ['/parts/fonts/font.css'];
        }
        
        get Tacho() : number { return this.tacho; }
        set Tacho(val : number)
        {
            this.tacho = val;
            this.tachoProgressBar.Value = val;
            this.changeRedZoneProgressBarColor();
            this.tachoProgressBar.update();
        }
        get Speed() { return this.speed; }
        set Speed(val : number)
        {
            this.speed = val;
            this.speedLabel.text = val.toFixed(0);
        }        
        get GasMilage() { return this.gasMilage; }
        set GasMilage(val : number)
        {
            this.gasMilage = val;
            this.gasMilageLabel.text = val.toFixed(2);
        }
        get Trip() { return this.trip }
        set Trip(val : number)
        {
            this.trip = val;
            this.tripLabel.text = val.toFixed(1);
        }
        get Fuel() { return this.fuel }
        set Fuel(val : number)
        {
            this.fuel = val;
            this.fuelLabel.text = val.toFixed(2);
        }
        
        get GearPos() { return this.gearPos }
        set GeasPos(val : string)
        {
            this.gearPos = val;
            this.gearPosLabel.text = val;
        }
        
        constructor()
        {
            super();
            
            const tachoMax = 9000;
            const tachoMin = 0;
            const tachoValDefault = 4500;
            const speedValDefault = 95;
            const gasMilageValDefault = 12.0;
            const tripValDefault = 230.0;
            const fuelValDefault = 30.00;
            
            const backSprite = PIXI.Sprite.fromFrame("LEDTachoMeter_Base");
            super.addChild(backSprite);
            
            const tachoProgressBar = this.tachoProgressBar;
            tachoProgressBar.Texture = PIXI.Texture.fromFrame("LEDTachoMeter_LED_Yellow");
            tachoProgressBar.Center.set(300,300);
            tachoProgressBar.pivot.set(300,300);
            tachoProgressBar.position.set(300, 300);
            tachoProgressBar.Radius = 300;
            tachoProgressBar.InnerRadius = 200;
            tachoProgressBar.Max = tachoMax;
            tachoProgressBar.Min = tachoMin;
            tachoProgressBar.Value = tachoValDefault;
            tachoProgressBar.OffsetAngle = 90;
            tachoProgressBar.FullAngle = 270;
            tachoProgressBar.AngleStep = 6;
            tachoProgressBar.updateForce();
            super.addChild(tachoProgressBar);
            
            const speedLabel = this.speedLabel;
            speedLabel.style = this.masterTextStyle.clone();
            speedLabel.style.fontSize = 88;
            speedLabel.anchor.set(1,0.5);
            speedLabel.text = speedValDefault.toFixed(0);
            speedLabel.position.set(410,230);
            super.addChild(speedLabel);
            
            const gasMilageLabel = this.gasMilageLabel;
            gasMilageLabel.style = this.masterTextStyle.clone();
            gasMilageLabel.style.fontSize = 45;
            gasMilageLabel.anchor.set(1,0.5);
            gasMilageLabel.text = gasMilageValDefault.toFixed(2);
            gasMilageLabel.position.set(310,360);
            super.addChild(gasMilageLabel);
            
            const tripLabel = this.tripLabel;
            tripLabel.style = this.masterTextStyle.clone();
            tripLabel.style.fontSize = 30;
            tripLabel.anchor.set(1,0.5);
            tripLabel.text = tripValDefault.toFixed(1);
            tripLabel.position.set(510,355);
            super.addChild(tripLabel);
            
            const fuelLabel = this.fuelLabel;
            fuelLabel.style = this.masterTextStyle.clone();
            fuelLabel.style.fontSize = 30;
            fuelLabel.anchor.set(1,0.5);
            fuelLabel.text = fuelValDefault.toFixed(2);
            fuelLabel.position.set(510,395);
            super.addChild(fuelLabel);

            const gearPosLabel = this.gearPosLabel;
            gearPosLabel.style = this.masterTextStyle.clone();
            gearPosLabel.style.fontSize = 100;
            gearPosLabel.anchor.set(1,0.5);
            gearPosLabel.text = "N";
            gearPosLabel.position.set(410,495);
            super.addChild(gearPosLabel);
        }
        
        private changeRedZoneProgressBarColor()
        {
            const redZoneTacho = 8000;
            if (this.tacho > redZoneTacho)
            {
                const redfilter = new PIXI.filters.ColorMatrixFilter();
                redfilter.hue(300);
                this.tachoProgressBar.filters = [redfilter];
            }
            else
                this.tachoProgressBar.filters = [];       
        }
    }
}