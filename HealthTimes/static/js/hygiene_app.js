
function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  d3.json("/hygiene/metadata/" + sample).then(function(response){

    console.log(response);
    var metadata = response;

    // Use d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(metadata).forEach( ([key, value]) => panel.append('p').text(key + ": " + value));

    // BONUS: Build the Gauge Chart
    buildGauge(sample, metadata.WFREQ);

  });
}

function buildGauge(sample, wfreq) {
  
  // Gauge level
  var level = wfreq;

  // Trig to calc meter point
  var degrees = 9 - level,
       radius = 0.5;
  var radians = degrees * Math.PI / 9;
  var x = radius * Math.cos(radians);
  var y = radius * Math.sin(radians);

  // Triangle for gauge pointer
  var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
       pathX = String(x),
       space = ' ',
       pathY = String(y),
       pathEnd = ' Z';
  var path = mainPath.concat(pathX,space,pathY,pathEnd);

  var data = [{ type: 'scatter',
     x: [0], y:[0],
      marker: {size: 28, color:'850000'},
      showlegend: false,
      name: 'scrubs',
      text: level,
      hoverinfo: 'text+name'},
    { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
    rotation: 90,
    text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
    textinfo: 'text',
    textposition:'inside',
    marker: {
      colors:['rgba(14, 127, 0, .5)', 'rgba(50, 113, 11, .5)', 'rgba(110, 154, 22, .5)', 'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
              'rgba(210, 206, 145, .5)', 'rgba(220, 210, 175, .5)', 'rgba(232, 226, 202, .5)', 'rgba(244, 255, 225, .5)', 'rgba(255, 255, 255, .5)']
    },
    labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
    hoverinfo: 'label',
    hole: .5,
    type: 'pie',
    showlegend: false
  }];

  var layout = {
    shapes:[{
        type: 'path',
        path: path,
        fillcolor: '850000',
        line: {
          color: '850000'
        }
      }],
    title: '<b>Belly Button Washing Frequency</b><br>(Scrubs per Week)',
    height: 500,
    width: 500,
    xaxis: {zeroline:false, showticklabels:false,
               showgrid: false, range: [-1, 1]},
    yaxis: {zeroline:false, showticklabels:false,
               showgrid: false, range: [-1, 1]}
  };

  Plotly.newPlot('gauge', data, layout);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json('/hygiene/samples/' + sample).then(function(response) {

    // @TODO: Build a Bubble Chart using the sample data  
    var sampleData = response;

    var trace1 = {
      x: sampleData.otu_ids,
      y: sampleData.sample_values,
      mode: 'markers',
      marker: {
        size: sampleData.sample_values,
        color: sampleData.otu_ids,
        colorscale: 'Earth',
        type: 'heatmap'
      },
      text: sampleData.otu_labels
    };

    var data = [trace1];

    var layout = {
      title: "<b>Bubble Chart of Belly Button Bacteria</b><br>(All Bacteria)",
      showlegend: false,
      xaxis: {
        title: "OTU ID"
      },
      yaxis: {
        title: "Sample Value"
      }
    };

    Plotly.newPlot('bubble', data, layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

    // Prepare a list of objects for sorting
    var list = [];
    for (var i = 0; i < sampleData.otu_ids.length; i++) {
        // Push each object into the list
        list.push({'otu_ids': sampleData.otu_ids[i], 'otu_labels': sampleData.otu_labels[i], 'sample_values': sampleData.sample_values[i]});
    }

    // Sort function by object key in array
    console.log(list.sort((a, b) => parseInt(b.sample_values) - parseInt(a.sample_values)));

    var trace2 = {
      values: list.slice(0,10).map(record => record.sample_values),
      labels: list.slice(0,10).map(record => record.otu_ids),
      hovertext: list.slice(0,10).map(record => "(" + record.otu_ids + ", " + record.otu_labels + ")"),
      type: "pie"
    };

    var data = [trace2];

    var layout = {
      title: "<b>Pie Chart of Belly Button Bacteria</b><br>(Top 10)",
      height: 500,
      width: 500
    };

    Plotly.newPlot("pie", data, layout);
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/hygiene/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text("BB_" + sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
