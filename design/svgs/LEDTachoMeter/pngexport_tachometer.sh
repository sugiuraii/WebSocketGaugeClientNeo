#!/bin/bash

# Import function
source ../../lib/export_spritesheet.sh

svg_filename=LEDTachoMeter.svg
id_list=(\
 "layer_base"\
 "layer_red"\
 "layer_led_dark"\
 "layer_text_fixed"\
 "layer_led_bright_white"\
)
inkscape_extra_options="--export-area-page"
export_pngs
create_spritesheets
