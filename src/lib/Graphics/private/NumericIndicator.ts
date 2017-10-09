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

export class BitmapFontNumericIndicator extends PIXI.extras.BitmapText
{
    private value : number = 0;
    
    /**
     * Number of decimal place to show.
     */
    public NumberOfDecimalPlace : number = 0;
    
    /**
     * Flag to show + sign when value is larger than 0. 
     */
    public ShowPlusSign : boolean = false;
    
    /**
     * Set indicator value.
     */
    public set Value(val : number)
    {
        this.value = val;
        let showText : string = val.toFixed(this.NumberOfDecimalPlace);
        
        if (this.ShowPlusSign && val > 0)
        {
                showText = "+".concat(showText);
        }
        
        this.text = showText;
    }    
    /**
     * Get indicator value.
     */
    public get Value() : number { return this.value }
}

export class NumericIndicator extends PIXI.Text
{
    private value : number = 0;
    /**
     * Number of decimal place to show.
     */
    public NumberOfDecimalPlace : number = 0;
    
    /**
     * Flag to show + sign when value is larger than 0. 
     */
    public ShowPlusSign : boolean = false;
    
    /**
     * Set indicator value.
     */
    public set Value(val : number)
    {
        this.value = val;
        let showText : string = val.toFixed(this.NumberOfDecimalPlace);
        
        if (this.ShowPlusSign && val > 0)
        {
                showText = "+".concat(showText);
        }
        
        this.text = showText;
    }    
    /**
     * Get indicator value.
     */
    public get Value() : number { return this.value }
}



