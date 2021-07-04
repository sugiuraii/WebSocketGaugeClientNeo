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
    defaultFormContent: MeterSelectDialogCotents,
    onCancel: () => void,
    onSet: (dat: MeterSelectDialogCotents) => void;
}

type MeterSelectDialogCotents =
    {
        ParameterCode: WebsocketParameterCode[]
    };

export const MeterSelectDialog: FunctionComponent<MeterSelectDialogProps> = (p) => {
    const [parameterCode, setParameterCode] = useState(p.defaultFormContent.ParameterCode);

    const handleCancel = () => {
        // Reset forms
        setParameterCode(p.defaultFormContent.ParameterCode);
        p.onCancel();
    };

    const handleSet = () => p.onSet({ ParameterCode: parameterCode });
    const parameterCodeSelectOptions = Object.keys(WebsocketParameterCode).map(x => <option key={x}  value={x}>{x}</option>);
    return (
        <Modal show={p.show} >
            <Modal.Header closeButton onHide={p.onCancel}>
                <Modal.Title>Meter select</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group controlId="formBasicSelect">
                    <Form.Label>Select parameter code</Form.Label>
                    <Form.Control as="select"
                        value={parameterCode[0]}
                        onChange={e => {
                            parameterCode[0] = e.target.value as WebsocketParameterCode;
                            setParameterCode(parameterCode);}}>
                            {parameterCodeSelectOptions}
                        </Form.Control>
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
                <Button variant="primary" onClick={handleSet}>Set</Button>
            </Modal.Footer>
        </Modal>
    );
};