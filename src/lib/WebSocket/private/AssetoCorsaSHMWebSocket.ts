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

import * as Interpolation from "./Interpolation";
import * as JSONFormats from "./JSONFormats";
import {WebsocketCommon} from "./WebsocketCommon";
import {DefiSSMWebsocketCommon} from "./DefiSSMWebSocket";

export class AssettoCorsaSHMWebsocket extends DefiSSMWebsocketCommon
{
    constructor()
    {
        super();
        this.modePrefix = "ACSHM";
    }

    public SendPhysicsWSSend(code : string, flag : boolean)
    {
        this.SendWSSend("PHYS", code, flag);
    }

    public SendGraphicsWSSend(code : string, flag : boolean)
    {
        this.SendWSSend("GRPH", code, flag);
    }

    public SendStaticInfoWSSend(code : string, flag : boolean)
    {
        this.SendWSSend("STATIC", code, flag);
    }

    public SendPhysicsWSInterval(interval : number)
    {
        this.SendWSInterval("PHYS", interval);
    }

    public SendGraphicsWSInterval(interval : number)
    {
        this.SendWSInterval("GRPH", interval);
    }

    public SendStaticInfoWSInterval(interval : number)
    {
        this.SendWSInterval("STATIC", interval);
    }

    private SendWSSend(paramtype : string, code : string, flag : boolean) : void
    {
        if (!this.IsConnetced)
            return;

        let sendWSSendObj = new JSONFormats.SendWSSendJSONMessage();          
        sendWSSendObj.mode = this.modePrefix + "_" + paramtype + "_WS_SEND";
        sendWSSendObj.code = code;
        sendWSSendObj.flag = flag;
        let jsonstr: string = JSON.stringify(sendWSSendObj);
        this.WebSocket.send(jsonstr);
    }

    private SendWSInterval(paramtype : string, interval : number) : void
    {
        if (!this.IsConnetced)
            return;

        let sendWSIntervalObj = new JSONFormats.SendWSIntervalJSONMessage();
        sendWSIntervalObj.mode = this.modePrefix + "_" + paramtype + "_WS_INTERVAL";
        sendWSIntervalObj.interval = interval;           
        var jsonstr = JSON.stringify(sendWSIntervalObj);
        this.WebSocket.send(jsonstr);
    }    
}