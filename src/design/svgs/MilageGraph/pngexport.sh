#!/bin/bash

# Import function
source ../../lib/export_spritesheet.sh

# Set svg file name
svg_filename=MilageGraph.svg
id_list=(\
 "layer_milagegraph_back"\
 "layer_milagegraph_grid"\
 "layer_milagegraph_text"\
)
inkscape_extra_options="--export-area-page"
export_pngs

id_list=(\
 "milagegraph_valuebar"\
 "milagegraph_valuebar2"\
)
inkscape_extra_options=""
export_pngs

create_spritesheets
