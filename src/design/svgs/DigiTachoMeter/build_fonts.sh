#!/bin/bash
source ../../lib/build_fonts_functuions.sh

PADDING=10
Color=255,255,255
Char=48-57,78,80,68,45

bmfontmake Audiowide-Regular.ttf GearPosFont 101 $Color $PADDING $Char
bmfontmake freefont/sfd/FreeSansBold.ttf SpeedMeterFont 170 $Color $PADDING $Char

replaceFace GearPosFont.fnt DigiTacho_GearPos
replaceFace SpeedMeterFont.fnt DigiTacho_SpeedMeter

BLUR_OPTION=0x5
glowFilter GearPosFont_0.png $BLUR_OPTION
glowFilter SpeedMeterFont_0.png $BLUR_OPTION
