#!/bin/bash
source ../../lib/build_fonts_functuions.sh

PADDING=10
Color=255,255,255
Char=40-64

bmfontmake freefont/sfd/FreeSansBold.ttf CircularGaugeLabelFont 90 $Color $PADDING $Char

BLUR_OPTION=0x7 
glowFilter CircularGaugeLabelFont_0.png $BLUR_OPTION
