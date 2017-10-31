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
        options.RedZoneBarFullAngle = 42;
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
        options.GaugeFullOnValueMin = true;
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

export class WaterTempGaugePanel extends FullCircularGaugePanelBase
{
    constructor()
    {
        let options = new FullCircularGaugePanelOptionsBase();
        
        options.TitleLabel = "WATER TEMP";
        options.UnitLabel = "degC";
        options.Min = 0;
        options.Max = 120;
        options.RedZoneBarEnable = true;
        options.YellowZoneBarEnable = true;
        options.GreenZoneBarEnable = false;
        options.RedZoneBarOffsetAngle = 315;
        options.YellowZoneBarOffsetAngle = 292.5;
        options.RedZoneBarFullAngle = 42;
        options.YellowZoneBarFullAngle = 22.5;
        options.ValueNumberRoundDigit = 0;
        
        options.AxisLabel = 
        [   "0",
            "20",
            "40",
            "60",
            "80",
            "100",
            "120"
        ];
        
        super(options);
    }
}

export class EngineOilTempGaugePanel extends FullCircularGaugePanelBase
{
    constructor()
    {
        let options = new FullCircularGaugePanelOptionsBase();
        
        options.TitleLabel = "ENG. OIL TEMP";
        options.UnitLabel = "degC";
        options.Min = 30;
        options.Max = 150;
        options.RedZoneBarEnable = true;
        options.YellowZoneBarEnable = true;
        options.GreenZoneBarEnable = false;
        options.RedZoneBarOffsetAngle = 315;
        options.YellowZoneBarOffsetAngle = 292.5;
        options.RedZoneBarFullAngle = 42;
        options.YellowZoneBarFullAngle = 22.5;
        options.ValueNumberRoundDigit = 0;
        
        options.AxisLabel = 
        [   "30",
            "50",
            "70",
            "90",
            "110",
            "130",
            "150"
        ];
        
        super(options);
    }
}

export class  BatteryVoltageGaugePanel extends FullCircularGaugePanelBase
{
    constructor()
    {
        let options = new FullCircularGaugePanelOptionsBase();
        
        options.TitleLabel = "BATTERY VOLT";
        options.UnitLabel = "V";
        options.Min = 9;
        options.Max = 15;
        options.RedZoneBarEnable = false;
        options.YellowZoneBarEnable = false;
        options.GreenZoneBarEnable = false;
        options.ValueNumberRoundDigit = 1;
        
        options.AxisLabel = 
        [   "9",
            "10",
            "11",
            "12",
            "13",
            "14",
            "15"
        ];
        
        super(options);
    }
}

export class  MassAirFlowGaugePanel extends FullCircularGaugePanelBase
{
    constructor()
    {
        let options = new FullCircularGaugePanelOptionsBase();
        
        options.TitleLabel = "MASS AIRFLOW";
        options.UnitLabel = "x10g/s";
        options.Min = 0;
        options.Max = 50;
        options.RedZoneBarEnable = false;
        options.YellowZoneBarEnable = false;
        options.GreenZoneBarEnable = false;
        options.ValueNumberRoundDigit = 0;
        
        options.AxisLabel = 
        [   "0",
            "10",
            "20",
            "30",
            "40",
            "50",
            "60"
        ];
        
        super(options);
    }
}