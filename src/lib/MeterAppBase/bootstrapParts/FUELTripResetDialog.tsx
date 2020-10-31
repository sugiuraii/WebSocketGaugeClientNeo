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

import React, { FunctionComponent } from 'react';
import { Modal, Button } from 'react-bootstrap';

type FUELTripResetDialogProps = {
    show: boolean,
    onClose: (reset: boolean) => void;
};

const FUELTripResetDialog: FunctionComponent<FUELTripResetDialogProps> = (p) => {
    return (
        <Modal show={p.show} >
            <Modal.Header closeButton onHide={() => p.onClose(false)}>
                <Modal.Title>Reset fuel consumption and trip.</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Reset fuel and trip?</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => p.onClose(false)}>Cancel</Button>
                <Button variant="primary" onClick={() => p.onClose(true)}>Reset</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default FUELTripResetDialog;