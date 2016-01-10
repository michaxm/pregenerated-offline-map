function onEachCity(feature, layer) {
    var popupContent = "<b>Lokalizacja: </b>";
    var city = "Lokalizacja: ";

    if (feature.properties && feature.properties.city) {
        popupContent += feature.properties.city;
    }

    layer.bindPopup(popupContent);

    layer.on('mouseover', function (e) {
        $('#miasto').text(city + feature.properties.city);
    });

    layer.on('mouseout', function (e) {
        $('#miasto').text('');
    });
}

function onEachLink(feature, layer) {
    var popupContent = "<b>Link: </b>";

    if (feature.properties && feature.properties.title) {
        popupContent += feature.properties.title;
        popupContent += "<br>";
        popupContent += "<b>Opis: </b>";
        popupContent += feature.properties.description;
    }

    layer.bindPopup(popupContent);
}

window.onload = function init() {
    $.getJSON("data/tiles/metadata.json", function(data){
       initMap(data);
    });
}

function initMap(metadata) {
    var center = metadata.center.split(",");
    var map = new L.Map("map", {
        center: new L.LatLng(center[1], center[0]),
        zoom: center[2]
    });

    var TopoLayer = L.tileLayer('data/tiles/{z}/{x}/{y}.png', {
        maxZoom: metadata.maxzoom,
        minZoom: metadata.minzoom,
    });

    map.addLayer(TopoLayer);

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