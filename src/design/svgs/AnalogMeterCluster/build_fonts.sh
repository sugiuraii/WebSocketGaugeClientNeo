#!/bin/bash

FONT_DIR=../../fonts/dist
FONTBM_CMD=../../bin/fontbm
BMFONT_path=bmfont
mkdir $BMFONT_path

$FONTBM_CMD --font-file $FONT_DIR/DSEG/DSEG14-Classic/DSEG14Classic-Regular.ttf  --output $BMFONT_path/AnalogMeterFont_40px --font-size 40 --color 0,0,0 --data-format xml --chars 48-57
$FONTBM_CMD --font-file $FONT_DIR/DSEG/DSEG14-Classic/DSEG14Classic-Regular.ttf  --output $BMFONT_path/AnalogMeterFont_45px --font-size 45 --color 0,0,0 --data-format xml --chars 48-57
$FONTBM_CMD --font-file $FONT_DIR/DSEG/DSEG14-Classic/DSEG14Classic-Bold.ttf  --output $BMFONT_path/AnalogMeterFont_60px --font-size 60 --color 0,0,0 --data-format xml --chars 48-57
$FONTBM_CMD --font-file $FONT_DIR/DSEG/DSEG14-Classic/DSEG14Classic-Bold.ttf  --output $BMFONT_path/AnalogMeterFont_115px --font-size 115 --color 0,0,0 --data-format xml --chars 48-57,78,80,68,45