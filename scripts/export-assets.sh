#!/bin/bash

set -e

for layer in $(aseprite -b --list-layers ./aseprite/source.aseprite); do
    if [[ $layer = bg* ]]
    then
        echo "bg $layer";
        aseprite -b --layer $layer ./aseprite/source.aseprite --save-as "./assets/export-{layer}.png"
    else
        echo "norm $layer";
        aseprite -b --layer $layer ./aseprite/source.aseprite --trim --save-as "./assets/export-{layer}.png"
    fi
done

for f in $(ls -l ./assets/ | grep export | cut -d":" -f2 | cut -d" " -f2); do
    fn=$(echo $f | sed -e's/export-//' | sed -e's/\.png//')
    echo 'this.load.image("'$fn'", "/assets/'$f'");'
done
