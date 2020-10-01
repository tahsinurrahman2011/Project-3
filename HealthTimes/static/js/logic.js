// Create outdoor map tiles layer
var outdoor = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
  "access_token={access_token}", {access_token: API_KEY});

// Create a map object
var myMap = L.map("map", {
  center: [39, -98],
  zoom: 4.5,
  layers: [outdoor]
});

// Create satellite map tiles layer
var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets-satellite",
  accessToken: API_KEY
});

// Create dark map tiles layer
var dark = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.dark",
  accessToken: API_KEY
});

// Create a baseMaps object to contain the different base maps
var baseMaps = {
  Outdoor: outdoor,
  Satellite: satellite,
  Dark: dark
};

// Create layer groups
var povertyLayer = new L.layerGroup();
var lacksHealthcareLayer = new L.layerGroup();
var smokesLayer = new L.layerGroup();
var obesityLayer = new L.layerGroup();

// Import Data
d3.csv("./static/data/health_indicators.csv", function(stateData) {

  console.log(stateData);

  // Step 1: Parse Data/Cast as numbers
  // ==============================
  stateData.forEach(function(data) {
    data.poverty = parseFloat(data.poverty);
    data.healthcare = parseFloat(data.healthcare);
    data.age = parseFloat(data.age);
    data.income = +data.income;
    data.smokes = parseFloat(data.smokes);
    data.obese = parseFloat(data.obese);
  });

  // Loop through the stateData array
  stateData.forEach(state=> {

    console.log(state);
    
    ////////////////
    // Obesity
    ////////////////

    // Conditionals for state circles
    var color = 'red';
    if (state.obesity < 5) { color = 'green'; }
    else if (state.obesity < 10) { color = 'greenyellow'; }
    else if (state.obesity < 15) { color = 'yellow'; }
    else if (state.obesity < 20) { color = 'orange'; }
    else if (state.obesity < 25) { color = 'darkorange'; }
    else if (state.obesity < 30) { color = 'coral'; }

    // Add circles to map
    L.circle([state.lat, state.long], {
      color: color,
      opacity: 0.3,
      fillColor: color,
      fillOpacity: 0.3,
      radius: state.obesity * 5000
    }).bindPopup("<h6>" + state.state + "</h6>Obese: " + state.obesity + "%")
    .addTo(obesityLayer);

    // Add layer to the map
    obesityLayer.addTo(myMap);


    ////////////////
    // Smoking
    ////////////////

    // Conditionals for state circles
    var color = 'red';
    if (state.smokes < 5) { color = 'green'; }
    else if (state.smokes < 10) { color = 'greenyellow'; }
    else if (state.smokes < 15) { color = 'yellow'; }
    else if (state.smokes < 20) { color = 'orange'; }
    else if (state.smokes < 25) { color = 'darkorange'; }
    else if (state.smokes < 30) { color = 'coral'; }

    // Add circles to map
    L.circle([state.lat, state.long], {
      color: color,
      opacity: 0.3,
      fillColor: color,
      fillOpacity: 0.7,
      radius: state.smokes * 5000
    }).bindPopup("<h6>" + state.state + "</h6>Smokes: " + state.smokes + "%")
    .addTo(smokesLayer);

    // Add layer to the map
    smokesLayer.addTo(myMap);

    ////////////////
    // Poverty
    ////////////////

    // Conditionals for state circles
    var color = 'red';
    if (state.poverty < 5) { color = 'green'; }
    else if (state.poverty < 10) { color = 'greenyellow'; }
    else if (state.poverty < 15) { color = 'yellow'; }
    else if (state.poverty < 20) { color = 'orange'; }
    else if (state.poverty < 35) { color = 'darkorange'; }
    else if (state.poverty < 30) { color = 'coral'; }

    // Add circles to map
    L.circle([state.lat, state.long], {
      color: color,
      opacity: 0.3,
      fillColor: color,
      fillOpacity: 0.5,
      radius: state.poverty * 5000
    }).bindPopup("<h6>" + state.state + "</h6>In Poverty: " + state.poverty + "%")
    .addTo(povertyLayer);

    // Add poverty layer to the map
    povertyLayer.addTo(myMap);

    ////////////////
    // Healthcare
    ////////////////
    
    // Conditionals for state circles
    var color = 'red';
    if (state.healthcare < 5) { color = 'green'; }
    else if (state.healthcare < 10) { color = 'greenyellow'; }
    else if (state.healthcare < 15) { color = 'yellow'; }
    else if (state.healthcare < 20) { color = 'orange'; }
    else if (state.healthcare < 35) { color = 'darkorange'; }
    else if (state.healthcare < 30) { color = 'coral'; }

    // Add circles to map
    L.circle([state.lat, state.long], {
      color: color,
      opacity: 0.3,
      fillColor: color,
      fillOpacity: 0.5,
      radius: state.healthcare * 5000
    }).bindPopup("<h6>" + state.state + "</h6>Lacks Healthcare: " + state.healthcare + "%")
    .addTo(lacksHealthcareLayer);

    // Add layer to the map
    lacksHealthcareLayer.addTo(myMap);
    
  });

});

// Create the background box for the legend
var legendBox = L.control();

// Create a div with a class "legendBox"
legendBox.onAdd = function (map) {
    return L.DomUtil.create('div', 'info');
};

// Add the box to the map
legendBox.addTo(myMap);

// Create a legend in layer control and position it
var legend = L.control({ position: "bottomright" });

// Create the legend div and update the innerHTML
legend.onAdd = function (map) {

  // Create a div with a class "legend"
  var div = L.DomUtil.create('div', 'legendBox legend'),
      percentage = [0, 5, 10, 15, 20, 25, 30]

  // Loop through our magnitude intervals and generate a label with a colored square for each interval
  for (var i = 0; i < percentage.length; i++) {
      div.innerHTML +=
          '<i style="background:' + getColor(percentage[i]) + '"></i> ' + 
          percentage[i] + 
          (percentage[i + 1] ? '&ndash;' + percentage[i + 1] + '%<br>' : '%+');
  }
  return div;
};

// Add the legend to the map
legend.addTo(myMap);

// Create an overlayMaps object
var overlayMaps = {
  "In Poverty": povertyLayer,
  "Lacks Healthcare": lacksHealthcareLayer,
  Smokes: smokesLayer,
  Obese: obesityLayer
};

// Create a layer control, containing our baseMaps and overlayMaps
L.control.layers(baseMaps, overlayMaps).addTo(myMap);

// Function for getting color of labels in the legend
function getColor(d) {
  return d === 0  ? "green" :
         d === 5  ? "greenyellow" :
         d === 10  ? "yellow" :
         d === 15  ? "orange" :
         d === 20  ? "darkorange" :
         d === 25  ? "coral" :
         d === 30  ? "red" :
                  "red";
}
