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
import React, { Fragment } from "react";
import { FunctionComponent, useState } from "react";
import { Form } from "react-bootstrap";
import { MeterSelectionSetting } from "../../dialog/MeterSelectDialog";

export type MeterWidgetCodeSelectPanelProps =
    {
        default: MeterSelectionSetting,
        codesToSelect: WebsocketParameterCode[],
        onUpdate: (dat: MeterSelectionSetting) => void;
    }

export const MeterWidgetCodeSelectPanel: FunctionComponent<MeterWidgetCodeSelectPanelProps> = (p) => {
    const [content, setContent] = useState(p.default);

    const selectOptions = p.codesToSelect.map(c => <option key={c}>{c}</option>);

    // Create parameter code selector
    const selectors: JSX.Element[] = [];
    for (const key in content) {
        const val = content[key];
        selectors.push(
            <Form.Group key={key}>
                <Form.Label>{key}</Form.Label>
                <Form.Control as="select"
                    value={val}
                    onChange={e => {
                        const newContent = {...content}; // Need to re-create array to update DOM.
                        newContent[key] = e.target.value as WebsocketParameterCode;
                        setContent(newContent);
                        handleUpdate(newContent);
                    }}>
                    {selectOptions}
                    </Form.Control>
            </Form.Group>
        );
    }

    const handleUpdate = (newContent: MeterSelectionSetting) => {
        p.onUpdate(newContent);
    };

    return (
        <Fragment>
            {selectors}
        </Fragment>
    );
}
