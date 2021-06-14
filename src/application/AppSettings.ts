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

import { GearPositionCalculator, CalcTireCircumference } from "../lib/MeterAppBase/utils/GearPositionCalculator";
import { WebsocketMapFactory } from "../lib/MeterAppBase/WebsocketObjCollection/WebsocketMapFactory";
import { WebsocketObjectCollectionOption } from "../lib/MeterAppBase/WebsocketObjCollection/WebsocketObjectCollection";

const wsMapFactory = new WebsocketMapFactory();

/**
 * Example of gear position calculator
 * Subaru impreza WRX STi, GDBA, JDM, 2000
 * Final = 3.9
 * Tire => 225/45R17
 */
export const DefaultGearPostionCalculator = new GearPositionCalculator(3.9, CalcTireCircumference(225, 45, 17),
    [
        {gear : 1, judgeFunction : (r) => r < 4.27 && r > 3.01},
        {gear : 2, judgeFunction : (r) => r > 2.07},
        {gear : 3, judgeFunction : (r) => r > 1.55},
        {gear : 4, judgeFunction : (r) => r > 1.2},
        {gear : 5, judgeFunction : (r) => r > 0.95},
        {gear : 6, judgeFunction : (r) => r > 0.73}        
    ]);


/**
 * Default websocket mapping (ELM327 default)
 */
function createWebSocketOption() : WebsocketObjectCollectionOption
{
    const wsOption = new WebsocketObjectCollectionOption();
    wsOption.ELM327WSEnabled = true;
    wsOption.FUELTRIPWSEnabled = true;
    wsOption.WSMap = wsMapFactory.DefaultELM327Map;

    return wsOption;
}

export const DefaultWebSocketMap = wsMapFactory.DefaultELM327Map;