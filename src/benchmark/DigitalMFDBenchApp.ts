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

//For including entry point html file in webpack
require("./DigitalMFDBenchApp.html");

window.onload = function()
{
    const meterapp = new DigitalMFDBenchApp();
    meterapp.run();
}

class DigitalMFDBenchApp extends MeterApplicationBase
{
    protected setWebSocketOptions()
    {
        //For graphic benchmark. Do nothing for websocket.
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
        const app = new PIXI.Application(1200, 600);
        document.body.appendChild(app.view);
        app.view.style.width = "100vw";
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
        
        app.stage.addChild(digiTachoPanel);
        app.stage.addChild(milagePanel);
        app.stage.addChild(boostPanel);
        app.stage.addChild(airFuelPanel);
        app.stage.addChild(waterTempPanel);
        app.stage.addChild(voltagePanel);
        app.stage.addChild(throttlePanel);
        
        let tacho = 0;
        let speed = 0;
        const gearPos = "1";

        let momentGasMilage = 2.0;
        const gasMilage5min = 3.0;
        const gasMilage10min = 5.0;
        const gasMilage15min = 7.0;
        const gasMilage20min = 9.0;;
        const gasMilage25min = 12.0;
        const gasMilage30min = 15.0;
        const totalGasMilage = 12.0;
        const totalFuel = 20.0;
        const totalTrip = 356.0;

        let boost = -1.0;
        let airFuelRatio = 8.0;
        let waterTemp = 50.0;
        let batteryVolt = 11.0;
        let throttle = 0.0;

        
        app.ticker.add(() => 
        {
            if(tacho > 9000)
                tacho = 0;
            else
                tacho += 200;
            
            if(speed > 280)
                speed = 0;
            else
                speed += 0.1;
            
            if(boost > 2.0)
                boost = -1.0;
            else
                boost += 0.05;
            
            if (airFuelRatio > 20)
                airFuelRatio = 8.0;
            else
                airFuelRatio += 0.1;
            
            if (batteryVolt > 15.0)
                batteryVolt = 11.0;
            else
                batteryVolt += 0.005;
                
            if (waterTemp > 150)
                waterTemp = 50.0;
            else
                waterTemp += 0.02;
            
            if(throttle > 100)
                throttle = 0;
            else
                throttle += 1;
            
            if (momentGasMilage > 20.0)
                momentGasMilage = 1.0;
            else
                momentGasMilage += 0.5;
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