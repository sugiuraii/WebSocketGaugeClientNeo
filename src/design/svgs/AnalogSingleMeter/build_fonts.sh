#!/bin/bash
source ../../lib/build_fonts_functuions.sh

PADDING=10
Color=255,255,255
Char=48-57,78,80,68,45

bmfontmake Michroma-Regular.ttf Michroma_24px_Glow 24 $Color $PADDING $Char
bmfontmake Michroma-Regular.ttf Michroma_48px_Glow 48 $Color $PADDING $Char

BLUR_OPTION=0x7 
glowFilter Michroma_24px_Glow_0.png $BLUR_OPTION
glowFilter Michroma_48px_Glow_0.png $BLUR_OPTION
