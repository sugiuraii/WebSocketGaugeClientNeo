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

import React, { FunctionComponent, useEffect, useRef } from "react";
import * as PIXI from "pixi.js";

type PIXIApplicationProps =
{
    application: PIXI.Application<HTMLCanvasElement>
}

export const PIXIApplication: FunctionComponent<PIXIApplicationProps> = (p) => {
    const pixiAppRef = useRef<HTMLDivElement>(null);

    // Called on unmount
    const unmount = () => {
        if (!pixiAppRef.current)
            return;
        while (pixiAppRef.current.firstChild) {
            pixiAppRef.current.removeChild(pixiAppRef.current.firstChild);
        }
    };

    // Mount pixi.js application view to DOM
    const addAppView = () => {
        const app = p.application;
        if (!pixiAppRef.current)
            return;
        pixiAppRef.current.appendChild(app.view);
    };

    /* eslint-disable react-hooks/exhaustive-deps */
    // Called on mounr
    useEffect(() => {
        if (!pixiAppRef.current)
            return;
        addAppView();
        return unmount;
    }, []);

    return (
        <div>
            <div ref={pixiAppRef} />
        </div>
    );
};

export default PIXIApplication;
