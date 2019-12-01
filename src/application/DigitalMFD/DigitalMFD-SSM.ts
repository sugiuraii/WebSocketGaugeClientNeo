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
 
// This is required to webpack font/texture/html files
/// <reference path="../../lib/webpackRequire.ts" />

import * as PIXI from "pixi.js";

//Import application base class
import {MeterApplicationBase} from "../../lib/MeterAppBase/MeterApplicationBase";

//Import meter parts
import {BoostGaugePanel} from "../../parts/CircularGauges/FullCircularGaugePanel";
import {AirFuelGaugePanel} from "../../parts/CircularGauges/FullCircularGaugePanel";
import {WaterTempGaugePanel} from "../../parts/CircularGauges/SemiCircularGaugePanel";
import {BatteryVoltageGaugePanel} from "../../parts/CircularGauges/SemiCircularGaugePanel";
import {ThrottleGaugePanel} from "../../parts/CircularGauges/SemiCircularGaugePanel";
import {DigiTachoPanel} from "../../parts/DigiTachoPanel/DigiTachoPanel";
import {MilageGraphPanel} from "../../parts/GasMilageGraph/MilageGraph";

//Import enumuator of parameter code
import {SSMParameterCode} from "../../lib/WebSocket/WebSocketCommunication";
import {SSMSwitchCode} from "../../lib/WebSocket/WebSocketCommunication";
import {ReadModeCode} from "../../lib/WebSocket/WebSocketCommunication";

//For including entry point html file in webpack
require("./DigitalMFD-SSM.html");

window.onload = function()
{
    const meterapp = new DigitalMFD_SSM(1200, 600);
    meterapp.run();
}

class DigitalMFD_SSM extends MeterApplicationBase
{
    protected setWebSocketOptions()
    {
        this.IsSSMWSEnabled = true;
        this.IsFUELTRIPWSEnabled = true;
        
        this.registerSSMParameterCode(SSMParameterCode.Engine_Speed, ReadModeCode.SLOWandFAST);
        this.registerSSMParameterCode(SSMParameterCode.Manifold_Absolute_Pressure, ReadModeCode.SLOWandFAST);
        this.registerSSMParameterCode(SSMParameterCode.Vehicle_Speed, ReadModeCode.SLOWandFAST);
        this.registerSSMParameterCode(SSMParameterCode.Coolant_Temperature, ReadModeCode.SLOW);
        this.registerSSMParameterCode(SSMParameterCode.Battery_Voltage, ReadModeCode.SLOW);
        this.registerSSMParameterCode(SSMParameterCode.Throttle_Opening_Angle, ReadModeCode.SLOWandFAST);
        this.registerSSMParameterCode(SSMParameterCode.Air_Fuel_Sensor_1, ReadModeCode.SLOWandFAST);
        this.registerSSMParameterCode(SSMSwitchCode.getNumericCodeFromSwitchCode(SSMSwitchCode.Neutral_Position_Switch), ReadModeCode.SLOWandFAST);
        
        this.FUELTRIPSectSpan = 300;
        this.FUELTRIPSectStoreMax = 6;
    }
    
    protected setTextureFontPreloadOptions()
    {
        this.registerWebFontFamilyNameToPreload(BoostGaugePanel.RequestedFontFamily);
        this.registerWebFontFamilyNameToPreload(WaterTempGaugePanel.RequestedFontFamily);
        this.registerWebFontFamilyNameToPreload(DigiTachoPanel.RequestedFontFamily);
        this.registerWebFontFamilyNameToPreload(MilageGraphPanel.RequestedFontFamily);
        
        this.registerWebFontCSSURLToPreload(BoostGaugePanel.RequestedFontCSSURL);
        this.registerWebFontCSSURLToPreload(WaterTempGaugePanel.RequestedFontCSSURL);
        this.registerWebFontCSSURLToPreload(DigiTachoPanel.RequestedFontCSSURL);
        this.registerWebFontCSSURLToPreload(MilageGraphPanel.RequestedFontCSSURL);
        
        this.registerTexturePathToPreload(BoostGaugePanel.RequestedTexturePath);
        this.registerTexturePathToPreload(WaterTempGaugePanel.RequestedTexturePath);
        this.registerTexturePathToPreload(DigiTachoPanel.RequestedTexturePath);
        this.registerTexturePathToPreload(MilageGraphPanel.RequestedTexturePath);
    }
    
