# Making custom meter parts

## Table of contents
* [Tools to make meter parts](#tools)
* [Meter parts example](#example)
* [Design meter parts and export to PNG file](#design)
* [Making sprite sheet](#spriteSheet)
* [Making bitmap font file](#bitmapFont)
* [Coding meter parts class](#coding)
	* [Import dependent libraries and resources (textures and bitmap fonts)](#import)
	* [Creating option class](#option)
	* [Set class specific(static) property](#classProperty)
	* [Construct meter parts](#construct)

## <a name="tools">Tools to make meter parts</a>

* Drawing software to design([Inkscape](https://inkscape.org/))

* Bitmap edit software([GIMP](https://www.gimp.org/))

* Bitmap font creation tool ([BMFont](http://www.angelcode.com/products/bmfont/))

* Sprite sheet creation tool ([Leshy SpriteSheet Tool](https://www.leshylabs.com/apps/sstool/) or [TexturePacker](https://www.codeandweb.com/texturepacker))

* And before reading this document, it may be better to see some of Pixi.js [examples](http://pixijs.github.io/examples/) or [tutorials](http://www.pixijs.com/tutorials).

## <a name="example">Meter parts example</a>

In this document, following "AnalogSingleMeter" class will be explained as a example.

![AnalogSingleMeter](./CustomMeterParts.img/AnalogSingleMeter.jpg).

* [The final code of AnalgSingleMeter](../src/parts/AnalogSingleMeter/AnalogSingleMeter.ts).

* [Design SVG file](../src/design/svgs/AnalogSingleMeter/AnalogSingleMeter.svg).

	* This svg (and this design) uses [Microma font](https://fonts.google.com/specimen/Michroma). Please install this font before opening the svg file.

## <a name="design">Design meter parts and export to PNG file</a>

First of all, design meter panel by drawing tool (such as Inkscape). After making design, export to PNG files.
This example separate meter design into 4 png files. These 4 png files (sprite, textures) will be combined while coding meter parts class.

![AnalogSingleMeter_TexturePNG](./CustomMeterParts.img/AnalogSingleMeter_TexturesPNG.jpg).

## <a name="spriteSheet"> Making sprite sheet</a>
On Pixi.js, making sprite sheet is recommened to handle textures, because of its performance optimization.
[Leshy SpriteSheet Tool](https://www.leshylabs.com/apps/sstool/) or [TexturePacker](https://www.codeandweb.com/texturepacker) can make sprite sheet for Pixi.js.
(Please set the sprite sheet map file format to 'JSON-Hash').

Sprite sheet tool will finally make one picture file (where all of sprite PNG files are merged) and one json file.
[Exported sprite sheet](../src/parts/AnalogSingleMeter/AnalogSingleMeter_0.png).
[Exported json file](../src/parts/AnalogSingleMeter/AnalogSingleMeter.json).

## <a name="bitmapFont">Making bitmap font file</a>
Pixi.js can handle various type of font, including TrueType and other types of Webfont.
Among them, bitmap font (PIXI.extras.BitmapText) is recommended because of its performance. (Vector type font needs rendereing every time the text is updated. This can make the performance overhead.)

[BMFont](http://www.angelcode.com/products/bmfont/) can make bitmap font file from TrueType fonts.

On exporting bitmap font, set font descriptor to "xml" and file format to "png" at "Options"->"Export options"->"File format".

## <a name="coding">Coding meter parts class</a>
After preparing sprite(textures) and fonts, make a code of parts class.

This library currently have three types of primitive gauge parts. To know how to use these classes, please refer [MeterPrimitive.md](./MeterPrimitive.md). These gauge primitive parts classes can be treated like "Container" of PIXI.js, since they extends the PIXI.Container class.
* CircularProgressBar

 ![CircularProgressBar](CustomMeterParts.img/CircularProgressBar.gif)
* RectangularProgressBar

 ![RectangularProgressBar](CustomMeterParts.img/RectangularProgressBar.gif) 
* RotationNeedleGauge

 ![RotationNeedleGauge](CustomMeterParts.img/RotationNeedleGauge.gif)

In this example, first make the master container class of "AnalogSingleMeter" (extends PIXI.Container), and add some child elements (Sprites and sub-containers).
![AnalogSingleMeter and child elements](./CustomMeterParts.img/MeterLayerAndContainer.jpg)
[Final code of AnalgSingleMeter.ts](../src/parts/AnalogSingleMeter/AnalogSingleMeter.ts)

### <a name="import">Import dependent libraries and resources (textures and bitmap fonts)</a>
```js
// Import dependent libraries (pixi.js and RotationNeedleGauge)
import {RotationNeedleGauge} from 'lib/Graphics/PIXIGauge';
import {RotationNeedleGaugeOptions} from 'lib/Graphics/PIXIGauge';

import * as PIXI from 'pixi.js';

// Set dependent texture files and bitmap font files (will be bundled by webpack file loader)
require("./AnalogSingleMeter.json");
require("./AnalogSingleMeter_0.png");
require("./Michroma_24px_Glow.fnt");
require("./Michroma_24px_Glow_0.png");
require("./Michroma_48px_Glow.fnt");
require("./Michroma_48px_Glow_0.png");
```
The first part of [AnalgSingleMeter.ts](../src/parts/AnalogSingleMeter/AnalogSingleMeter.ts) imports dependent library classes (pixi.js library, RotationNeedleGauge class and its option class) and resource files (textures(sprite sheet) and bitmap font files). These resource files will be bundled to build destination directory (WebSocketGaugeClientNeo/public_html) by webpack and webpack file loader.

### <a name="option">Creating option class</a>
The second part of [AnalgSingleMeter.ts](../src/parts/AnalogSingleMeter/AnalogSingleMeter.ts) defines `AnalogSingleMeterOptions` class. This class stores setting of `AnalogSingleMeter`, such as Max/Min value, gauge title text, unit label text and scale label texts. (In this example, meter settings are defined in separate class.)
Of course, "Option" class is not absolutely necessary, and you can define meter panel setting in the meter class itself.

```js
/**
 * Setting option class for AnalogSingleMeter
 */
export class AnalogSingleMeterOption
{
    /**
     * Gauge Max.
     */
    public Max : number;
    /**
     * Gauge Min.
     */
    public Min : number;
    /**
     * Gauge Title
     */
    public Title : string;
    /**
     * Gauge unit
     */
    public Unit : string;
    /**
     * Gauge scale numbers (7 ticks).
     */
    public ScaleLabel : string[];
    
    /**
     * Construct AnalogSingleMeterOption with default settings.
     */
    constructor()
    {
        this.Max = 2.0;
        this.Min = -1.0;
        this.Title = "Boost";
        this.Unit = "x100kPa";
        this.ScaleLabel = ["-1.0","-0.5","0.0", "0.5", "1.0", "1.5", "2.0"];
    }
}
```

### <a name="classProperty">Set class specific(static) property</a>
After that, `AnalogSingleMeter` class is defined. First, class member variables and properties are defined.

```js
/**
 * Analog single meter gauge example class
 */
export class AnalogSingleMeter extends PIXI.Container
{
    /**
     * The variable option class to define the design (max, min, title and scale labels).
     * @see AnalogSingleMeterOption
     */
    private Option : AnalogSingleMeterOption;
    
    /**
     * Texture path required by this parts. (This static property will be refered to pre-load texture).
     */
    static get RequestedTexturePath() : string[]
    {
        // Note : Bitmap font(*.fnt file) sholud be treated as "Texture" (not Webfont).
        return ["img/AnalogSingleMeter.json", "img/Michroma_24px_Glow.fnt",  "img/Michroma_48px_Glow.fnt"];
    }
    
    /**
     * Font family name required by this parts. (This static property will be refered to pre-load webfont).
     */
    static get RequestedFontFamily() : string[]
    {
        // No webfont(truetype) is needed on this parts. Return null array.
        return [];
    }
    
    /**
     * CSS URL(filepath) to define webfont, required by this parts. (This static property will be refered to pre-load webfont).
     */
    static get RequestedFontCSSURL() : string[]
    {
        // No webfont(truetype) is needed on this parts. Return null array.
        return [];
    }
    
    /**
     * Needle gauge object.
     */
    private NeedleGauge: RotationNeedleGauge;
    
    /**
     * Get gauge value.
     * @return Gauge value.
     */
    public get Value() { return this.NeedleGauge.Value }
    
    /**
     * Set gauge value (and update needle gauge).
     * @param val The value to set.
     */
    public set Value(val: number) {
        this.NeedleGauge.Value = val;
        this.NeedleGauge.update();
    }
    
    ...

}
```

On `AnalogSingleMeter`, 3 static readonly properties of `RequestedTexturePath`, `RequestedFontFamily` and `RequestedFontCSSURL` are defined.
These properties defines the name of texture, WebFont family name and the url of webfont css file.
These properties will be reffered by the file pre-loading setting of meter application class.
To know the detail, please see the "Define application class"->"Setup picture and font preloading" section in [CustomMeterApp.md](./CustomMeterApp.md).

Currently, these properties are NOT linked with `require()` statement at the first part of the code (see [previous section](#import)). Texture and font names need to be defined on both `reqiure()` statememt and these static properties.

And please note that `RequestedFontFamily` and `RequestedFontCSSURL` properties only treat Webfont (such as TrueType font).
"Bitmap font" are treated as "Texture" here. That is why `*.fnt` (bitmap font definition file) files are defined in `RequestedTexturePath` property, not in the `RequestedFontFamily` property.

### <a name="construct">Construct meter parts</a>
```js
export class AnalogSingleMeter extends PIXI.Container
{
	...
    
    /**
     * Construct AnalogSingleMeter class.
     * @param option Meter setting option.
     */   
    constructor(option: AnalogSingleMeterOption)
    {
        // Call the constructor of PIXI.Container.
        super();
        
        // Set option
        this.Option = option;
        
        //Create meter backplate (see below).
        const meterBackPlate = this.createMeterBackPlate(option.Title, option.ScaleLabel, option.Unit)
        
        //Create needle gauge.
        const needleGaugeOptions = new RotationNeedleGaugeOptions();
        needleGaugeOptions.Max = option.Max;
        needleGaugeOptions.Min = option.Min;
        needleGaugeOptions.OffsetAngle = 270;
        needleGaugeOptions.FullAngle = 270;
        needleGaugeOptions.Texture = PIXI.Texture.fromFrame("AnalogSingleMeter_Needle");
        const needleGauge = new RotationNeedleGauge(needleGaugeOptions);
        needleGauge.pivot.set(220, 15);
        needleGauge.position.set(210, 210);
        needleGauge.Value = option.Min;
        
        //Create needleCap
        const needleCap = PIXI.Sprite.fromFrame("AnalogSingleMeter_NeedleCap");
        needleCap.pivot.set(47, 47);
        needleCap.position.set(210, 210);
        
        //Add each sub container to master container.
        this.addChild(meterBackPlate);
        this.addChild(needleGauge);
        this.addChild(needleCap);
        
        //Set reference of needleGauge to this.NeedleGauge.
        this.NeedleGauge = needleGauge;
    }
    
    /**
     * Create meter backplate (contains meter base, grid and text labels).
     * @return Container of meter backplate.
     */
    private createMeterBackPlate(gaugeTitle : string, numberLabels : string[], unit : string) : PIXI.Container
    {  
        //Create MeterBase sprite
        const backSprite = PIXI.Sprite.fromFrame("AnalogSingleMeter_Base");

        //Create MeterGrid sprite
        const gridSprite = PIXI.Sprite.fromFrame("AnalogSingleMeter_Grid");
        
        //Create gauge title label
        const titleElem = new PIXI.extras.BitmapText(gaugeTitle, {fontName :"Michroma", fontSize : 48, align: "right"});
        titleElem.anchor = new PIXI.Point(1,0.5);
        titleElem.position.set(370,260);
        
        //Create gauge unit label
        const unitElem = new PIXI.extras.BitmapText(unit, {fontName :"Michroma", fontSize : 24, align: "center"});
        unitElem.anchor = new PIXI.Point(0.5,0.5);
        unitElem.position.set(210,150);

        //Create meter number label
        let numberElements: PIXI.extras.BitmapText[] = [];
        numberElements[0] = new PIXI.extras.BitmapText(numberLabels[0], {fontName :"Michroma", fontSize : 48, align: "center"});
        numberElements[0].anchor = new PIXI.Point(0.5,1);
        numberElements[0].position.set(210,372);
        numberElements[1] = new PIXI.extras.BitmapText(numberLabels[1], {fontName :"Michroma", fontSize : 48, align: "left"});
        numberElements[1].anchor = new PIXI.Point(0,1);
        numberElements[1].position.set(85,330);
        numberElements[2] = new PIXI.extras.BitmapText(numberLabels[2], {fontName :"Michroma", fontSize : 48, align: "left"});
        numberElements[2].anchor = new PIXI.Point(0,0.5);
        numberElements[2].position.set(52,210);
        numberElements[3] = new PIXI.extras.BitmapText(numberLabels[3], {fontName :"Michroma", fontSize : 48, align: "left"});
        numberElements[3].anchor = new PIXI.Point(0,0);
        numberElements[3].position.set(85, 90);
        numberElements[4] = new PIXI.extras.BitmapText(numberLabels[4], {fontName :"Michroma", fontSize : 48, align: "center"});
        numberElements[4].anchor = new PIXI.Point(0.5,0);
        numberElements[4].position.set(210,40);
        numberElements[5] = new PIXI.extras.BitmapText(numberLabels[5], {fontName :"Michroma", fontSize : 48, align: "right"});
        numberElements[5].anchor = new PIXI.Point(1,0);
        numberElements[5].position.set(335,90);
        numberElements[6] = new PIXI.extras.BitmapText(numberLabels[6], {fontName :"Michroma", fontSize : 48, align: "right"});
        numberElements[6].anchor = new PIXI.Point(1,0.5);
        numberElements[6].position.set(375,210);

        // Add all of elements to baseContainer.
        const baseContainer = new PIXI.Container();
        baseContainer.addChild(backSprite);
        baseContainer.addChild(gridSprite);
        baseContainer.addChild(titleElem);
        baseContainer.addChild(unitElem);
        for (let i = 0; i < numberLabels.length; i++)
            baseContainer.addChild(numberElements[i]);
        
        // "Baking" this container to single texture
        // This can speed up the rendering (since gpu dose not need to construct this constructor on every frame)
        baseContainer.cacheAsBitmap = true;
        return baseContainer;
    }
}
```
Finally, `AnalogSingleMeter` is constructed by defining elements (sprites, bitmap texts and gauge primitives), and adding these elements to master containers (by `this.addChild()`).
(To know the meanings of element's properties, please see [pixi.js examples](http://pixijs.github.io/examples/), [pixi.js tutorials](http://www.pixijs.com/tutorials), or [MeterPrimitive.md](./MeterPrimitive.md)).

On this example, "Meter back plate" (=backSprite + gridSprite + title label + unit label + number labels) are grouped into single container (by the method of `createMeterBackPlate()`).
At the final step of `createMeterBackPlate()`, the contents of this container are cached ("baked") into single texture by setting `cacheAsBitMap = true`. By this, the WebGL renderer need not to construct this container by every frame and improve rendering performance (This technique is explained in [cachAsBitmap section of pixi.js demo](https://pixijs.github.io/examples/#/demos/cacheAsBitmap.js).

