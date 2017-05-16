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
 
/// <reference path="../../lib/webpackRequire.ts" />

import {AnalogMeterCluster} from "../../parts/AnalogMeterCluster/AnalogMeterCluster";
import * as WebFont from "webfontloader";
import * as PIXI from "pixi.js";
import {ControlPanel} from "../../lib/ControlPanel";
import {LogWindow} from "../../lib/LogWindow";

import {DefiCOMWebsocket} from "../../lib/WebSocket/WebSocketCommunication";
import {SSMWebsocket} from "../../lib/WebSocket/WebSocketCommunication";
import {FUELTRIPWebsocket} from "../../lib/WebSocket/WebSocketCommunication";

import {DefiParameterCode} from "../../lib/WebSocket/WebSocketCommunication";
import {SSMParameterCode} from "../../lib/WebSocket/WebSocketCommunication";
import {ReadModeCode} from "../../lib/WebSocket/WebSocketCommunication";

import {MeterApplication} from "../../lib/MeterApplication";

require("../AnalogMeterCluster.html");

window.onload = function()
{
    const meterapp = new AnalogMeterClusterApp();
    meterapp.run();
}

class AnalogMeterClusterApp extends MeterApplication
{
    public run()
    {
        this.IsDefiWSEnabled = true;
        this.IsSSMWSEnabled = true;
        this.IsFUELTRIPWSEnabled = true;
        
        this.registerDefiParameterCode(DefiParameterCode.Engine_Speed, true);
        this.registerDefiParameterCode(DefiParameterCode.Manifold_Absolute_Pressure, true);
        this.registerSSMParameterCode(SSMParameterCode.Vehicle_Speed, ReadModeCode.FAST, true);
        this.registerSSMParameterCode(SSMParameterCode.Vehicle_Speed, ReadModeCode.SLOW, true);
        this.registerSSMParameterCode(SSMParameterCode.Coolant_Temperature, ReadModeCode.SLOW, false);
        
        this.PreloadWebFontFamiliy = AnalogMeterCluster.RequestedFontFamily;
        this.PreloadWebFontCSSURL = AnalogMeterCluster.RequestedFontCSSURL;
        this.CreateMainPanel = () =>
        {
            const app = new PIXI.Application(1366,768);
            document.body.appendChild(app.view);

            const meterCluster = new AnalogMeterCluster();
            app.stage.addChild(meterCluster);

            app.ticker.add(() => {
                const timestamp = PIXI.ticker.shared.lastTime;
                meterCluster.Tacho = this.DefiWS.getVal(DefiParameterCode.Engine_Speed, timestamp);
                meterCluster.Boost = this.DefiWS.getVal(DefiParameterCode.Manifold_Absolute_Pressure, timestamp); 
                meterCluster.Speed = this.SSMWS.getVal(SSMParameterCode.Vehicle_Speed,timestamp);
                meterCluster.WaterTemp = this.SSMWS.getRawVal(SSMParameterCode.Coolant_Temperature);
                
                meterCluster.Trip = this.FUELTRIPWS.getTotalTrip();
                meterCluster.Fuel = this.FUELTRIPWS.getTotalGas();
                meterCluster.GasMilage = this.FUELTRIPWS.getMomentGasMilage(timestamp);
            });
        }
        
        super.run();
    }
}
/*
namespace AnalogMeterClusterPanel
{
    const defiWS = new DefiCOMWebsocket();
    const ssmWS = new SSMWebsocket();
    const fuelTripWS = new FUELTRIPWebsocket();
    const controlPanel = new ControlPanel();
    const logWindow = new LogWindow();
    
    export function preloadFont()
    {
        WebFont.load(
            {
                custom: 
                { 
                    families: AnalogMeterCluster.RequestedFontFamily,
                    urls: AnalogMeterCluster.RequestedFontCSSURL 
                },
                active: ()=> { preloadTexture(); }
            }
        );
    }
    
    function preloadTexture()
    {
        PIXI.loader.add(AnalogMeterCluster.RequestedTexturePath[0]);
        PIXI.loader.load(main);
    }
    
    function setupControlPanelEvents(cpanel : ControlPanel, logwin : LogWindow)
    {
        //Set Debug button
        cpanel.setOnLogButtonClicked( () => { logwin.Visible = !logwin.Visible; });
        //Set Reset button event
        controlPanel.setOnResetButtonClicked( () =>
        {
            if(window.confirm("Reset Trip and fuel consumption data?"))
                fuelTripWS.SendReset();
        });   
    }
    
    function connectDefiWS()
    {
        logWindow.appendLog("DefiWS start to connect..");
        defiWS.Connect();
        defiWS.OnWebsocketClose = () => {
            logWindow.appendLog("DefiWS is disconnected.");
            controlPanel.setDefiIndicatorStatus(defiWS.getReadyState());
            
            window.setTimeout(() => defiWS.Connect(), 5000);
        }
        defiWS.OnWebsocketError = (message : string) => {
            logWindow.appendLog("DefiWS websocket error : " + message);
        }
        defiWS.OnRESPacketReceived = (message : string) => {
            logWindow.appendLog("DefiWS RES message : " + message);
        }
        defiWS.OnERRPacketReceived = (message : string) =>
        {
            logWindow.appendLog("DefiWS ERR message : " + message);
        }
        defiWS.OnWebsocketOpen = () =>
        {
            logWindow.appendLog("DefiWS is connected.");
            controlPanel.setDefiIndicatorStatus(defiWS.getReadyState());
            defiWS.SendWSSend(DefiParameterCode.Manifold_Absolute_Pressure, true);
            defiWS.EnableInterpolate(DefiParameterCode.Manifold_Absolute_Pressure);
            defiWS.SendWSSend(DefiParameterCode.Engine_Speed, true);
            defiWS.EnableInterpolate(DefiParameterCode.Engine_Speed);
        }
    }
    
    function connectSSMWS()
    {
        logWindow.appendLog("SSMWS start to connect..");
        ssmWS.Connect();
        ssmWS.OnWebsocketClose = () => {
            logWindow.appendLog("SSMWS is disconnected.");
            controlPanel.setSSMIndicatorStatus(ssmWS.getReadyState());
            window.setTimeout(() => ssmWS.Connect(), 5000);
        }
        ssmWS.OnWebsocketError = (message : string) => {
            logWindow.appendLog("SSMWS websocket error : " + message);
        }
        ssmWS.OnRESPacketReceived = (message : string) => {
            logWindow.appendLog("SSMWS RES message : " + message);
        }
        ssmWS.OnERRPacketReceived = (message : string) =>
        {
            logWindow.appendLog("SSMWS ERR message : " + message);
        }
        ssmWS.OnWebsocketOpen = () =>
        {
            logWindow.appendLog("SSMWS is connected.");
            controlPanel.setSSMIndicatorStatus(ssmWS.getReadyState());
            ssmWS.SendCOMRead(SSMParameterCode.Vehicle_Speed, ReadModeCode.FAST, true);
            ssmWS.SendCOMRead(SSMParameterCode.Vehicle_Speed, ReadModeCode.SLOW, true);
            ssmWS.EnableInterpolate(SSMParameterCode.Vehicle_Speed);
            ssmWS.SendCOMRead(SSMParameterCode.Coolant_Temperature, ReadModeCode.SLOW, true);
            ssmWS.EnableInterpolate(SSMParameterCode.Vehicle_Speed);
        }
    }
    
    function main()
    {
        defiWS.URL = "ws://"+location.hostname+":2012/";
        ssmWS.URL = "ws://"+location.hostname+":2013/";
        fuelTripWS.URL = "ws://"+location.hostname+":2014/";

        setupControlPanelEvents(controlPanel, logWindow);        
        connectDefiWS();
        connectSSMWS();
        
        const app = new PIXI.Application(1366,768);
        document.body.appendChild(app.view);

        const meterCluster = new AnalogMeterCluster();
        app.stage.addChild(meterCluster);

        app.ticker.add(() => {
            const timestamp = PIXI.ticker.shared.lastTime;
            meterCluster.Tacho = defiWS.getVal(DefiParameterCode.Engine_Speed, timestamp);
            meterCluster.Boost = defiWS.getVal(DefiParameterCode.Manifold_Absolute_Pressure, timestamp); 
            meterCluster.Speed = ssmWS.getVal(SSMParameterCode.Vehicle_Speed,timestamp);
            meterCluster.WaterTemp = ssmWS.getRawVal(SSMParameterCode.Coolant_Temperature);
        });
    }
}
*/