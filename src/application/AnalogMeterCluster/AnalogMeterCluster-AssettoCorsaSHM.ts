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
import {AnalogMeterCluster} from "../../parts/AnalogMeterCluster/AnalogMeterCluster";

//Import enumuator of parameter code
import {AssettoCorsaSHMPhysicsParameterCode, AssettoCorsaSHMNumericalVALCode} from "../../lib/WebSocket/WebSocketCommunication";
import {AssettoCorsaSHMGraphicsParameterCode} from "../../lib/WebSocket/WebSocketCommunication";
import {AssettoCorsaSHMStaticInfoParameterCode} from "../../lib/WebSocket/WebSocketCommunication";

//For including entry point html file in webpack
require("./AnalogMeterCluster-AssettoCorsaSHM.html");

window.onload = function()
{
    const meterapp = new AnalogMeterCluster_AssettoCorsaSHM(1100, 600);
    meterapp.run();
}

class AnalogMeterCluster_AssettoCorsaSHM extends MeterApplicationBase
{
    protected setWebSocketOptions()
    {
        this.IsAssettoCorsaWSEnabled = true;
        
        this.registerAssettoCorsaPhysicsParameterCode(AssettoCorsaSHMPhysicsParameterCode.Rpms);
        this.registerAssettoCorsaPhysicsParameterCode(AssettoCorsaSHMPhysicsParameterCode.SpeedKmh);
        this.registerAssettoCorsaPhysicsParameterCode(AssettoCorsaSHMPhysicsParameterCode.ManifoldPressure);
        this.registerAssettoCorsaPhysicsParameterCode(AssettoCorsaSHMPhysicsParameterCode.Gear);
    }
    
    protected setTextureFontPreloadOptions()
    {
        this.registerWebFontFamilyNameToPreload(AnalogMeterCluster.RequestedFontFamily);
        this.registerWebFontCSSURLToPreload(AnalogMeterCluster.RequestedFontCSSURL);
        this.registerTexturePathToPreload(AnalogMeterCluster.RequestedTexturePath);
    }
    
    protected setPIXIMeterPanel() : void
    {
        const meterCluster = new AnalogMeterCluster();
        this.stage.addChild(meterCluster);

        this.ticker.add(() => {
            const timestamp = this.ticker.lastTime;
            const tacho = this.AssettoCorsaWS.getVal(AssettoCorsaSHMNumericalVALCode.Rpms, timestamp);
            const boost = this.AssettoCorsaWS.getVal(AssettoCorsaSHMNumericalVALCode.ManifoldPressure, timestamp) * 1.01972 //convert kPa to kgf/cm2 and relative pressure;
            const speed = this.AssettoCorsaWS.getVal(AssettoCorsaSHMNumericalVALCode.SpeedKmh, timestamp);
            const waterTemp = 95;
            const trip = 100;
            const fuel = 20;
            const gasMilage = 10;
            
            const gearPos = this.AssettoCorsaWS.getRawVal(AssettoCorsaSHMNumericalVALCode.Gear);
            
            meterCluster.Tacho = tacho;
            meterCluster.Boost = boost; 
            meterCluster.Speed = speed;
            meterCluster.WaterTemp = waterTemp;

            if(gearPos === 0)
                meterCluster.GearPos = "R";
            else if(gearPos === 1)
                meterCluster.GearPos = "N";
            else
                meterCluster.GearPos = (gearPos-1).toString();
            
            meterCluster.Trip = trip;
            meterCluster.Fuel = fuel;
            meterCluster.GasMilage = gasMilage;
        });
    }
}
