#!/bin/bash
source ../../lib/build_fonts_functuions.sh

PADDING=10
Color=255,255,255
Char=48-57,78,80,68,45

bmfontmake freefont/sfd/FreeSansBold.ttf MilageGraphFont_45px 45 $Color $PADDING $Char
bmfontmake freefont/sfd/FreeSansBold.ttf MilageGraphFont_65px 65 $Color $PADDING $Char

BLUR_OPTION=0x7 
glowFilter MilageGraphFont_45px_0.png $BLUR_OPTION
glowFilter MilageGraphFont_65px_0.png $BLUR_OPTION
