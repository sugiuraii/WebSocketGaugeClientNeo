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

import React, { Fragment } from "react";
import { FunctionComponent, useState } from "react";
import { Form } from "react-bootstrap";

export type MeterWidgetSetPanelCommonProps =
    {
        default: { wsInterval: number, forceCanvas: boolean },
        onUpdate: (p: { wsInterval: number, forceCanvas: boolean }) => void
    }

export const MeterWidgetSetPanelCommon: FunctionComponent<MeterWidgetSetPanelCommonProps> = (p) => {
    const [wsInterval, setWSInterval] = useState(p.default.wsInterval);
    const [forceCanvas, setForceCanvas] = useState(p.default.forceCanvas);

    const handleUpdate = () => p.onUpdate({wsInterval: wsInterval, forceCanvas: forceCanvas});
    return (
        <Fragment>
            <Form>
                <Form.Group controlId="formWSInterval">
                    <Form.Label>Defi/Arduino websocket message interval</Form.Label>
                    <Form.Control type="number" min={0} value={wsInterval} onChange={(evt) => 
                        {
                            setWSInterval(Number(evt.target.value));
                            handleUpdate();
                        }}/>
                </Form.Group>
                <Form.Group controlId="formSetUseCanvasCheckbox">
                    <Form.Check type='checkbox' checked={forceCanvas} label="Force to use canvas." onChange={e => 
                        {
                            setForceCanvas(e.currentTarget.checked);
                            handleUpdate();
                        }} />
                </Form.Group>
            </Form>
        </Fragment>
    );
}
