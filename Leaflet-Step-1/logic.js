// Create our map, giving it the streetmap and earthquakes layers to display on load
var myMap = L.map("map", {
    center: [40, -105],
    zoom: 4
});

// Create marker colors
function chooseColor(magnitude) {
    return magnitude > 5 ? "red" :
        magnitude > 4 ? "orange" :
        magnitude > 3 ? "gold" :
        magnitude > 2 ? "yellow" :
        magnitude > 1 ? "yellowgreen" :
        "greenyellow";
}

// Create marker size per quake magnitude
function createMagnitude(magnitude) {
    return magnitude * 20000;
}

// Create legend for map
function legend() {
    var leg = L.control({
        position: 'bottomright'
    });

    leg.onAdd = function() {
        var labels = ["Magnitude Legend"];
        var div = L.DomUtil.create('div', 'info legend'),
            category = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];
        color = ["#51802F", "#AEBF4A", "#FFD968", "#FEC378", "#FDAA96", "#FDB5C2"];

        for (var i = 0; i < category.length; i++) {
            div.innerHTML = labels.push('<div class="square" style="background:' +
                color[i] + '"></div><span class="explanation">' + cat[color.length - i - 1] + '</span>');
        }

        div.innerHTML = labels.join('<br>');
        return div;
    };
    leg.addTo(myMap);
}

// Create earthquake layer
function createMap(earthQuakeLayer) {
    //Create light map
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
        maxZoom: 10,
        id: "mapbox.light",
        accessToken: API_KEY
    }).addTo(myMap);

    //Add the earthquake layer into map  
    earthQuakeLayer.addTo(myMap);
}


// Earthquake locations, bubbles, and features
function createBubblesLayer(response) {
    let earthQuakesData = response.features;
    let earthQuakePoints = [];
    // Loop through index for location, mangitude
    for (var i = 0; i < earthQuakesData.length; i++) {
        var point = earthQuakesData[i].geometry.coordinates;
        var magnitude = earthQuakesData[i].properties.mag;
        var title = earthQuakesData[i].properties.title;

        // Marker and bind popup with station name
        var bubbles = L.circle([point[1], point[0]], {
            color: "#AF9C60",
            fillColor: chooseColor(magnitude),
            fillOpacity: 1.0,
            radius: createMagnitude(magnitude)
        }).bindPopup(title);

        earthQuakePoints.push(bubbles);
    }
    return L.layerGroup(earthQuakePoints);
}
console.log(createBubblesLayer)


// Perform API call to USGS API to get earthquake information
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(response) {
    var layer = createBubblesLayer(response);
    createMap(layer);
    legend();
});