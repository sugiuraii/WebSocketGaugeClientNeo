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
 
import ws = require('./websocket/websocketClient');
import comm = ws.webSocketGauge.lib.communication;
    
module webSocketGauge.meterpanelCommon
{
/**
 * Unified gauge control class. Frontend of Defi/SSM/Arduino/ELM327 websocket.<br>
 * ゲージコントロール用クラス。Defi/SSM/Arduino/ELM327 websocketのフロントエンド.
 * @constructor
 */
export class GaugeControl
{
    /**
     * DefiWS reference.
     */
    private _Defi_WS: comm.DefiCOMWebsocket = null;
    /**
     * SSMWS reference.
     */
    private _SSM_WS: comm.SSMWebsocket = null;
    /**
     * ArduinoWS reference.
     */
    private _Arduino_WS: comm.ArduinoCOMWebsocket = null;
    /**
     * ELM327WS reference
     */
    private _ELM327_WS: comm.ELM327COMWebsocket = null;
    /**
     * FUELTRIPWS reference.
     */
    private _FUELTRIP_WS: comm.FUELTRIPWebsocket = null;
    
    /**
     * URL of Defi Websocket server.
     * @default ws://location.hostname:2012/
     */
    private Defi_WS_URL = "ws://"+location.hostname+":2012/";
    /**
     * URL of SSM Websocket server.
     * @default ws://location.hostname:2013/
     */
    private SSM_WS_URL =  "ws://"+location.hostname+":2013/";
    /**
     * URL of Arduino Websocket server.
     * @default ws://location.hostname:2015/
     */
    private Arduino_WS_URL = "ws://"+location.hostname+":2015/";
    /**
     * URL of ELM327 Websocket server.
     * @default ws://location.hostname:2016/
     */
    private ELM327_WS_URL = "ws://"+location.hostname+":2016/";
    /**
     * URL of FUELTRIP Websocket server.
     * @default ws://location.hostname:2014/
     */
    private FUELTRIP_WS_URL = "ws://"+location.hostname+":2014/";
    
    /**
     * List of SSM Slow/Fast/Slow+Fast read flag list.
     */
    private _SSM_SlowFastReadFlagList = {};
    /**
     * List of ELM327 Slow/Fast/Slow+Fast read flag list.
     */
    private _ELM327_SlowFastReadFlagList = {};
    
    /**
     * HTML element ID of debug message window.<br>
     * デバッグメッセージウインドウのHTMLエレメントID.
     * @default #div_message
     */
    private MessageWindowID = '#div_message';
    /**
     * HTML element ID of DefiCOM_Websocket status indicator.<br>
     * DefiCOM_Websocket ステータスインジケータのHTMLエレメントID.
     * @default #defi_status
     */
    private Defi_StatusIndicatorID = "#defi_status";
    /**
     * HTML element ID of SSMCOM_Websocket status indicator.<br>
     * SSMCOM_Websocket ステータスインジケータのHTMLエレメントID.
     * @default #ssm_status
     */
    private SSM_StatusIndicatorID = "#ssm_status";
    /**
     * HTML element ID of ArduinoCOM_Websocket status indicator.<br>
     * ArduinoCOM_Websocket ステータスインジケータのHTMLエレメントID.
     * @default #arduino_status
     */
    private Arduino_StatusIndicatorID = "#arduino_status";
    /**
     * HTML element ID of ELM327COM_Websocket status indicator.<br>
     * ELM327COM_Websocket ステータスインジケータのHTMLエレメントID.
     * @default #elm327_status
     */
    private ELM327_StatusIndicatorID = "#elm327_status";
    /**
     * HTML element ID of FUELTRIP_Websocket status indicator.<br>
     * FUELTRIP_Websocket ステータスインジケータのHTMLエレメントID.
     * @default #fueltrip_status
     */
    private FUELTRIP_StatusIndicatorID = "#fueltrip_status";
    
    /**
     * HTML element ID of the spinner to set DefiCOM/ArduinoCOM send interval.<br>
     * Defi/Arduinoのwebsocket通信インターバルを設定するスピナーのHTMLID
     * @default #spinner_defiWSinterval
     */
    private DEFIARDUINOWSInverval_SpinnerID = "#spinner_defiWSinterval";
    
    /**
     * WaitTime after websocket Open or websocket Close (msec)<br>
     * WebSocketオープンまたはクローズ後の待ち時間(ミリ秒)
     * @default 5000
     */
    private WaitTimeAfterWebSocketOpenClose = 5000;
    
    constructor()
    {
        
    }
    
    /**
    * Enable DefiWebSocket.<br>
    * DefiWebSocketを有効化する
    */
    public enableDefiWebSocket() : void
    {
        this._Defi_WS = new comm.DefiCOMWebsocket();
        this.initializeWebSocket(this._Defi_WS);
    }

    /**
    * Enable SSMWebSocket.<br>
    * SSMWebSocketを有効化する
    */
   public EnableSSMWebSocket() : void
   {
       this._SSM_WS = new comm.SSMWebsocket();
       this.initializeWebSocket(this._SSM_WS);
   };

   /**
    * Enable ArduinoWebSocket.<br>
    * ArduinoWebSocketを有効化する
    */
   public EnableArduinoWebSocket() : void
   {
       this._Arduino_WS = new comm.ArduinoCOMWebsocket();
       this.initializeWebSocket(this._Arduino_WS);
   };

   /**
    * Enable ELM327WebSocket.<br>
    * ELM327WebSocketを有効化する
    */
   public EnableELM327WebSocket() : void
   {
       this._ELM327_WS = new comm.ELM327COMWebsocket();
       this.initializeWebSocket(this._ELM327_WS);
   };

