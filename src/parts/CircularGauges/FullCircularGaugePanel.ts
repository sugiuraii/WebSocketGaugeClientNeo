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
