#!/bin/bash -e

bounds=`grep bounds metadata.json |cut -d \" -f 4`

x1=`echo "$bounds" |cut -d \, -f 1`
y1=`echo "$bounds" |cut -d \, -f 2`
x2=`echo "$bounds" |cut -d \, -f 3`
y2=`echo "$bounds" |cut -d \, -f 4`

minzoom=`grep minzoom metadata.json |cut -d \" -f 4`
maxzoom=`grep maxzoom metadata.json |cut -d \" -f 4`

./get-tiles-from-coordinates.bash $x1 $y1 $x2 $y2 $minzoom $maxzoom
