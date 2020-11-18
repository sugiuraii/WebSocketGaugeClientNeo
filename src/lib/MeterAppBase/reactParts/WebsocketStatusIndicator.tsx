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
import { Badge } from 'react-bootstrap';
import { WebsocketConnectionStatus } from '../WebsocketAppBackend/WebsocketConnectionStatus'
import { WebsocketState } from '../WebsocketAppBackend/WebsocketState';

type WebsocketStatusIndicatorProps =
    {
        statusList: { [name: string]: WebsocketState }
    }

export const WebsocketStatusIndicator: FunctionComponent<WebsocketStatusIndicatorProps> = (p) => {
    const badges: JSX.Element[] = [];
    for (const name in p.statusList) {
        const variant = getBadgeVariant(p.statusList[name].isEnabled, p.statusList[name].connectionStatus);
        badges.push(<Badge variant={variant}>{name}</Badge>);
    }
    return (
        <div>
            {badges}
        </div>
    );
}

function getBadgeVariant(isEnabled: boolean, status: WebsocketConnectionStatus): string {
    if (!isEnabled)
        return "dark";
    else {
        switch (status) {
            case WebsocketConnectionStatus.Connecting:
                return "info";
            case WebsocketConnectionStatus.Open:
                return "success";
            case WebsocketConnectionStatus.Closing:
                return "warning";
            case WebsocketConnectionStatus.Closed:
                return "danger";
            default:
                throw Error("Unknown websocket stauts is assigned to WebsocketIndicator.")
        }
    }
}

export default WebsocketStatusIndicator;