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
import { ILogger } from '../interfaces/ILogger';

export class LogModalDialog implements ILogger {
  private writeDate = false;

  public get WriteDate(): boolean { return this.writeDate }
  public set WriteDate(flag: boolean) { this.writeDate = flag }

  private dialogHTML(): string {
    const html =
      '<div class="modal fade" id="logModal" tabindex="-1" role="dialog" aria-labelledby="logModalLabel" aria-hidden="true">\
          <div class="modal-dialog" role="document">\
            <div class="modal-content">\
              <div class="modal-header">\
                <h5 class="modal-title" id="logModalLabel">Log window</h5>\
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">\
                  <span aria-hidden="true">&times;</span>\
                </button>\
              </div>\
              <div id="logContents" class="modal-body">\
              </div>\
              <div class="modal-footer">\
                <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>\
              </div>\
            </div>\
          </div>\
        </div>';

    return html;
  }

  private getTimeString(): string {
    return new Date().toLocaleString();
  }

  public clearLog(): void {
    $('#logContents').empty();
  }

  public appendLog(message: string): void {
    let strToAppend: string;
    if (this.writeDate)
      strToAppend = this.getTimeString() + "<br>";
    else
      strToAppend = "";

    strToAppend += (message + "<br>");

    $('#logContents').append(strToAppend);
  }

  public create(): void {
    $('body').append(this.dialogHTML);
  }
}
