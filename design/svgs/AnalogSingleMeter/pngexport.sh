#!/bin/bash

# Import function
source ../../lib/export_spritesheet.sh

# Set svg file name
svg_filename=AnalogSingleMeter.svg
id_list=(\
 "layer_analogsinglemeter_base"\
 "layer_analogsinglemeter_grid"\
)
inkscape_extra_options="--export-area-page"
export_pngs

# Perform export (crop by obj border)
id_list=(\
 "layer_analogsinglemeter_needle"\
 "layer_analogsinglemeter_needlecap"\
)
inkscape_extra_options=""
export_pngs

create_spritesheets
