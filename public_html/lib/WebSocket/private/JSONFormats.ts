/* 
 * Copyright (c) 2017, kuniaki
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * * Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */


export interface IJSONMessage
{
    mode : string;
}

export class ResetJSONMessage implements IJSONMessage
{
    public mode : string = "RESET";
}

export class VALJSONMessage implements IJSONMessage
{
    public mode:string = "VAL";
    public val : {[key : string] : number;};
}

export class ErrorJSONMessage implements IJSONMessage
{
    public mode: string = "ERR";
    public msg: string;
}

export class ResponseJSONMessage implements IJSONMessage
{
    public mode: string = "RES";
    public msg: string;
}

export class MomentFuelTripJSONMessage implements IJSONMessage
{
    public mode: string = "MOMENT_FUELTRIP";
    public moment_gasmilage : number;
    public total_gas : number;
    public total_trip : number;
    public total_gasmilage : number;
}

export class SectFuelTripJSONMessage implements IJSONMessage
{
    public mode: string = "SECT_FUELTRIP";
    public sect_span: number;
    public sect_trip : number[];
    public sect_gas : number[];
    public sect_gasmilage : number[];
}

export class SectSpanJSONMessage implements IJSONMessage
{
    public mode : string = "SECT_SPAN";
    public sect_span : number;
}

export class SectStoreMaxJSONMessage implements IJSONMessage
{
    public mode : string = "SECT_STOREMAX";
    public storemax : number;
}

export class SendWSSendJSONMessage implements IJSONMessage
{
    public mode : string;
    public code : string;
    public flag : boolean;
}
export class SendWSIntervalJSONMessage implements IJSONMessage
{
    public mode : string;
    public interval : number;
}
export class SendCOMReadJSONMessage implements IJSONMessage
{
    mode : string;
    code : string;
    read_mode : string;
    flag : boolean;
}
export class SendSlowReadIntervalJSONMessage implements IJSONMessage
{
    mode : string;
    interval : number;
}

