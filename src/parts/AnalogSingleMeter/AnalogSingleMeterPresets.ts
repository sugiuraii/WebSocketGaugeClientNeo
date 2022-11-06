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

import { AnalogSingleMeter } from './AnalogSingleMeter';
import { AnalogSingleMeterOption } from './AnalogSingleMeterOption';

export class AnalogSingleMeterPresets {
    public static async BoostMeter() {
        const option = new AnalogSingleMeterOption();
        return await AnalogSingleMeter.create(option);
    }

    public static async RevMeter() {
        const option = new AnalogSingleMeterOption();
        option.Max = 12000;
        option.Min = 0;
        option.Title = "Rev";
        option.Unit = "x1000rpm";
        option.ScaleLabel = ["0", "2", "4", "6", "8", "10", "12"];
        return await AnalogSingleMeter.create(option);
    }

    public static async VacuumMeter() {
        const option = new AnalogSingleMeterOption();
        option.Max = +0.5;
        option.Min = -1.0;
        option.Title = "Vacuum";
        option.Unit = "x100kPa";
        option.ScaleLabel = ["-1.0", "-0.75", "-0.5", "-0.25", "0.0", "0.25", "0.50"];
        return await AnalogSingleMeter.create(option);
    }

    public static async WaterTempMeter() {
        const option = new AnalogSingleMeterOption();
        option.Min = 20;
        option.Max = 140;
        option.Title = "Water";
        option.Unit = "degC";
        option.ScaleLabel = ["20", "40", "60", "80", "100", "120", "140"];
        return await AnalogSingleMeter.create(option);

    }

    public static async OilTempMeter() {
        const option = new AnalogSingleMeterOption();
        option.Min = 40;
        option.Max = 160;
        option.Title = "OilTemp";
        option.Unit = "degC";
        option.ScaleLabel = ["40", "60", "80", "100", "120", "140", "160"];
        return await AnalogSingleMeter.create(option);
    }

    public static async BatteryVoltageMeter() {
        const option = new AnalogSingleMeterOption();
        option.Min = 6;
        option.Max = 18;
        option.Title = "Voltage";
        option.Unit = "Volt";
        option.ScaleLabel = ["6", "8", "10", "12", "14", "16", "18"];
        return await AnalogSingleMeter.create(option);
    }

    public static async OilPressureMeter() {
        const option = new AnalogSingleMeterOption();
        option.Min = 0;
        option.Max = 12;
        option.Title = "OilPres.";
        option.Unit = "x100kPa";
        option.ScaleLabel = ["0", "2", "4", "6", "8", "10", "12"];
        return await AnalogSingleMeter.create(option);        
    }

    public static async MassAirFlowMeter() {
        const option = new AnalogSingleMeterOption();
        option.Min = 0;
        option.Max = 60;
        option.Title = "Mass airflow";
        option.Unit = "x10kg/s";
        option.ScaleLabel = ["0", "10", "20", "30", "40", "50", "60"];
        return await AnalogSingleMeter.create(option);  
    }

    public static async AirFuelRatioMeter() {
        const option = new AnalogSingleMeterOption();
        option.Min = 10;
        option.Max = 22;
        option.Title = "A/F ratio";
        option.Unit = "A/F";
        option.ScaleLabel = ["10", "12", "14", "16", "18", "20", "22"];
        return await AnalogSingleMeter.create(option);        
    }

    public static async EngineLoadMeter() {
        const option = new AnalogSingleMeterOption();
        option.Min = 0;
        option.Max = 100;
        option.Title = "Engine Load";
        option.Unit = "percent";
        option.GaugeDrawValConversionFunc = x => x < 20 ? 1.6666 * x : 0.833 * x + 16.666;
        option.ScaleLabel = ["0", "10", "20", "40", "60", "80", "100"];
        return await AnalogSingleMeter.create(option);        
    }

    public static async IntakeAirTemperatureMeter() {    
        const option = new AnalogSingleMeterOption();
        option.Min = 0;
        option.Max = 120;
        option.Title = "Intake temp.";
        option.Unit = "degC";
        option.ScaleLabel = ["0", "20", "40", "60", "80", "100", "120"];
        return await AnalogSingleMeter.create(option);        
    }
}
