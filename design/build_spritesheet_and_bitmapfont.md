# Build spritesheet and bitmapfont

# 1. Install required application to your sysem.
Before build spritesheet and bitmapfont,
* Install Inkscape (to build spritesheet from svg files)
* Install imagemagick (6.9)
    * Imagemagick is required by spritesheet.js, and postprocessing of bitmapfont

# 2. Run download script
* Install tool program binary
    ```
    cd bin
    bash download_tools.sh
    ```
* Install ttf fonts to build bitmapfont
    ```
    cd fonts
    bash download_ttfs.sh
    ```

# 3. Install npm package 
```
cd svgs
npm i
```
# 4. Install ttf fonts (refered from svgs) to your system
* Unfortunately there is no script to install font file requried from svgs.
    * Please open svg files by Inkscape, check font is correctly drawn. If some of fonts is missing, please install by yourself.

# 5. Run build script
```
cd (folder of design)
bash build_fonts.sh
bash pngexport.sh
```

