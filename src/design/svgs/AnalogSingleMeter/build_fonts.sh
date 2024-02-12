#!/bin/bash
source ../../lib/build_fonts_functuions.sh

PADDING=5
Color=255,255,255
Char=32-126

bmfontmake Michroma.ttf AnalogSingleMeter_18px 18 $Color $PADDING $Char
bmfontmake Michroma.ttf AnalogSingleMeter_36px 36 $Color $PADDING $Char
replaceFace AnalogSingleMeter_18px.fnt AnalogSingleMeter_18px
replaceFace AnalogSingleMeter_36px.fnt AnalogSingleMeter_36px

BLUR_OPTION=0x2
glowFilter AnalogSingleMeter_18px_0.png $BLUR_OPTION
glowFilter AnalogSingleMeter_36px_0.png $BLUR_OPTION
