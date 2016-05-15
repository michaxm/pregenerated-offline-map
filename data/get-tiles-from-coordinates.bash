#!/bin/bash -e

if [ $# -ne 6 ]; then
 echo "Syntax: $0 lon1 lat1 lon2 lat2 zmin zmax"
 echo
 echo "Loads openstreetmap.org tiles in the given area. Does not reload already fetched tiles"
 exit 1
fi
X1=$1
Y1=$2
X2=$3
Y2=$4
ZMIN=$5
ZMAX=$6

PI=`echo "4*a(1)" | bc -l`

function calcx {
  x=$1
  z=$2
  res=`echo "2^$z * ( $x + 180 ) / 360" |bc -l`
  floored=`echo ${res%.*}`
  if [ -n "$floored" ]; then
   echo $floored
  else
   echo 0 #no digit -> flooring to zero
  fi
}

function calcy {
  y=$1
  z=$2
  rad=`echo "$y*($PI/180)" | bc -l`
  res=`echo "(1 - l(s($rad)/c($rad) + (1/c($rad)))/$PI) / 2 * 2^$z" |bc -l`
  floored=`echo ${res%.*}`
  if [ -n "$floored" ]; then
   echo $floored
  else
   echo 0 #no digit -> flooring to zero
  fi
}

for z in `seq $ZMIN $ZMAX`; do
 x1=$(calcx $X1 $z)
 y1=$(calcy $Y1 $z)
 x2=$(calcx $X2 $z)
 y2=$(calcy $Y2 $z)
 echo "Loading for $z from ($x1/$y1) to ($x2/$y2)"
 for x in `seq $x1 $x2`; do
  for y in `seq $y2 $y1`; do #y-coords are reversed
  echo "Loading: ($x/$y) at zoom $z"
   ../get-openstreetmap-tile.bash $x $y $z e
  done
 done
done
