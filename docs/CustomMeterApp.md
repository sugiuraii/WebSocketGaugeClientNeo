# Making custom meter gauge application.

## Table of contents
* Directroy map of sources
* Register application html and typescript files to webpack.

## Directory map of sources.
In this section, `WebSocketGaugeClientNeo/src/application` directory is manipurated.

```
WebSocketGaugeClientNeo/
+-- src
	+-- application		<-	Sources for meter (top-level) application.
    +-- lib				<-	Sources for libraries (normally, do not need to modify).
    +-- parts			<-	Sources for meter parts.
+-- public_html 		<-	Build destination directory.
```

## Register application html and typescirpt files to webpack.
### Copy from existing demo application sources.
To make custom meter application, one html and one typescipt(*.ts) file is reqired.
It is recommened to use demo application file for the template.

First, copy `DigitalMFD-ELM327DemoApp.html` and `DigitalMFD-ELM327DemoApp.ts` to your prefer filename. (In this document, destination file name set to `CustomMeterpanelApp.html`and `CustomMeterpanelApp.ts`).
```
> cd WebSocketGaugeClientNeo/src/application
> cp DigitalMFD-ELM327DemoApp.html CustomMeterpanelApp.html
> cp DigitalMFD-ELM327DemoApp.ts CustomMeterpanelApp.ts
```

### Edit webpack.config.js to register webpack build target.
After that, open `WebSocketGaugeClientNeo/src/application/webpack.config.js`, and modify `module.exports={}` definition as ...

```js
module.exports = {
    entry:
    {
        "CustomMeterpanelApp" : './CustomMeterpanelApp.ts', // Add this line.
        "AnalogMeterClusterApp" : './AnalogMeterClusterApp.ts',
        "DigitalMFDApp" : './DigitalMFDApp.ts',
        "DigitalMFD-ELM327DemoApp" : './DigitalMFD-ELM327DemoApp.ts',
        "DigitalMFD-ArduinoDemoApp" : './DigitalMFD-ArduinoDemoApp.ts',
        "DigitalMFD-SSMDemoApp" : './DigitalMFD-SSMDemoApp.ts'
    },
...
```
By this, webpack will complie `CustomMeterpanelApp.ts` and its dependent source files automatically (typescript compiler of tsc will be called inside webpack), and bundle into `CustomMeterpanelApp.js`.

### Edit CustomMeterpanelApp.html
`CustomMeterpanelApp.html`(you copied on previous section) is a entry point html file. This html file should load `CustomMeterpanelApp.js` (this file should be built by webpack).

Edit `<script>` tag of `CustomMeterpanelApp.html` as follows.
```html
<html>
    <head>
    	<!-- change html titie as you like-->
        <title>CustomMeterpanelApp</title>
        <meta charset="UTF-8">

    </head>
    <body style="background: black">
    	<!-- modify here to read CustomMeterpanelApp.js -->
        <script type="text/javascript" src="js/CustomMeterpanelApp.js"></script>
    </body>
</html>
```

### Edit CustomMeterpanelApp.ts
To bundle `CustomMeterpanelApp.html` with application typescript file (`CustomMeterpanelApp.ts`), open `CustomMeterpanelApp.ts`, and edit `require()` field as below..

```js
...
//For including entry point html file in webpack
require("./CustomMeterpanelApp.html");
...
```

## Try building custom meter panel application

To build, run npm script at `WebSocketGaugeClientNeo/` directory, like,
```
(move to the directory of WebSocketGaugeClientNeo and type)..
> npm run build-application
```

After the build is finished, you may find `CustomMeterpanelApp.html` and `CustomMeterpanelApp.js` in `public_html/application` directory.

## Modify the contents of custom meter panel application
On this section, `CustomMeterpanelApp.ts` will be modified as the pictures below (left : before modification, right : after modification).
* Shrink the size of "TURBO BOOST" gauge.
* Change meter type of "WATER TEMP" (180deg gauge to 270deg gauge).
* Add "MASS AIR FLOW" and "BATTERY VOLT" gauges.

![Modify meter panel before](CustomMeterApp.img/MeterpanelModBefore.PNG)![Modify meter panel after](CustomMeterApp.img/MeterpanelModAfter.PNG)
----

Definition of meter application is done in follwoing steps in `CustomMeterpanelApp.ts`.
* Import meter parts/paramter code class from library.
* Define meter application class (with extending the class of MeterApplicationBase)
	* Setup websocket communication. (by implementing `setWebSocketOptions()`)
    * Setup texture and font pre-load. (by implementing `setTextureFontPreloadOptions()`).
    * Setup meter panel contents (parts location is viewport) and parts operation (by implementing `setPIXIMeterPanel()`)

### Import meter parts/paramter code classes from library.
In meter application, each meter parts (water temp gauge, boost gauge, etc..) is described by typescript class (see below). 
These parts class are written in separate type script files and need to be imported in `CustomMeterpanelApp.ts` by `import` statement.
![Meter panel and parts classes](CustomMeterApp.img/MeterpanelMod_PartsClass.PNG)

```js
//// Import meter parts
import {DigiTachoPanel} from "../parts/DigiTachoPanel/DigiTachoPanel";
import {BoostGaugePanel} from "../parts/CircularGauges/FullCircularGaugePanel";
import {ThrottleGaugePanel} from "../parts/CircularGauges/SemiCircularGaugePanel";
//// Changed from original DigitalMFD-ELM327DemoApp.ts
//import {WaterTempGaugePanel} from "../parts/CircularGauges/SemiCircularGaugePanel";
import {WaterTempGaugePanel} from "../parts/CircularGauges/FullCircularGaugePanel";
// Add to original DigitalMFD-ELM327DemoApp.ts
import {MassAirFlowGaugePanel} from "../parts/CircularGauges/FullCircularGaugePanel";
import {BatteryVoltageGaugePanel} from "../parts/CircularGauges/SemiCircularGaugePanel";

```