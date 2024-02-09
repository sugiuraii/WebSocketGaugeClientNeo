#!/bin/bash

# Set command/path of inkscape
inkscape_cmd=inkscape

# Set svg file name
svg_filename=LEDTachoMeter.svg

# Set export folder
export_dir=spritesheet
export_filename_prefix=${svg_filename%.*}

mkdir $export_dir

# Export (crop by page)
id_list=(\
 "layer_base"\
 "layer_red"\
 "layer_led_dark"\
 "layer_text_fixed"\
 "layer_led_bright_white"\
)

for id in "${id_list[@]}"
do
  $inkscape_cmd --export-type="png" $svg_filename --export-id="$id" --export-id-only --export-area-page --export-filename=$export_dir/${export_filename_prefix}_$id.png
done

cd $export_dir
npx spritesheet-js --format pixi.js *.png --name ${export_filename_prefix}Texture
