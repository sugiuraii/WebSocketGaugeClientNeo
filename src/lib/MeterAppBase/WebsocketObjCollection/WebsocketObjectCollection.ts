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

import { DefiWebsocketBackend } from "../WebsocketAppBackend/DefiWebsocketBackend";
import { SSMWebsocketBackend } from "../WebsocketAppBackend/SSMWebsocketBackend";
import { ArduinoWebsocketBackend } from "../WebsocketAppBackend/ArduinoWebsocketBackend";
import { ELM327WebsocketBackend } from "../WebsocketAppBackend/ELM327WebsocketBackend";
import { AssettoCorsaSHMWebsocketBackend } from "../WebsocketAppBackend/AssettoCorsaSHMWebsocketBackend";
import { FUELTRIPWebsocketBackend } from "../WebsocketAppBackend/FUELTRIPWebsocketBackend";
import { ILogger } from "../utils/ILogger";
import { WebsocketState } from "../WebsocketAppBackend/WebsocketState";
import { WebsocketClientMapEntry, WebsocketClientMapper } from "./WebsocketClientMapper";
import { WebsocketParameterCode } from "./WebsocketParameterCode";
import { WebsocketMapFactory } from "./WebsocketMapFactory";

export class WebsocketObjectCollectionOption
{
    public DefiWSEnabled = false;
    public DefiWSURL =  "ws://" + location.hostname + ":" + DefiWebsocketBackend.DEFAULT_WS_PORT.toString() + DefiWebsocketBackend.WS_URL_PATH;
    public SSMWSEnabled = false;
    public SSMWSSURL = "ws://" + location.hostname + ":" + SSMWebsocketBackend.DEFAULT_WS_PORT.toString() + SSMWebsocketBackend.WS_URL_PATH;
    public ArduinoWSEnabled = false;
    public ArduinoWSURL = "ws://" + location.hostname + ":" + ArduinoWebsocketBackend.DEFAULT_WS_PORT.toString() + ArduinoWebsocketBackend.WS_URL_PATH;
    public ELM327WSEnabled = false;
    public ELM327WSURL = "ws://" + location.hostname + ":" + ELM327WebsocketBackend.DEFAULT_WS_PORT.toString() + ELM327WebsocketBackend.WS_URL_PATH;
    public FUELTRIPWSEnabled = false;
    public FUELTRIPWSURL = "ws://" + location.hostname + ":" + FUELTRIPWebsocketBackend.DEFAULT_WS_PORT.toString() + FUELTRIPWebsocketBackend.WS_URL_PATH;
    public FUELTRIPWSOption : {FUELTRIPSectSpan: number, FUELTRIPSectStoreMax: number} = {FUELTRIPSectSpan : 300, FUELTRIPSectStoreMax : 6};
    public AssettoCorsaWSEnabled = false;
    public AssettoCorsaWSURL = "ws://" + location.hostname + ":" + AssettoCorsaSHMWebsocketBackend.DEFAULT_WS_PORT.toString() + AssettoCorsaSHMWebsocketBackend.WS_URL_PATH;

    public WSMap : Map<WebsocketParameterCode, WebsocketClientMapEntry>;

    constructor()
    {
        const mapFactory = new WebsocketMapFactory();
        this.WSMap = mapFactory.DefaultELM327Map;
    }
}

export class WebsocketObjectCollection {
    private readonly Option: WebsocketObjectCollectionOption;

    private readonly wsmapper : WebsocketClientMapper;

    private readonly defiWS: DefiWebsocketBackend | undefined;
    private readonly ssmWS: SSMWebsocketBackend | undefined;
    private readonly arduinoWS: ArduinoWebsocketBackend | undefined;
    private readonly elm327WS: ELM327WebsocketBackend | undefined;
    private readonly fueltripWS: FUELTRIPWebsocketBackend | undefined;
    private readonly assettoCorsaWS: AssettoCorsaSHMWebsocketBackend | undefined;

    private readonly websocketStates : {[name : string] : WebsocketState} = {};

    public get WSMapper() : WebsocketClientMapper
    {
        return this.wsmapper;
    }

    get DefiWS(): DefiWebsocketBackend {
        if (this.defiWS != undefined)
            return this.defiWS as DefiWebsocketBackend;
        else
            throw ReferenceError("DefiWSBackend is not defined.");
    }

