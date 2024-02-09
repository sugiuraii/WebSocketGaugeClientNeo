#!/bin/bash

# Set command/path of inkscape
inkscape_cmd=inkscape

# Set svg file name
svg_filename=SemiCircularGauge.svg

# Set export folder
export_dir=spritesheet
export_filename_prefix=${svg_filename%.*}

mkdir $export_dir

# Perform export (crop by page border)
id_list=(\
 "layer_back"\
 "layer_grid"\
)

for id in "${id_list[@]}"
do
  $inkscape_cmd --export-type="png" $svg_filename --export-id="$id" --export-id-only --export-area-page --export-filename=$export_dir/${export_filename_prefix}_$id.png
done

# Perform export (crop by obj border)
id_list=(\
 "layer_valuebar"\
 "layer_redzone_bar"\
 "layer_yellowzone_bar"\
 "layer_greenzone_bar"\
)

for id in "${id_list[@]}"
do
  $inkscape_cmd --export-type="png" $svg_filename --export-id="$id" --export-id-only --export-filename=$export_dir/${export_filename_prefix}_$id.png
done

cd $export_dir
npx spritesheet-js --format pixi.js ${export_filename_prefix}*.png --name ${export_filename_prefix}Texture