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

import { WebsocketParameterCode } from "websocket-gauge-client-communication-service"
import React, { useEffect, useState } from "react";
import { FunctionComponent } from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import { MeterSelectionSetting } from "../dialog/MeterSelectDialog";
import { MeterWidgetCodeSelectPanel } from "./parts/MeterWidgetCodeSelectPanel";
import { MeterWidgetConfigPanel } from "./parts/MeterWidgetConfigPanel";

export type MeterWidgetConfigPanelWithMeterSelectProps =
{
    baseURL: string,
    default: { wsInterval: number, forceCanvas: boolean, meterSelection: MeterSelectionSetting},
    codesToSelect: WebsocketParameterCode[],
    previewAspect?: number
}

export const MeterWidgetConfigPageWithMeterSelect: FunctionComponent<MeterWidgetConfigPanelWithMeterSelectProps> = (p) =>
{
    const [wsInterval, setWSInterval] = useState(p.default.wsInterval);
    const [forceCanvas, setForceCanvas] = useState(p.default.forceCanvas);
    const [meterSelection, setMeterSelection] = useState(p.default.meterSelection);
    
    const url = decodeURL(wsInterval, forceCanvas, p.baseURL, meterSelection);
    
    // Auto tune iframe height from the aspect ratio given by previewHeight and previewWidth
    useEffect(() => {
        if(p.previewAspect === undefined)
            return;
        
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const iframeElem = document.getElementById("previewIframe")!as HTMLIFrameElement;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const scrollWidth = iframeElem.contentDocument!.documentElement.scrollWidth;
        const scrollHeight = scrollWidth * p.previewAspect;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        iframeElem.style.height = scrollHeight + "px";        
    },[p.previewAspect]);

    return(
        <>
            <Container fluid>
                <Row>
                    <Col sm={8}>
                        <Card>
                            <Card.Header><h1>Widget preview</h1></Card.Header>
                            <Card.Body>
                                <div style={{textAlign:"center"}}>
                                    <iframe id="previewIframe" src={url} width="100%" ></iframe>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col sm={4}>
                        <Card>
                            <Card.Header><h1>Setting</h1></Card.Header>
                            <Card.Body>
                                <MeterWidgetConfigPanel default={{wsInterval:p.default.wsInterval, forceCanvas:p.default.forceCanvas}} onUpdate={(x)=>{
                                    setWSInterval(x.wsInterval);
                                    setForceCanvas(x.forceCanvas);
                                }}/>
                                <MeterWidgetCodeSelectPanel default={p.default.meterSelection} codesToSelect={p.codesToSelect} onUpdate={(d) => setMeterSelection({...d})} />
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Header><h1>Widget URL</h1></Card.Header>
                            <a href={url}>{url}</a>
                        </Card>
                    </Col>
            </Row>
            </Container>
        </>
    );
}

function decodeURL(wsInterval: number, forceCanvas: boolean, baseURL: string, meterSelection: MeterSelectionSetting) : string
{
    const meterIDs = Object.keys(meterSelection).join(',');
    const paramCodes = Object.keys(meterSelection).map((id) => meterSelection[id]).join(',');

    return baseURL + '?' +  "WSInterval=" + wsInterval.toString() + "&ForceCanvas=" + forceCanvas + "&MeterID=" + meterIDs + "&Param=" + paramCodes;
}