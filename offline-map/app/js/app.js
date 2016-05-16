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
    initData(null);
}

function initData(mapSelection) {
    console.log("Loading data for: "+mapSelection);
    
    readMapNames(function(mapNames) {
        if (mapSelection == null) {
        // direct access logs an error, but works ...
        // this is copied workaround - probably really dirty, but right now I don't care
        $.ajaxSetup({beforeSend: function(xhr){
                         if (xhr.overrideMimeType)  {
                             xhr.overrideMimeType("application/json");
                         }}});
        $.getJSON("data/World/metadata.json", function(metadata){
            initMap(metadata, true, mapNames);
        });
    } else {
        readMetadata("data/"+mapSelection+"/metadata.json", function(metadata){
            initMap(metadata, false, mapNames);
        });
    }
    });
}

function initMap(metadata, useInlineData, mapNames) {
    console.log("Initializing");
    var center = metadata.center.split(",");
    var map = new L.Map("map", {
        center: new L.LatLng(center[1], center[0]),
        zoom: center[2]
    });
    addBaseLayer(map, metadata, useInlineData);
    var featuresLayer = addMapMarkers(map);
    addSearchControl(map, featuresLayer);
    addMapControl(map, mapNames);
}

function addBaseLayer(map, metadata, useInlineData) {
    var baseLayer;
    if (useInlineData) {
        baseLayer = new L.tileLayer(
            makeFsPath(metadata),
            makeLayerOptions(metadata)
            );
        /*
        // debug requested tiles:
        baseLayer = new L.TileLayer.Functional(function (view) {
            var filePath = makeFsPath(metadata)
            .replace('{z}', view.zoom)
            .replace('{y}', view.tile.row)
            .replace('{x}', view.tile.column);
        
            console.log(filePath);
            return filePath;
        });
            */
    } else {
        baseLayer = new L.TileLayer.Functional(function (view) {
            var filePath = makeFsPath(metadata)
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
}

function makeFsPath(metadata) {
    // Shortcut: demand metadata.name == data folder name
    var mapName = metadata.name;
    return 'data/'+mapName+'/{z}/{x}/{y}.png';
}

function makeLayerOptions(metadata) {
    return {
        maxZoom: metadata.maxzoom,
        minZoom: metadata.minzoom,
    };
}

function addMapControl(map, mapNames) {
    $('#reload').on('click', function() {
        map.remove();
        initData(null);
    });
    $('#world-map').on('click', function() {
        map.remove();
        initData(null);
    });
    
    $('.map-name').remove();
    
    var mapNamesContainer = $('#mapNames');
    addMapSelector(mapNamesContainer, map, "World", null);
    
    mapNames.forEach(function(mapName) {
        addMapSelector(mapNamesContainer, map, mapName, mapName);
    });
}

function addMapSelector(mapNamesContainer, map, mapDisplayName, mapName) {
    var mapNameSelector = $( '<li class="list-group-item map-name">'+mapDisplayName+'</li>' );
    mapNamesContainer.append(mapNameSelector);
    mapNameSelector.on('click', function() {
            map.remove();
            initData(mapName);
        });
}

function addMapMarkers(map) {
    
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
    return featuresLayer;
}

function addSearchControl(map, featuresLayer) {

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
