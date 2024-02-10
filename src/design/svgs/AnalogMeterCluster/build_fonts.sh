#!/bin/bash
source ../../lib/build_fonts_functuions.sh

PADDING=0
Color=0,0,0
Char=48-57,78,80,68,45

bmfontmake DSEG/DSEG14-Classic/DSEG14Classic-Regular.ttf AnalogMeterFont_40px 40 $Color $PADDING $Char
bmfontmake DSEG/DSEG14-Classic/DSEG14Classic-Regular.ttf AnalogMeterFont_45px 45 $Color $PADDING $Char
bmfontmake DSEG/DSEG14-Classic/DSEG14Classic-Bold.ttf LEDMeterFont_60px 60 $Color $PADDING $Char
bmfontmake DSEG/DSEG14-Classic/DSEG14Classic-Bold.ttf LEDMeterFont_115px 115 $Color $PADDING $Char
