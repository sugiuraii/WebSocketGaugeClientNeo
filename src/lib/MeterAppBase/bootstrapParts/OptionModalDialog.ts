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

export class OptionModalDialog
{
    private onWSIntervalSpinnerValueChanged : (val : number) => void = (val : number) => 
    {
        localStorage.setItem("WSInterval", val.toString());
    };
    
    private onPIXIJSSwitchIsChanged : (forceCanvas : boolean)=> void = (forceCanvas : boolean) =>
    {
        localStorage.setItem("ForceCanvas", forceCanvas?"true":"false");
    };
    
    /**
     * Event listener on WSIntervalSpinner is changed.
     */
    //public set OnWSIntervalSpinnerValueChanged(listener : (val:number) => void ) {this.onWSIntervalSpinnerValueChanged = listener };
    
    /**
     * Event listener on PIXI.js related option switch is changed.
     */
    //public set OnPIXIJSSwitchIsChanged(listener: (forceCanvas : boolean) => void) {this.onPIXIJSSwitchIsChanged = listener };
    
    private get dialogHTML() : string
    {
        const optionModalDialogHTML = 
        '<div class="modal fade" id="optionModal" tabindex="-1" role="dialog">\
            <div class="modal-dialog" role="document">\
              <div class="modal-content">\
                <div class="modal-header">\
                  <h5 class="modal-title">Options</h5>\
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">\
                        <span aria-hidden="true">&times;</span>\
                  </button>\
                </div>\
                <div class="modal-body">\
                    <form>\
                        <div class="form-group">\
                            <label for="wsIntervalInput">Defi/Arduino websocket message interval</label>\
                            <input type="number" class="form-control" id="wsIntervalInput" min="0" placeholder="0">\
                        </div>\
                        <hr>\
                        <div class="form-check">\
                            <label class="form-check-label">\
                            <input id="forceCanvasCheckBox" class="form-check-input" type="checkbox" value="">Force canvas rendering instead of WebGL\
                            </label>\
                        </div>\
                    </form>\
                </div>\
                <div class="modal-footer">\
                  <button type="button" class="btn btn-primary" data-dismiss="modal" >Close</button>\
                </div>\
              </div>\
            </div>\
          </div>\
        ';
        
        return optionModalDialogHTML;
    }
    
    public create()
    {
        $('body').append(this.dialogHTML);
        
        //Assign control change event
        $('#wsIntervalInput').on('change', ()=>{this.onWSIntervalSpinnerValueChanged(Number($('#wsIntervalInput').val()))});
        $('#forceCanvasCheckBox').on('change', () => {this.onPIXIJSSwitchIsChanged(Boolean($('#forceCanvasCheckBox').prop('checked')))});
    }
    
}
    
