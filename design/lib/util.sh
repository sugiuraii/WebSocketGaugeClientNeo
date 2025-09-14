#!/bin/bash

function clean() {
    if [ -d ./bmfont ]; then
        rm -r bmfont
    fi
    if [ -d ./pngexport ]; then
        rm -r pngexport
    fi
    if [ -d ./spritesheet ]; then
        rm -r spritesheet
    fi
}

function install() {
    cp ./spritesheet/* $1
    cp ./bmfont/* $1
}
