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
import { Modal, Form, Button } from 'react-bootstrap';

type WSIntervalOptionDialogProps = {
    show : boolean,
    interval : number,
    onCancel : () => void,
    onSet : (newInterval : number) => void
}

export const WSIntervalOptionDialog : FunctionComponent<WSIntervalOptionDialogProps> = (p) => {
    const [interval, setInterval] = useState(p.interval);

    return (
        <Modal show={p.show} >
            <Modal.Header closeButton onHide={p.onCancel}>
                <Modal.Title>Websocket message interval.</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formWSInterval">
                        <Form.Label>Defi/Arduino websocket message interval</Form.Label>
                        <Form.Control type="number" min={0} value={interval} onChange={(evt) => setInterval(Number(evt.target.value))} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={p.onCancel}>Cancel</Button>
                <Button variant="primary" onClick={() => p.onSet(interval)}>Set</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default WSIntervalOptionDialog;
