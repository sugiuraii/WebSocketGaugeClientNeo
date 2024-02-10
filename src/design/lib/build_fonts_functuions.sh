#!/bin/bash

function bmfontmake() {
    local FONT_DIR=../../fonts/dist
    local FONTBM_CMD=../../bin/fontbm
    local BMFONT_path=bmfont

    local TTF_rel_path=$1
    local BMFont_name=$2
    local BMFont_size=$3
    local BMFont_color=$4
    local BMFont_Padding=$5
    local BMFont_Chars=$6
    local FontBM_Opts=$7

    if [ ! -d $BMFONT_path ]; then
        mkdir $BMFONT_path
    fi
    local TTF_PATH=$FONT_DIR/$TTF_rel_path
    $FONTBM_CMD --font-file $TTF_PATH --output $BMFONT_path/$BMFont_name --font-size $BMFont_size --color $BMFont_color --data-format xml --chars $BMFont_Chars --padding-right $BMFont_Padding --padding-left $BMFont_Padding --padding-up $BMFont_Padding --padding-down $BMFont_Padding $FontBM_Opts
}

function glowFilter() {
    local ImageMagick_convert_cmd=convert
    # Glow blur option (blur_radiusxblur_stdev)
    local PNG_FileName=$1
    local Blur_Option=$2
    local BMFONT_path=bmfont

    $ImageMagick_convert_cmd $BMFONT_path/$PNG_FileName \( -clone 0 -blur $Blur_Option \) \( -clone 0,1 -compose plus -composite \) -delete 0,1 $BMFONT_path/$PNG_FileName
}