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

type OptionDialogProps = {
    show: boolean,
    defaultFormContent : OptionDialogFormContents,
    onCancel: () => void,
    onSet: (dat: OptionDialogFormContents) => void;
}

export type OptionDialogFormContents = {
    host: string,
    wsHostSameAsHttpHost: boolean,
    pixijsPreserveDrawingBuffer: boolean
}

export const OptionDialog: FunctionComponent<OptionDialogProps> = (p) => {
    const [host, setHost] = useState(p.defaultFormContent.host);
    const [wsHostSameAsHttpHost, setWSHostSameAsHttpHost] = useState(p.defaultFormContent.wsHostSameAsHttpHost);
    const [pixijsPreserveDrawingBuffer, setPIXIJSPreserveDrawingBuffer] = useState(p.defaultFormContent.pixijsPreserveDrawingBuffer);

    return (
        <Modal show={p.show} >
            <Modal.Header closeButton onHide={p.onCancel}>
                <Modal.Title>Option</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formWSURL">
                        <Form.Label>Websocket server hostname/ip</Form.Label>
                        <Form.Control type="text" value={host} onChange={(e) => setHost(e.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="formSetWSServerHttpSiteCheckbox">
                        <Form.Check type='checkbox' checked={wsHostSameAsHttpHost} label="Set websocket server address same as this website." onChange={e => setWSHostSameAsHttpHost(e.currentTarget.checked)} />
                    </Form.Group>
                    <Form.Group controlId="formPreserveDrawingBufferCheckBox">
                        <Form.Check type="checkbox" checked={pixijsPreserveDrawingBuffer} label="Enable preserveDrawingBuffer on pixi.js." onChange={e => setPIXIJSPreserveDrawingBuffer(e.currentTarget.checked)} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={p.onCancel}>Close</Button>
                <Button variant="primary" onClick={() => p.onSet({ host: host, wsHostSameAsHttpHost: wsHostSameAsHttpHost, pixijsPreserveDrawingBuffer: pixijsPreserveDrawingBuffer })}>Set</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default OptionDialog;
