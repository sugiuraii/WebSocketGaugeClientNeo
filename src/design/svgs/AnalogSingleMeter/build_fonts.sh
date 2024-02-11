#!/bin/bash
source ../../lib/build_fonts_functuions.sh

PADDING=5
Color=255,255,255
Char=32-126

bmfontmake Michroma.ttf Michroma_18px_Glow 18 $Color $PADDING $Char
bmfontmake Michroma.ttf Michroma_36px_Glow 36 $Color $PADDING $Char

BLUR_OPTION=0x2
glowFilter Michroma_18px_Glow_0.png $BLUR_OPTION
glowFilter Michroma_36px_Glow_0.png $BLUR_OPTION
