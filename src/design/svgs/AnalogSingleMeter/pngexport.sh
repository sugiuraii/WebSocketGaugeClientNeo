#!/bin/bash

# Set command/path of inkscape
#inkscape_cmd=inkscape

# Set svg file name
svg_filename=AnalogSingleMeter.svg

# Set list of ids to export
id_list=(\
 "layer_analogsinglemeter_base"\
 "layer_analogsinglemeter_grid"\
)

for id in "${id_list[@]}"
do
  $inkscape_cmd --export-type="png" $svg_filename --export-id="$id" --export-id-only --export-area-page
done

$inkscape_cmd --export-type="png" $svg_filename --export-id=layer_analogsinglemeter_needle --export-id-only
$inkscape_cmd --export-type="png" $svg_filename --export-id=layer_analogsinglemeter_needlecap --export-id-only
