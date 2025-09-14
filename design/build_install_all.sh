#!/bin/bash

cd svgs
subdirs=`ls -d */`
for i in $subdirs;
do
    if [ $i != "node_modules/" ]; then
        echo "--------- Run build_install.sh on " $i
        cd $i
        bash build_install.sh
        cd ..
    fi
done

