#!/bin/bash

# Set command/path of inkscape
inkscape_cmd=inkscape

# Set svg file name
svg_filename=AnalogSingleMeter.svg

# Perform export (crop by page border)
id_list=(\
 "layer_analogsinglemeter_base"\
 "layer_analogsinglemeter_grid"\
)

for id in "${id_list[@]}"
do
  $inkscape_cmd --export-type="png" $svg_filename --export-id="$id" --export-id-only --export-area-page
done

# Perform export (crop by obj border)
id_list=(\
 "layer_analogsinglemeter_needle"\
 "layer_analogsinglemeter_needlecap"\
)

for id in "${id_list[@]}"
do
  $inkscape_cmd --export-type="png" $svg_filename --export-id="$id" --export-id-only
done
