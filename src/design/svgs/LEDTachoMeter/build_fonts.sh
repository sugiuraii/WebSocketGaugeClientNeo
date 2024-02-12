#!/bin/bash
source ../../lib/build_fonts_functuions.sh

PADDING=10
Color=255,255,255
Char=43-57,78,80,68,96,39,126

bmfontmake DSEG/DSEG14-Classic/DSEG14Classic-BoldItalic.ttf LEDMeterFont_30px 30 $Color $PADDING $Char
bmfontmake DSEG/DSEG14-Classic/DSEG14Classic-BoldItalic.ttf LEDMeterFont_45px 45 $Color $PADDING $Char
bmfontmake DSEG/DSEG14-Classic/DSEG14Classic-BoldItalic.ttf LEDMeterFont_88px 88 $Color $PADDING $Char
bmfontmake DSEG/DSEG14-Classic/DSEG14Classic-BoldItalic.ttf LEDMeterFont_100px 100 $Color $PADDING $Char
replaceFace LEDMeterFont_30px.fnt LEDMeterFont_30px
replaceFace LEDMeterFont_45px.fnt LEDMeterFont_45px
replaceFace LEDMeterFont_88px.fnt LEDMeterFont_88px
replaceFace LEDMeterFont_100px.fnt LEDMeterFont_100px

BLUR_OPTION=0x7 
glowFilter LEDMeterFont_30px_0.png $BLUR_OPTION
glowFilter LEDMeterFont_45px_0.png $BLUR_OPTION
glowFilter LEDMeterFont_88px_0.png $BLUR_OPTION
glowFilter LEDMeterFont_100px_0.png $BLUR_OPTION
