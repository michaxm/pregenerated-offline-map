#!/bin/bash -e

if [ $# -lt 3 ]; then
 echo "Syntax: $0 x y z [d|e]"
 exit 1
fi

X=$1
Y=$2
Z=$3

DIR=${Z}/${X}
LOC=${DIR}/${Y}.png

if [ "$4" = "e" ] && [ -e "$LOC" ]; then
 echo "$LOC exists, not loading"
 exit 0;
fi

mkdir -p ${Z}/${X}
wget -nv http://b.tile.openstreetmap.org/${LOC} -O ${LOC}

if [ "$4" = "d" ]; then
 display ${LOC}
fi
