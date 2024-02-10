#!/bin/bash
source ../../lib/build_fonts_functuions.sh

PADDING=10
Color=255,255,255
Char=48-57,78,80,68,45

bmfontmake Audiowide-Regular.ttf GearPosFont 125 $Color $PADDING $Char
bmfontmake freefont/sfd/FreeSansBold.ttf SpeedMeterFont 185 $Color $PADDING $Char

BLUR_OPTION=0x7 
glowFilter GearPosFont_0.png $BLUR_OPTION
glowFilter SpeedMeterFont_0.png $BLUR_OPTION
