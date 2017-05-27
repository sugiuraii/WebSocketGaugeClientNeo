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

 /// <reference path="../../lib/webpackRequire.ts" />
 
import {RectangularProgressBar} from '../../lib/Graphics/PIXIGauge';
import * as PIXI from 'pixi.js';
 
require("./MilageGraphTexture.json");
require("./MilageGraphTexture.png");
require("../fonts/font.css");
require("../fonts/GNU-Freefonts/FreeSansBold.otf");

require("./MilageGraphFont_45px.fnt");
require("./MilageGraphFont_45px_0.png");
require("./MilageGraphFont_68px.fnt");
require("./MilageGraphFont_68px_0.png");

export class MilageGraphPanel extends PIXI.Container
{
    private momentGasMilageBar: RectangularProgressBar = new RectangularProgressBar();
    private sectGasMilageBar: {[spankey : string] : RectangularProgressBar } = {};
    private tripLabel: PIXI.extras.BitmapText;
    private fuelLabel: PIXI.extras.BitmapText;
    private gasMilageLabel: PIXI.extras.BitmapText;

    private momentGasMilage : number = 0;
    private trip : number = 0;
    private fuel : number = 0;
    private gasMilage : number = 0;
    private sectGasMilage : {[spankey : string] : number } = {};

    private sectSpan : string[] = ["5min","10min","15min", "20min", "25min", "30min"];

    static get RequestedTexturePath() : string[]
    {
        return ["img/MilageGraphTexture.json", "img/MilageGraphFont_45px.fnt", "img/MilageGraphFont_68px.fnt"];
    }

    static get RequestedFontFamily() : string[]
    {
        return ["FreeSans-Bold"]
    }

    static get RequestedFontCSSURL() : string[]
    {
        return ['font.css'];
    }

    public get MomentGasMilage(): number { return this.momentGasMilage }
    public set MomentGasMilage(val: number)
    {
        this.momentGasMilage = val;
        this.momentGasMilageBar.Value = val;
        this.momentGasMilageBar.update();
    }

    public get Fuel() : number { return this.fuel };
    public set Fuel(val : number)
    {
        this.fuel = val;
        this.fuelLabel.text = this.fuel.toFixed(2)
    }

    public get Trip() : number { return this.trip };
    public set Trip(val : number )
    {
        this.trip = val;
        this.tripLabel.text = this.trip.toFixed(1);
    }

    public get GasMilage(): number {return this.gasMilage}
    public set GasMilage(val : number)
    {
        this.gasMilage = val;
        this.gasMilageLabel.text = this.gasMilage.toFixed(1);
    }

    public setSectGasMllage(sectspan : string, gasMilage : number) : void
    {
        this.sectGasMilage[sectspan] = gasMilage;
        this.sectGasMilageBar[sectspan].Value = this.sectGasMilage[sectspan];
        this.sectGasMilageBar[sectspan].update();
    }
    public getSectGasMllage(sectspan : string) : number
    {
        return this.sectGasMilage[sectspan];
    }

    constructor()
    {
        super();
        //Initialize array fields
        for (let span in this.sectSpan)
        {
            this.sectGasMilageBar[span] = new RectangularProgressBar();
            this.sectGasMilage[span] = 0;
        }
        this.create();
    }

    private create()
    {
        const backTexture = PIXI.Texture.fromFrame("MilageGraph_Back");
        const backSprite = new PIXI.Sprite(backTexture);
        super.addChild(backSprite);

        const momentGasMilageTexture = PIXI.Texture.fromFrame("MilageGraph_valueBar2");
        this.momentGasMilageBar.Texture = momentGasMilageTexture;
        this.momentGasMilageBar.Vertical = true;
        this.momentGasMilageBar.MaskWidth = 40;
        this.momentGasMilageBar.MaskHeight = 240;
        this.momentGasMilageBar.Max = 20;
        this.momentGasMilageBar.Min = 0;
        this.momentGasMilageBar.position.set(411,17);
        super.addChild(this.momentGasMilageBar);

        //Sect fuelTrip progressbar
        const sectGasMilageBarTexture = PIXI.Texture.fromFrame("MilageGraph_valueBar1");
        for (let i = 0; i < this.sectSpan.length; i++)
        {
            const spankey: string = this.sectSpan[i];
            this.sectGasMilageBar[spankey] = new RectangularProgressBar();
            this.sectGasMilageBar[spankey].Texture = sectGasMilageBarTexture;
            this.sectGasMilageBar[spankey].Vertical = true;
            this.sectGasMilageBar[spankey].MaskWidth = 30;
            this.sectGasMilageBar[spankey].MaskHeight = 240;
            this.sectGasMilageBar[spankey].Max = 20;
            this.sectGasMilageBar[spankey].Min = 0;
            super.addChild(this.sectGasMilageBar[spankey]);
        }
        this.sectGasMilageBar["30min"].position.set(72,17);
        this.sectGasMilageBar["25min"].position.set(130,17);
        this.sectGasMilageBar["20min"].position.set(187,17);
        this.sectGasMilageBar["15min"].position.set(245,17);
        this.sectGasMilageBar["10min"].position.set(303,17);
        this.sectGasMilageBar["5min"].position.set(360,17);
        
        this.tripLabel = new PIXI.extras.BitmapText("0.0", { font : "FreeSans_45px", align : "right"});
        this.tripLabel.anchor = new PIXI.Point(1,1);
        this.tripLabel.position.set(610,115);
        super.addChild(this.tripLabel);

        this.fuelLabel = new PIXI.extras.BitmapText("0.00", { font : "FreeSans_45px", align : "right"});
        this.fuelLabel.anchor = new PIXI.Point(1,1);
        this.fuelLabel.position.set(610,170);
        super.addChild(this.fuelLabel);

        this.gasMilageLabel = new PIXI.extras.BitmapText("0.00", { font : "FreeSans_68px", align : "right"});
        this.gasMilageLabel.anchor = new PIXI.Point(1,1);
        this.gasMilageLabel.position.set(625, 270); 
        super.addChild(this.gasMilageLabel);
    }
}