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
import * as TWEEN from "@tweenjs/tween.js"

//Import application base class
import {MeterApplication} from "meter-application-common";
import {MeterApplicationOption} from "meter-application-common";

//Import meter parts
import {AnalogMeterCluster} from "@websocketgaugeclientneo/meterparts-analogmetercluster";

import {FPSCounter} from "parts/FPSIndicator/FPSCounter";

import { Interpolator, InterpolatorFactory, InterpolatorOption } from 'interpolation';
import { ValueScheduler } from './utils/ValueScheduler';

import { TrailLayer } from 'pixi-traillayer';

//For including entry point html file in webpack
require("./AnalogMeterClusterBenchApp.html");

window.onload = function()
{
    const meterapp = new AnalogMeterClusterBenchApp();
    meterapp.Start();
}

class AnalogMeterClusterStartupAnimation {
    private readonly AnalogMeterCluster:AnalogMeterCluster;
    private IsFinished = false;
    private meterVal = {boost: -1.0, tacho: 0, speed : 0};
    private brightness = {back : 0.1, text : 0.1};
    private textblur = {val: 10.0};
    private readonly tweenGroup = new TWEEN.Group();

    constructor(AnalogMeterCluster:AnalogMeterCluster) {
        this.AnalogMeterCluster = AnalogMeterCluster;
        this.setup();
    }

    public isFinished() {return this.IsFinished};
    private setup() {
        const blurTween = new TWEEN.Tween(this.textblur).to({val:0.0}, 1000);
        const brightnessTween1 = new TWEEN.Tween(this.brightness).to({back : 0.1, text:1.0}, 1000) .easing(TWEEN.Easing.Quadratic.InOut);
        const brightnessTween2 = new TWEEN.Tween(this.brightness).to({back : 1.0, text:1.0}, 1000) .easing(TWEEN.Easing.Quadratic.InOut);
            
        const sweepTween = new TWEEN.Tween(this.meterVal).to({boost: 2.0, tacho: 9000, speed: 280}, 2500)
        .easing(TWEEN.Easing.Quadratic.InOut);
        const sweepBackTween = new TWEEN.Tween(this.meterVal).to({boost: -1.0, tacho: 0, speed: 0}, 1000)
        .easing(TWEEN.Easing.Quadratic.InOut);

        brightnessTween1.start();
        brightnessTween1.chain(blurTween);
        blurTween.chain(brightnessTween2);
        brightnessTween2.chain(sweepTween);
        sweepTween.chain(sweepBackTween);
        
        this.tweenGroup.add(brightnessTween1);
        this.tweenGroup.add(blurTween);
        this.tweenGroup.add(brightnessTween2);
        this.tweenGroup.add(sweepTween);
        this.tweenGroup.add(sweepBackTween);

        this.IsFinished = false;
        this.AnalogMeterCluster.CacheBackContainerAsTexture = false;
        brightnessTween2.onComplete(() => this.AnalogMeterCluster.CacheBackContainerAsTexture = true);
        sweepBackTween.onComplete(() => this.IsFinished = true);
    }

    public ticker(timestamp: number) {
        if(this.IsFinished)
            return;

        const meterCluster = this.AnalogMeterCluster;
        this.tweenGroup.update(timestamp);
                
        const tblurFilter = new PIXI.BlurFilter();
        tblurFilter.blur = this.textblur.val;
        tblurFilter.enabled = !(this.textblur.val === 0.0);
        const bfilter = new PIXI.ColorMatrixFilter();
        bfilter.brightness(this.brightness.back, false);
        const tfilter = new PIXI.ColorMatrixFilter();
        tfilter.brightness(this.brightness.text, false);
        meterCluster.getBoostDisplayObjects("Background").filters = [bfilter];
        meterCluster.getTachoDisplayObjects("Background").filters = [bfilter];
        meterCluster.getSpeedDisplayObjects("Background").filters = [bfilter];
        meterCluster.getTachoDisplayObjects("LCDBase").filters = [bfilter];
        meterCluster.getSpeedDisplayObjects("LCDBase").filters = [bfilter];
        meterCluster.getBoostDisplayObjects("BackLabel").filters = [tfilter, tblurFilter];
        meterCluster.getTachoDisplayObjects("BackLabel").filters = [tfilter, tblurFilter];
        meterCluster.getSpeedDisplayObjects("BackLabel").filters = [tfilter, tblurFilter];
        
        meterCluster.Tacho = this.meterVal.tacho;
        meterCluster.Speed = this.meterVal.speed;
        meterCluster.Boost = this.meterVal.boost;
    }
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
            meterCluster.visible = false;

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

            const animation = new AnalogMeterClusterStartupAnimation(meterCluster);

            app.ticker.add(() => 
            {
                meterCluster.visible = true;
                fpsCounter.setFPS(app.ticker.FPS);
                const timestamp = app.ticker.lastTime;
                animation.ticker(timestamp);
                if(animation.isFinished()) {
                    if(tacho > 9000)
                        tacho = 0;
                    else
                        tacho += 200;
                    
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
                
                    meterCluster.Tacho = tacho;
                    meterCluster.Speed = speed;
                    meterCluster.Boost = boost;
                    meterCluster.WaterTemp = waterTemp;
                    meterCluster.GasMilage = totalGasMilage;
                    meterCluster.Trip = totalTrip;
                    meterCluster.Fuel = totalFuel;
                    meterCluster.GearPos = gearPos;
                }
           });    
        };

        const app = new MeterApplication(appOption);
        app.Run();
    }
}