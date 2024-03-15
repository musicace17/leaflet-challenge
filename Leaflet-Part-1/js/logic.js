//Endpoint!
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"


let earthquakes = L.layerGroup();

//Tile Layer
var mapTile = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.{ext}', {
	minZoom: 1,
	maxZoom: 16,
	attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'jpg'
});


let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 3,
    layers: [mapTile, earthquakes]
});



//GET the URL
d3.json(url).then(function(data){
    function markerSize(magnitude) {
        return magnitude * 4;
    };
    function markerColor(depth) {
        if (depth > 90) {
            return "red";
        }
        else if (depth > 70) {
            return "orange";
        }
        else if (depth > 50) {
            return "yellow";
        }
        else if (depth > 30) {
            return "green";
        }
        else if (depth > 10) {
            return "blue";
        }
        else {
            return "purple";
        }
    }

    //Geojson time
    L.geoJson(data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: markerSize(feature.properties.mag),
                color: markerColor(feature.geometry.coordinates[2]),
                fillColor: markerColor(feature.geometry.coordinates[2]),
                fillOpacity: 0.75,
                weight: 0.5,
            });
        },
        onEachFeature: function(feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
        }
    }).addTo(earthquakes);

    earthquakes.addTo(myMap);

    //Legend time
    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "info legend");
        let grades = [0, 10, 30, 50, 70, 90];
        let colors = ["purple", "blue", "green", "yellow", "orange", "red"];
        div.innerHTML += "<h3>Depth</h3>"
        for (let i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + colors[i] + '"></i>'+
                grades[i] + (grades[i + 1]? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
        return div;
        };
        legend.addTo(myMap);
        });
