#!/bin/bash

cd svgs
subdirs=`ls -d */`
for i in $subdirs;
do
    cd $i
    bash build_install.sh
    cd ..
done

