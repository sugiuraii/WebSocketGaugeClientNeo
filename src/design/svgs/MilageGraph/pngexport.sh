#!/bin/bash

# Set command/path of inkscape
inkscape_cmd=inkscape

# Set svg file name
svg_filename=MilageGraph.svg

# Perform export (crop by page border)
id_list=(\
 "layer_milagegraph_back"\
 "layer_milagegraph_grid"\
 "layer_milagegraph_text"\
)

for id in "${id_list[@]}"
do
  $inkscape_cmd --export-type="png" $svg_filename --export-id="$id" --export-id-only --export-area-page
done

# Perform export (crop by obj border)
id_list=(\
 "milagegraph_valuebar"\
 "milagegraph_valuebar2"\
)

for id in "${id_list[@]}"
do
  $inkscape_cmd --export-type="png" $svg_filename --export-id="$id" --export-id-only
done
