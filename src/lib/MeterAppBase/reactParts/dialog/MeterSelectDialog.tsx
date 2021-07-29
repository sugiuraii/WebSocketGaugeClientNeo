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

import React, { FunctionComponent, useState } from 'react';
import { Form } from 'react-bootstrap';
import { Modal, Button } from 'react-bootstrap';
import { WebsocketParameterCode } from '../../WebsocketObjCollection/WebsocketParameterCode';

type MeterSelectDialogProps = {
    show: boolean,
    default: MeterSelectionSetting,
    codesToSelect: WebsocketParameterCode[],
    onCancel: () => void,
    onSet: (dat: MeterSelectionSetting) => void;
}

export type MeterSelectionSetting = { [meterID: string]: WebsocketParameterCode };

export const MeterSelectDialog: FunctionComponent<MeterSelectDialogProps> = (p) => {
    const [content, setContent] = useState(p.default);

    const handleCancel = () => {
        // Reset forms
        setContent(p.default);
        p.onCancel();
    };

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
                    }}>
                    {selectOptions}
                    </Form.Control>
            </Form.Group>
        );
    }

    const handleSet = () => {
        p.onSet(content);
    };

    return (
        <Modal show={p.show} >
            <Modal.Header closeButton onHide={p.onCancel}>
                <Modal.Title>Meter select</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {selectors}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
                <Button variant="primary" onClick={handleSet}>Set</Button>
            </Modal.Footer>
        </Modal>
    );
};