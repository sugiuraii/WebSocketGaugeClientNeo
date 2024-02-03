#!/bin/bash

# Set command/path of inkscape
#inkscape_cmd=inkscape

# Set svg file name
svg_filename=AnalogMeterCluster.svg

# Set list of ids to export
id_list=(\
 "layer_tacho_base"\
 "layer_tacho_red"\
 "layer_tacho_lcd_base"\
)

for id in "${id_list[@]}"
do
  $inkscape_cmd --export-type="png" $svg_filename --export-id="$id" --export-id-only
done
