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
import { Modal, Form, Button } from 'react-bootstrap';

type OptionDialogProps = {
    show: boolean,
    defaultFormContent: OptionDialogFormContents,
    onCancel: () => void,
    onSet: (dat: OptionDialogFormContents) => void;
}

export type OptionDialogFormContents = {
    forceCanvas : boolean
}

export const OptionDialog: FunctionComponent<OptionDialogProps> = (p) => {
    const [forceCanvas, setForceCanvas] = useState(p.defaultFormContent.forceCanvas);

    const handleCancel = () => {
        // Reset forms
        setForceCanvas(p.defaultFormContent.forceCanvas);
        p.onCancel();
    };

    const handleSet = () => p.onSet({forceCanvas : forceCanvas});

    return (
        <Modal show={p.show} >
            <Modal.Header closeButton onHide={p.onCancel}>
                <Modal.Title>Option</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formSetUseCanvasCheckbox">
                        <Form.Check type='checkbox' checked={forceCanvas} label="Force to use canvas." onChange={e => setForceCanvas(e.currentTarget.checked)} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
                <Button variant="primary" onClick={handleSet}>Set</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default OptionDialog;
