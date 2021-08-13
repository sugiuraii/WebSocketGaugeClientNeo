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

import { GearPositionCalculator, CalcTireCircumference } from "lib/MeterAppBase/utils/GearPositionCalculator";
import { WebsocketMapFactory } from "lib/MeterAppBase/WebsocketObjCollection/WebsocketMapFactory";
import { WebsocketObjectCollectionOption } from "lib/MeterAppBase/WebsocketObjCollection/WebsocketObjectCollection";

import * as jsonc from "jsonc-parser";
import { ArduinoParameterCode, DefiParameterCode } from "lib/WebSocket/WebSocketCommunication";

require('./GearPositionCalcSetting.appconfig.jsonc');
type GearPositionCalcSetting =
    {
        TireParameter:
        {
            TireWidth: number,
            FlatRatio: number,
            TireInchSize: number
        },
        FinalGearRatio: number,
        GearRatio: { gear: number, max: number, min: number }[]
    };

require('./WebSocketSetting.appconfig.jsonc');
type WebSocketSetting =
    {
        WebSocketEnable:
        {
            ELM327: boolean,
            Defi: boolean,
            SSM: boolean,
            Arduino: boolean
        },
        FuelTripLoggerEnabled: boolean,
        Mapping: string
    };

require('./HybridWebSocketMapSetting.appconfig.jsonc');
type HybridWebSocketMapSetting =
    {
        ELM327AndArduinoHybridMap: {
            CodesToMapToArduino: ArduinoParameterCode[]
        },
        SSMAndArduinoHybridMap:
        {
            CodesToMapToArduino: ArduinoParameterCode[]
        },
        SSMAndDefiHybridMap:
        {
            CodesToMapToDefi: DefiParameterCode[]
        }
    };

export const getGearPositionCalculator = async (): Promise<GearPositionCalculator> => {
    const setting: GearPositionCalcSetting = jsonc.parse(await (await fetch("./config/GearPositionCalcSetting.appconfig.jsonc")).text());
    const gearPosJudgeFunctions: Array<{ gear: number, judgeFunction: (ratio: number) => boolean }> = [];

    for (const v of setting.GearRatio)
        gearPosJudgeFunctions.push({ gear: v.gear, judgeFunction: (ratio) => ratio >= v.min && ratio <= v.max });

    return new GearPositionCalculator(setting.FinalGearRatio, CalcTireCircumference(setting.TireParameter.TireWidth, setting.TireParameter.FlatRatio, setting.TireParameter.TireInchSize), gearPosJudgeFunctions);
}

export const getWebsocketCollectionOption = async (): Promise<WebsocketObjectCollectionOption> => {
    const wssetting: WebSocketSetting = jsonc.parse(await (await fetch("./config/WebSocketSetting.appconfig.jsonc")).text());
    const hybridmapsetting: HybridWebSocketMapSetting = jsonc.parse(await (await fetch("./config/HybridWebSocketMapSetting.appconfig.jsonc")).text());

    const wsOption = new WebsocketObjectCollectionOption();
    if (wssetting.WebSocketEnable.Defi)
        wsOption.DefiWSEnabled = true;
    if (wssetting.WebSocketEnable.SSM)
        wsOption.SSMWSEnabled = true;
    if (wssetting.WebSocketEnable.Arduino)
        wsOption.ArduinoWSEnabled = true;
    if (wssetting.WebSocketEnable.ELM327)
        wsOption.ELM327WSEnabled = true;

    if (wssetting.FuelTripLoggerEnabled)
        wsOption.FUELTRIPWSEnabled = true;
    const wsMapFactory = new WebsocketMapFactory();

    switch (wssetting.Mapping) {
        case "DefaultELM327Map":
            wsOption.WSMap = wsMapFactory.DefaultELM327Map;
            break;
        case "DefaultSSMMap":
            wsOption.WSMap = wsMapFactory.DefaultSSMMap;
            break;
        case "DefaultDefiMap":
            wsOption.WSMap = wsMapFactory.DefaultDefiMap;
            break;
        case "DefaultArduino7Map":
            wsOption.WSMap = wsMapFactory.DefaultArduinoMap;
            break;
        case "ELM327andArduinoHybridMap":
            wsOption.WSMap = wsMapFactory.getELM327AndArduinoHybridMap(hybridmapsetting.ELM327AndArduinoHybridMap.CodesToMapToArduino);
            break;
        case "SSMandArduinoHybridMap":
            wsOption.WSMap = wsMapFactory.getSSMAndArduinoHybridMap(hybridmapsetting.SSMAndArduinoHybridMap.CodesToMapToArduino);
            break;
        case "SSMandDefiHybridMap":
            wsOption.WSMap = wsMapFactory.getSSMAndDefiHybridMap(hybridmapsetting.SSMAndDefiHybridMap.CodesToMapToDefi);
            break;
        default:
            throw TypeError("Invalid websocket map type in WebSocketSetting.appconfig.jsonc.");
    }

    return wsOption;
}
