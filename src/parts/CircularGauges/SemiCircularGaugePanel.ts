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
import {SemiCircularGaugePanelOptionBase} from "./private/SemiCircularGaugePanelBase"

export class ThrottleGaugePanel extends SemiCircularGaugePanelBase
{
    constructor()
    {
        let options = new SemiCircularGaugePanelOptionBase();
        
        options.TitleLabel = "THROTTLE";
        options.Min = 0;
        options.Max = 100;
        options.UnitLabel = "%"
        options.RedZoneBarEnable = false;
        options.YellowZoneBarEnable = false;
        options.GreenZoneBarEnable = false;
        options.AxisLabel = ["0","25","50","75","100"];
        
        super(options);
    }
}

export class WaterTempGaugePanel extends SemiCircularGaugePanelBase
{
    constructor()
    {
        let options = new SemiCircularGaugePanelOptionBase();
        
        options.TitleLabel = "WATER TEMP";
        options.Min = 40;
        options.Max = 120;
        options.UnitLabel = "degC"
        options.RedZoneBarEnable = true;
        options.RedZoneBarOffsetAngle = 315;
        options.RedZoneBarFullAngle = 45;
        options.YellowZoneBarEnable = true;
        options.YellowZoneBarOffsetAngle = 292.5;
        options.YellowZoneBarFullAngle = 22.5;
        options.GreenZoneBarEnable = false;
        options.AxisLabel = ["40","60","80","100","120"];
        
        super(options);
    }
}

export class EngineOilTempGaugePanel extends SemiCircularGaugePanelBase
{
    constructor()
    {
        let options = new SemiCircularGaugePanelOptionBase();
        
        options.TitleLabel = "ENG. OIL TEMP";
        options.Min = 50;
        options.Max = 150;
        options.UnitLabel = "degC"
        options.RedZoneBarEnable = true;
        options.RedZoneBarOffsetAngle = 315;
        options.RedZoneBarFullAngle = 45;
        options.YellowZoneBarEnable = true;
        options.YellowZoneBarOffsetAngle = 292.5;
        options.YellowZoneBarFullAngle = 22.5;
        options.GreenZoneBarEnable = false;
        options.AxisLabel = ["50","75","100","125","150"];
                
        super(options);
    }
}

export class BatteryVoltageGaugePanel extends SemiCircularGaugePanelBase
{
    constructor()
    {
        let options = new SemiCircularGaugePanelOptionBase();
        
        options.TitleLabel = "BATTERY VOLT";
        options.Min = 11;
        options.Max = 15;
        options.UnitLabel = "V"
        options.RedZoneBarEnable = false;
        options.YellowZoneBarEnable = false;
        options.GreenZoneBarEnable = false;
        options.AxisLabel = ["11","12","13","14","15"];
        options.ValueNumberRoundDigit = 1;
        
        super(options);
    }
}