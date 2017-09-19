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

import {FullCircularGaugePanelBase} from "./private/FullCircularGaugePanelBase"
import {FullCircularGaugePanelOptionsBase} from "./private/FullCircularGaugePanelBase"

export class BoostGaugePanel extends FullCircularGaugePanelBase
{
    constructor()
    {
        let options = new FullCircularGaugePanelOptionsBase();
        
        options.TitleLabel = "TURBO BOOST";
        options.UnitLabel = "x100kPa";
        options.Min = -1.0;
        options.Max = 2.0;
        options.RedZoneBarEnable = true;
        options.YellowZoneBarEnable = true;
        options.GreenZoneBarEnable = true;
        options.RedZoneBarOffsetAngle = 315;
        options.YellowZoneBarOffsetAngle = 270;
        options.GreenZoneBarOffsetAngle = 90;
        options.RedZoneBarFullAngle = 40;
        options.YellowZoneBarFullAngle = 45;
        options.GreenZoneBarFullAngle = 90;
        options.ValueNumberRoundDigit = 1;
        
        options.AxisLabel = 
        [   "-1.0",
            "-0.5",
            "0",
            "+0.5",
            "+1.0",
            "+1.5",
            "+2.0"
        ];
        
        super(options);
    }
}

export class AirFuelGaugePanel extends FullCircularGaugePanelBase
{
    constructor()
    {
        let options = new FullCircularGaugePanelOptionsBase();

        options.TitleLabel = "Air/Fuel Ratio";
        options.Min = 8;
        options.Max = 20;
        options.RedZoneBarOffsetAngle = 315;
        options.RedZoneBarFullAngle = 45;
        options.YellowZoneBarOffsetAngle = 225;
        options.YellowZoneBarFullAngle = 90;
        options.GreenZoneBarOffsetAngle = 135;
        options.GreenZoneBarFullAngle = 90;
        options.InvertDraw = true;
        options.UnitLabel="A/F";
        options.ValueNumberRoundDigit = 1;
        options.AxisLabel = 
        [   "20",
            "18",
            "16",
            "14",
            "12",
            "10",
            "8"
        ];
        
        super(options);
    }
}
