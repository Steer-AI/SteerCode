#!/bin/bash

directory="src/lib/data/"

for file in $directory*.js; do
    if [[ -f $file ]]; then
        new_file="${file%.js}.cjs"
        mv "$file" "$new_file"
        echo "Renamed $file to $new_file"
    fi
done
