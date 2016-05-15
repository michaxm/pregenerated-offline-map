Pregenerated Offline Map
------------------------
This is a webpage and an Firefox os app to display pregenerated (openstreetmap) tiles. It is meant for local subsets of mapdata, not the complete world data.

The default configuration contains a small world overview map with very limited zoom levels, which is less than 200 KB. Useful maps are meant to be added by the individual user. See data for bash scripts that fetch needed tiles for a given map specification. Maps are expected to be put on the sdcard storage in a directory data with a file "maps" containing an ordered list of subdirectories with map data.
Data amount: an area of 0.2^2 degrees (most cities should fit in) takes 16MB of space on zoom level 15. Each more detailed zoom level is about 3 times bigger as the previous one.

Privileged app
--------------
This is a packaged app that is meant to be used completely offline (my device has not been allowed any network connection at all). Reading from sdcard requires privileges. As I currently do not plan to get a marketplace certification, the only deployment method I know is through the Web IDE (which I use anyway).
The alternative (web app) can only be used with inline map data, the included World map is an example for that. This however becomes impractical for larger (>60MB) maps.

Roadmap
-------
- Support searchable featured coodinates (again)

Origin
------
The initial version of this setup (packaged app with Leaflet) was taken from https://github.com/kownet/poland-offline-map, but has been changed drastically since. Some portions however (search features) have not yet been resupported in a way I like.
