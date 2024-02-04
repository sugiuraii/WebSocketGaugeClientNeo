#!/bin/bash

# Set command/path of inkscape
inkscape_cmd=inkscape

# Set svg file name
svg_filename=DigiTachoMeter.svg

# Set list of ids to export
id_list=(\
 "layer_digitachometer_back"\
 "layer_digitachometer_grid"\
 "layer_digitachometer_text"\
)

for id in "${id_list[@]}"
do
  $inkscape_cmd --export-type="png" $svg_filename --export-id="$id" --export-id-only --export-area-page
done

$inkscape_cmd --export-type="png" $svg_filename --export-id=layer_digitachometer_led_dark --export-id-only
