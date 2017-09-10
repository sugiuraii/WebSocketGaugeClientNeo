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
// This is required to webpack font/texture/html files
/// <reference path="../lib/webpackRequire.ts" />

import * as PIXI from "pixi.js";

//Import application base class
import {MeterApplicationBase} from "../lib/MeterAppBase/MeterApplicationBase";

//Import meter parts
import {BoostGaugePanel} from "../parts/CircularGauges/FullCircularGaugePanel";
import {AirFuelGaugePanel} from "../parts/CircularGauges/FullCircularGaugePanel";
import {WaterTempGaugePanel} from "../parts/CircularGauges/SemiCircularGaugePanel";
import {BatteryVoltageGaugePanel} from "../parts/CircularGauges/SemiCircularGaugePanel";
import {ThrottleGaugePanel} from "../parts/CircularGauges/SemiCircularGaugePanel";
import {DigiTachoPanel} from "../parts/DigiTachoPanel/DigiTachoPanel";
import {MilageGraphPanel} from "../parts/GasMilageGraph/MilageGraph";

//Import enumuator of parameter code
import {DefiParameterCode} from "../lib/WebSocket/WebSocketCommunication";
import {SSMParameterCode} from "../lib/WebSocket/WebSocketCommunication";
import {SSMSwitchCode} from "../lib/WebSocket/WebSocketCommunication";
import {ReadModeCode} from "../lib/WebSocket/WebSocketCommunication";

//For including entry point html file in webpack
require("./DigitalMFDApp.html");

window.onload = function()
{
    const meterapp = new DigitalMFDApp(1200, 600);
    meterapp.run();
}

class DigitalMFDApp extends MeterApplicationBase
{
    protected setWebSocketOptions()
    {
        this.IsDefiWSEnabled = true;
        this.IsSSMWSEnabled = true;
        this.IsFUELTRIPWSEnabled = true;
        
        this.registerDefiParameterCode(DefiParameterCode.Engine_Speed, true);
        this.registerDefiParameterCode(DefiParameterCode.Manifold_Absolute_Pressure, true);
        this.registerSSMParameterCode(SSMParameterCode.Vehicle_Speed, ReadModeCode.SLOWandFAST, false);
        this.registerSSMParameterCode(SSMParameterCode.Coolant_Temperature, ReadModeCode.SLOW, false);
        this.registerSSMParameterCode(SSMParameterCode.Battery_Voltage, ReadModeCode.SLOW, false);
        this.registerSSMParameterCode(SSMParameterCode.Throttle_Opening_Angle, ReadModeCode.SLOWandFAST, true);
        this.registerSSMParameterCode(SSMParameterCode.Air_Fuel_Sensor_1, ReadModeCode.SLOWandFAST, true);
        this.registerSSMParameterCode(SSMSwitchCode.getNumericCodeFromSwitchCode(SSMSwitchCode.Neutral_Position_Switch), ReadModeCode.SLOWandFAST, false);
        
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
            const timestamp = PIXI.ticker.shared.lastTime;
            const tacho = this.DefiWS.getVal(DefiParameterCode.Engine_Speed, timestamp);
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
            
            const boost = this.DefiWS.getVal(DefiParameterCode.Manifold_Absolute_Pressure, timestamp)  * 0.0101972 - 1 //convert kPa to kgf/cm2 and relative pressure;
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