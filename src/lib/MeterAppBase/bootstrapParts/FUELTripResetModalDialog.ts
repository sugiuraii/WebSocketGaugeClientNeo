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
import {FUELTRIPWebsocket} from '../../WebSocket/WebSocketCommunication';

export class FUELTripResetModalDialog
{
    private get dialogHTML() : string 
    {
        const html =         
        '<div class="modal fade" id="fuelTripResetModal" tabindex="-1" role="dialog" aria-labelledby="fuelTripResetModalLabel" aria-hidden="true">\
          <div class="modal-dialog" role="document">\
            <div class="modal-content">\
              <div class="modal-header">\
                <h5 class="modal-title" id="fuelTripResetModalLabel">Fuel and Trip reset.</h5>\
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">\
                  <span aria-hidden="true">&times;</span>\
                </button>\
              </div>\
              <div class="modal-body">\
                <p>Reset fuel and trip?</p>\
              </div>\
              <div class="modal-footer">\
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>\
                <button type="button" id="fuelTripResetButton" data-dismiss="modal" class="btn btn-primary">Reset</button>\
              </div>\
            </div>\
          </div>\
        </div>';
        
        return html;
    }
    
    /**
     * Create fuel/trip reset button.
     * @param fuelTripWebSocket FUELTRIPWebsocket object to reset (on click reset button).
     */
    public create(fuelTripWebSocket: FUELTRIPWebsocket)
    {
         $('body').append(this.dialogHTML);
         //Assign control change event
         $('#fuelTripResetButtont').on('click', () => {fuelTripWebSocket.SendReset()});
    }
}