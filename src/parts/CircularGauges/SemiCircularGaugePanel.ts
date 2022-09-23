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

import { SemiCircularGaugePanel } from "./private/SemiCircularGaugePanelBase"
import { SemiCircularGaugePanelOptionBase } from "./private/SemiCircularGaugePanelBase"

export { SemiCircularGaugePanel } from "./private/SemiCircularGaugePanelBase"

export class SemiCircularGaugePanelPresets {
    public static async ThrottleGaugePanel() {
        const options = new SemiCircularGaugePanelOptionBase();

        options.TitleLabel = "THROTTLE";
        options.Min = 0;
        options.Max = 100;
        options.UnitLabel = "%"
        options.RedZoneBarEnable = false;
        options.YellowZoneBarEnable = false;
        options.GreenZoneBarEnable = false;
        options.AxisLabel = ["0", "25", "50", "75", "100"];

        return await SemiCircularGaugePanel.create(options);
    }

    public static async WaterTempGaugePanel() {
        const options = new SemiCircularGaugePanelOptionBase();

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
        options.AxisLabel = ["40", "60", "80", "100", "120"];

        return await SemiCircularGaugePanel.create(options);
    }

    public static async EngineOilTempGaugePanel() {
        const options = new SemiCircularGaugePanelOptionBase();

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
        options.AxisLabel = ["50", "75", "100", "125", "150"];

        return await SemiCircularGaugePanel.create(options);
    }

    public static async BatteryVoltageGaugePanel() {
        const options = new SemiCircularGaugePanelOptionBase();

        options.TitleLabel = "BATTERY VOLT";
        options.Min = 11;
        options.Max = 15;
        options.UnitLabel = "V"
        options.RedZoneBarEnable = false;
        options.YellowZoneBarEnable = false;
        options.GreenZoneBarEnable = false;
        options.AxisLabel = ["11", "12", "13", "14", "15"];
        options.ValueNumberRoundDigit = 1;

        return await SemiCircularGaugePanel.create(options);
    }

    public static async AirFuelGaugePanel() {
        const options = new SemiCircularGaugePanelOptionBase();

        options.TitleLabel = "Air/Fuel Ratio";
        options.Min = 10;
        options.Max = 18;
        options.RedZoneBarOffsetAngle = 315;
        options.RedZoneBarFullAngle = 45;
        options.YellowZoneBarOffsetAngle = 270;
        options.YellowZoneBarFullAngle = 45;
        options.GreenZoneBarOffsetAngle = 180;
        options.GreenZoneBarFullAngle = 90;
        options.GaugeFullOnValueMin = true;
        options.UnitLabel = "A/F";
        options.ValueNumberRoundDigit = 1;
        options.AxisLabel =
            [
                "18",
                "16",
                "14",
                "12",
                "10"
            ];

        return await SemiCircularGaugePanel.create(options);
    }

    public static async VacuumGaugePanel() {
        const options = new SemiCircularGaugePanelOptionBase();

        options.TitleLabel = "Manifold Pres.";
        options.UnitLabel = "x100kPa";
        options.Min = -1.5;
        options.Max = 0;
        options.RedZoneBarEnable = false;
        options.YellowZoneBarEnable = true;
        options.GreenZoneBarEnable = true;
        options.YellowZoneBarOffsetAngle = 315;
        options.YellowZoneBarFullAngle = 45;
        options.GreenZoneBarOffsetAngle = 180;
        options.GreenZoneBarFullAngle = 45;
        options.ValueNumberRoundDigit = 1;

        options.AxisLabel =
            [
                "-1.0",
                "-0.75",
                "-0.5",
                "-0.25",
                "0.0"
            ];

        return await SemiCircularGaugePanel.create(options);
    }

    public static async BoostGaugePanel() {
        const options = new SemiCircularGaugePanelOptionBase();

        options.TitleLabel = "TURBO BOOST";
        options.UnitLabel = "x100kPa";
        options.Min = -1.0;
        options.Max = 2.0;
        options.RedZoneBarEnable = true;
        options.YellowZoneBarEnable = true;
        options.GreenZoneBarEnable = true;
        options.RedZoneBarOffsetAngle = 337.5;
        options.RedZoneBarFullAngle = 22.5;
        options.YellowZoneBarOffsetAngle = 315;
        options.YellowZoneBarFullAngle = 22.5;
        options.GreenZoneBarOffsetAngle = 180;
        options.GreenZoneBarFullAngle = 90;
        options.ValueNumberRoundDigit = 1;
        options.GaugeDrawValConversionFunc = (v) => (v < 0) ? (1.5 * v + 0.5) : (0.75 * v + 0.5);
        options.AxisLabel =
            [
                "-1.0",
                "-0.5",
                "+0.0",
                "+1.0",
                "+2.0"
            ];

        return await SemiCircularGaugePanel.create(options);
    }

    public static async MassAirFlowGaugePanel() {
        const options = new SemiCircularGaugePanelOptionBase();

        options.TitleLabel = "MASS AIRFLOW";
        options.Min = 0;
        options.Max = 40;
        options.UnitLabel = "x10g/s"
        options.RedZoneBarEnable = false;
        options.YellowZoneBarEnable = false;
        options.GreenZoneBarEnable = false;
        options.AxisLabel = ["0", "10", "20", "30", "40"];
        options.ValueNumberRoundDigit = 0;

        return await SemiCircularGaugePanel.create(options);
    }

    public static async EngineLoadGaugePanel() {
        const options = new SemiCircularGaugePanelOptionBase();

        options.TitleLabel = "ENGINE LOAD";
        options.Min = 0;
        options.Max = 100;
        options.UnitLabel = "%"
        options.RedZoneBarEnable = false;
        options.YellowZoneBarEnable = false;
        options.GreenZoneBarEnable = false;
        options.AxisLabel = ["0", "25", "50", "75", "100"];
        options.ValueNumberRoundDigit = 0;

        return await SemiCircularGaugePanel.create(options);
    }

    public static async IntakeAirTemperaturePanel() {
        const options = new SemiCircularGaugePanelOptionBase();

        options.TitleLabel = "INTAKE TEMP.";
        options.Min = 0;
        options.Max = 100;
        options.UnitLabel = "degC"
        options.RedZoneBarEnable = true;
        options.YellowZoneBarEnable = true;
        options.GreenZoneBarEnable = true;
        options.RedZoneBarOffsetAngle = 337.5;
        options.RedZoneBarFullAngle = 22.5;
        options.YellowZoneBarOffsetAngle = 315;
        options.YellowZoneBarFullAngle = 22.5;
        options.GreenZoneBarOffsetAngle = 180;
        options.GreenZoneBarFullAngle = 90;
        options.AxisLabel = ["0", "25", "50", "75", "100"];
        options.ValueNumberRoundDigit = 0;

        return await SemiCircularGaugePanel.create(options);
    }
}