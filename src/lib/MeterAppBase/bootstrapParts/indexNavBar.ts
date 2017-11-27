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

import * as $ from 'jquery';
import {OptionModalDialog} from './OptionModalDialog'

/**
 * Bootstrap navbar class for index.htmls.
 */
export class indexNavBar
{
    /**
     * Create bootstrap navbar for index.html.
     */
    public create()
    {
        const optionModalDialog = new OptionModalDialog();
        optionModalDialog.create();
        $('body').prepend(this.navbarHTML);
    }
    
    private get navbarHTML() : string
    {
        const html = 
            '<nav class="navbar navbar-expand-lg navbar-dark bg-primary">\n\
                <a class="navbar-brand" href="#">Websocket gauge client menu</a>\n\
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">\n\
                    <span class="navbar-toggler-icon"></span>\n\
                </button>\n\
                <div class="collapse navbar-collapse" id="navbarNav">\n\
                    <ul class="navbar-nav mr-auto">\n\
                        <li class="nav-item">\
                            <a class="nav-link" data-toggle="modal" data-target="#optionModal">\n\
                                Options\
                            </a>\
                        </li>\
                    </ul>\
                </div>\
            </nav>';
                   
        return html;
    }    
}
