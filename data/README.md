Supplying map data
------------------

Map data is expected on sdcard in a subdirectoy data. Subdirectories contain metadata.json with map boundaries and zoom levels and the map tiles. Examples are provided here. A script (load ...) is provided to load the tiles of a given map, it expects the subdirectory name.
Finally, the data directory contains a file "maps" - a workaround because subdirectories could not be listed.

The World map is a special map used as a default - it is linked to the core map data and thus can be loaded even without permissions.
