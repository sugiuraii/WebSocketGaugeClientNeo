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

import $ from 'jquery';

import { FUELTripResetModalDialog } from "./FUELTripResetModalDialog"
import { LogModalDialog } from "./LogModalDialog"
import { OptionModalDialog } from "./OptionModalDialog"

import 'bootstrap';
import 'jquery';
import 'popper.js';
import '../../../css/bootstrap-slate/bootstrap.slate.min.css';
import { IStatusIndicator } from '../interfaces/IStatusIndicator';
import { WebsocketStatus } from '../WebsocketAppBackend/WebsocketStatus'

class WebsocketStatusIndicator implements IStatusIndicator {

    private readonly elementID: string;
    private isEnabled = true;

    constructor(elementID: string) {
        this.elementID = elementID;
    }

    public SetStatus(status: WebsocketStatus) {
        let cssClass = "";
        const elementID = this.elementID;

        if (!this.isEnabled)
            //Disabled
            cssClass = "badge badge-dark";
        else {
            switch (status) {
                case WebsocketStatus.Connecting:
                    cssClass = "badge badge-info";
                    break;
                case WebsocketStatus.Open:
                    cssClass = "badge badge-success";
                    break;
                case WebsocketStatus.Closing:
                    cssClass = "badge badge-warning";
                    break;
                case WebsocketStatus.Closed:
                    cssClass = "badge badge-danger";
                    break;
                default:
                    throw Error("Unknown websocket stauts is assigned to WebsocketIndicator.")
                    break;
            }
        }

        $('#' + elementID).removeClass().addClass(cssClass);
    }
}

/**
 * Bootstrap navbar class for meter application.
 */
export class ApplicationNavBar {

    private logModalDialog = new LogModalDialog();
    private fuelTripResetModalDialog = new FUELTripResetModalDialog();

    private webSocketIndicators: { [key: string]: WebsocketStatusIndicator; } = {};

    private isCreated = false;

    public get LogModalDialog(): LogModalDialog { return this.logModalDialog }
    public get FUELTRIPModalDialog(): FUELTripResetModalDialog { return this.fuelTripResetModalDialog }

    public GetWebSocketStatusIndicator(id: string): IStatusIndicator {
        return this.webSocketIndicators[id];
    }

    public AddWebSocketStatusIndicator(id: string, caption: string): void {
        if (this.webSocketIndicators[id] != undefined)
            throw Error("Indicator of id=" + id + " already exists.");
        else if ($('#' + id).length != 0)
            throw Error("Element id of " + id + " is reaseved in template HTML.");
        else if (!this.isCreated)
            throw Error("Application Navbar is not created. Call create() first.");
        else {
            this.webSocketIndicators[id] = new WebsocketStatusIndicator(id);
            $("#webSocketStatusIndicatorContainer").append('<span id="' + id + '" class="badge badge-dark">' + caption + '</span>');
        }
    }

    /**
     * Create bootstrap navbar for index.html.
     */
    public create(): void {
        if (this.isCreated)
            throw Error("Application NavBar is already created");

        // Create subparts.
        const optionModalDialog = new OptionModalDialog();
        optionModalDialog.create();
        this.logModalDialog.create();
        this.fuelTripResetModalDialog.create();

        $('body').prepend(this.navbarHTML);
        this.isCreated = true;
    }

    private get navbarHTML(): string {
        const html =
            '<nav class="navbar fixed-top navbar-expand-lg navbar-dark bg-primary" style="transition: opacity .35s; opacity : 0.1;" onmouseover="this.style.opacity = 1" onmouseleave="this.style.opacity = 0.1">\n\
                <a class="navbar-brand" href="#">Menu</a>\n\
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">\n\
                    <span class="navbar-toggler-icon"></span>\n\
                </button>\n\
                <div class="collapse navbar-collapse" id="navbarNav">\n\
                    <ul class="navbar-nav mr-auto">\n\
                        <li class="nav-item">\
                            <a class="nav-link" href="../index.html">\n\
                                Home\
                            </a>\
                        </li>\
                        <li class="nav-item">\
                            <a class="nav-link" data-toggle="modal" data-target="#optionModal">\n\
                                Options\
                            </a>\
                        </li>\
                        <li class="nav-item">\
                            <a class="nav-link" data-toggle="modal" data-target="#fuelTripResetModal">\n\
                                Fuel/Trip Reset\
                            </a>\
                        </li>\
                        <li class="nav-item">\
                            <a class="nav-link" data-toggle="modal" data-target="#logModal">\
                                Message\n\
                            </a>\n\
                        </li>\n\
                    </ul>\n\
                    <form id="webSocketStatusIndicatorContainer" class="form-inline">\n\
                    </form>\
                </div>\
            </nav>';

        return html;
    }
}
