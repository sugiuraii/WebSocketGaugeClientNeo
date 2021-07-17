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

import { OptionDialog, OptionDialogFormContents } from '../dialog/OptionDialog'
import React, { FunctionComponent, useState, Fragment } from 'react';
import { Navbar, Nav } from 'react-bootstrap';

type IndexNavbarProps =
    {
        defaultOptionDialogContent: OptionDialogFormContents,
        onOptionDialogSet: (content: OptionDialogFormContents) => void
    };

export const IndexNavbar: FunctionComponent<IndexNavbarProps> = (p) => {
    const [showDialog, SetShowDialog] = useState(false);

    return (
        <Fragment>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Navbar.Brand>Menu</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Item>
                            <Nav.Link onClick={() => SetShowDialog(true)}>Option</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="./AllResetWebstorage.html" >Reset webstorage (for all pages)</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <OptionDialog onCancel={() => SetShowDialog(false)}
                onSet={(d) => {
                    SetShowDialog(false);
                    p.onOptionDialogSet(d);
                }}
                show={showDialog} defaultFormContent={p.defaultOptionDialogContent} />
        </Fragment>
    );
};

export default IndexNavbar;