    protected setPIXIMeterPanel()
    {        
        const digiTachoPanel = new DigiTachoPanel();
        digiTachoPanel.position.set(0,0);
        
        const milagePanel = new MilageGraphPanel();
        milagePanel.position.set(0,300);
        milagePanel.scale.set(0.94,0.94);
        
        const boostPanel = new BoostGaugePanel();
        boostPanel.position.set(600,0);
        boostPanel.scale.set(0.751,0.751);
        
        const airFuelPanel = new AirFuelGaugePanel();
        airFuelPanel.position.set(600,310);
        airFuelPanel.scale.set(0.751, 0.751);
        
        const waterTempPanel = new WaterTempGaugePanel();
        waterTempPanel.position.set(900,0);
        waterTempPanel.scale.set(0.68);
        
        const voltagePanel = new BatteryVoltageGaugePanel();
        voltagePanel.position.set(900,200);
        voltagePanel.scale.set(0.68);
        
        const throttlePanel = new ThrottleGaugePanel();
        throttlePanel.position.set(900,400);
        throttlePanel.scale.set(0.68);
        
        this.stage.addChild(digiTachoPanel);
        this.stage.addChild(milagePanel);
        this.stage.addChild(boostPanel);
        this.stage.addChild(airFuelPanel);
        this.stage.addChild(waterTempPanel);
        this.stage.addChild(voltagePanel);
        this.stage.addChild(throttlePanel);
        
        this.ticker.add(() => 
        {
            const timestamp = this.ticker.lastTime;
            const tacho = this.SSMWS.getVal(SSMParameterCode.Engine_Speed, timestamp);
            const speed = this.SSMWS.getVal(SSMParameterCode.Vehicle_Speed, timestamp);
            const neutralSw = this.SSMWS.getSwitchFlag(SSMSwitchCode.Neutral_Position_Switch);
            const gearPos = this.calculateGearPosition(tacho, speed, neutralSw);
            
            const momentGasMilage = this.FUELTRIPWS.getMomentGasMilage(timestamp);
            const gasMilage5min : number = this.FUELTRIPWS.getSectGasMilage(0);
            const gasMilage10min : number = this.FUELTRIPWS.getSectGasMilage(1);
            const gasMilage15min : number = this.FUELTRIPWS.getSectGasMilage(2);
            const gasMilage20min : number = this.FUELTRIPWS.getSectGasMilage(3);
            const gasMilage25min : number = this.FUELTRIPWS.getSectGasMilage(4);
            const gasMilage30min : number = this.FUELTRIPWS.getSectGasMilage(5);
            const totalGasMilage = this.FUELTRIPWS.getTotalGasMilage();
            const totalFuel = this.FUELTRIPWS.getTotalGas();
            const totalTrip = this.FUELTRIPWS.getTotalTrip();
            
            const boost = this.SSMWS.getVal(SSMParameterCode.Manifold_Absolute_Pressure, timestamp)  * 0.0101972 - 1 //convert kPa to kgf/cm2 and relative pressure;
            const airFuelRatio = this.SSMWS.getVal(SSMParameterCode.Air_Fuel_Sensor_1, timestamp)*14;
            const waterTemp = this.SSMWS.getRawVal(SSMParameterCode.Coolant_Temperature);
            const batteryVolt = this.SSMWS.getRawVal(SSMParameterCode.Battery_Voltage);
            const throttle = this.SSMWS.getVal(SSMParameterCode.Throttle_Opening_Angle, timestamp);
            
            digiTachoPanel.Speed = speed;
            digiTachoPanel.Tacho = tacho;
            digiTachoPanel.GearPos = gearPos;
            
            milagePanel.MomentGasMilage = momentGasMilage;
            milagePanel.Trip = totalTrip;
            milagePanel.Fuel = totalFuel;
            milagePanel.GasMilage = totalGasMilage;
            milagePanel.setSectGasMllage("5min", gasMilage5min);
            milagePanel.setSectGasMllage("10min", gasMilage10min);
            milagePanel.setSectGasMllage("15min", gasMilage15min);
            milagePanel.setSectGasMllage("20min", gasMilage20min);
            milagePanel.setSectGasMllage("25min", gasMilage25min);
            milagePanel.setSectGasMllage("30min", gasMilage30min);
            
            boostPanel.Value = boost;
            airFuelPanel.Value = airFuelRatio;
            waterTempPanel.Value = waterTemp;
            voltagePanel.Value = batteryVolt;
            throttlePanel.Value = throttle;
       });
    }
}