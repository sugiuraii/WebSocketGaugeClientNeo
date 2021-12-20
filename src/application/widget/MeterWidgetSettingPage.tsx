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

import { MeterWidgetConfigPage } from "lib/MeterAppBase/reactParts/widgetSetting/MeterWidgetConfigPage";
import { MeterWidgetConfigPageWithMeterSelect } from "lib/MeterAppBase/reactParts/widgetSetting/MeterWidgetConfigPageWithMeterSelect";
import React from "react";
import ReactDOM from "react-dom";

import 'bootswatch/dist/slate/bootstrap.min.css';
const BOOTSTRAP_CSS_FILENAME = "bootstrap.min.css";

require("./MeterWidgetSettingPage.html");
function loadBootStrapCSS() {
    const head = document.getElementsByTagName('head')[0];
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', BOOTSTRAP_CSS_FILENAME);
    head.appendChild(link);
}

const rootElement = document.createElement('div');
loadBootStrapCSS();

ReactDOM.render(
    <>
        <MeterWidgetConfigPage baseURL={location.href} default={{forceCanvas:false, wsInterval:0}}/>
        <MeterWidgetConfigPageWithMeterSelect baseURL={location.href} 
                                              codesToSelect={["Engine_Speed", "Engine_Load", "Manifold_Absolute_Pressure", "Coolant_Temperature", "Engine_oil_temperature", "Battery_Voltage", "Oil_Pressure", "Mass_Air_Flow", "O2Sensor_1_Air_Fuel_Ratio", "Intake_Air_Temperature"]} 
                                              default={{forceCanvas:false, wsInterval:0, meterSelection:{Meter1 : "Engine_Speed"}}}/>
    </>
    , rootElement);    

// Add react components to html body
document.body.appendChild(rootElement);

