// Storing API in jquery
var earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson"


// Get data
d3.json(earthquakeURL, function(data) {
    console.log (data)
    createFeatures(data.features);
});
// Define function for each feature to run on 
function createFeatures(earthquakeData) {
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h3>Magnitude: " + feature.properties.mag +"</h3><h3>Location: "+ feature.properties.place +
              "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
          },

          pointToLayer: function (feature, latlng) {
            return new L.circle(latlng,
              {radius: getRadius(feature.properties.mag),
              fillColor: getColor(feature.properties.mag),
              fillOpacity: .6,
              color: "#000",
              stroke: true,
              weight: .8
          })
        }
        });
    createMap(earthquakes);
}
function createMap(earthquakes) {
    // Various Map Layers (Mapbox API) for user selection
    var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?" +
      "access_token=pk.eyJ1IjoiY2ZlcnJhcmVuIiwiYSI6ImNqaHhvcW9sNjBlMmwzcHBkYzk0YXRsZ2cifQ.lzNNrQqp-E85khEiWhgq4Q");
    var lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
      "access_token=pk.eyJ1IjoiY2ZlcnJhcmVuIiwiYSI6ImNqaHhvcW9sNjBlMmwzcHBkYzk0YXRsZ2cifQ.lzNNrQqp-E85khEiWhgq4Q");
    var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoiY2ZlcnJhcmVuIiwiYSI6ImNqaHhvcW9sNjBlMmwzcHBkYzk0YXRsZ2cifQ.lzNNrQqp-E85khEiWhgq4Q");
   // Define base maps
   var baseMaps = {
    "Light Map": lightMap,
    "Outdoors": outdoors,
    "Satellite": satelliteMap
};
// Create overlay object to hold overlay layer
var overlayMaps = {
    "Earthquakes": earthquakes
};
    
// Create our map
var myMap = L.map("map", {
    center: [40.7, -94.5],
    zoom: 3,
    layers: [lightMap, earthquakes]
    });
//Add layer control to map
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false,
    legend: true
}).addTo(myMap);

// Create legend
var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend');
    labels = [],
    grades = [0,1,2,3,4,5];

    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
    };
    legend.addTo(myMap);
}

// Create color function
function getColor(magnitude) {
    if (magnitude > 5) {
        return 'red'
    } else if (magnitude > 4) {
        return 'orange'
    } else if (magnitude > 3) {
        return 'yellow'
    } else if (magnitude > 2) {
        return 'lightgreen'
    } else if (magnitude > 1) {
        return 'green'
    } else {
        return '#58C9CB'
    }
};

//Create radius function
function getRadius(magnitude) {
    return magnitude * 25000;
};