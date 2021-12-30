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

import React, { useState } from "react";
import { FunctionComponent } from "react";
import { Button, Card } from "react-bootstrap";
import { MeterWidgetConfigPanel } from "./parts/MeterWidgetConfigPanel";

export type MeterWidgetConfigPanelProps =
{
    baseURL: string,
    default: { wsInterval: number, forceCanvas: boolean},
    previewHeight?: string,
    previewWidth?: string
}

export const MeterWidgetConfigPage: FunctionComponent<MeterWidgetConfigPanelProps> = (p) =>
{
    const [wsInterval, setWSInterval] = useState(p.default.wsInterval);
    const [forceCanvas, setForceCanvas] = useState(p.default.forceCanvas);

    const url = decodeURL(wsInterval, forceCanvas, p.baseURL);
    return(
        <>
            <Card>
                <div style={{textAlign:"center"}}>
                    <iframe src={url} width={p.previewWidth} height={p.previewHeight}></iframe>
                </div>
            </Card>
            <Card>
                <MeterWidgetConfigPanel default={{wsInterval:p.default.wsInterval, forceCanvas:p.default.forceCanvas}} onUpdate={(x)=>{
                    setWSInterval(x.wsInterval);
                    setForceCanvas(x.forceCanvas);

                }}/>
            </Card>
            <Card>
                {url}
                <Button variant="primary" onClick={()=>navigator.clipboard.writeText(url)}>Copy URL</Button>
            </Card>
        </>
    );
}

function decodeURL(wsInterval: number, forceCanvas: boolean, baseURL: string) : string
{
    return baseURL + '?' +  "wsInterval=" + wsInterval.toString() + "&forceCanvas=" + forceCanvas;
}