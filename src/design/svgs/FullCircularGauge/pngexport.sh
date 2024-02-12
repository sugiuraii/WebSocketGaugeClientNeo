#!/bin/bash

# Import function
source ../../lib/export_spritesheet.sh

# Set svg file name
svg_filename=FullcircularGauge.svg
id_list=(\
 "layer_back"\
 "layer_grid"\
)
inkscape_extra_options="--export-area-page"
export_pngs

id_list=(\
 "layer_valuebar"\
 "layer_redzone_bar"\
 "layer_yellowzone_bar"\
 "layer_greenzone_bar"\
)
inkscape_extra_options=""
export_pngs

create_spritesheets
