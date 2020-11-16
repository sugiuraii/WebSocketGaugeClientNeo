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

export class WebstorageHandler {

    public get WebsocketServerHome() : string
    {
        const wsServerHostname = localStorage.getItem("WSServerHostname");
        return wsServerHostname === null ? location.hostname : wsServerHostname;
    }

    public set WebsocketServerHome(host : string)
    {
        localStorage.setItem("WSServerHostname", host);
    }

    public get WSServerSameAsHttp() : boolean
    {
        const wsServerSameAsHttp = localStorage.getItem("SetWSServerSameAsHttp");
        return wsServerSameAsHttp === null? true : wsServerSameAsHttp === "true";
    }

    public set WSServerSameAsHttp(flag : boolean)
    {
        localStorage.setItem("SetWSServerSameAsHttp", flag?"true":"false");
    }

    public get WSInterval() : number
    {
        const wsInterval = localStorage.getItem("WSInterval");
        return wsInterval === null ? 0 : Number(wsInterval);
    }

    public set WSInterval(interval : number)
    {
        localStorage.setItem("WSInterval", interval.toString());
    }

    public get PreserveDrawingBuffer() : boolean
    {
        const preserveDrawingBuffer = localStorage.getItem("preserveDrawingBuffer")
        return (preserveDrawingBuffer === null) ? false : preserveDrawingBuffer === "true";
    }
}

