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
import { CircularGaugePanelBase } from "./private/CircularGaugePanelBase";
import { SemiCircularGaugePanelOption } from "./SemiCircularGaugePanelOption"

require("./private/SemiCircularGaugeTexture.json");
require("./private/SemiCircularGaugeTexture.png");
require("./fonts/FreeSansBold.otf");

require("./private/CircularGaugeLabelFont.fnt");
require("./private/CircularGaugeLabelFont_0.png");

export class SemiCircularGaugePanel extends CircularGaugePanelBase {
    private constructor(options: SemiCircularGaugePanelOption) {
        super(options);
    }

    public static async create(options: SemiCircularGaugePanelOption) {
        await PIXI.Assets.load(["img/SemiCircularGaugeTexture.json", "img/CircularGaugeLabelFont.fnt"]);
        await PIXI.Assets.load(["./fonts/FreeSansBold.otf"]);
        const instance = new SemiCircularGaugePanel(options);
        return instance;
    }
}
