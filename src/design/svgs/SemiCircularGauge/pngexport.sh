#!/bin/bash

# Import function
source ../../lib/export_spritesheet.sh
svg_filename=SemiCircularGauge.svg
id_list=(\
 "layer_back"\
 "layer_grid"\
 "layer_valuebar"\
 "layer_redzone_bar"\
 "layer_yellowzone_bar"\
 "layer_greenzone_bar"\
)
inkscape_extra_options="--export-area-page"
export_pngs

create_spritesheets
