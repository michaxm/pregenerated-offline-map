function onEachCity(feature, layer) {
    var popupContent = "<b>Position: </b>";
    var city = "Position: ";

    if (feature.properties && feature.properties.city) {
        popupContent += feature.properties.city;
    }

    layer.bindPopup(popupContent);

    layer.on('mouseover', function (e) {
        $('#entry').text(city + feature.properties.city);
    });

    layer.on('mouseout', function (e) {
        $('#entry').text('');
    });
}

function onEachLink(feature, layer) {
    var popupContent = "<b>Link: </b>";

    if (feature.properties && feature.properties.title) {
        popupContent += feature.properties.title;
        popupContent += "<br>";
        popupContent += "<b>Description: </b>";
        popupContent += feature.properties.description;
    }

    layer.bindPopup(popupContent);
}

window.onload = function init() {
    initData();
}

function initData() {
    console.log("Loading data");
    readMetadata("data/tiles/metadata.json", function(metadata){
        initMap(metadata);
    });
}

function initMap(metadata) {
    var useInlineData = false;
    console.log("Initializing");

    var center = metadata.center.split(",");
    var map = new L.Map("map", {
        center: new L.LatLng(center[1], center[0]),
        zoom: center[2]
    });
    $('#reload').on('click', function() {
        map.remove();
        initData();
    });
    
    var baseLayer;
    if (useInlineData) {
        baseLayer = new L.tileLayer(
            'data/tiles/{z}/{x}/{y}.png',
            makeLayerOptions(metadata)
        );
    } else {
        baseLayer = new L.TileLayer.Functional(function (view) {
            var filePath = 'data/tiles/{z}/{x}/{y}.png'
            .replace('{z}', view.zoom)
            .replace('{y}', view.tile.row)
            .replace('{x}', view.tile.column);
            
            var deferred = $.Deferred();
            withUrlForFilePath(filePath, function(url) {
                deferred.resolve(url);
            })
            return deferred.promise();
            
        }, makeLayerOptions(metadata));
    }
    map.addLayer(baseLayer);
    
    
    var geojsonMarkerOptions = {
        radius: 6,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    L.geoJson.ajax('data/cities.json', {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, geojsonMarkerOptions);
        },
        onEachFeature: onEachCity
    }).addTo(map);

    var featuresLayer = L.geoJson.ajax('data/links.json', {
        style: function(feature) {
            return {
                color: "#000",
                opacity: 0.001
            };
        },
        onEachFeature: onEachLink
    });

    var searchControl = new L.Control.Search({
        layer: featuresLayer, 
        propertyName: 'title', 
        circleLocation: false
    });

    searchControl.on('search_locationfound', function(e) {
        
        e.layer.setStyle({
            fillColor: '#3f0', 
            color: '#0f0', 
            opacity: 1
        });

        if(e.layer._popup)
            e.layer.openPopup();

    }).on('search_collapsed', function(e) {
        featuresLayer.eachLayer(function(layer) {   //restore feature color
            featuresLayer.resetStyle(layer);
        }); 
    });
    
    map.addControl( searchControl );  //inizialize search control
}

function makeLayerOptions(metadata) {
    return {
        maxZoom: metadata.maxzoom,
        minZoom: metadata.minzoom,
    };
}