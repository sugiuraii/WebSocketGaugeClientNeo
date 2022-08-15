# Build instruction

## Source code tree map
```
WebSocketGaugeClientNeo/
+-- src
	+-- application				<-	Sources for meter (top-level) application.
        +---webpack.config.js	<-	Webpack setting file
		+---*.ts				<-	Meter application definition code
        +---*.html				<-	Application html
    +-- lib						<-	Sources for libraries (normally, do not need to modify).
    +-- parts					<-	Sources for meter parts.
+-- public_html 				<-	Build destination directory.
```
This project uses typescript and `webpack`. Before running program, source codefiles need to be processed by webpack.
(Typescript compiler of `tsc` is called in `webpack`,by using `ts-loader`)

## Add custom application sources files to `webpack.config.js`
While complinig and deploying sources by `webpack`, `webpack` refers `webpack.config.js` (in `WebSocketGaugeClientNeo/src/application`)to know which source files need to be complied.

On making custom meter applications, `webpack.config.js` need to be modified.

`webpack.config.js`
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
`webpack` refers `module.exports = {}` definition on building sources.
Above example adds new meter application of "CustomMeterpanelApp" (corresponding typescript file is `CustomMeterpanelApp.ts` at `WebSocketGaugeClientNeo/src/application`)
(Please note that he `CustomMeterpanelApp.html` is reffered in `CustomMeterpanelApp.ts`).

## Build custom meter application source
By modifying `webpack.config.js`, custom meter application can be built by npm script of
```
(move to the directory of WebSocketGaugeClientNeo and type)..
> npm run build-application
```
(If you use Netbeans for IDE, it is also possbile to build by Right click on "WebSocketGaugeClientNeo" project and select "npm script" -> "build-application")

After build is finished, deployed html and source files are stored in `public_html/application` directory.


