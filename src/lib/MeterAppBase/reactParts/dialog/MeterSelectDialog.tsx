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

import React, { FunctionComponent, useState } from 'react';
import { Form } from 'react-bootstrap';
import { Modal, Button } from 'react-bootstrap';
import { WebsocketParameterCode } from '../../WebsocketObjCollection/WebsocketParameterCode';

type MeterSelectDialogProps = {
    show: boolean,
    default: MeterSelectDialogCotents,
    codesToSelect: WebsocketParameterCode[],
    onCancel: () => void,
    onSet: (dat: MeterSelectDialogCotents) => void;
}

export type MeterSelectDialogCotents = { caption: string, selectedCode: WebsocketParameterCode }[];

export const MeterSelectDialog: FunctionComponent<MeterSelectDialogProps> = (p) => {
    const [parameterCode, setParameterCode] = useState(p.default.map(v => v.selectedCode));

    const handleCancel = () => {
        // Reset forms
        setParameterCode(p.default.map(v => v.selectedCode));
        p.onCancel();
    };

    const selectOptions = p.codesToSelect.map(c => <option key={c}>{c}</option>);

    // Create parameter code selector
    const selectors: JSX.Element[] = [];
    for (let i = 0; i < p.default.length; i++) {
        const v = p.default[i];
        selectors.push(
            <Form.Group key={v.caption}>
                <Form.Label>{v.caption}</Form.Label>
                <Form.Control as="select"
                    value={v.selectedCode}
                    onChange={e => {
                        parameterCode[i] = e.target.value as WebsocketParameterCode;
                        setParameterCode(parameterCode);
                    }}>
                    {selectOptions}
                    </Form.Control>
            </Form.Group>
        );
    }

    const handleSet = () => {
        const newContent: MeterSelectDialogCotents = [];
        for (let i = 0; i < p.default.length; i++)
            newContent.push({ caption: p.default[i].caption, selectedCode: parameterCode[i] });
        p.onSet(newContent);
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