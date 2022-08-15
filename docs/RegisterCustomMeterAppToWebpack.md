# WebSocketGaugeServer - Register custom meter application to webpack

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
+-- playwright                  <-  Working folder to make application thumbnail images (using playwright)
```

This project uses [typescript](https://www.typescriptlang.org/) and [webpack](https://webpack.js.org/). 
Before running program, source codefiles need to be processed(compiled) by webpack.
(Typescript compiler of `tsc` is called in `webpack`,by using [ts-loader](https://github.com/TypeStrong/ts-loader))

## Register custom meter application source files to `webpack.config.js`
While complinig and deploying sources by `webpack`, `webpack` refers `webpack.config.js` (in `src/application`) to find source files to be complied.
On making your custom meter applications, the entry point of your meter application needs to be registered to `webpack.config.js`.

For example, to register your "CustomMeterpanelApp" application (which has the entry point code in `/src/application/CustomMeterpanelApp.ts`) to `weboack.config.js`, add one line to `entry` field like this..
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
On the example above, new meter application of "CustomMeterpanelApp" (corresponding typescript file is `CustomMeterpanelApp.ts` at `src/application`) is registered.
(Please note that he `CustomMeterpanelApp.html` is reffered in `CustomMeterpanelApp.ts`).

## Build custom meter application
After modifying `webpack.config.js`, you can build the application as regular manner (see [Build.md](Build.md) or [Build-Docker.md](Build-Docker.md))

```
(move to the directory of WebSocketGaugeClientNeo and type)..
> npm run build-application
```
Or run `build-all` script to build all of assets.
```
> npm run build-all
```

After build is finished, html and compiled js files will be deployed into `public_html` directory.


