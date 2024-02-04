#!/bin/bash

# Set command/path of inkscape
inkscape_cmd=inkscape

# Set svg file name
svg_filename=SemiCircularGauge.svg

# Set list of ids to export
id_list=(\
 "layer_back"\
 "layer_grid"\
)

for id in "${id_list[@]}"
do
  $inkscape_cmd --export-type="png" $svg_filename --export-id="$id" --export-id-only --export-area-page
done

$inkscape_cmd --export-type="png" $svg_filename --export-id=layer_valuebar --export-id-only

$inkscape_cmd --export-type="png" $svg_filename --export-id=layer_redzone_bar --export-id-only
