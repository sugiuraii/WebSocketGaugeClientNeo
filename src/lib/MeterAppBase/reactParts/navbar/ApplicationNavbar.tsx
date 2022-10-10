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


import { OptionDialog, OptionDialogFormContents } from '../dialog/OptionDialog'
import { WSIntervalOptionDialog } from '../dialog/WSIntervalOptionDialog'
import { FUELTripResetDialog } from '../dialog/FUELTripResetDialog'
import { LogDialog } from '../dialog/LogDialog'
import { WebsocketStatusIndicator } from '../WebsocketStatusIndicator'
import React, { FunctionComponent, useState, Fragment } from 'react';
import { Navbar, Nav } from 'react-bootstrap'
import { WebsocketState } from '../../WebsocketClientService/WebsocketState'
import { MeterSelectDialog, MeterSelectionSetting } from '../dialog/MeterSelectDialog'
import { WebsocketParameterCode } from '../../WebsocketObjCollection/WebsocketParameterCode'

type ApplicationNavbarProps =
    {
        defaultOptionDialogContent: OptionDialogFormContents,
        defaultWSInterval: number,
        logList: string[],
        onOptionDialogSet?: (content: OptionDialogFormContents) => void,
        onWSIntervalDialogSet?: (wsInterval: number) => void,
        onFUELTripResetDialogSet?: (reset: boolean) => void,
        onMeterSelectDialogSet?: (data : MeterSelectionSetting) => void,
        defaultMeterSelectDialogContent?: MeterSelectionSetting,
        parameterToSelectInMeterSelectDialog?: WebsocketParameterCode[],
        websocketStatusList: { [name: string]: WebsocketState },
        opacityOnMouseOff : string,
        onWebStorageReset:() => void
    };

export const ApplicationNavbar: FunctionComponent<ApplicationNavbarProps> = (p) => {
    const [showOptionDialog, setShowOptionDialog] = useState(false);
    const [showWSIntervalDialog, setShowWSIntervalDialog] = useState(false);
    const [showFUELTripResetDialog, setShowFUELTripResetDialog] = useState(false);
    const [showLogDialog, setShowLogDialog] = useState(false);
    const [showMeterSelectDialog, setShowMeterSelectDialog] = useState(false);
    const [mouseOver, setMouseOver] = useState(false);

    return (
        <Fragment>
            <Navbar bg="dark" fixed="top" variant="dark" expand="lg" style={{ transition: "opacity .35s", opacity: mouseOver ? "1.0" : p.opacityOnMouseOff }} onMouseOver={() => setMouseOver(true)} onMouseLeave={() => setMouseOver(false)} >
                <Navbar.Brand>Menu</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Item>
                            <Nav.Link href="../index.html">Home</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link disabled={p.onOptionDialogSet === undefined} onClick={() => setShowOptionDialog(true)}>Option</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link disabled={p.onWSIntervalDialogSet === undefined} onClick={() => setShowWSIntervalDialog(true)}>WSInterval</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link disabled={p.onFUELTripResetDialogSet === undefined} onClick={() => setShowFUELTripResetDialog(true)}>Fuel/Trip reset</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link onClick={() => setShowLogDialog(true)}>Log</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link onClick={() => p.onWebStorageReset()}>Reset setting</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link disabled={p.onMeterSelectDialogSet === undefined} onClick={() => setShowMeterSelectDialog(true)}>Edit meter</Nav.Link>
                        </Nav.Item>
                    </Nav>
                    <WebsocketStatusIndicator statusList={p.websocketStatusList} />
                </Navbar.Collapse>
            </Navbar>
            <OptionDialog onCancel={() => setShowOptionDialog(false)}
                onSet={(d) => {
                    setShowOptionDialog(false);
                    if(p.onOptionDialogSet !== undefined)
                        p.onOptionDialogSet(d);
                }}
                show={showOptionDialog} defaultFormContent={p.defaultOptionDialogContent} />
            <WSIntervalOptionDialog show={showWSIntervalDialog} interval={p.defaultWSInterval} onCancel={() => setShowWSIntervalDialog(false)}
                onSet={(newinterval) => {
                    setShowWSIntervalDialog(false);
                    if(p.onWSIntervalDialogSet !== undefined)
                        p.onWSIntervalDialogSet(newinterval);
                }} />
            <FUELTripResetDialog show={showFUELTripResetDialog}
                onClose={(reset) => {
                    setShowFUELTripResetDialog(false);
                    if(p.onFUELTripResetDialogSet !== undefined)
                        p.onFUELTripResetDialogSet(reset);
                }} />
            <LogDialog show={showLogDialog} logList={p.logList} onClose={() => setShowLogDialog(false)} />
            { p.defaultMeterSelectDialogContent !== undefined &&
            <MeterSelectDialog  show={showMeterSelectDialog} onCancel={() => setShowMeterSelectDialog(false)}
                                onSet={(dat) => 
                                {
                                    setShowMeterSelectDialog(false);
                                    if(p.onMeterSelectDialogSet !== undefined)
                                        p.onMeterSelectDialogSet(dat);
                                }}
                                codesToSelect = {(p.parameterToSelectInMeterSelectDialog === undefined)?[]:p.parameterToSelectInMeterSelectDialog }
                                default={p.defaultMeterSelectDialogContent}
                />
            }
        </Fragment>
    );
};

export default ApplicationNavbar;