    get SSMWS(): SSMWebsocketBackend {
        if (this.ssmWS != undefined)
            return this.ssmWS as SSMWebsocketBackend;
        else
            throw ReferenceError("SSMWSBackennd is not defined.");
    }

    get ArduinoWS(): ArduinoWebsocketBackend {
        if (this.arduinoWS != undefined)
            return this.arduinoWS as ArduinoWebsocketBackend;
        else
            throw ReferenceError("ArduinoWSBackennd is not defined.");
    }

    get ELM327WS(): ELM327WebsocketBackend {
        if (this.elm327WS != undefined)
            return this.elm327WS as ELM327WebsocketBackend;
        else
            throw ReferenceError("ELM327WSBackennd is not defined.");
    }

    get FUELTRIPWS(): FUELTRIPWebsocketBackend {
        if (this.fueltripWS != undefined)
            return this.fueltripWS as FUELTRIPWebsocketBackend;
        else
            throw ReferenceError("FUELTRIPWSBackennd is not defined.");
    }

    get AssettoCorsaWS(): AssettoCorsaSHMWebsocketBackend {
        if (this.assettoCorsaWS != undefined)
            return this.assettoCorsaWS as AssettoCorsaSHMWebsocketBackend;
        else
            throw ReferenceError("AssettoCorsaSHMWSBackennd is not defined.");
    }

    get WebsocketStates() : {[name : string] : WebsocketState } { return this.websocketStates }

    constructor(logger : ILogger, option: WebsocketObjectCollectionOption, wsInterval : number) {
        this.Option = option;

        if (this.Option.DefiWSEnabled) {
            this.defiWS = new DefiWebsocketBackend(this.Option.DefiWSURL, logger, wsInterval);
            this.websocketStates[this.defiWS.getName()] = this.defiWS.getWebsocketState();
        }
        else
            this.defiWS = undefined;

        if (this.Option.SSMWSEnabled) {
            this.ssmWS = new SSMWebsocketBackend(this.Option.SSMWSSURL, logger);
            this.websocketStates[this.ssmWS.getName()] = this.ssmWS.getWebsocketState();
        }
        else
            this.ssmWS = undefined;

        if (this.Option.ArduinoWSEnabled) {
            this.arduinoWS = new ArduinoWebsocketBackend(this.Option.ArduinoWSURL, logger, wsInterval);
            this.websocketStates[this.arduinoWS.getName()] = this.arduinoWS.getWebsocketState();
        }
        else
            this.arduinoWS = undefined;

        if (this.Option.ELM327WSEnabled) {
            this.elm327WS = new ELM327WebsocketBackend(this.Option.ELM327WSURL, logger);
            this.websocketStates[this.elm327WS.getName()] = this.elm327WS.getWebsocketState();
        }
        else
            this.elm327WS = undefined;

        if (this.Option.FUELTRIPWSEnabled) {
            const fuelTripSectSpan = this.Option.FUELTRIPWSOption.FUELTRIPSectSpan
            const fuelTripSectStoreMax = this.Option.FUELTRIPWSOption.FUELTRIPSectStoreMax;
            this.fueltripWS = new FUELTRIPWebsocketBackend(this.Option.FUELTRIPWSURL, logger, fuelTripSectSpan, fuelTripSectStoreMax);
            this.websocketStates[this.fueltripWS.getName()] = this.fueltripWS.getWebsocketState();
        }
        else
            this.fueltripWS = undefined;

        if (this.Option.AssettoCorsaWSEnabled) {
            this.assettoCorsaWS = new AssettoCorsaSHMWebsocketBackend(this.Option.AssettoCorsaWSURL, logger, wsInterval);
            this.websocketStates[this.assettoCorsaWS.getName()] = this.assettoCorsaWS.getWebsocketState();
        }
        else
            this.assettoCorsaWS = undefined;

        this.wsmapper = new WebsocketClientMapper(this, option.WSMap, logger);
    }

    public Run(): void {
        if (this.Option.DefiWSEnabled)
            this.DefiWS.Run();
        if (this.Option.SSMWSEnabled)
            this.SSMWS.Run();
        if (this.Option.ArduinoWSEnabled)
            this.ArduinoWS.Run();
        if (this.Option.ELM327WSEnabled)
            this.ELM327WS.Run();
        if (this.Option.FUELTRIPWSEnabled)
            this.FUELTRIPWS.Run();
        if (this.Option.AssettoCorsaWSEnabled)
            this.AssettoCorsaWS.Run();
    }
}