   /**
    * Enable FUELTRIPWebSocket.<br>
    * FUELTRIPWebSocketを有効化する
    */
   public EnableFUELTRIPWebSocket() : void
   {
       this._FUELTRIP_WS = new comm.FUELTRIPWebsocket();
       this.initializeWebSocket(this._FUELTRIP_WS);
   };
   
   /**
    * Initialize websocket obj.
    * @param {Defi/SSM/Arduino/ELM327/FUELTRIP_Websocket} webSocketObj to initialize.
    * @private
    */
    private initializeWebSocket(webSocketObj: comm.WebsocketCommon) : void
    {
        const self = this;
        webSocketObj.OnERRPacketReceived = function(msg : string)
        {
            self.appendDebugMessage(webSocketObj.ModePrefix, msg);
        };
        webSocketObj.OnRESPacketReceived = function(msg : string)
        {
            self.appendDebugMessage(webSocketObj.ModePrefix, msg);
        };
        webSocketObj.OnWebsocketError = function(msg : string)
        {
            self.appendDebugMessage(webSocketObj.ModePrefix, msg);
        };
        webSocketObj.OnWebsocketOpen = function()
        {
            self.appendDebugMessage(webSocketObj.ModePrefix, "Connection started");
            // call _websocketCommunicationOnOpen(webSocketObj) 5(changeable by WaitTimeAfterWebSocketOpenClose) sec after websocket open.
            window.setTimeout(self.WebsocketCommunicationOnOpen(webSocketObj), self.WaitTimeAfterWebSocketOpenClose);
        };  
        webSocketObj.OnWebsocketClose = function()
        {
            self.appendDebugMessage(webSocketObj.ModePrefix, "Connection closed");
            self.appendDebugMessage(webSocketObj.ModePrefix, "Reconnect after 5sec...");
            setTimeout(
            function(){
                webSocketObj.Connect();
            }, self.WaitTimeAfterWebSocketOpenClose);                
        };
    };
    
    /**
    * Initial communication on Websocket open
    * @param {type} webSocketObj
    */
    private WebsocketCommunicationOnOpen(webSocketObj : comm.WebsocketCommon) : void
    {
        if(webSocketObj.ModePrefix === "DEFI" || webSocketObj.ModePrefix === "ARDUINO")
        {
            for(var paramCodekey in webSocketObj.OnVALpacketReceived)
                webSocketObj.SendWSSend(paramCodekey, "true");
            webSocketObj.SendWSInterval(localStorage.WSInterval);
            $(this.DEFIARDUINOWSInverval_SpinnerID).val(localStorage.WSInterval);
        }
        else if (webSocketObj.ModePrefix === "SSM" || webSocketObj.ModePrefix === "ELM327" )
        {
            for(var paramCodekey in webSocketObj.onVALpacketReceived)
            {
                var readMode;
                var convertedParamCodeKey;
                if(webSocketObj.ModePrefix === "SSM")
                {
                    convertedParamCodeKey = this._convertSSMSwitchCodeToNumericCode(paramCodekey);
                    readMode = this._SSM_SlowFastReadFlagList[convertedParamCodeKey];
                }
                else if(webSocketObj.ModePrefix === "ELM327")
                {
                    convertedParamCodeKey = paramCodekey;
                    readMode = this._ELM327_SlowFastReadFlagList[paramCodekey];
                }

                if(readMode === "Slow")
                    webSocketObj.SendCOMRead(convertedParamCodeKey, "SLOW", "true");
                else if(readMode === "Fast")
                    webSocketObj.SendCOMRead(convertedParamCodeKey, "FAST", "true");
                else if(readMode === "Slow+Fast")
                {
                    webSocketObj.SendCOMRead(convertedParamCodeKey, "SLOW", "true");
                    webSocketObj.SendCOMRead(convertedParamCodeKey, "FAST", "true");
                }
                else
                    this._appendDebugMessage(convertedParamCodeKey.ModePrefix, "Bug: readMode property is wrong.");
            }
        }
        else if (webSocketObj.ModePrefix === "FUELTRIP")
        {
            //Do nothing.
        }
    };

    /**
     * Register defi parameter code and register event called when corresponding VAL packet is received. <br>
     * 読み出すDefiパラメータコードと、VALパケット到着時のイベント処理ルーチンの登録
     * @param {String} code Defi parameter code.<br> 登録するDefiParameterコード名。 
     * @param {function(var)} receivedEventHandler Event called when corresponding VAL packet is received.<br>
     * 対応するVALパケットを受信したときに呼び出されるイベント。
     */
     public RegisterDefiParameterCode(code : string, receivedEventHandler : (val : number)=>void)
     {
         'use strict';
         if(this._Defi_WS !== null)
             this._Defi_WS.OnVALPacketReceived[code] = receivedEventHandler;
         else
             this.appendDebugMessage("DEFI", "ParameterCode Register is required. But Websocket is not enabled.");
     };

