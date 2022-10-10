/* 
 * The MIT License
 *
 * Copyright 2017 sz2.
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

import { DefiWebsocketClientService } from "../WebsocketClientService/DefiWebsocketClientService";
import { SSMWebsocketClientService } from "../WebsocketClientService/SSMWebsocketClientService";
import { ArduinoWebsocketClientService } from "../WebsocketClientService/ArduinoWebsocketClientService";
import { ELM327WebsocketClientService } from "../WebsocketClientService/ELM327WebsocketClientService";
import { AssettoCorsaSHMWebsocketClientService } from "../WebsocketClientService/AssettoCorsaSHMWebsocketService";
import { FUELTRIPWebsocketClientService } from "../WebsocketClientService/FUELTRIPWebsocketClientService";
import { ILogger } from "../utils/ILogger";
import { WebsocketState } from "../WebsocketClientService/WebsocketState";
import { WebsocketClientMapEntry, WebsocketClientMapper } from "./WebsocketClientMapper";
import { WebsocketParameterCode } from "./WebsocketParameterCode";
import { WebsocketMapFactory } from "./WebsocketMapFactory";

export class WebsocketObjectCollectionOption
{
    public DefiWSEnabled = false;
    public DefiWSURL =  "ws://" + location.hostname + ":" + DefiWebsocketClientService.DEFAULT_WS_PORT.toString() + DefiWebsocketClientService.WS_URL_PATH;
    public SSMWSEnabled = false;
    public SSMWSSURL = "ws://" + location.hostname + ":" + SSMWebsocketClientService.DEFAULT_WS_PORT.toString() + SSMWebsocketClientService.WS_URL_PATH;
    public ArduinoWSEnabled = false;
    public ArduinoWSURL = "ws://" + location.hostname + ":" + ArduinoWebsocketClientService.DEFAULT_WS_PORT.toString() + ArduinoWebsocketClientService.WS_URL_PATH;
    public ELM327WSEnabled = false;
    public ELM327WSURL = "ws://" + location.hostname + ":" + ELM327WebsocketClientService.DEFAULT_WS_PORT.toString() + ELM327WebsocketClientService.WS_URL_PATH;
    public FUELTRIPWSEnabled = false;
    public FUELTRIPWSURL = "ws://" + location.hostname + ":" + FUELTRIPWebsocketClientService.DEFAULT_WS_PORT.toString() + FUELTRIPWebsocketClientService.WS_URL_PATH;
    public FUELTRIPWSOption : {FUELTRIPSectSpan: number, FUELTRIPSectStoreMax: number} = {FUELTRIPSectSpan : 300, FUELTRIPSectStoreMax : 6};
    public AssettoCorsaWSEnabled = false;
    public AssettoCorsaWSURL = "ws://" + location.hostname + ":" + AssettoCorsaSHMWebsocketClientService.DEFAULT_WS_PORT.toString() + AssettoCorsaSHMWebsocketClientService.WS_URL_PATH;

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

    private readonly defiWS: DefiWebsocketClientService | undefined;
    private readonly ssmWS: SSMWebsocketClientService | undefined;
    private readonly arduinoWS: ArduinoWebsocketClientService | undefined;
    private readonly elm327WS: ELM327WebsocketClientService | undefined;
    private readonly fueltripWS: FUELTRIPWebsocketClientService | undefined;
    private readonly assettoCorsaWS: AssettoCorsaSHMWebsocketClientService | undefined;

    private readonly websocketStates : {[name : string] : WebsocketState} = {};

    public get WSMapper() : WebsocketClientMapper
    {
        return this.wsmapper;
    }

    get DefiWS(): DefiWebsocketClientService {
        if (this.defiWS != undefined)
            return this.defiWS as DefiWebsocketClientService;
        else
            throw ReferenceError("DefiWSBackend is not defined.");
    }

    get SSMWS(): SSMWebsocketClientService {
        if (this.ssmWS != undefined)
            return this.ssmWS as SSMWebsocketClientService;
        else
            throw ReferenceError("SSMWSBackennd is not defined.");
    }

    get ArduinoWS(): ArduinoWebsocketClientService {
        if (this.arduinoWS != undefined)
            return this.arduinoWS as ArduinoWebsocketClientService;
        else
            throw ReferenceError("ArduinoWSBackennd is not defined.");
    }

    get ELM327WS(): ELM327WebsocketClientService {
        if (this.elm327WS != undefined)
            return this.elm327WS as ELM327WebsocketClientService;
        else
            throw ReferenceError("ELM327WSBackennd is not defined.");
    }

    get FUELTRIPWS(): FUELTRIPWebsocketClientService {
        if (this.fueltripWS != undefined)
            return this.fueltripWS as FUELTRIPWebsocketClientService;
        else
            throw ReferenceError("FUELTRIPWSBackennd is not defined.");
    }

    get AssettoCorsaWS(): AssettoCorsaSHMWebsocketClientService {
        if (this.assettoCorsaWS != undefined)
            return this.assettoCorsaWS as AssettoCorsaSHMWebsocketClientService;
        else
            throw ReferenceError("AssettoCorsaSHMWSBackennd is not defined.");
    }

    get WebsocketStates() : {[name : string] : WebsocketState } { return this.websocketStates }

    constructor(logger : ILogger, option: WebsocketObjectCollectionOption, wsInterval : number) {
        this.Option = option;

        if (this.Option.DefiWSEnabled) {
            this.defiWS = new DefiWebsocketClientService(this.Option.DefiWSURL, logger, wsInterval);
            this.websocketStates[this.defiWS.getName()] = this.defiWS.getWebsocketState();
        }
        else
            this.defiWS = undefined;

        if (this.Option.SSMWSEnabled) {
            this.ssmWS = new SSMWebsocketClientService(this.Option.SSMWSSURL, logger);
            this.websocketStates[this.ssmWS.getName()] = this.ssmWS.getWebsocketState();
        }
        else
            this.ssmWS = undefined;

        if (this.Option.ArduinoWSEnabled) {
            this.arduinoWS = new ArduinoWebsocketClientService(this.Option.ArduinoWSURL, logger, wsInterval);
            this.websocketStates[this.arduinoWS.getName()] = this.arduinoWS.getWebsocketState();
        }
        else
            this.arduinoWS = undefined;

        if (this.Option.ELM327WSEnabled) {
            this.elm327WS = new ELM327WebsocketClientService(this.Option.ELM327WSURL, logger);
            this.websocketStates[this.elm327WS.getName()] = this.elm327WS.getWebsocketState();
        }
        else
            this.elm327WS = undefined;

        if (this.Option.FUELTRIPWSEnabled) {
            const fuelTripSectSpan = this.Option.FUELTRIPWSOption.FUELTRIPSectSpan
            const fuelTripSectStoreMax = this.Option.FUELTRIPWSOption.FUELTRIPSectStoreMax;
            this.fueltripWS = new FUELTRIPWebsocketClientService(this.Option.FUELTRIPWSURL, logger, fuelTripSectSpan, fuelTripSectStoreMax);
            this.websocketStates[this.fueltripWS.getName()] = this.fueltripWS.getWebsocketState();
        }
        else
            this.fueltripWS = undefined;

        if (this.Option.AssettoCorsaWSEnabled) {
            this.assettoCorsaWS = new AssettoCorsaSHMWebsocketClientService(this.Option.AssettoCorsaWSURL, logger, wsInterval);
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