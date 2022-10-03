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

import { FullCircularGaugePanel } from "./private/FullCircularGaugePanelBase"
import { FullCircularGaugePanelOption } from "./private/FullCircularGaugePanelBase"

export { FullCircularGaugePanel } from "./private/FullCircularGaugePanelBase"

export class FullCircularGaugePanelPresets {
    public static async BoostGaugePanel() {
        const options = new FullCircularGaugePanelOption();

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
            ["-1.0",
                "-0.5",
                "0",
                "+0.5",
                "+1.0",
                "+1.5",
                "+2.0"
            ];

        return await FullCircularGaugePanel.create(options);
    }

    public static async VacuumGaugePanel() {

        const options = new FullCircularGaugePanelOption();

        options.TitleLabel = "Manifold pres.";
        options.UnitLabel = "x100kPa";
        options.Min = -1.0;
        options.Max = 0.5;
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
            ["-1.0",
                "-0.75",
                "-0.5",
                "-0.25",
                "+0",
                "+0.25",
                "+0.5"
            ];

        return await FullCircularGaugePanel.create(options);
    }

    public static async AirFuelGaugePanel() {
        const options = new FullCircularGaugePanelOption();

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
        options.UnitLabel = "A/F";
        options.ValueNumberRoundDigit = 1;
        options.AxisLabel =
            ["20",
                "18",
                "16",
                "14",
                "12",
                "10",
                "8"
            ];

        return await FullCircularGaugePanel.create(options);
    }

    public static async WaterTempGaugePanel() {
        const options = new FullCircularGaugePanelOption();

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
            ["0",
                "20",
                "40",
                "60",
                "80",
                "100",
                "120"
            ];

        return await FullCircularGaugePanel.create(options);
    }

    public static async EngineOilTempGaugePanel() {
        const options = new FullCircularGaugePanelOption();

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
            ["30",
                "50",
                "70",
                "90",
                "110",
                "130",
                "150"
            ];

        return await FullCircularGaugePanel.create(options);
    }

    public static async BatteryVoltageGaugePanel() {
        const options = new FullCircularGaugePanelOption();

        options.TitleLabel = "BATTERY VOLT";
        options.UnitLabel = "V";
        options.Min = 9;
        options.Max = 15;
        options.RedZoneBarEnable = false;
        options.YellowZoneBarEnable = false;
        options.GreenZoneBarEnable = false;
        options.ValueNumberRoundDigit = 1;

        options.AxisLabel =
            ["9",
                "10",
                "11",
                "12",
                "13",
                "14",
                "15"
            ];

        return await FullCircularGaugePanel.create(options);
    }

    public static async MassAirFlowGaugePanel() {
        const options = new FullCircularGaugePanelOption();

        options.TitleLabel = "MASS AIRFLOW";
        options.UnitLabel = "x10g/s";
        options.Min = 0;
        options.Max = 50;
        options.RedZoneBarEnable = false;
        options.YellowZoneBarEnable = false;
        options.GreenZoneBarEnable = false;
        options.ValueNumberRoundDigit = 0;

        options.AxisLabel =
            ["0",
                "10",
                "20",
                "30",
                "40",
                "50",
                "60"
            ];

        return await FullCircularGaugePanel.create(options);
    }

    public static async EngineLoadGaugePanel() {
        const options = new FullCircularGaugePanelOption();

        options.TitleLabel = "ENGINE LOAD";
        options.UnitLabel = "%";
        options.Min = 0;
        options.Max = 100;
        options.RedZoneBarEnable = false;
        options.YellowZoneBarEnable = false;
        options.GreenZoneBarEnable = false;
        options.ValueNumberRoundDigit = 0;
        options.GaugeDrawValConversionFunc = x => x < 20 ? 1.6666 * x : 0.833 * x + 16.666;
        options.AxisLabel =
            ["0",
                "10",
                "20",
                "40",
                "60",
                "80",
                "100"
            ];

        return await FullCircularGaugePanel.create(options);
    }

    public static async IntakeAirTemperatureGaugePanel() {
        const options = new FullCircularGaugePanelOption();

        options.TitleLabel = "INTAKE TEMP.";
        options.UnitLabel = "degC";
        options.Min = 0;
        options.Max = 120;
        options.RedZoneBarEnable = true;
        options.YellowZoneBarEnable = true;
        options.GreenZoneBarEnable = true;
        options.RedZoneBarOffsetAngle = 292.5;
        options.YellowZoneBarOffsetAngle = 247.5;
        options.GreenZoneBarOffsetAngle = 90;
        options.RedZoneBarFullAngle = 67.5;
        options.YellowZoneBarFullAngle = 45;
        options.GreenZoneBarFullAngle = 90;
        options.ValueNumberRoundDigit = 0;
        options.AxisLabel =
            ["0",
                "20",
                "40",
                "60",
                "80",
                "100",
                "120"
            ];

        return await FullCircularGaugePanel.create(options);
    }
}
