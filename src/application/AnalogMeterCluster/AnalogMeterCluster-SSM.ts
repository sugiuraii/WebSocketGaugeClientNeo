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

//Import application base class
import {MeterApplication} from "../../lib/MeterAppBase/MeterApplication";
import {MeterApplicationOption} from "../../lib/MeterAppBase/options/MeterApplicationOption";

//Import meter parts
import {AnalogMeterCluster} from "../../parts/AnalogMeterCluster/AnalogMeterCluster";

//Import enumuator of parameter code
import {SSMParameterCode} from "../../lib/WebSocket/WebSocketCommunication";
import {SSMSwitchCode} from "../../lib/WebSocket/WebSocketCommunication";
import {ReadModeCode} from "../../lib/WebSocket/WebSocketCommunication";

import {calculateGearPosition} from "../../lib/MeterAppBase/utils/CalculateGearPosition";
import { SSMSwitchCodeToParameterCode } from "../../lib/WebSocket/private/parameterCode/SSMSwitchCode";

//For including entry point html file in webpack
require("./AnalogMeterCluster-SSM.html");

window.onload = function()
{
    const meterapp = new AnalogMeterCluster_SSM();
    meterapp.Start();
}

class AnalogMeterCluster_SSM
{
    public Start()
    {
        const appOption = new MeterApplicationOption();
        appOption.width = 1100;
        appOption.height = 600;
        appOption.PreloadResource.WebFontFamiliyName.addall(AnalogMeterCluster.RequestedFontFamily);
        appOption.PreloadResource.WebFontCSSURL.addall(AnalogMeterCluster.RequestedFontCSSURL);
        appOption.PreloadResource.TexturePath.addall(AnalogMeterCluster.RequestedTexturePath);

        appOption.WebsocketEnableFlag.SSM = true;
        appOption.WebsocketEnableFlag.FUELTRIP = true;

        appOption.ParameterCode.SSM.addall({code : SSMParameterCode.Engine_Speed, readmode : ReadModeCode.SLOWandFAST});
        appOption.ParameterCode.SSM.addall({code : SSMParameterCode.Manifold_Absolute_Pressure, readmode : ReadModeCode.SLOWandFAST});
        appOption.ParameterCode.SSM.addall({code : SSMParameterCode.Vehicle_Speed, readmode : ReadModeCode.SLOWandFAST});
        appOption.ParameterCode.SSM.addall({code : SSMParameterCode.Coolant_Temperature, readmode : ReadModeCode.SLOW});
        appOption.ParameterCode.SSM.addall({code : SSMSwitchCodeToParameterCode(SSMSwitchCode.Neutral_Position_Switch), readmode : ReadModeCode.SLOWandFAST});

        appOption.SetupPIXIMeterPanel = (app, ws) =>
        {
            const stage = app.stage;
            const meterCluster = new AnalogMeterCluster();
            stage.addChild(meterCluster);
    
            app.ticker.add(() => {
                const timestamp = app.ticker.lastTime;
                const tacho = ws.SSMWS.getVal(SSMParameterCode.Engine_Speed, timestamp);
                const boost = ws.SSMWS.getVal(SSMParameterCode.Manifold_Absolute_Pressure, timestamp) * 0.0101972 - 1 //convert kPa to kgf/cm2 and relative pressure;
                const speed = ws.SSMWS.getVal(SSMParameterCode.Vehicle_Speed,timestamp);
                const waterTemp = ws.SSMWS.getRawVal(SSMParameterCode.Coolant_Temperature);
                const trip = ws.FUELTRIPWS.getTotalTrip();
                const fuel = ws.FUELTRIPWS.getTotalGas();
                const gasMilage = ws.FUELTRIPWS.getTotalGasMilage();
                const neutralSw = ws.SSMWS.getSwitchFlag(SSMSwitchCode.Neutral_Position_Switch);
                
                const geasPos = calculateGearPosition(tacho, speed, neutralSw);
                
                meterCluster.Tacho = tacho;
                meterCluster.Boost = boost; 
                meterCluster.Speed = speed;
                meterCluster.WaterTemp = waterTemp;
                meterCluster.GearPos = geasPos;
                meterCluster.Trip = trip;
                meterCluster.Fuel = fuel;
                meterCluster.GasMilage = gasMilage;
            });    
        };

        const app = new MeterApplication(appOption);
        app.Run();
    }
}
