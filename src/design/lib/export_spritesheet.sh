#!/bin/bash

# Set variable of 
# id_list
# svg_file
# inkscape_extra_options
# as global variable
function export_pngs() {
    # Set command/path of inkscape
    local inkscape_cmd=inkscape

    # Set export folder
    local export_dir=pngexport
    local export_filename_prefix=${svg_filename%.*}

    # Perform export (crop by object border)
    if [ ! -d $export_dir ]; then
        mkdir $export_dir
    fi
    for id in "${id_list[@]}"
    do
        $inkscape_cmd --export-type="png" $svg_filename --export-id="$id" --export-id-only --export-filename=$export_dir/${export_filename_prefix}_$id.png $inkscape_extra_options
    done
}

# Set variable of 
# svg_file
# as global variable
function create_spritesheets() {
    # Set export folder
    local pngexport_dir=pngexport
    local export_filename_prefix=${svg_filename%.*}
    local spritesheet_dir=spritesheet
    mkdir $spritesheet_dir
    cd $spritesheet_dir
    npx spritesheet-js --format pixi.js ../$pngexport_dir/${export_filename_prefix}*.png --name ${export_filename_prefix}Texture
}
