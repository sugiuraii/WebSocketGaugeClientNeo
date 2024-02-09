#!/bin/bash

# Set command/path of inkscape
inkscape_cmd=inkscape

# Set svg file name
svg_filename=AnalogSingleMeter.svg

# Set export folder
export_dir=spritesheet
export_filename_prefix=${svg_filename%.*}

mkdir $export_dir

# Perform export (crop by page border)
id_list=(\
 "layer_analogsinglemeter_base"\
 "layer_analogsinglemeter_grid"\
)

for id in "${id_list[@]}"
do
  $inkscape_cmd --export-type="png" $svg_filename --export-id="$id" --export-id-only --export-area-page --export-filename=$export_dir/${export_filename_prefix}_$id.png
done

# Perform export (crop by obj border)
id_list=(\
 "layer_analogsinglemeter_needle"\
 "layer_analogsinglemeter_needlecap"\
)

for id in "${id_list[@]}"
do
  $inkscape_cmd --export-type="png" $svg_filename --export-id="$id" --export-id-only --export-filename=$export_dir/${export_filename_prefix}_$id.png
done

cd $export_dir
npx spritesheet-js --format pixi.js *.png --name ${export_filename_prefix}Texture