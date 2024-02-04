#!/bin/bash

# Set command/path of inkscape
inkscape_cmd=inkscape

# Set svg file name
svg_filename=FullcircularGauge.svg

# Perform export (crop by page border)
id_list=(\
 "layer_back"\
 "layer_grid"\
)

for id in "${id_list[@]}"
do
  $inkscape_cmd --export-type="png" $svg_filename --export-id="$id" --export-id-only --export-area-page
done

# Perform export (crop by obj border)
id_list=(\
 "layer_valuebar"\
 "layer_shaft"\
 "layer_redzone_bar"\
 "layer_yellowzone_bar"\
 "layer_greenzone_bar"\
)

for id in "${id_list[@]}"
do
  $inkscape_cmd --export-type="png" $svg_filename --export-id="$id" --export-id-only
done
