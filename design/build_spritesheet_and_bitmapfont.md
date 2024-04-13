# Build spritesheet and bitmapfont

# 1. Install required application to your sysem.
Before build spritesheet and bitmapfont,
* Install Inkscape (to build spritesheet from svg files)
* Install imagemagick (6.9)
    * Imagemagick is required by spritesheet.js, and postprocessing of bitmapfont

# 2. Run download script
* Install tool program binary, and ttf fonts to build bitmapfont.
    ```
    bash build_setup.sh
    ```

# 3. Install ttf fonts (refered from svgs) to your system
* Unfortunately there is no script to install font file requried from svgs.
    * Please open svg files by Inkscape, check font is correctly drawn. If some of fonts is missing, please install by yourself.

# 4. Run build script and deploy
```
bash build_install_all.sh
```

