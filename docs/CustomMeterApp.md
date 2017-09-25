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
To make custom meter application, one html and one typescipt(*.ts) file is reqired.
It is recommened to use demo application file for the template.

First, copy `DigitalMFD-ELM327DemoApp.html` and `DigitalMFD-ELM327DemoApp.ts` to your prefer filename. (In this document, destination file name set to `CustomMeterpanelApp.html`and `CustomMeterpanelApp.ts`).
```
> cd WebSocketGaugeClientNeo/src/application
> cp DigitalMFD-ELM327DemoApp.html CustomMeterpanelApp.html
> cp DigitalMFD-ELM327DemoApp.ts CustomMeterpanelApp.ts
```

After that, modify `WebSocketGaugeClientNeo/src/application/webpack.config.js` as follows.

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
    devtool: "source-map",
    output:
    {
        path: __dirname + "/../../public_html/application",
        filename: "./js/[name].js"
    },
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },
  module: {
    loaders: [
        { test: /\.tsx?$/, loader: 'ts-loader' },
        { test: /\.png$/, loader: "file-loader?name=img/[name].[ext]" },
        { test: /\.fnt$/, loader: "file-loader?name=img/[name].[ext]" },
        { test: /\.json$/, loader: "file-loader?name=img/[name].[ext]" },
        { test: /\.html$/, loader: "file-loader?name=[name].[ext]" },
        { test: /\.css$/, loader: "file-loader?name=[name].[ext]" },
        { test: /\.(ttf|otf)$/, loader: "file-loader?name=fonts/[name].[ext]" }
    ]
  }
};
```

By this, webpack can build and bundle your `CustomMeterpanelApp.html`and `CustomMeterpanelApp.ts`.

To build, run npm script at `WebSocketGaugeClientNeo/` directory, like,
```
> npm run build-application
```

