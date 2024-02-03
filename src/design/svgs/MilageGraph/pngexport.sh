#!/bin/bash

# Set command/path of inkscape
#inkscape_cmd=inkscape

# Set svg file name
svg_filename=MilageGraph.svg

# Set list of ids to export
id_list=(\
 "layer_milagegraph_back"\
 "layer_milagegraph_grid"\
 "layer_milagegraph_text"\
)

for id in "${id_list[@]}"
do
  $inkscape_cmd --export-type="png" $svg_filename --export-id="$id" --export-id-only --export-area-page
done

$inkscape_cmd --export-type="png" $svg_filename --export-id=milagegraph_valuebar --export-id-only
$inkscape_cmd --export-type="png" $svg_filename --export-id=milagegraph_valuebar2 --export-id-only
