# Making custom meter application.

## Table of contents
* [Introduction](#intro)
* [Meter application source files](#meter_application_source)
* [Bundle html file with typescript file](#bundle_html_and_typescript)
* [Import dependent modules](#import_dependent_modules)
* [Application entry point](#application_entry_point)
* [Define application class](#define_application_class)
	* [Setup websocket communication (by implementing `setWebSocketOptions()`)](#setup_websocket_communication)
	* [Setup picture and font preloading (by implementing `setTextureFontPreloadOptions()`)](#setup_preloading)
	* [Setup meter panel configuration (by implementing `setPIXIMeterPanel()`)](#setup_meter_panel)
* [The html file](#html_file)
* [Build custom meter application](#build)

## <a name="intro">Introduction</a>
![Application diagram](./CustomMeterApp.img/ApplicationDiagram.jpg)
Meter application (html5 front panel view of gauge) have mainly two kind of object, one is websocket communication(client) class, and the other is meter (graphical) parts class.
Websocket client classes manage the communication with [Websocket server programs](https://github.com/sugiuraii/WebSocketGaugeServer), with parsing JSON data from Websocket server. The parsed data are sent to meter parts classes by every animation frame. The meter parts classes changes its view (rotating needle, changing progressbar, changing digital indictaor, etc..) corresponding the data received from websocket communication(client) classes.

This document will explain how to costruct meter application class. During making the application class, you can setup,
* Which kind of websocket client (Defi/SSM/Arduino/ELM327) will be used.
* Which kind of data (engine rpm, boost pressure, etc..) will be sent from websocket server.
* Which kind of meter parts will be used.
* Position and size of meter parts.

If you want to make your own meter parts (with your new design), please refer [CustomMeterParts.md](./CustomMeterParts.md) and [MeterPrimitive.md](./MeterPrimitive.md).

## <a name="meter_application_source">Meter application source files.</a>

Meter application (top level deifition of meter panel that consist of meter parts and websocket communication) is stored in `WebSocketGaugeClientNeo/application` directory.

One meter application consists of one html file and one typescript file.
* Html file (For example, `DigitalMFD-ELM327DemoApp.html`).
* Application source code file (For example, `DigitalMFD-ELM327DemoApp.ts`)

The *.html file simply calls javascript file. The main part of application logic is described in typescript file.
(The typescript file finally will be compiled to javascript file by typescirpt oompiler.)

In this document, `DigitalMFD-ELM327DemoApp.ts` and `DigitalMFD-ELM327DemoApp.html` will be used to explain the application coding.

## <a name="bundle_html_and_typescript">Bundle html file with typescript file. </a>
`DigitalMFD-ELM327DemApp.ts`
```js
// Set entry point html file to bundle by webpack
require("./DigitalMFD-ELM327DemoApp.html");
```
The html file is need to be bundled with the application typescirpt file as the `require()` statement above.
By using sthis information, webpack will bundle html file and type script file, and build to `WebSocketGaugeClientNeo/public_html` directory.

## <a name="import_dependent_modules">Import dependent modules</a>
`DigitalMFD-ELM327DemoApp.ts`
```js
//Import application base class
import {MeterApplicationBase} from "../lib/MeterAppBase/MeterApplicationBase";

//Import meter parts
import {WaterTempGaugePanel} from "../parts/CircularGauges/SemiCircularGaugePanel";
import {ThrottleGaugePanel} from "../parts/CircularGauges/SemiCircularGaugePanel";
import {DigiTachoPanel} from "../parts/DigiTachoPanel/DigiTachoPanel";
import {BoostGaugePanel} from "../parts/CircularGauges/FullCircularGaugePanel";

//Import enumuator of parameter code
import {OBDIIParameterCode} from "../lib/WebSocket/WebSocketCommunication";
import {ReadModeCode} from "../lib/WebSocket/WebSocketCommunication";
```
Import several modules by `import{}` statement. In meter application source, following modules should be imported.
* `MeterApplicationBase` class
	* Base class of meter application, that contains common parts (websocket status indicator, log window and some controls), common logics, and websocket communication objects.
		* Websocket communication object is imclued in `MeterapplicationBase`class. Do not need to import separately.
* Meter parts classes
	* Defines parts of meter panel. In `DigitalMFD-ELM327DemoApp.ts`, four types of meter parts are imported.
	* The source code of mater panel parts exists in `WebSocketGaugeClientNeo/parts` directory. You can add your original design meter parts.
	![Meter panel parts class](CustomMeterApp.img/MeterpanelMod_PartsClass.jpg)
* Parameter code enumator modlules
 	* Define enumator of parameter code (Engine_Speed, Manifold_Absolute_Pressure, etc...).
 	* Import the parameter code module corresponding the websocket server to communicate.
 		* ELM327(OBDII) : `OBDIIParameterCode`
 		* Arduino ADC : `ArduinoParameterCode`
 		* Defi Link : `DefiParameterCode`
 		* Subaru SSM : `SSMParameterCode` and `SSMSwitchCode`
 			* For ELM327 and SSM, `ReadModeCode` also should be imported. (This defines read mode (interval of sending data from ECU)).

## <a name="application_entry_point">Application entry point</a>

`DigitalMFD-ELM327DemoApp.ts`
```js
window.onload = function()
{
    const meterapp = new DigitalMFD_ELM327DemoApp(720, 1280);
    meterapp.run();
}
```
This entry point method (`window.onload()`) is called when the browser finish loading html files.
(But it should be noted that browser do not wait to finish loading picture and font files. Because of that, preload setting should be defined in application class).
Construct application class (described below), and start application class with `run()` method.

## <a name="define_application_class">Define application class</a>
`DigitalMFD-ELM327DemoApp.ts`
```js
class DigitalMFD_ELM327DemoApp extends MeterApplicationBase
{
    protected setWebSocketOptions()
    {
    ...
    }
    protected setTextureFontPreloadOptions()
    {
    ...
    }
    protected setPIXIMeterPanel()
    {
    ...
    }
```

The application class of `DigitalMFD_ELM327DemoApp` extends the base (abstract) class of MeterApplicationBase. The `MeterApplicationBase` class requires its subclass to implement follwoing method.
* `setWebSocketOptions()`
	* Method to setup websocket communication.
	* Enabling websocket communication, register parameter code (Engine_Speed, Manifold_Absolute_Pressure, etc...) to communicate).
* `setTextureFontPreloadOptions()`
	* Method to setup preloading picture (textures, sprites) and font files.
* `setPIXIMeterPanel()`
	* Setup the actual design and operation of meter panel.
	* Construct meter parts, set the position of meter parts, and define the operation on every animation frame.

### <a name="setup_websocket_communication">Setup websocket communication (by implementing `setWebSocketOptions()`) </a>
`DigitalMFD-ELM327DemoApp.ts`
```js
protected setWebSocketOptions()
{
    //Enable ELM327 websocket client
    this.IsELM327WSEnabled = true;

    this.registerELM327ParameterCode(OBDIIParameterCode.Engine_Speed, ReadModeCode.SLOWandFAST, true);
    this.registerELM327ParameterCode(OBDIIParameterCode.Vehicle_Speed, ReadModeCode.SLOWandFAST, true);
    this.registerELM327ParameterCode(OBDIIParameterCode.Throttle_Opening_Angle, ReadModeCode.SLOWandFAST, true);
    this.registerELM327ParameterCode(OBDIIParameterCode.Coolant_Temperature, ReadModeCode.SLOW, true);
    this.registerELM327ParameterCode(OBDIIParameterCode.Manifold_Absolute_Pressure, ReadModeCode.SLOWandFAST, true);
}
```
The first part of above code sets the websocket enable flag. By setting `IsELM327WSEnabled` flag to `true`, ELM327 websocket client is enabled (this also enables websocket indicator on ELM327). Same kind of flags are also available on other websocket clents, such as..
* ELM327(OBDII) : `IsELM327WSEnabled`
* Arduino ADC : `IsArudinoWSEnabled`
* Defi Link : `IsDefiWSEnabled`
* Subaru SSM : `IsSSMWSEnabled`

The second part of above code registers the parameter code to communicate,  by the method of `registerELM327ParameterCode(code : string, readMode : string, interpolate : boolean)`.
* 1st argument of `code : string` defines the parameter code (Engine_Speed, Vehicle_Speed, etc..) to register. The candidate of parameter code can be accessed through the imported namespace of `OBDIIPamraterCode`.
* 2nd argument of `readMode : string` set the read mode of ECU communication.
	* The candidate is `SLOWandFAST`, `SLOW` and `FAST`. This can set the update cycle of each parameter (sensor reading data).
	* The update rate of `SLOW` is 10times slower than `SLOTandFAST` and `FAST` (`SLOWandFAST` and `FAST` have currenlt almost same update rate), however it can save ECU <-> websocket server bandwidth.
		* It should be noted that the bandwidth between ECU and websocket server is quite limited (especially, in the case of SSM, the baudrate between ECU and websocket server is only 4800bps.)
    * This `readMode` argument is not available on `registerDefiParameterCode()` and `registerArduinoParameterCode()`.
* 3rd argument of `interpolate : boolean` is the flag to enable or disable 'interpolation'. By setting this flag true (and using `getVal()` (instead of `getRawVal()`) in `setPIXIMeterPanel()` implementation), the meter can make smooth animation, even though update rate is low.

Of course, code registration method is also available on Arduino, Defi and SSM.
* ELM327(OBDII) : `registerELM327ParameterCode(code : string, readMode : string, interpolate : boolean)`
* Arduino ADC : `registerArduinoParameterCode(code : string, interpolate : boolean)`
* Defi Link : `registerDefiParameterCode(code : string, interpolate : boolean)`
* Subaru SSM : `registerSSMParameterCode(code : string, readMode : string, interpolate : boolean)`

### <a name="setup_preloading">Setup picture and font preloading (by implementing `setTextureFontPreloadOptions()`)</a>
`DigitalMFD-ELM327DemoApp.ts`
```js
protected setTextureFontPreloadOptions()
{
    this.registerWebFontFamilyNameToPreload(WaterTempGaugePanel.RequestedFontFamily);
    this.registerWebFontFamilyNameToPreload(DigiTachoPanel.RequestedFontFamily);
    this.registerWebFontFamilyNameToPreload(BoostGaugePanel.RequestedFontFamily);
    this.registerWebFontFamilyNameToPreload(ThrottleGaugePanel.RequestedFontFamily);

    this.registerWebFontCSSURLToPreload(WaterTempGaugePanel.RequestedFontCSSURL);
    this.registerWebFontCSSURLToPreload(DigiTachoPanel.RequestedFontCSSURL);
    this.registerWebFontCSSURLToPreload(BoostGaugePanel.RequestedFontCSSURL);
    this.registerWebFontCSSURLToPreload(ThrottleGaugePanel.RequestedFontCSSURL);

    this.registerTexturePathToPreload(WaterTempGaugePanel.RequestedTexturePath);
    this.registerTexturePathToPreload(DigiTachoPanel.RequestedTexturePath);
    this.registerTexturePathToPreload(BoostGaugePanel.RequestedTexturePath);
    this.registerTexturePathToPreload(ThrottleGaugePanel.RequestedTexturePath);
}
```
In `setTextureFontPreloadOptions()` method, `WebFontFamilyName`, `WebFontCSSURL` and `TexturePath` shold be registered for each parts. These parameters are implemented as static properties of meter parts classes.

### <a name="setup_meter_panel">Setup meter panel configuration (by implementing `setPIXIMeterPanel()`)</a>
`DigitalMFD-ELM327DemoApp.ts`
```js
protected setPIXIMeterPanel()
{
    // Construct meter panel parts.
    const digiTachoPanel = new DigiTachoPanel();
    digiTachoPanel.position.set(0,0);
    digiTachoPanel.scale.set(1.15);

    const boostPanel = new BoostGaugePanel();
    boostPanel.position.set(90,360);
    boostPanel.scale.set(1.3);

    const waterTempPanel = new WaterTempGaugePanel();
    waterTempPanel.position.set(0,890);
    waterTempPanel.scale.set(0.85);

    const throttlePanel = new ThrottleGaugePanel();
    throttlePanel.position.set(360,890);
    throttlePanel.scale.set(0.85);

    // Add meter panel parts to stage.
    this.stage.addChild(digiTachoPanel);
    this.stage.addChild(boostPanel);
    this.stage.addChild(waterTempPanel);
    this.stage.addChild(throttlePanel);

    // Define ticker method to update meter view (this ticker method will be called every frame).
    this.ticker.add(() =>
    {
        // Take timestamp of animation frame. (This time stamp is needed to interpolate meter sensor reading).
        const timestamp = PIXI.Ticker.shared.lastTime;
        // Get sensor information from websocket communication objects.
        const tacho = this.ELM327WS.getVal(OBDIIParameterCode.Engine_Speed, timestamp);
        const speed = this.ELM327WS.getVal(OBDIIParameterCode.Vehicle_Speed, timestamp);
        const neutralSw = false;
        const gearPos = this.calculateGearPosition(tacho, speed, neutralSw);

        const boost = this.ELM327WS.getVal(OBDIIParameterCode.Manifold_Absolute_Pressure, timestamp)  * 0.0101972 - 1; //convert kPa to kg[](http://)f/cm2 and relative pressure

        const waterTemp = this.ELM327WS.getRawVal(OBDIIParameterCode.Coolant_Temperature);
        const throttle = this.ELM327WS.getVal(OBDIIParameterCode.Throttle_Opening_Angle, timestamp);

        // Update meter panel value by sensor data.
        digiTachoPanel.Speed = speed;
        digiTachoPanel.Tacho = tacho;
        digiTachoPanel.GearPos = gearPos;
        waterTempPanel.Value = waterTemp;
        throttlePanel.Value = throttle;
        boostPanel.Value = boost;
   });
}
```
The first half of above code create meter parts instances. Created instances are added to stage (after setting scale (by `scale.set()`) and position (by `position.set()`)).
(Since meter parts class extends PIXI.Container class, parts instances can be treated like pixi.js Container instances.)

The latter half of above code (after `this.ticker.add()`) defines the ticker method. This part of code will be called  every animation frame of application (like `requestAnimationFrame()`). By using following methods, sensor data is obtaind by every animation frame, and transferred to meter parts instances.
* `getVal(code : string, timestamp : number)`
	* This method get the "interpolated" sensor value for smooth animation. With using this method, smooth meter animation is possble even though sensor update rate is slow.
	  This method interpolate sensor value by using timestamp of animation frame (this can be given by `timestamp` argument) and timestamp of data receive from websocket server.
    * To use this method, animation timestamp is needed. (On above code, animation timestamp is obtained by the static property of `PIXI.ticker.shared.lastTime`). And also, interpolation flag need to be set true on registering parameter.
* `getRawVal(code : string)`
	* This method gets raw value (not interpolated) of sensor.

## <a name="html_file">The html file</a>
html file (in this example, `DigitalMFD-ELM327DemoApp.html`) simply calls the javascript file (this javascript file is complied and deployed by webpack).
```html
<html>
    <head>
        <title>DigitalMFDApp</title>
        <meta charset="UTF-8">

    </head>
    <body style="background: black">
        <script type="text/javascript" src="js/DigitalMFD-ArduinoDemoApp.js"></script>
    </body>
</html>
```

## <a name="build">Build custom meter application</a>
By referring sample source files and this document, you can make custom meter application.
To build your custom meter application, `webpack.config.js` need to be modified to register your custom meter application.
Please refer [MeterAppBuild.md](./MeterAppBuild.md)
