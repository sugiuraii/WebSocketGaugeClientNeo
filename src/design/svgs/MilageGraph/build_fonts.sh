#!/bin/bash
source ../../lib/build_fonts_functuions.sh

PADDING=10
Color=255,255,255
Char=43-57

bmfontmake freefont/sfd/FreeSansBold.ttf MilageGraphFont_38px 38 $Color $PADDING $Char
bmfontmake freefont/sfd/FreeSansBold.ttf MilageGraphFont_57px 57 $Color $PADDING $Char
replaceFace MilageGraphFont_38px.fnt MilageGraphFont_38px
replaceFace MilageGraphFont_57px.fnt MilageGraphFont_57px

BLUR_OPTION=0x7 
glowFilter MilageGraphFont_38px_0.png $BLUR_OPTION
glowFilter MilageGraphFont_57px_0.png $BLUR_OPTION
