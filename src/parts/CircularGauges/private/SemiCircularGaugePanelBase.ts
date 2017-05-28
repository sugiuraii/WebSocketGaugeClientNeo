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

import {CircularGaugePanelBase} from './CircularGaugePanelBase';
import {TextOption} from './CircularGaugePanelBase';

require("./SemiCircularGaugeTexture.json");
require("./SemiCircularGaugeTexture.png");
require("../../fonts/font.css");
require("../../fonts/GNU-Freefonts/FreeSansBold.otf");

require("./CircularGaugeLabelFont.fnt");
require("./CircularGaugeLabelFont_0.png");

export class SemiCircularGaugePanelBase extends CircularGaugePanelBase
{
    static get RequestedTexturePath() : string[]
    {
        return ["img/SemiCircularGaugeTexture.json", "img/CircularGaugeLabelFont.fnt"];
    }

    static get RequestedFontFamily() : string[]
    {
        return ["FreeSans-Bold"]
    }

    static get RequestedFontCSSURL() : string[]
    {
        return ['font.css'];
    }

    protected setOption() : void
    {
        this.RedZoneBarTexture = PIXI.Texture.fromFrame("SemiCircular_Gauge1_Redzone_Bar");
        this.YellowZoneBarTexture = PIXI.Texture.fromFrame("SemiCircular_Gauge1_Yellowzone_Bar");
        this.GreenZoneBarTexture = PIXI.Texture.fromFrame("SemiCircular_Gauge1_Greenzone_Bar");
        this.ValueBarTexture = PIXI.Texture.fromFrame("SemiCircular_Gauge1_Value_Bar");
        this.BackTexture = PIXI.Texture.fromFrame("SemiCircular_Gauge1_Back");
        this.GridTexture = PIXI.Texture.fromFrame("SemiCircular_Gauge1_Grid");

        this.masterTextStyle = new PIXI.TextStyle(
        {
            dropShadow : true,
            dropShadowBlur: 15,
            padding : 15,
            dropShadowColor: "white",
            dropShadowDistance: 0,
            fill : "white",
            fontFamily: "FreeSans-Bold"
        });
        this.offsetAngle = 180;
        this.fullAngle = 180;
        this.min = 0;
        this.max = 180;
        this.angleStep = 0.1;

        this.valueBarRadius = 200;
        this.valueBarInnerRadius = 0;        
        this.valueTextLabelOption.position.set(200,185);
        this.valueTextLabelOption.position.set(200,185);
        this.valueTextLabelOption.anchor.set(0.5,0.5);
        this.valueTextLabelOption.align = "center";

        this.zoneBarRadius = 200;        
        this.centerPosition.set(200,195);

        this.titleLabel = "ANGLE";
        this.titleLabelOption = new TextOption(new PIXI.Point(200, 266), new PIXI.Point(0.5, 0.5), "center", 42);
        this.unitLabel = "deg";
        this.unitLabelOption = new TextOption(new PIXI.Point(200, 235), new PIXI.Point(0.5, 0.5), "center", 23);
        this.valueNumberRoundDigit = 0;

        this.redZoneBarEnable = true;
        this.yellowZoneBarEnable = true;
        this.greenZoneBarEnable = true;
        this.redZoneBarOffsetAngle = 315;
        this.redZoneBarFullAngle = 45;
        this.yellowZoneBarOffsetAngle = 270;
        this.yellowZoneBarFullAngle = 45;
        this.greenZoneBarOffsetAngle = 180;
        this.greenZoneBarFullAngle = 45;

        const axisLabelFontSize = 38;
        this.setAxisLabel(
        [   "0",
            "45",
            "90",
            "135",
            "180",
        ]);
        this.setAxisLabelOption(
        [
            new TextOption(new PIXI.Point(60, 195), new PIXI.Point(0.5, 0), "center", axisLabelFontSize),
            new TextOption(new PIXI.Point(90, 75), new PIXI.Point(1, 0.5), "right", axisLabelFontSize),
            new TextOption(new PIXI.Point(200, 40), new PIXI.Point(0.5, 1), "center", axisLabelFontSize),
            new TextOption(new PIXI.Point(310, 75), new PIXI.Point(0, 0.5), "left", axisLabelFontSize),
            new TextOption(new PIXI.Point(340, 195), new PIXI.Point(0.5, 0), "center", axisLabelFontSize)                
        ]);
    }
}

