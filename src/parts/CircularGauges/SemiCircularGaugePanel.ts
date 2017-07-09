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

import {SemiCircularGaugePanelBase} from "./private/SemiCircularGaugePanelBase"

export class ThrottleGaugePanel extends SemiCircularGaugePanelBase
{
    protected setOption() : void
    {
        super.setOption();
        this.titleLabel = "THROTTLE";
        this.min = 0;
        this.max = 100;
        this.unitLabel = "%"
        this.redZoneBarEnable = false;
        this.yellowZoneBarEnable = false;
        this.greenZoneBarEnable = false;
        this.setAxisLabel(["0","25","50","75","100"]);
    }
}

export class WaterTempGaugePanel extends SemiCircularGaugePanelBase
{
    protected setOption() : void
    {
        super.setOption();
        this.titleLabel = "WATER TEMP";
        this.min = 40;
        this.max = 120;
        this.unitLabel = "degC"
        this.redZoneBarEnable = true;
        this.redZoneBarOffsetAngle = 315;
        this.redZoneBarFullAngle = 45;
        this.yellowZoneBarEnable = true;
        this.yellowZoneBarOffsetAngle = 292.5;
        this.yellowZoneBarFullAngle = 22.5;
        this.greenZoneBarEnable = false;
        this.setAxisLabel(["40","60","80","100","120"]);
    }
}

export class EngineOilTempGaugePanel extends SemiCircularGaugePanelBase
{
    protected setOption() : void
    {
        super.setOption();
        this.titleLabel = "ENG. OIL TEMP";
        this.min = 50;
        this.max = 150;
        this.unitLabel = "degC"
        this.redZoneBarEnable = true;
        this.redZoneBarOffsetAngle = 315;
        this.redZoneBarFullAngle = 45;
        this.yellowZoneBarEnable = true;
        this.yellowZoneBarOffsetAngle = 292.5;
        this.yellowZoneBarFullAngle = 22.5;
        this.greenZoneBarEnable = false;
        this.setAxisLabel(["50","75","100","125","150"]);
    }
}

export class BatteryVoltageGaugePanel extends SemiCircularGaugePanelBase
{
    protected setOption() : void
    {
        super.setOption();
        this.titleLabel = "BATTERY VOLT";
        this.min = 11;
        this.max = 15;
        this.unitLabel = "V"
        this.redZoneBarEnable = false;
        this.yellowZoneBarEnable = false;
        this.greenZoneBarEnable = false;
        this.setAxisLabel(["11","12","13","14","15"]);
        this.valueNumberRoundDigit = 1;
    }
}