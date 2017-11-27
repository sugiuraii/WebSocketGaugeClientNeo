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

/**
 * Bootstrap navbar class for meter application.
 */
export class ApplicationNavBar
{    
    private indicatorEnabledFlag = new indicatorEnaledFlag();
    
    /**
     * Create bootstrap navbar for index.html.
     */
    public create()
    {
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
                    <form class="form-inline">\n\
                        <span id="defiIndicaror" class="badge badge-dark">Defi</span>\
                        <span id="ssmIndicaror" class="badge badge-dark">SSM</span>\
                        <span id="arduinoIndicaror" class="badge badge-dark">Arduino</span>\
                        <span id="elm327Indicaror" class="badge badge-dark">ELM327</span>\
                        <span id="fueltripIndicaror" class="badge badge-dark">FUELTRIP</span>\
                    </form>\
                </div>\
            </nav>';
                   
        return html;
    }
    
    public setDefiIndicatorStatus(status : number)
    {
        if (this.indicatorEnabledFlag.Defi)
            this.changeIndicatorColor("defiIndicator", status)
        else
            this.changeIndicatorColor("defiIndicator", -1)
    }

    public setSSMIndicatorStatus(status : number) 
    {
        if (this.indicatorEnabledFlag.SSM)
            this.changeIndicatorColor("ssmIndicator", status)
        else
            this.changeIndicatorColor("ssmIndicator", -1)
    }
    
    public setArduinoIndicatorStatus(status : number)
    {
        if (this.indicatorEnabledFlag.Arduino)
            this.changeIndicatorColor("arduinoIndicator", status)
        else
            this.changeIndicatorColor("arduinoIndicator", -1)
    }
    
    public setELM327IndicatorStatus(status : number) 
    {
        if (this.indicatorEnabledFlag.ELM327)
            this.changeIndicatorColor("elm327Indicator", status)
        else
            this.changeIndicatorColor("elm327Indicator", -1)
    }
    
    public setFUELTRIPIndicatorStatus(status : number) 
    {
        if (this.indicatorEnabledFlag.FUELTRIP)
            this.changeIndicatorColor("fueltripIndicator", status)
        else
            this.changeIndicatorColor("fueltripIndicator", -1)
    }
    
    public get IsDefiInidicatorEnabled() {return this.indicatorEnabledFlag.Defi }
    public set IsDefiInidicatorEnabled(flag : boolean) { this.indicatorEnabledFlag.Defi = flag }
    public get IsSSMInidicatorEnabled() {return this.indicatorEnabledFlag.SSM }
    public set IsSSMInidicatorEnabled(flag: boolean) {this.indicatorEnabledFlag.SSM = flag }
    public get IsArduinoInidicatorEnabled() {return this.indicatorEnabledFlag.Arduino }
    public set IsArduinoInidicatorEnabled(flag: boolean) {this.indicatorEnabledFlag.Arduino = flag }
    public get IsELM327InidicatorEnabled() {return this.indicatorEnabledFlag.ELM327 }
    public set IsELM327InidicatorEnabled(flag: boolean) {this.indicatorEnabledFlag.ELM327 = flag }
    public get IsFUELTRIPInidicatorEnabled() {return this.indicatorEnabledFlag.FUELTRIP }
    public set IsFUELTRIPInidicatorEnabled(flag: boolean) {this.indicatorEnabledFlag.FUELTRIP = flag }
    
    private changeIndicatorColor(elementID : string, status : number)
    {
        let cssClass : string = "";
        switch (status)
        {
            case WebSocket.CONNECTING://CONNECTING
                cssClass = "badge badge-info";
                break;
            case WebSocket.OPEN://OPEN
                cssClass = "badge badge-success";
                break;
            case WebSocket.CLOSING://CLOSING
                cssClass = "badge badge-warning";
                break;
            case WebSocket.CLOSED://CLOSED
                cssClass = "badge badge-danger";
                break;
            case -1: //Disabled
                cssClass = "badge badge-dark";
                break;
            default:
                // this never happens
                break;     
        }
        
        $(elementID).removeClass().addClass(cssClass);
    }
}

class indicatorEnaledFlag
{
    public Defi = false;
    public SSM = false;
    public Arduino = false;
    public ELM327 = false;
    public FUELTRIP = false;
}