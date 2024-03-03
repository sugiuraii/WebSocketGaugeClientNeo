#!/bin/bash
source ../../lib/build_fonts_functuions.sh

PADDING=1
Color=0,0,0
Char=43-57,78,80,68,96,39,126

bmfontmake DSEG/DSEG14-Classic/DSEG14Classic-Bold.ttf AnalogMeterFont_35px 35 $Color $PADDING $Char
bmfontmake DSEG/DSEG14-Classic/DSEG14Classic-Bold.ttf AnalogMeterFont_40px 40 $Color $PADDING $Char
bmfontmake DSEG/DSEG14-Classic/DSEG14Classic-Bold.ttf  AnalogMeterFont_60px 60 $Color $PADDING $Char
bmfontmake DSEG/DSEG14-Classic/DSEG14Classic-Bold.ttf  AnalogMeterFont_115px 115 $Color $PADDING $Char
replaceFace AnalogMeterFont_35px.fnt AnalogMeterFont_35px
replaceFace AnalogMeterFont_40px.fnt AnalogMeterFont_40px
replaceFace AnalogMeterFont_60px.fnt AnalogMeterFont_60px
replaceFace AnalogMeterFont_115px.fnt AnalogMeterFont_115px
