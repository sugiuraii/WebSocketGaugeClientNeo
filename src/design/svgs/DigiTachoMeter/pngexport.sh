#!/bin/bash
# Import function
source ../../lib/export_spritesheet.sh
svg_filename=DigiTachoMeter.svg
id_list=(\
 "layer_digitachometer_back"\
 "layer_digitachometer_grid"\
 "layer_digitachometer_text"\
)
inkscape_extra_options="--export-area-page"
export_pngs

id_list=(\
 "layer_digitachometer_led_dark"\
)
inkscape_extra_options=""
export_pngs

create_spritesheets