     /**
     * Append message to debug messsage window.
     * @param {String} prefix Message prefix
     * @param {String} message debug message
     */
    private appendDebugMessage(prefix : string, message:string ) : void
    {
        const output_message : string = prefix + " : "  + message;
        $(this.MessageWindowID).append(output_message + '<br/>');
    };

};



    




/**
 * Register arduino parameter code and register event called when corresponding VAL packet is received. <br>
 * 読み出すDefiパラメータコードと、VALパケット到着時のイベント処理ルーチンの登録
 * @param {String} code Arduino parameter code.<br> 登録するArduinoParameterコード名。 
 * @param {function(var)} receivedEventHandler Event called when corresponding VAL packet is received.<br>
 * 対応するVALパケットを受信したときに呼び出されるイベント。
 */
GaugeControl.prototype.RegisterArduinoParameterCode = function(code, receivedEventHandler)
{
    'use strict';
    if(this._Arduino_WS !== null)
        this._Arduino_WS.onVALpacketReceived[code] = receivedEventHandler;
    else
        this._appendDebugMessage("ARDUINO", "ParameterCode Register is required. But Websocket is not enabled."); 
};

/**
 * Register SSM parameter code and register event called when corresponding VAL packet is received. <br>
 * 読み出すSSMパラメータコードと、VALパケット到着時のイベント処理ルーチンの登録
 * @param {String} code SSM parameter code.<br> 登録するSSM Parameterコード名。
 * @param {String} SlowFastFlag Read mode. Read mode must be "Slow", "Fast" or "Slow+Fast".<br>読み出しモード。"Slow"または"Fast"または"Slow+Fast"。 
 * @param {function(var)} receivedEventHandler Event called when corresponding VAL packet is received.<br>
 * 対応するVALパケットを受信したときに呼び出されるイベント。
 */
GaugeControl.prototype.RegisterSSMParameterCode = function(code, SlowFastFlag, receivedEventHandler)
{
    'use strict';
    if(SlowFastFlag !== "Slow" && SlowFastFlag !== "Fast"  && SlowFastFlag !== "Slow+Fast")
        this._appendDebugMessage("SSM", "SlowFastFlag is "+SlowFastFlag+". Not Slow or Fast or Slow+Fast.");
    else if (this._SSM_WS !== null)
    {
        // SSM SlowFastReadFlag is managed by parameter code. Not switch code. If switch code is assinged, need conversion.
        this._SSM_SlowFastReadFlagList[this._convertSSMSwitchCodeToNumericCode(code)] = SlowFastFlag;
        this._SSM_WS.onVALpacketReceived[code] = receivedEventHandler;
    }
    else
        this._appendDebugMessage("SSM", "ParameterCode Register is required. But Websocket is not enabled."); 
};

/**
 * Register ELM327 parameter code and register event called when corresponding VAL packet is received. <br>
 * 読み出すELM327パラメータコードと、VALパケット到着時のイベント処理ルーチンの登録
 * @param {String} code ELM327 parameter code.<br> 登録するELM327 Parameterコード名。
 * @param {String} SlowFastFlag Read mode. Read mode must be "Slow", "Fast" or "Slow+Fast".<br>読み出しモード。"Slow"または"Fast"または"Slow+Fast"。 
 * @param {function(var)} receivedEventHandler Event called when corresponding VAL packet is received.<br>
 * 対応するVALパケットを受信したときに呼び出されるイベント。
 */
GaugeControl.prototype.RegisterELM327ParameterCode = function(code, SlowFastFlag, receivedEventHandler)
{
    'use strict';
    if(SlowFastFlag !== "Slow" && SlowFastFlag !== "Fast"  && SlowFastFlag !== "Slow+Fast")
        this._appendDebugMessage("ELM327", "SlowFastFlag is "+SlowFastFlag+". Not Slow or Fast or Slow+Fast.");
    else if (this._ELM327_WS !== null)
    {
        this._ELM327_SlowFastReadFlagList[code] = SlowFastFlag;
        this._ELM327_WS.onVALpacketReceived[code] = receivedEventHandler;
    }
    else
        this._appendDebugMessage("ELM327", "ParameterCode Register is required. But Websocket is not enabled."); 

};

/**
 * Register event which is called MOMENT_FUELTRIP VAL message is received.<br>
 * MOMENT_FUELTRIP(瞬間燃費)メッセージを受信したときのイベントを登録。
 * @param {function(moment_gasmilage, total_gas, total_trip, total_gasmilage)} receivedEvent Event to register.
 */
GaugeControl.prototype.RegisterMOMENTFUELTRIPPacketRecivedEvent = function(receivedEvent)
{
    'use strict';
    if(this._FUELTRIP_WS !== null)
        this._FUELTRIP_WS.onMomentFUELTRIPpacketReceived = receivedEvent;
    else
        this._appendDebugMessage("FUELTRIP", "PacketReceivedEvent Register is required. But Websocket is not enabled."); 

};

/**
 * Register event which is called SECT_FUELTRIP VAL message is received.<br>
 * SECT_FUELTRIP(区間燃費)メッセージを受信したときのイベントを登録。
 * @param {function(sect_span, sect_trip, sect_gas, sect_gasmilage)} receivedEvent Event to register.
 */
GaugeControl.prototype.RegisterSECTFUELTRIPPacketRecivedEvent = function(receivedEvent)
{
    'use strict';
    if(this._FUELTRIP_WS !== null)
        this._FUELTRIP_WS.onSectFUELTRIPpacketReceived = receivedEvent;
    else
        this._appendDebugMessage("FUELTRIP", "PacketReceivedEvent Register is required. But Websocket is not enabled."); 

};

/**
 * Connect enabled websocket.<br>
 * Please call Enable(Defi/SSM/ELM327/Arduino)Websocket method before connect.<br>
 * 接続します。<br>
 * 接続前にEnable(Defi/SSM/ELM327/Arduino)WebsocketメソッドでWebsocketを有効化してください。
 */
GaugeControl.prototype.ConnectWebSocket = function()
{
    'use strict';
    if(this._Defi_WS !== null)
    {
        this._Defi_WS.URL = this.Defi_WS_URL;
        this._Defi_WS.Connect();
    }
    if(this._SSM_WS !== null)
    {
        this._SSM_WS.URL = this.SSM_WS_URL;
        this._SSM_WS.Connect();
    }
    if(this._Arduino_WS !== null)
    {
        this._Arduino_WS.URL = this.Arduino_WS_URL;
        this._Arduino_WS.Connect();
    }
    if(this._ELM327_WS !== null)
    {
        this._ELM327_WS.URL = this.ELM327_WS_URL;
        this._ELM327_WS.Connect();
    }
    if(this._FUELTRIP_WS !== null)
    {
        this._FUELTRIP_WS.URL = this.FUELTRIP_WS_URL;
        this._FUELTRIP_WS.Connect();
    }
};

/**
 * Disconnect websocket.<br>Websocketを切断します.
 */
GaugeControl.prototype.DisconnectWebSocket = function()
{
    'use strict';
    if(this._Defi_WS !== null)
        this._Defi_WS.Close();
    if(this._SSM_WS !== null)
        this._SSM_WS.Close();
    if(this._Arduino_WS !== null)
        this._Arduino_WS.Close();
    if(this._ELM327_WS !== null)
        this._ELM327_WS.Close();
    if(this._FUELTRIP_WS !== null)
        this._FUELTRIP_WS.Close();
};

/**
 * Check websocket status and update indicator.<br> Please register this method to setInterval().<br>
 * Websocket状態を確認して、インジケータの表示を更新します<br> リアルタイムで表示する際はsetInterval()メソッドに登録し定期的に呼ぶこと。
 * @see GaugeControl.Defi_StatusIndicatorID
 * @see GaugeControl.SSM_StatusIndicatorID
 * @see GaugeControl.Arduino_StatusIndicatorID
 * @see GaugeControl.ELM327_StatusIndicatorID
 * @see GaugeControl.FUELTRIP_StatusIndicatorID
 */
GaugeControl.prototype.CheckWebSocketStatus = function()
{
    'use strict';
    this._changeWebSocketIndicator(this._Defi_WS, this.Defi_StatusIndicatorID);
    this._changeWebSocketIndicator(this._SSM_WS, this.SSM_StatusIndicatorID);
    this._changeWebSocketIndicator(this._Arduino_WS, this.Arduino_StatusIndicatorID);
    this._changeWebSocketIndicator(this._ELM327_WS, this.ELM327_StatusIndicatorID);
    this._changeWebSocketIndicator(this._FUELTRIP_WS, this.FUELTRIP_StatusIndicatorID);
};

/**
 * Show or Hide debug message window.<br>デバッグメッセージウインドウを表示、非表示します。
 */
GaugeControl.prototype.ShowDebugMessage = function()
{
    'use strict';
    if($(this.MessageWindowID).css("display") === "none")
    {
        //Show debug message window
        $(this.MessageWindowID).css("display","inline");                    
    }
    else
    {
        //Hide debug message window
        $(this.MessageWindowID).css("display","none");
    }
};

/**
 * Send FUELTRIP_WS_RESET packet and reset fuel/trip meter.<br>FUELTRIP_WS_RESETパケットを送信し、燃料消費、トリップ、燃費をリセットします。
 */
GaugeControl.prototype.ResetFuelTrip = function()
{
    'use strict';
    if(this._FUELTRIP_WS === null)
    {
        this._appendDebugMessage("FUELTRIP", "ResetFuelTrip() is called. But FUELTRIP_WS is null");
    }
    else if(window.confirm('Reset fuel and trip?'))
    {
        this._FUELTRIP_WS.SendReset();
    };
};

/**
 * Send (DEFI/ARDUINO)_SEND_INTERVAL packet and change send interval of VAL packet for Defi/Arduino Websocket.<br>
 * (DEFI/ARDUINO)_SEND_INTERVALパケットを送信し、Defi/Arduino WebsocketのVALパケットの送信頻度を変更します。
 * @see GaugeControl.DEFIARDUINOWSInverval_SpinnerID
 */
GaugeControl.prototype.DefiArduinoWSIntervalChange = function()
{
    'use strict';
    var interval = $(this.DEFIARDUINOWSInverval_SpinnerID).val();
    if(this._Defi_WS !== null)
        this._Defi_WS.SendWSInterval(interval);
    if(this._Arduino_WS !== null)
        this._Arduino_WS.SendWSInterval(interval);
    localStorage.WSInterval = interval;
};

/**
 * Get the list of all available DefiParameterCodeList<br>
 * 利用可能なDefiParameterCodeのリストを取得します。
 * @returns {String[]} Array of String that contains all of available DefiParameterCode<br>
 *              利用可能なDefiParameterCodeListを示すStringの配列
 */
GaugeControl.prototype.getDefiParameterCodeList = function()
{
    return this.DefiParameterCode.keys(); 
};

/**
 * Get the list of all available SSMParameterCodeList<br>
 * 利用可能なSSMParameterCodeのリストを取得します。
 * @returns {String[]} Array of String that contains all of available SSMParameterCode<br>
 *              利用可能なSSMParameterCodeListを示すStringの配列
 */
GaugeControl.prototype.getSSMParameterCodeList = function()
{
    return this.SSMParameterCode.keys();
};

/**
 * Get the list of all available ArduinoParameterCodeList<br>
 * 利用可能なArduinoParameterCodeのリストを取得します。
 * @returns {String[]} Array of String that contains all of available ArduinoParameterCode<br>
 *              利用可能なArduinoParameterCodeListを示すStringの配列
 */
GaugeControl.prototype.getArduinoParameterCodeList = function()
{
    return this.ArduinoParameterCode.keys();
};

/**
 * Get the list of all available ELM327ParameterCodeList<br>
 * 利用可能なELM327ParameterCodeのリストを取得します。
 * @returns {String[]} Array of String that contains all of available ELM327ParameterCode<br>
 *              利用可能なELM327ParameterCodeListを示すStringの配列
 */
GaugeControl.prototype.getELM327ParameterCodeList = function()
{
    return this.ELM327ParameterCode.keys();
};

/**
 * Add debug message window html into body element.(Call this in window.onload)<br>
 * デバッグメッセージウインドを追加します。(window.onloadからコールしてください)
 */
GaugeControl.prototype.addDebugMessageWindow = function()
{
    'use strict';

    $('body').ready(function()
    {
        var html = '<div class=\"debug_message\" id=\"div_message\" >\
                    </div>';
        $("body").append(html);
    });
};

/**
 * Add control panel window (button, interval spiiner, websocket indicator).<br>
 * コントロールパネルウインドウを追加します(ボタン、interval controler, websocket inducator含む)(window.onloadからコールしてください)
 */
GaugeControl.prototype.addControlPanel = function()
{
    'use strict';

    $('body').ready(function()
    {
        var html = '\
        <div id=\"controlPanel\" class=\"controlPanel\">\
            <button id=\"button_reset\" class=\"button_reset\">Reset</button>\
            <button id=\"button_debug\" class=\"button_debug\">Debug</button>\
            <div class=\"websocket_statusBox\">\
                <div>Websocket Status</div>\
                <div id=\"defi_status\">Defi</div>\
                <div id=\"ssm_status\">SSM</div>\
                <div id=\"arduino_status\">Arduino</div>\
                <div id=\"elm327_status\">ELM327</div>\
                <div id=\"fueltrip_status\">FUELTRIP</div>\
                <div>\
                    DefiWSInterval<br>\
                    <input id=\"spinner_defiWSinterval\" type=\"number\" min=\"0\" max=\"10\" step=\"1\" value =\"0\" onchange=\"gaugeControl.DefiArduinoWSIntervalChange()\"/>\
                </div>\
            </div>\
        </div>\
        ';
        $('body').append(html);
    });

    //Register button event
    var self = this;
    $('#button_reset').ready(function(){
        $("#button_reset").click(function(){
            self.ResetFuelTrip();
        });    
    });
    $('#button_debug').ready(function(){
        $("#button_debug").click(function(){
            self.ShowDebugMessage();
        });
    });

    //set interval to websocket indicator
    $('#controlPanel').ready(function()
    {
        setInterval(function(){
            self.CheckWebSocketStatus();
        }, 1000);
    });
};





/**
 * Check websocket status
 * @param {type} webSocketObj
 * @param {type} indicatorElementID
 * @private
 */
GaugeControl.prototype._changeWebSocketIndicator = function(webSocketObj, indicatorElementID)
{
    'use strict';
    //Check if indicator element exists or not
    if($(indicatorElementID)[0])
    {
        if(webSocketObj === null)
            $(indicatorElementID).css("color","gray");
        else
        {
            switch(webSocketObj.getReadyState()) 
            { 
                case -1: //Websocket obj is undefined
                    $(indicatorElementID).css("color","gray");
                    break;
                case 0://CONNECTING
                    $(indicatorElementID).css("color","blue");
                    break;
                case 1://OPEN
                    $(indicatorElementID).css("color","green");
                    break;
                case 2://CLOSING
                    $(indicatorElementID).css("color","orange");
                    break;
                case 3://CLOSED
                    $(indicatorElementID).css("color","red");
                    break;
                default:
                    // this never happens
                    break;                      
            }
        }
    }
};



/**
 * Convert SSM switch code to numeric code.
 * @param {type} paramCodeKey
 * @private
 */
GaugeControl.prototype._convertSSMSwitchCodeToNumericCode = function(paramCodeKey)
{
    'use strict';
    switch(paramCodeKey){
        case "AT_Vehicle_ID" : 
        case "Test_Mode_Connector" : 
        case "Read_Memory_Connector" : 
            return "Switch_P0x061";
        break;

        case "Neutral_Position_Switch" : 
        case "Idle_Switch" : 
        case "Intercooler_AutoWash_Switch" : 
        case "Ignition_Switch" : 
        case "Power_Steering_Switch" : 
        case "Air_Conditioning_Switch" : 
            return "Switch_P0x062";
        break;

        case "Handle_Switch" : 
        case "Starter_Switch" : 
        case "Front_O2_Rich_Signal" : 
        case "Rear_O2_Rich_Signal" : 
        case "Front_O2_2_Rich_Signal" : 
        case "Knock_Signal_1" : 
        case "Knock_Signal_2" : 
        case "Electrical_Load_Signal" : 
            return "Switch_P0x063";
        break;

        case "Crank_Position_Sensor" : 
        case "Cam_Position_Sensor" : 
        case "Defogger_Switch" : 
        case "Blower_Switch" : 
        case "Interior_Light_Switch" : 
        case "Wiper_Switch" : 
        case "AirCon_Lock_Signal" : 
        case "AirCon_Mid_Pressure_Switch" : 
            return "Switch_P0x064";
        break;

        case "AirCon_Compressor_Signal" : 
        case "Radiator_Fan_Relay_3" : 
        case "Radiator_Fan_Relay_1" : 
        case "Radiator_Fan_Relay_2" : 
        case "Fuel_Pump_Relay" : 
        case "Intercooler_AutoWash_Relay" : 
        case "CPC_Solenoid_Valve" : 
        case "BlowBy_Leak_Connector" :
            return "Switch_P0x065";
        break;

        case "PCV_Solenoid_Valve" : 
        case "TGV_Output" : 
        case "TGV_Drive" : 
        case "Variable_Intake_Air_Solenoid" : 
        case "Pressure_Sources_Change" : 
        case "Vent_Solenoid_Valve" : 
        case "P_S_Solenoid_Valve" : 
        case "Assist_Air_Solenoid_Valve" : 
            return "Switch_P0x066";
        break;

        case "Tank_Sensor_Control_Valve" : 
        case "Relief_Valve_Solenoid_1" : 
        case "Relief_Valve_Solenoid_2" : 
        case "TCS_Relief_Valve_Solenoid" : 
        case "Ex_Gas_Positive_Pressure" : 
        case "Ex_Gas_Negative_Pressure" : 
        case "Intake_Air_Solenoid" : 
        case "Muffler_Control" : 
            return "Switch_P0x067";
        break;

        case "Retard_Signal_from_AT" : 
        case "Fuel_Cut_Signal_from_AT" : 
        case "Ban_of_Torque_Down" : 
        case "Request_Torque_Down_VDC" : 
            return "Switch_P0x068";
        break;

        case "Torque_Control_Signal_1" : 
        case "Torque_Control_Signal_2" : 
        case "Torque_Permission_Signal" : 
        case "EAM_Signal" : 
        case "AT_coop_lock_up_signal" : 
        case "AT_coop_lean_burn_signal" : 
        case "AT_coop_rich_spike_signal" : 
        case "AET_Signal" : 
            return "Switch_P0x069";
        break;

        case "ETC_Motor_Relay" : 
            return "Switch_P0x120";
        break;

        case "Clutch_Switch" : 
        case "Stop_Light_Switch" : 
        case "Set_Coast_Switch" : 
        case "Rsume_Accelerate_Switch" : 
        case "Brake_Switch" : 
        case "Accelerator_Switch" :
            return "Switch_P0x121";
        break;

        default :
            return paramCodeKey;
        break;
    }
};

/**
 * Get available parameter code of DefiCOMWebsocket.<br>
 * DefiCOM Websocketの利用可能なParameterコード名
 * @type String
 * @see GaugeControl.prototype.getDefiParameterCodeList()
 */
GaugeControl.prototype.DefiParameterCode = {
    Manifold_Absolute_Pressure:	"Manifold_Absolute_Pressure",
    Engine_Speed:               "Engine_Speed",
    Oil_Pressure:               "Oil_Pressure",
    Fuel_Rail_Pressure:         "Fuel_Rail_Pressure",
    Exhaust_Gas_Temperature:	"Exhaust_Gas_Temperature",
    Oil_Temperature:            "Oil_Temperature",
    Coolant_Temperature:	"Coolant_Temperature"
};
Object.freeze(GaugeControl.prototype.DefiParameterCode);

/**
 * Get available parameter code of ArduinoCOMWebsocket.<br>
 * ArduinoCOM Websocketの利用可能なParameterコード名
 * @type String
 * @see GaugeControl.prototype.getArduinoParameterCodeList()
 */
GaugeControl.prototype.ArduinoParameterCode = {
    Engine_Speed:               "Engine_Speed",
    Vehicle_Speed:              "Vehicle_Speed",
    Manifold_Absolute_Pressure: "Manifold_Absolute_Pressure",
    Coolant_Temperature:        "Coolant_Temperature",
    Oil_Temperature:            "Oil_Temperature",
    Oil_Temperature2:           "Oil_Temperature2",
    Oil_Pressure:               "Oil_Pressure",
    Fuel_Rail_Pressure:         "Fuel_Rail_Pressure"
};
Object.freeze(GaugeControl.prototype.ArduinoParameterCode);

/**
 * Get available parameter code of SSMCOMWebsocket.<br>
 * SSMCOM Websocketの利用可能なParameterコード名
 * @type String
 * @see GaugeControl.prototype.getSSMParameterCodeList()
 */
GaugeControl.prototype.SSMParameterCode = {
    Engine_Load:	"Engine_Load",
    Coolant_Temperature:	"Coolant_Temperature",
    Air_Fuel_Correction_1:	"Air_Fuel_Correction_1",
    Air_Fuel_Learning_1:	"Air_Fuel_Learning_1",
    Air_Fuel_Correction_2:	"Air_Fuel_Correction_2",
    Air_Fuel_Learning_2:	"Air_Fuel_Learning_2",
    Manifold_Absolute_Pressure:	"Manifold_Absolute_Pressure",
    Engine_Speed:	"Engine_Speed",
    Vehicle_Speed:	"Vehicle_Speed",
    Ignition_Timing:	"Ignition_Timing",
    Intake_Air_Temperature:	"Intake_Air_Temperature",
    Mass_Air_Flow:	"Mass_Air_Flow",
    Throttle_Opening_Angle:	"Throttle_Opening_Angle",
    Front_O2_Sensor_1:	"Front_O2_Sensor_1",
    Rear_O2_Sensor:	"Rear_O2_Sensor",
    Front_O2_Sensor_2:	"Front_O2_Sensor_2",
    Battery_Voltage:	"Battery_Voltage",
    Air_Flow_Sensor_Voltage:	"Air_Flow_Sensor_Voltage",
    Throttle_Sensor_Voltage:	"Throttle_Sensor_Voltage",
    Differential_Pressure_Sensor_Voltage:	"Differential_Pressure_Sensor_Voltage",
    Fuel_Injection_1_Pulse_Width:	"Fuel_Injection_1_Pulse_Width",
    Fuel_Injection_2_Pulse_Width:	"Fuel_Injection_2_Pulse_Width",
    Knock_Correction:	"Knock_Correction",
    Atmospheric_Pressure:	"Atmospheric_Pressure",
    Manifold_Relative_Pressure:	"Manifold_Relative_Pressure",
    Pressure_Differential_Sensor:	"Pressure_Differential_Sensor",
    Fuel_Tank_Pressure:	"Fuel_Tank_Pressure",
    CO_Adjustment:	"CO_Adjustment",
    Learned_Ignition_Timing:	"Learned_Ignition_Timing",
    Accelerator_Opening_Angle:	"Accelerator_Opening_Angle",
    Fuel_Temperature:	"Fuel_Temperature",
    Front_O2_Heater_1:	"Front_O2_Heater_1",
    Rear_O2_Heater_Current:	"Rear_O2_Heater_Current",
    Front_O2_Heater_2:	"Front_O2_Heater_2",
    Fuel_Level:	"Fuel_Level",
    Primary_Wastegate_Duty_Cycle:	"Primary_Wastegate_Duty_Cycle",
    Secondary_Wastegate_Duty_Cycle:	"Secondary_Wastegate_Duty_Cycle",
    CPC_Valve_Duty_Ratio:	"CPC_Valve_Duty_Ratio",
    Tumble_Valve_Position_Sensor_Right:	"Tumble_Valve_Position_Sensor_Right",
    Tumble_Valve_Position_Sensor_Left:	"Tumble_Valve_Position_Sensor_Left",
    Idle_Speed_Control_Valve_Duty_Ratio:	"Idle_Speed_Control_Valve_Duty_Ratio",
    Air_Fuel_Lean_Correction:	"Air_Fuel_Lean_Correction",
    Air_Fuel_Heater_Duty:	"Air_Fuel_Heater_Duty",
    Idle_Speed_Control_Valve_Step:	"Idle_Speed_Control_Valve_Step",
    Number_of_Ex_Gas_Recirc_Steps:	"Number_of_Ex_Gas_Recirc_Steps",
    Alternator_Duty:	"Alternator_Duty",
    Fuel_Pump_Duty:	"Fuel_Pump_Duty",
    Intake_VVT_Advance_Angle_Right:	"Intake_VVT_Advance_Angle_Right",
    Intake_VVT_Advance_Angle_Left:	"Intake_VVT_Advance_Angle_Left",
    Intake_OCV_Duty_Right:	"Intake_OCV_Duty_Right",
    Intake_OCV_Duty_Left:	"Intake_OCV_Duty_Left",
    Intake_OCV_Current_Right:	"Intake_OCV_Current_Right",
    Intake_OCV_Current_Left:	"Intake_OCV_Current_Left",
    Air_Fuel_Sensor_1_Current:	"Air_Fuel_Sensor_1_Current",
    Air_Fuel_Sensor_2_Current:	"Air_Fuel_Sensor_2_Current",
    Air_Fuel_Sensor_1_Resistance:	"Air_Fuel_Sensor_1_Resistance",
    Air_Fuel_Sensor_2_Resistance:	"Air_Fuel_Sensor_2_Resistance",
    Air_Fuel_Sensor_1:	"Air_Fuel_Sensor_1",
    Air_Fuel_Sensor_2:	"Air_Fuel_Sensor_2",
    Gear_Position:	"Gear_Position",
    A_F_Sensor_1_Heater_Current:	"A_F_Sensor_1_Heater_Current",
    A_F_Sensor_2_Heater_Current:	"A_F_Sensor_2_Heater_Current",
    Roughness_Monitor_Cylinder_1:	"Roughness_Monitor_Cylinder_1",
    Roughness_Monitor_Cylinder_2:	"Roughness_Monitor_Cylinder_2",
    Air_Fuel_Correction_3:	"Air_Fuel_Correction_3",
    Air_Fuel_Learning_3:	"Air_Fuel_Learning_3",
    Rear_O2_Heater_Voltage:	"Rear_O2_Heater_Voltage",
    Air_Fuel_Adjustment_Voltage:	"Air_Fuel_Adjustment_Voltage",
    Roughness_Monitor_Cylinder_3:	"Roughness_Monitor_Cylinder_3",
    Roughness_Monitor_Cylinder_4:	"Roughness_Monitor_Cylinder_4",
    Throttle_Motor_Duty:	"Throttle_Motor_Duty",
    Throttle_Motor_Voltage:	"Throttle_Motor_Voltage",
    Sub_Throttle_Sensor:	"Sub_Throttle_Sensor",
    Main_Throttle_Sensor:	"Main_Throttle_Sensor",
    Sub_Accelerator_Sensor:	"Sub_Accelerator_Sensor",
    Main_Accelerator_Sensor:	"Main_Accelerator_Sensor",
    Brake_Booster_Pressure:	"Brake_Booster_Pressure",
    Fuel_Rail_Pressure:	"Fuel_Rail_Pressure",
    Exhaust_Gas_Temperature:	"Exhaust_Gas_Temperature",
    Cold_Start_Injector:	"Cold_Start_Injector",
    SCV_Step:	"SCV_Step",
    Memorised_Cruise_Speed:	"Memorised_Cruise_Speed",
    Exhaust_VVT_Advance_Angle_Right:	"Exhaust_VVT_Advance_Angle_Right",
    Exhaust_VVT_Advance_Angle_Left:	"Exhaust_VVT_Advance_Angle_Left",
    Exhaust_OCV_Duty_Right:	"Exhaust_OCV_Duty_Right",
    Exhaust_OCV_Duty_Left:	"Exhaust_OCV_Duty_Left",
    Exhaust_OCV_Current_Right:	"Exhaust_OCV_Current_Right",
    Exhaust_OCV_Current_Left:	"Exhaust_OCV_Current_Left",

    Switch_P0x061:	"Switch_P0x061",
    Switch_P0x062:	"Switch_P0x062",
    Switch_P0x063:	"Switch_P0x063",
    Switch_P0x064:	"Switch_P0x064",
    Switch_P0x065:	"Switch_P0x065",
    Switch_P0x066:	"Switch_P0x066",
    Switch_P0x067:	"Switch_P0x067",
    Switch_P0x068:	"Switch_P0x068",
    Switch_P0x069:	"Switch_P0x069",
    Switch_P0x120:	"Switch_P0x120",
    Switch_P0x121:	"Switch_P0x121"
};
Object.freeze(GaugeControl.prototype.SSMParameterCode);

/**
 * Get available parameter code of ELM327COMWebsocket.<br>
 * ELM327COM Websocketの利用可能なParameterコード名
 * @type String
 * @see GaugeControl.prototype.getELM327ParameterCodeList()
 */
GaugeControl.prototype.ELM327ParameterCode = {
    Engine_Load:	"Engine_Load",
    Coolant_Temperature:	"Coolant_Temperature",
    Air_Fuel_Correction_1:	"Air_Fuel_Correction_1",
    Air_Fuel_Learning_1:	"Air_Fuel_Learning_1",
    Air_Fuel_Correction_2:	"Air_Fuel_Correction_2",
    Air_Fuel_Learning_2:	"Air_Fuel_Learning_2",
    Fuel_Tank_Pressure:	"Fuel_Tank_Pressure",
    Manifold_Absolute_Pressure:	"Manifold_Absolute_Pressure",
    Engine_Speed:	"Engine_Speed",
    Vehicle_Speed:	"Vehicle_Speed",
    Ignition_Timing:	"Ignition_Timing",
    Intake_Air_Temperature:	"Intake_Air_Temperature",
    Mass_Air_Flow:	"Mass_Air_Flow",
    Throttle_Opening_Angle:	"Throttle_Opening_Angle",
    Run_time_since_engine_start:	"Run_time_since_engine_start",
    Distance_traveled_with_MIL_on:	"Distance_traveled_with_MIL_on",
    Fuel_Rail_Pressure:	"Fuel_Rail_Pressure",
    Fuel_Rail_Pressure_diesel:	"Fuel_Rail_Pressure_diesel",
    Commanded_EGR:	"Commanded_EGR",
    EGR_Error:	"EGR_Error",
    Commanded_evaporative_purge:	"Commanded_evaporative_purge",
    Fuel_Level_Input:	"Fuel_Level_Input",
    Number_of_warmups_since_codes_cleared:	"Number_of_warmups_since_codes_cleared",
    Distance_traveled_since_codes_cleared:	"Distance_traveled_since_codes_cleared",
    Evap_System_Vapor_Pressure:	"Evap_System_Vapor_Pressure",
    Atmospheric_Pressure:	"Atmospheric_Pressure",
    Catalyst_TemperatureBank_1_Sensor_1:	"Catalyst_TemperatureBank_1_Sensor_1",
    Catalyst_TemperatureBank_2_Sensor_1:	"Catalyst_TemperatureBank_2_Sensor_1",
    Catalyst_TemperatureBank_1_Sensor_2:	"Catalyst_TemperatureBank_1_Sensor_2",
    Catalyst_TemperatureBank_2_Sensor_2:	"Catalyst_TemperatureBank_2_Sensor_2",
    Battery_Voltage:	"Battery_Voltage",
    Absolute_load_value:	"Absolute_load_value",
    Command_equivalence_ratio:	"Command_equivalence_ratio",
    Relative_throttle_position:	"Relative_throttle_position",
    Ambient_air_temperature:	"Ambient_air_temperature",
    Absolute_throttle_position_B:	"Absolute_throttle_position_B",
    Absolute_throttle_position_C:	"Absolute_throttle_position_C",
    Accelerator_pedal_position_D:	"Accelerator_pedal_position_D",
    Accelerator_pedal_position_E:	"Accelerator_pedal_position_E",
    Accelerator_pedal_position_F:	"Accelerator_pedal_position_F",
    Commanded_throttle_actuator:	"Commanded_throttle_actuator",
    Time_run_with_MIL_on:	"Time_run_with_MIL_on",
    Time_since_trouble_codes_cleared:	"Time_since_trouble_codes_cleared",
    Ethanol_fuel_percent:	"Ethanol_fuel_percent"
};
Object.freeze(GaugeControl.prototype.ELM327ParameterCode);

/**
 * Read mode for SSM/ELM327 Websocket.<br>
 * SSM/ELM327の読み出しモード 
 * @type String
 */
GaugeControl.prototype.ReadMode = {
    Slow : "Slow",
    Fast : "Fast",
    SlowAndFast : "Slow+Fast"
};
Object.freeze(GaugeControl.prototype.ReadMode);

/**
 * Type of FUELTRIP message.(MOMENT or SECT)<br>
 * FUELTRIPメッセージの種類(MOMENT(瞬間燃費)またはSECT(区間燃費).
 * @type String
 */
GaugeControl.prototype.FUELTRIPMessageType = {
    MOMENT : "MOMENT",
    SECT : "SECT"
};
Object.freeze(GaugeControl.prototype.FUELTRIPMessageType);

}
