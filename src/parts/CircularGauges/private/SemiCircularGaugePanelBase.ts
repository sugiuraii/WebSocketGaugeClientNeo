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

import { CircularGaugePanelBase } from './CircularGaugePanelBase';
import { TextOption } from './CircularGaugePanelBase';
import { CircularGaugePanelOptionBase } from './CircularGaugePanelBase';
import * as PIXI from 'pixi.js';

require("./SemiCircularGaugeTexture.json");
require("./SemiCircularGaugeTexture.png");
require("../../fonts/font.css");
require("../../fonts/GNU-Freefonts/FreeSansBold.otf");

require("./CircularGaugeLabelFont.fnt");
require("./CircularGaugeLabelFont_0.png");

export class SemiCircularGaugePanelOptionBase extends CircularGaugePanelOptionBase {
    constructor() {
        super();
        this.setOption();
    }

    private setOption(): void {
        this.RedZoneBarTexture = PIXI.Texture.from("SemiCircular_Gauge1_Redzone_Bar");
        this.YellowZoneBarTexture = PIXI.Texture.from("SemiCircular_Gauge1_Yellowzone_Bar");
        this.GreenZoneBarTexture = PIXI.Texture.from("SemiCircular_Gauge1_Greenzone_Bar");
        this.ValueBarTexture = PIXI.Texture.from("SemiCircular_Gauge1_Value_Bar");
        this.BackTexture = PIXI.Texture.from("SemiCircular_Gauge1_Back");
        this.GridTexture = PIXI.Texture.from("SemiCircular_Gauge1_Grid");

        this.MasterTextStyle = new PIXI.TextStyle(
            {
                dropShadow: true,
                dropShadowBlur: 15,
                padding: 15,
                dropShadowColor: "#FFFFFF",
                dropShadowDistance: 0,
                fill: "white",
                fontFamily: "FreeSans-Bold"
            });
        this.OffsetAngle = 180;
        this.FullAngle = 180;
        this.Min = 0;
        this.Max = 180;
        this.AngleStep = 0.1;

        this.ValueBarRadius = 200;
        this.ValueBarInnerRadius = 0;
        this.ValueTextLabelOption.position.set(200, 185);
        this.ValueTextLabelOption.position.set(200, 185);
        this.ValueTextLabelOption.anchor.set(0.5, 0.5);
        this.ValueTextLabelOption.align = "center";

        this.ZoneBarRadius = 200;
        this.CenterPosition.set(200, 195);

        this.TitleLabel = "ANGLE";
        this.TitleLabelOption = new TextOption(new PIXI.Point(200, 266), new PIXI.Point(0.5, 0.5), "center", 42);
        this.UnitLabel = "deg";
        this.UnitLabelOption = new TextOption(new PIXI.Point(200, 235), new PIXI.Point(0.5, 0.5), "center", 23);
        this.ValueNumberRoundDigit = 0;

        this.RedZoneBarEnable = true;
        this.YellowZoneBarEnable = true;
        this.GreenZoneBarEnable = true;
        this.RedZoneBarOffsetAngle = 315;
        this.RedZoneBarFullAngle = 45;
        this.YellowZoneBarOffsetAngle = 270;
        this.YellowZoneBarFullAngle = 45;
        this.GreenZoneBarOffsetAngle = 180;
        this.GreenZoneBarFullAngle = 45;

        const axisLabelFontSize = 38;
        this.AxisLabel =
            ["0",
                "45",
                "90",
                "135",
                "180",
            ];
        this.AxisLabelOption =
            [
                new TextOption(new PIXI.Point(60, 195), new PIXI.Point(0.5, 0), "center", axisLabelFontSize),
                new TextOption(new PIXI.Point(90, 75), new PIXI.Point(1, 0.5), "right", axisLabelFontSize),
                new TextOption(new PIXI.Point(200, 40), new PIXI.Point(0.5, 1), "center", axisLabelFontSize),
                new TextOption(new PIXI.Point(310, 75), new PIXI.Point(0, 0.5), "left", axisLabelFontSize),
                new TextOption(new PIXI.Point(340, 195), new PIXI.Point(0.5, 0), "center", axisLabelFontSize)
            ];
    }
}

export class SemiCircularGaugePanelBase extends CircularGaugePanelBase {
    constructor(options: SemiCircularGaugePanelOptionBase) {
        super(options);
    }

    static get RequestedTexturePath(): string[] {
        return ["img/SemiCircularGaugeTexture.json", "img/CircularGaugeLabelFont.fnt"];
    }

    static get RequestedFontFamily(): string[] {
        return ["FreeSans-Bold"]
    }

    static get RequestedFontCSSURL(): string[] {
        return ['font.css'];
    }


}

