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

import parts = require("../../parts/AnalogMeterCluster/AnalogMeterCluster");
import WebFont = require("webfontloader");
import comm = require("../../lib/websocket/websocketClient");
import cpanel = require("../../lib/ControlPanel");
import logwin = require("../../lib/LogWindow");
require("../AnalogMeterCluster.html");

window.onload = function()
{
    webSocketGauge.test.AnalogMeterClusterPanel.preloadFont();
}

namespace webSocketGauge.test.AnalogMeterClusterPanel
{
    import AnalogMeterCluster = parts.webSocketGauge.parts.AnalogMeterCluster.AnalogMeterCluster;
    import DefiCOMWebsocket = comm.webSocketGauge.lib.communication.DefiCOMWebsocket;
    import SSMWebsocket = comm.webSocketGauge.lib.communication.SSMWebsocket;
    import FUELTRIPWebsocket = comm.webSocketGauge.lib.communication.FUELTRIPWebsocket;
    import ControlPanel = cpanel.webSocketGauge.parts.ControlPanel;
    import LogWindow = logwin.webSocketGauge.parts.LogWindow;
    
    import DefiParameterCode = comm.webSocketGauge.lib.communication.DefiParameterCode;
    import SSMParameterCode = comm.webSocketGauge.lib.communication.SSMParameterCode;
    
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
    
    function connectWS()
    {
        logWindow.appendLog("DefiWS start to connect..");
        defiWS.Connect();
        defiWS.OnWebsocketClose = () => {
            logWindow.appendLog("DefiWS is disconnected.");
            controlPanel.setDefiIndicatorStatus(defiWS.getReadyState());
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
    function main()
    {
        defiWS.URL = "ws://"+location.hostname+":2012/";
        ssmWS.URL = "ws://"+location.hostname+":2013/";
        fuelTripWS.URL = "ws://"+location.hostname+":2014/";

        setupControlPanelEvents(controlPanel, logWindow);        
        connectWS();
        
        const app = new PIXI.Application(1366,768);
        document.body.appendChild(app.view);

        const meterCluster = new AnalogMeterCluster();
        app.stage.addChild(meterCluster);

        app.ticker.add((timestamp : number) => {
            meterCluster.Tacho = defiWS.getVal(DefiParameterCode.Engine_Speed, timestamp);
            meterCluster.Boost = defiWS.getVal(DefiParameterCode.Manifold_Absolute_Pressure, timestamp); 
        });
    }
}