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

require('./index.html');

import 'bootswatch/dist/slate/bootstrap.min.css';

import { IndexNavbar } from '../lib/MeterAppBase/reactParts/navbar/IndexNaxbar'
import React  from 'react'
import ReactDOM from 'react-dom'
import { WebstorageHandler } from '../lib/MeterAppBase/Webstorage/WebstorageHandler';

window.onload = () => {
    const webStorage = new WebstorageHandler();

    // Crete react components
    const rootElement = document.getElementById('root');
    ReactDOM.render(<IndexNavbar defaultOptionDialogContent={{ forceCanvas:webStorage.ForceCanvas }}
        onOptionDialogSet={c => {
            webStorage.ForceCanvas = c.forceCanvas;
        }}/>, rootElement);
}