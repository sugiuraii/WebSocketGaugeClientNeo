#!/bin/bash

FONT_DIR=../../fonts/dist
FONTBM_CMD=../../bin/fontbm
BMFONT_path=bmfont
PADDING=10
mkdir $BMFONT_path

$FONTBM_CMD --font-file $FONT_DIR/DSEG/DSEG14-Classic/DSEG14Classic-BoldItalic.ttf  --output $BMFONT_path/LEDMeterFont_30px --font-size 40 --color 255,255,255 --data-format xml --chars 48-57 --padding-right $PADDING --padding-left $PADDING --padding-up $PADDING --padding-down $PADDING
$FONTBM_CMD --font-file $FONT_DIR/DSEG/DSEG14-Classic/DSEG14Classic-BoldItalic.ttf  --output $BMFONT_path/LEDMeterFont_45px --font-size 45 --color 255,255,255 --data-format xml --chars 48-57 --padding-right $PADDING --padding-left $PADDING --padding-up $PADDING --padding-down $PADDING
$FONTBM_CMD --font-file $FONT_DIR/DSEG/DSEG14-Classic/DSEG14Classic-BoldItalic.ttf  --output $BMFONT_path/LEDMeterFont_88px --font-size 60 --color 255,255,255 --data-format xml --chars 48-57 --padding-right $PADDING --padding-left $PADDING --padding-up $PADDING --padding-down $PADDING
$FONTBM_CMD --font-file $FONT_DIR/DSEG/DSEG14-Classic/DSEG14Classic-BoldItalic.ttf  --output $BMFONT_path/LEDMeterFont_100px --font-size 115 --color 255,255,255 --data-format xml --chars 48-57,78,80,68,45 --padding-right $PADDING --padding-left $PADDING --padding-up $PADDING --padding-down $PADDING

ImageMagick_convert_cmd=convert
# Glow blur option (blur_radiusxblur_stdev)
BLUR_OPTION=0x7 
cd $BMFONT_path
$ImageMagick_convert_cmd LEDMeterFont_30px_0.png \( -clone 0 -blur $BLUR_OPTION \) \( -clone 0,1 -compose plus -composite \) -delete 0,1 LEDMeterFont_30px_0.png
$ImageMagick_convert_cmd LEDMeterFont_45px_0.png \( -clone 0 -blur $BLUR_OPTION \) \( -clone 0,1 -compose plus -composite \) -delete 0,1 LEDMeterFont_45px_0.png
$ImageMagick_convert_cmd LEDMeterFont_88px_0.png \( -clone 0 -blur $BLUR_OPTION \) \( -clone 0,1 -compose plus -composite \) -delete 0,1 LEDMeterFont_88px_0.png
$ImageMagick_convert_cmd LEDMeterFont_100px_0.png \( -clone 0 -blur $BLUR_OPTION \) \( -clone 0,1 -compose plus -composite \) -delete 0,1 LEDMeterFont_100px_0.png
