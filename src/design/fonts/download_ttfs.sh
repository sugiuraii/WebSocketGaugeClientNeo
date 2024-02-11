#!bin/bash

mkdir dist
mkdir dist/freefont
wget https://ftp.gnu.org/gnu/freefont/freefont-ttf.zip -P dist/
unzip dist/freefont-ttf.zip -d dist/freefont
mkdir dist/DSEG
wget https://github.com/keshikan/DSEG/releases/download/v0.50beta1/fonts-DSEG_v050b1.zip -P dist/
unzip dist/fonts-DSEG_v050b1.zip -d dist/DSEG
wget https://github.com/google/fonts/raw/main/ofl/audiowide/Audiowide-Regular.ttf -P dist/
wget https://fonts.cdnfonts.com/s/15358/Michroma.woff -P dist/