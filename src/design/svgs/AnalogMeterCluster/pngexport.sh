#!/bin/bash

# Set command/path of inkscape
inkscape_cmd=inkscape

# Set svg file name
svg_filename=AnalogMeterCluster.svg

# Set export folder
export_dir=spritesheet
export_filename_prefix=${svg_filename%.*}

# Perform export (crop by object border)
id_list=(\
 "layer_tacho_base"\
 "layer_tacho_red"\
 "layer_tacho_lcd_base"\
 "layer_tacho_lcd_bar"\
 "layer_tacho_text_lcd_fixed"\
 "layer_tacho_tachotext"\
 "layer_tacho_needle"\
 "layer_tacho_needlecap"\
 "layer_speed_base"\
 "layer_speed_text"\
 "layer_speed_lcdbase"\
 "layer_speed_lcdtext_fixed"\
 "layer_speed_lcdbar"\
 "layer_speed_needle"\
 "layer_speed_needlecap"\
 "layer_boost_base"\
 "layer_boost_text"\
 "layer_boost_needle"\
)

mkdir $export_dir
for id in "${id_list[@]}"
do
  $inkscape_cmd --export-type="png" $svg_filename --export-id="$id" --export-id-only --export-filename=$export_dir/${export_filename_prefix}_$id.png
done

cd $export_dir
npx spritesheet-js --format pixi.js *.png