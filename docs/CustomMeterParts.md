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

First of all, design meter panel by drawing tool (such as Inkscape). After making design, export to PNG files.
This example separate meter design into 4 png files. These 4 png files (sprite, textures) will be combined while coding meter parts class.

![AnalogSingleMeter_TexturePNG](./CustomMeterParts.img/AnalogSingleMeter_TexturesPNG.jpg).

## Making sprite sheet
On Pixi.js, making sprite sheet is recommened to handle textures, because of its performance optimization.
[Leshy SpriteSheet Tool](https://www.leshylabs.com/apps/sstool/) or [TexturePacker](https://www.codeandweb.com/texturepacker) can make sprite sheet for Pixi.js.
(Please set the sprite sheet map file format to 'JSON-Hash').

Sprite sheet tool will finally make one picture file (where all of sprite PNG files are merged) and one json file.
[Exported sprite sheet](../src/parts/AnalogSingleMeter/AnalogSingleMeter_0.png).
[Exported json file](../src/parts/AnalogSingleMeter/AnalogSingleMeter.json).

## Making bitmap font file
Pixi.js can handle various type of font, including TrueType and other types of Webfont.
Among them, bitmap font (PIXI.extras.BitmapText) is recommended because of its performance. (Vector type font needs rendereing every time the text is updated. This can make the performance overhead.)

[BMFont](http://www.angelcode.com/products/bmfont/) can make bitmap font file from TrueType fonts.
##