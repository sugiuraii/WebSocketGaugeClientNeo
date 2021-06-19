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

import * as PIXI from 'pixi.js';

//Import application base class
import {MeterApplication} from "../lib/MeterAppBase/MeterApplication";

//Import meter parts
import {BoostGaugePanel} from "../parts/CircularGauges/FullCircularGaugePanel";
import {AirFuelGaugePanel} from "../parts/CircularGauges/FullCircularGaugePanel";
import {WaterTempGaugePanel} from "../parts/CircularGauges/SemiCircularGaugePanel";
import {BatteryVoltageGaugePanel} from "../parts/CircularGauges/SemiCircularGaugePanel";
import {ThrottleGaugePanel} from "../parts/CircularGauges/SemiCircularGaugePanel";
import {DigiTachoPanel} from "../parts/DigiTachoPanel/DigiTachoPanel";
import {MilageGraphPanel} from "../parts/GasMilageGraph/MilageGraph";

import {FPSCounter} from "../parts/FPSIndicator/FPSCounter";
import { MeterApplicationOption } from "../lib/MeterAppBase/options/MeterApplicationOption";

//For including entry point html file in webpack
require("./DigitalMFDBenchApp.html");

window.onload = function()
{
    const meterapp = new DigitalMFDBenchApp();
    meterapp.Run();
}

class DigitalMFDBenchApp
{    
    public Run()
    {
        const pixiAppOption : PIXI.IApplicationOptions = {width : 1200, height : 600};

        const appOption = new MeterApplicationOption(pixiAppOption);
        appOption.PreloadResource.WebFontFamiliyName.addall(BoostGaugePanel.RequestedFontFamily);
        appOption.PreloadResource.WebFontFamiliyName.addall(WaterTempGaugePanel.RequestedFontFamily);
        appOption.PreloadResource.WebFontFamiliyName.addall(DigiTachoPanel.RequestedFontFamily);
        appOption.PreloadResource.WebFontFamiliyName.addall(MilageGraphPanel.RequestedFontFamily);

        appOption.PreloadResource.WebFontCSSURL.addall(BoostGaugePanel.RequestedFontCSSURL);
        appOption.PreloadResource.WebFontCSSURL.addall(WaterTempGaugePanel.RequestedFontCSSURL);
        appOption.PreloadResource.WebFontCSSURL.addall(DigiTachoPanel.RequestedFontCSSURL);
        appOption.PreloadResource.WebFontCSSURL.addall(MilageGraphPanel.RequestedFontCSSURL);
        
        appOption.PreloadResource.TexturePath.addall(BoostGaugePanel.RequestedTexturePath);
        appOption.PreloadResource.TexturePath.addall(WaterTempGaugePanel.RequestedTexturePath);
        appOption.PreloadResource.TexturePath.addall(DigiTachoPanel.RequestedTexturePath);
        appOption.PreloadResource.TexturePath.addall(MilageGraphPanel.RequestedTexturePath);
        
        appOption.PreloadResource.TexturePath.addall(FPSCounter.RequestedTexturePath);

        appOption.SetupPIXIMeterPanel = (app) =>
        {
            const stage = app.stage;

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
            
            stage.addChild(digiTachoPanel);
            stage.addChild(milagePanel);
            stage.addChild(boostPanel);
            stage.addChild(airFuelPanel);
            stage.addChild(waterTempPanel);
            stage.addChild(voltagePanel);
            stage.addChild(throttlePanel);
            
            let tacho = 0;
            let speed = 0;
            const gearPos = "1";
    
            let momentGasMilage = 2.0;
            const gasMilage5min = 3.0;
            const gasMilage10min = 5.0;
            const gasMilage15min = 7.0;
            const gasMilage20min = 9.0;
            const gasMilage25min = 12.0;
            const gasMilage30min = 15.0;
            const totalGasMilage = 12.0;
            const totalFuel = 20.0;
            const totalTrip = 356.0;
    
            const fpsCounter = new FPSCounter();
            fpsCounter.position.set(0,0);
            stage.addChild(fpsCounter);
    
            let boost = -1.0;
            let airFuelRatio = 8.0;
            let waterTemp = 50.0;
            let batteryVolt = 11.0;
            let throttle = 0.0;
                
            app.ticker.add(() => 
            {
                fpsCounter.setFPS(app.ticker.FPS);
                            
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
        };

        const app = new MeterApplication(appOption);
        app.Run();
    }
}