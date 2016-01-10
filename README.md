This is a webpage and an fx-os app to display pregenerated (openstreetmap) tiles. It is meant for local subsets of mapdata, not the world data.

The display method for tiles and all basic setup is taken from https://github.com/kownet/poland-offline-map, I have started with a fresh history because of some example data, which I feel does not belong into the application logic and did not want as binary data in the history. Furthermore, I plan on reusing officially generated tiles and do not emphasize meta data enrichment.

To use it, local tiles have to be acquired for your needs. One way to acquire them is to edit data/metadata.json to your needs (bounds, center, zoom) and execute the bash script to load the required tiles. Data amount: an area of 0.2^2 degrees (most cities should fit in) takes 16MB of space on zoom level 15. Each higher levels size is 4 times bigger.

TODO No metadata integration tested yet, just plain maps.
