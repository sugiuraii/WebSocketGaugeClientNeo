#!/bin/bash

cd bin
bash download_tools.sh
cd ../

cd fonts
bash download_ttfs.sh
cd ../

npm i
