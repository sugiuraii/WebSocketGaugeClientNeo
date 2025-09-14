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

import * as PIXI from 'pixi.js';

//Import application base class
import {MeterApplication} from "meter-application-common";
import {MeterApplicationOption} from "meter-application-common";

//Import meter parts
import {AnalogMeterCluster} from "@websocketgaugeclientneo/meterparts-analogmetercluster";

import {FPSCounter} from "parts/FPSIndicator/FPSCounter";

import { Interpolator, InterpolatorFactory, InterpolatorOption } from 'interpolation';
import { ValueScheduler } from './utils/ValueScheduler';

import { TrailLayer } from 'pixi-traillayer';

import * as TWEEN from "@tweenjs/tween.js"

//For including entry point html file in webpack
require("./AnalogMeterClusterBenchApp.html");

window.onload = function()
{
    const meterapp = new AnalogMeterClusterBenchApp();
    meterapp.Start();
}

class AnalogMeterClusterBenchApp
{
    public Start()
    {
        const pixiAppOption : Partial<PIXI.ApplicationOptions> = {width : 1100, height : 600};

        const appOption = new MeterApplicationOption(pixiAppOption);
        
        appOption.SetupPIXIMeterPanel = async (app) =>
        {
            const meterCluster = await AnalogMeterCluster.create();
            const stage = app.stage;

            stage.addChild(meterCluster);
            
            const fpsCounter = await FPSCounter.create();
            fpsCounter.position.set(0,0);
            stage.addChild(fpsCounter);
            
            let tacho = 0;
            let speed = 0;
            let gearPos = "1";
    
            const totalGasMilage = 12.0;
            const totalFuel = 20.0;
            const totalTrip = 356.0;
    
            let boost = -1.0;
            let waterTemp = 50.0;
        
            const tachoSchedule = [
                {duration: 250, val: 1000},
                {duration: 500, val: 3000},
                {duration: 500, val: 5000},
                {duration: 500, val: 7000},
                {duration: 500, val: 9000},
                {duration: 500, val: 0}
            ];
            const tachoValueSource = new InterpolatorFactory().get({type: "Linear"});
            const tachoScheduler = new ValueScheduler((val) => tachoValueSource.setVal(val), tachoSchedule, false);
            tachoScheduler.start();
            let meterVal = {boost: -1.0, tacho: 0, speed : 0};
            
            const tween = new TWEEN.Tween(meterVal).to({boost: 2.0, tacho: 9000, speed: 280}, 2500)
            .easing(TWEEN.Easing.Quadratic.InOut);
            const tweenback = new TWEEN.Tween(meterVal).to({boost: -1.0, tacho: 0, speed: 0}, 1000)
            .easing(TWEEN.Easing.Quadratic.InOut);
            
            tween.start();
            tween.chain(tweenback);
            
            app.ticker.add(() => 
            {
                const timestamp = app.ticker.lastTime;
                TWEEN.update(timestamp);
                //tweenback.update(timestamp);
                fpsCounter.setFPS(app.ticker.FPS);
                const tacho = tachoValueSource.getVal();
/*                
                if(speed > 280)
                    speed = 0;
                else
                    speed += 0.5;
                
                if(boost > 2.0)
                    boost = -1.0;
                else
                    boost += 0.05;
                
                if (waterTemp > 140)
                    waterTemp = 50;
                else
                    waterTemp += 0.1;
                */
                gearPos = "-";
                meterCluster.Tacho = meterVal.tacho;
                meterCluster.Speed = meterVal.speed;
                meterCluster.Boost = meterVal.boost;
                meterCluster.WaterTemp = waterTemp;
                meterCluster.GasMilage = totalGasMilage;
                meterCluster.Trip = totalTrip;
                meterCluster.Fuel = totalFuel;
                meterCluster.GearPos = gearPos;
           });    
        };

        const app = new MeterApplication(appOption);
        app.Run();
    }
}