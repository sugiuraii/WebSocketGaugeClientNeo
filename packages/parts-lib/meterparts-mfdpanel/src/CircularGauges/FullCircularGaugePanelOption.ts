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

import { TextOption } from './private/CircularGaugePanelBase';
import { CircularGaugePanelOptionBase } from './private/CircularGaugePanelBase';
import * as PIXI from 'pixi.js';

export class FullCircularGaugePanelOption extends CircularGaugePanelOptionBase {
    constructor() {
        super();
        this.setOption();
    }

    private setOption(): void {
        this.RedZoneBarTextureName = "FullCircularGauge_layer_redzone_bar.png";
        this.YellowZoneBarTextureName = "FullCircularGauge_layer_yellowzone_bar.png";
        this.GreenZoneBarTextureName = "FullCircularGauge_layer_greenzone_bar.png";
        this.ValueBarTextureName = "FullCircularGauge_layer_valuebar.png";
        this.BackTextureName = "FullCircularGauge_layer_back.png";
        this.GridTextureName = "FullCircularGauge_layer_grid.png";

        this.MasterTextStyle = new PIXI.TextStyle(
            {
                dropShadow: {blur: 15, color: "#FFFFFF", distance: 0},
                padding: 15,
                fill: "white",
                fontFamily: "Freesansbold"
            });
        this.OffsetAngle = 90;
        this.FullAngle = 270;
        this.Min = 0;
        this.Max = 270;
        this.AngleStep = 0.1;

        this.ValueBarRadius = 150;
        this.ValueBarInnerRadius = 50;
        this.ValueTextLabelOption.position.set(200, 185);
        this.ValueTextLabelOption.position.set(200, 185);
        this.ValueTextLabelOption.anchor.set(0.5, 0.5);
        this.ValueTextLabelOption.align = "center";

        this.ZoneBarRadius = 200;
        this.CenterPosition.set(200, 200);

        this.TitleLabel = "ANGLE";
        this.TitleLabelOption = new TextOption(new PIXI.Point(200, 370), new PIXI.Point(0.5, 0.5), "center", 38);
        this.UnitLabel = "deg";
        this.UnitLabelOption = new TextOption(new PIXI.Point(200, 235), new PIXI.Point(0.5, 0.5), "center", 23);
        this.ValueNumberRoundDigit = 0;

        this.RedZoneBarEnable = true;
        this.YellowZoneBarEnable = true;
        this.GreenZoneBarEnable = true;
        this.RedZoneBarOffsetAngle = 315;
        this.YellowZoneBarOffsetAngle = 270;
        this.GreenZoneBarOffsetAngle = 90;
        this.RedZoneBarFullAngle = 40;
        this.YellowZoneBarFullAngle = 45;
        this.GreenZoneBarFullAngle = 90;

        const axisLabelFontSize = 30;
        this.AxisLabel =
            ["0",
                "45",
                "90",
                "135",
                "180",
                "225",
                "270"
            ];
        this.AxisLabelOption =
            [
                new TextOption(new PIXI.Point(207, 335), new PIXI.Point(0, 0.5), "left", axisLabelFontSize),
                new TextOption(new PIXI.Point(90, 310), new PIXI.Point(1, 0.5), "right", axisLabelFontSize),
                new TextOption(new PIXI.Point(45, 193), new PIXI.Point(1, 0.5), "right", axisLabelFontSize),
                new TextOption(new PIXI.Point(90, 75), new PIXI.Point(1, 0.5), "right", axisLabelFontSize),
                new TextOption(new PIXI.Point(200, 40), new PIXI.Point(0.5, 1), "center", axisLabelFontSize),
                new TextOption(new PIXI.Point(310, 75), new PIXI.Point(0, 0.5), "left", axisLabelFontSize),
                new TextOption(new PIXI.Point(340, 195), new PIXI.Point(0.5, 0), "center", axisLabelFontSize)
            ];
    }
}


