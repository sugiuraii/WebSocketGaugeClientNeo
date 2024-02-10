#!/bin/bash

# Set variable of 
# id_list
# svg_file
# inkscape_extra_options
# as global variable
function export_spritesheet() {
    # Set command/path of inkscape
    local inkscape_cmd=inkscape

    # Set export folder
    local export_dir=spritesheet
    local export_filename_prefix=${svg_filename%.*}

    # Perform export (crop by object border)
    mkdir $export_dir
    for id in "${id_list[@]}"
    do
    $inkscape_cmd --export-type="png" $svg_filename --export-id="$id" --export-id-only --export-filename=$export_dir/${export_filename_prefix}_$id.png $inkscape_extra_options
    done

    cd $export_dir
    npx spritesheet-js --format pixi.js *.png --name ${export_filename_prefix}Texture
}