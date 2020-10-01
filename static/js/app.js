function drawGraphs(sampleID)
{
    console.log(`sampleID is ${sampleID}`);
    
    drawDemographics(sampleID);
    drawBarPlot(sampleID);
    drawBubbleChart(sampleID);

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

        //var demogDiv = d3.select("#sample-metadata");
        //var dataList;
                    
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
            //y: otuIDs,            
            text: otuLabels,
            //name: "OTU Sample Values",
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

function optionChanged(newSampleID)
{   
    console.log(`user selected ${newSampleID}`);
    drawGraphs(newSampleID);
}

function InitDashboard()
{
    var selector = d3.select("#selDataset");

    d3.json("samples.json").then((importedData) => 
    { 
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

/*d3.json("samples.json").then((importedData) => {
        
    var ids = data.names.metadata.id;
    console.log(ids);
   
    //var names = data.dataset.data.map(sample => sample.names);
    var names = data.map(sample => sample.names);
    var metadata = data.map(sample => sample.metadata);
    var samples = data.map(sample => sample.samples);
    console.log("names: " ,names);
    console.log("metadata: " ,metadata);
    console.log("samples: " ,samples); 

    // Sort the data array using the greekSearchResults value
    data.sort(function(a, b) {
      return parseFloat(b.greekSearchResults) - parseFloat(a.greekSearchResults);
    });
  
    // Slice the first 10 objects for plotting
    data = data.slice(0, 10);
  
    // Reverse the array due to Plotly's defaults
    data = data.reverse();
  
     // Trace1 for the Greek Data
    var trace1 = {
      x: data.map(row => row.greekSearchResults),
      y: data.map(row => row.greekName),
      text: data.map(row => row.greekName),
      name: "Greek",
      type: "bar",
      orientation: "h"
    };
  
    // data
    var chartData = [trace1];
  
    // Apply the group bar mode to the layout
    var layout = {
      title: "Greek gods search results",
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
      }
    };
  
    // Render the plot to the div tag with id "plot"
    Plotly.newPlot("plot", chartData, layout); 
  });*/