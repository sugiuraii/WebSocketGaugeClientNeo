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

export class BoostGaugePanel extends FullCircularGaugePanelBase
{
    protected setOption() : void
    {
        super.setOption();
        this.titleLabel = "TURBO BOOST";
        this.unitLabel = "x100kPa";
        this.min = -1.0;
        this.max = 2.0;
        this.redZoneBarEnable = true;
        this.yellowZoneBarEnable = true;
        this.greenZoneBarEnable = true;
        this.redZoneBarOffsetAngle = 315;
        this.yellowZoneBarOffsetAngle = 270;
        this.greenZoneBarOffsetAngle = 90;
        this.redZoneBarFullAngle = 40;
        this.yellowZoneBarFullAngle = 45;
        this.greenZoneBarFullAngle = 90;
        this.valueNumberRoundDigit = 1;
        
        this.setAxisLabel(
        [   "-1.0",
            "-0.5",
            "0",
            "+0.5",
            "+1.0",
            "+1.5",
            "+2.0"
        ]);
    }
}

export class AirFuelGaugePanel extends FullCircularGaugePanelBase
{
    protected setOption() : void
    {
        super.setOption();
        this.titleLabel = "Air/Fuel Ratio";
        this.min = 8;
        this.max = 20;
        this.redZoneBarOffsetAngle = 315;
        this.redZoneBarFullAngle = 45;
        this.yellowZoneBarOffsetAngle = 225;
        this.yellowZoneBarFullAngle = 90;
        this.greenZoneBarOffsetAngle = 135;
        this.greenZoneBarFullAngle = 90;
        this.invertDraw = true;
        this.unitLabel="A/F";
        this.valueNumberRoundDigit = 1;
        this.setAxisLabel(
        [   "20",
            "18",
            "16",
            "14",
            "12",
            "10",
            "8"
        ]);
    }
}
