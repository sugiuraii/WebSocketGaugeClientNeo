# Making custom meter parts



## Tools to make meter parts

* Drawing software to design([Inkscape](https://inkscape.org/))

* Bitmap edit software([GIMP](https://www.gimp.org/))

* Bitmap font creation tool ([BMFont](http://www.angelcode.com/products/bmfont/))

* Sprite sheet creation tool ([Leshy SpriteSheet Tool](https://www.leshylabs.com/apps/sstool/) or [TexturePacker](https://www.codeandweb.com/texturepacker))

* And before reading this document, it may be better to see some of Pixi.js [examples](http://pixijs.github.io/examples/) or [tutorials](http://www.pixijs.com/tutorials).



## Meter parts example

In this document, following "AnalogSingleMeter" class will be explained as a example.

![AnalogSingleMeter](./CustomMeterParts.img/AnalogSingleMeter.jpg).

* [The final code of AnalgSingleMeter](../src/parts/AnalogSingleMeter/AnalogSingleMeter.ts).

* [Design SVG file](../src/design/svgs/AnalogSingleMeter/AnalogSingleMeter.svg).

	* This svg (and this design) uses [Microma font](https://fonts.google.com/specimen/Michroma). Please install this font before opening the svg file.



## Design meter parts and export to PNG file.

First of all, design 