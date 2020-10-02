function drawGraphs(sampleID)
{
    console.log(`sampleID is ${sampleID}`);
    
    drawDemographics(sampleID);
    drawBarPlot(sampleID);
    drawBubbleChart(sampleID);
    drawGaugeChart(sampleID);

}

function drawDemographics(sampleID)
{
    d3.json("samples.json").then((importedData) => 
    { 
        function filterSample(sampleData)
        {
            return sampleData.id == sampleID;
        }
        
        var sampleMetadata = importedData.metadata.filter(filterSample);
        console.log("demo sampleMetadata: ", sampleMetadata);

        // select the element by class name
        var demogDiv = d3.select("#sample-metadata");

        demogDiv.html("");

        // read through the filtered data and write into rows/cells of the table
        sampleMetadata.forEach((filteredRow) => {
            var listdata = demogDiv.append("tr");
            Object.entries(filteredRow).forEach(([key, value]) => {
              var cell = listdata.append("tr");
              cell.text(`${key}:  ${value}`);
            });
        });
    });
}

function drawBarPlot(sampleID)
{
    d3.json("samples.json").then((importedData) => 
    { 
        function filterSample(sampleData)
        {
            return sampleData.id == sampleID;
        }
        
        var sampleData = importedData.samples.filter(filterSample);
        console.log("bar sampleData: ", sampleData);
        
        // select the element by class name
        var barDiv = d3.select("#bar");
        barDiv.html("");

        console.log("sampleData[0].otu_ids ", sampleData[0].otu_ids);
        console.log("sampleData[0].sample_values ", sampleData[0].sample_values);
        console.log("sampleData[0].otu_labels ", sampleData[0].otu_labels);

        otuIDs = sampleData[0].otu_ids.slice(0,10);
        sampleValues = sampleData[0].sample_values.slice(0,10).reverse();
        otuLabels = sampleData[0].otu_labels.slice(0,10);

        console.log("bar otu_ids ", otuIDs);
        console.log("bar sample_values ", sampleValues);
        console.log("bar otu_labels ", otuLabels);

        var trace1 = {
            x: sampleValues,
            y: otuIDs.map(id => "OTU " + id.toString()),            
            text: otuLabels,
            name: otuIDs,
            type: "bar",
            orientation: "h"
          };

          var data = [trace1];

          // Apply the group barmode to the layout
          var layout = {
            title: (`Top 10 OTUs of Subject id ${sampleID}`)
          };
          
          // Render the plot to the div tag with id "plot"
          Plotly.newPlot("bar", data, layout); 
    });
}

function drawBubbleChart(sampleID)
{
    d3.json("samples.json").then((importedData) => 
    { 
        function filterSample(sampleData)
        {
            return sampleData.id == sampleID;
        }
        
        var sampleData = importedData.samples.filter(filterSample);
        console.log("bubble sampleData: ", sampleData);
        
        // select the element by class name
        var bubbleDiv = d3.select("#bubble");
        bubbleDiv.html("");

        otuIDs = sampleData[0].otu_ids;
        sampleValues = sampleData[0].sample_values;
        otuLabels = sampleData[0].otu_labels;

        console.log("bubble otu_ids ", otuIDs);
        console.log("bubble sample_values ", sampleValues);
        console.log("bubble otu_labels ", otuLabels);

        var trace1 = {
            x: otuIDs,
            y: sampleValues,
            mode: 'markers',
            marker: {
              size: sampleValues,
              color: otuIDs,
              text: otuLabels
            }
          };
          
          var data = [trace1];
          
          var layout = {
            title: 'Marker Size'
            //showlegend: false,
            //height: 600,
            //width: 600
            //xaxis: "OTU ID"
          };
          
        Plotly.newPlot('bubble', data, layout);

    });
}

function drawGaugeChart(sampleID)
{
  d3.json("samples.json").then((importedData) => 
  { 
      function filterSample(sampleData)
      {
          return sampleData.id == sampleID;
      }
      
      var sampleMetadata = importedData.metadata.filter(filterSample);
      console.log("gauge sampleMetadata: ", sampleMetadata);

      // getting the count to be used in for loop
      var namesCount = importedData.names.length;
      console.log("namesCount: ", namesCount);

      var allWfreq = importedData.metadata.wfreq;
      console.log("allWfreq: ", allWfreq);

      var washingFreq = sampleMetadata[0].wfreq;
      console.log("washingFreq: ", washingFreq);

      var washingFreqArray = importedData.metadata;
      console.log("washingFreqArray: ", washingFreqArray);

      // select the element by class name
      var gaugeDiv = d3.select("#gauge");

      gaugeDiv.html("");

      var data = [
        {
          domain: { x: [0, 1], y: [0, 1] },
          value: washingFreq,
          title: { text: "<span style='font-weight: bold'>Belly Button Washing Frequency</span><br>Scurbs per Week" },
          type: "indicator",
          mode: "gauge+number"
        }
      ];

      var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
      Plotly.newPlot('gauge', data, layout);
  });
}

function optionChanged(newSampleID)
{   
    console.log(`user selected ${newSampleID}`);
    drawGraphs(newSampleID);
}

// this function performs the default display of dashboard landing page
function InitDashboard()
{
    d3.json("samples.json").then((importedData) => 
    { 
      var selector = d3.select("#selDataset");
      console.log(importedData);

      var sampleNames = importedData.names;
      console.log("sampleNames: ", sampleNames);

      sampleNames.forEach((nameID) =>
      {
        selector.append("option")
          .text(nameID)
          .property("value", nameID);
      });

      // default ID on landing page
      var sampleID = sampleNames[0];
      console.log("sampleID: ", sampleID);

      drawGraphs(sampleID);
    });       
}

InitDashboard();