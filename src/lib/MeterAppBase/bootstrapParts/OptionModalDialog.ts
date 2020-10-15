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

import $ from "jquery";

export class OptionModalDialog {
  /**
   * Event listener on WSIntervalSpinner is changed.
   */
  private onWSIntervalSpinnerValueChanged: (val: number) => void = (val: number) => {
    localStorage.setItem("WSInterval", val.toString());
  };

  /**
   * Event listener on PIXI.js related option switch is changed.
   */
  private onPIXIpreserveDrawingBufferSwitchChanged: (preserveDrawingBuffer: boolean) => void = (preserveDrawingBuffer: boolean) => {
    localStorage.setItem("preserveDrawingBuffer", preserveDrawingBuffer ? "true" : "false");
  };

  private get dialogHTML(): string {
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
                          <label for="wsURL">Websocket server URL</label>\
                          <input type="text" class="form-control" id="websocketServerHostname" content=""ws://wsserveraddress.to.set/" placeholder="0">\
                        </div>\
                        <hr>\
                        <div class="form-check">\
                          <label class="form-check-label">\
                          <input id="setWSServerSameAsHttpSite" class="form-check-input" type="checkbox" value="">Set websocket server address same as this website.\
                          </label>\
                        </div>\
                        <hr>\
                        <div class="form-group">\
                            <label for="wsIntervalInput">Defi/Arduino websocket message interval</label>\
                            <input type="number" class="form-control" id="wsIntervalInput" min="0" placeholder="0">\
                        </div>\
                        <hr>\
                        <div class="form-check">\
                            <label class="form-check-label">\
                            <input id="preserveDrawingBufferCheckBox" class="form-check-input" type="checkbox" value="">Enable preserveDrawingBuffer on pixi.js\
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

  private setInitialValue() {
    if (!localStorage.getItem("WSServerHostname"))
      localStorage.setItem("WSServerHostname", location.hostname);
    if (!localStorage.getItem("SetWSServerSameAsHttp"))
      localStorage.setItem("SetWSServerSameAsHttp", "true");
    if (!localStorage.getItem("WSInterval"))
      localStorage.setItem("WSInterval", "0");
    if (!localStorage.getItem("preserveDrawingBuffer"))
      localStorage.setItem("preserveDrawingBuffer", "false");
  }

  public create(): void {
    $('body').append(this.dialogHTML);

    // Set default value if keys are not found on webstorage.
    this.setInitialValue();

    //Load stored value from webstorage
    const wsInterval = Number(localStorage.getItem("WSInterval"));
    const preserveDrawingBuffer = localStorage.getItem("preserveDrawingBuffer") === "true" ? true : false;
    $('#wsIntervalInput').val(wsInterval);
    $('#preserveDrawingBufferCheckBox').prop('checked', preserveDrawingBuffer);

    const wsServerHostname: string = (typeof localStorage.getItem("WSServerHostname") === "string")?(localStorage.getItem("WSServerHostname") as string):"localhost";
    const setWSServerSameAsHttpSite: boolean = localStorage.getItem("SetWSServerSameAsHttp") === "true" ? true : false;
    $('#websocketServerHostname').val(wsServerHostname);
    $('#setWSServerSameAsHttpSite').prop('checked', setWSServerSameAsHttpSite);
    $('#websocketServerHostname').prop('disabled', setWSServerSameAsHttpSite);

    //Assign control change event
    $('#wsIntervalInput').on('change', () => { this.onWSIntervalSpinnerValueChanged(Number($('#wsIntervalInput').val())) });
    $('#preserveDrawingBufferCheckBox').on('change', () => { this.onPIXIpreserveDrawingBufferSwitchChanged(Boolean($('#preserveDrawingBufferCheckBox').prop('checked'))) });
    $('#websocketServerHostname').on('change', () => localStorage.setItem("WSServerHostname", String($('#websocketServerHostname').val())));
    $('#setWSServerSameAsHttpSite').on('change', () => {
      const setWSServerSameAsHttpSite: boolean = $('#setWSServerSameAsHttpSite').prop('checked');
      localStorage.setItem("SetWSServerSameAsHttp", setWSServerSameAsHttpSite ? "true" : "false");
      $('#websocketServerHostname').prop('disabled', setWSServerSameAsHttpSite);
    })
  }

}

