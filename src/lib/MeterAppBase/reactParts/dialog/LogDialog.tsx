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

import React, { FunctionComponent, Fragment } from 'react';
import { Modal, Button } from 'react-bootstrap';

type LogDialogProps =
    {
        show: boolean,
        logList: string[],
        onClose: () => void;
    }

export const LogDialog: FunctionComponent<LogDialogProps> = (p) => {
    const logContents: JSX.Element[] = [];
    let key = 0;
    p.logList.forEach(s => {
        logContents.push(<Fragment key={key}>{s}<br /></Fragment>);
        key++;
    });

    return (
        <Modal show={p.show} >
            <Modal.Header closeButton onHide={p.onClose}>
                <Modal.Title>Log</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{logContents}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={p.onClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default LogDialog;