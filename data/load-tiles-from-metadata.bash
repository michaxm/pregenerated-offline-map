#!/bin/bash -e

if [ $# -ne 1 ]; then
 echo "Syntax: $0 <subdir>"
 echo
 echo "Loads openstreetmap.org of the given, direct subdirectory"
 exit 1
fi

cd $1

bounds=`grep bounds metadata.json |cut -d \" -f 4`

x1=`echo "$bounds" |cut -d \, -f 1`
y1=`echo "$bounds" |cut -d \, -f 2`
x2=`echo "$bounds" |cut -d \, -f 3`
y2=`echo "$bounds" |cut -d \, -f 4`

minzoom=`grep minzoom metadata.json |cut -d \" -f 4`
maxzoom=`grep maxzoom metadata.json |cut -d \" -f 4`

echo "Loading: $x1 $y1 $x2 $y2 $minzoom $maxzoom"
../get-tiles-from-coordinates.bash $x1 $y1 $x2 $y2 $minzoom $maxzoom
