// this calls the function that loads the landing page 
InitDashboard();

// this function displays the dashboard in the landing page by using the first ID in dropdown as default
function InitDashboard()
{
    d3.json("samples.json").then((importedData) => 
    { 
      // selects the dropdown entity in the html
      var selector = d3.select("#selDataset");

      // selects the list of names in the data
      var sampleNames = importedData.names;

      // fills the dropdown with list of values for selection
      sampleNames.forEach((nameID) =>
      {
        selector.append("option")
          .text(nameID)
          .property("value", nameID);
      });

      // reads the default ID on landing page
      var sampleID = sampleNames[0];

      // calls the function to draw the graphs on the landing page
      drawAllGraphs(sampleID);
    });       
}

// this section calls all the functions that draws each of the graphs
function drawAllGraphs(sampleID)
{
    drawDemographics(sampleID);
    drawBarPlot(sampleID);
    drawBubbleChart(sampleID);
    drawGaugeChart(sampleID);

}

// this section lists the demographics details of the selected subject ID
function drawDemographics(sampleID)
{
    d3.json("samples.json").then((importedData) => 
    { 
      // returns the data of the selected subject ID
      function filterSample(sampleData)
      {
        return sampleData.id == sampleID;
      }
      
      // calls the function the returns the data of selected ID
      var sampleMetadata = importedData.metadata.filter(filterSample);
      
      // select the element by class name and clear
      var demogDiv = d3.select("#sample-metadata");
      demogDiv.html("");

      // read through the filtered data and write into rows/cells of the table
      sampleMetadata.forEach((filteredRow) => 
      {
        var listdata = demogDiv.append("tr");
          Object.entries(filteredRow).forEach(([key, value]) => 
          {
            var cell = listdata.append("tr");
            cell.text(`${key}:  ${value}`);
          });
      });
    });
}

// this section draws the bar plot of the top 10 OTUs of the default/selected subject ID
function drawBarPlot(sampleID)
{
    d3.json("samples.json").then((importedData) => 
    { 
      // returns the data of the selected subject ID
      function filterSample(sampleData)
      {
        return sampleData.id == sampleID;
      }
      
      // calls the function the returns the data of subject ID and store the filtered data
      var sampleData = importedData.samples.filter(filterSample);
        
      // select the element by class name and clear
      var barDiv = d3.select("#bar");
      barDiv.html("");

      // selects the top 10 OTU data
      otuIDs = sampleData[0].otu_ids.slice(0,10);
      sampleValues = sampleData[0].sample_values.slice(0,10).reverse();
      otuLabels = sampleData[0].otu_labels.slice(0,10);

      // builds the trace using the top 10 OUT data
      var trace1 = 
      {
        x: sampleValues,
        y: otuIDs.map(id => "OTU " + id.toString()),            
        text: otuLabels,
        name: otuIDs,
        type: "bar",
        orientation: "h"
      };

      var data = [trace1];

      // define layout
      var layout = 
      {
        title: (`Top 10 OTUs of Subject id ${sampleID}`)
      };
          
      // render the plot to the div tag associated to the bar graph div
      Plotly.newPlot("bar", data, layout); 
    });
}

// this section draws the bubble chart of the default/selected subject ID
function drawBubbleChart(sampleID)
{
    d3.json("samples.json").then((importedData) => 
    { 
      // returns the data of the selected subject ID
      function filterSample(sampleData)
      {
        return sampleData.id == sampleID;
      }
      
      // calls the function the returns the data of subject ID and store the filtered data
      var sampleData = importedData.samples.filter(filterSample);
             
      // select the element by class name and clear
      var bubbleDiv = d3.select("#bubble");
      bubbleDiv.html("");

      // selects the information needed to plot the chart
      otuIDs = sampleData[0].otu_ids;
      sampleValues = sampleData[0].sample_values;
      otuLabels = sampleData[0].otu_labels;

      // builds the trace using the filtered data
      var trace1 = 
      {
        x: otuIDs,
        y: sampleValues,
        text: otuLabels,
        mode: 'markers',
        number: { prefix: "OTU "},
        marker: 
        {
          size: sampleValues,
          color: otuIDs
        }
      };
          
      var data = [trace1];
      
      // define the layout of the chart
      var layout = 
      {
        title: 'OTU ID Size Chart',
        xaxis: {title: 'OTU ID'},
        yaxis: {title: 'OTU Size'}
      };

      // render the plot to the div tag associated to the bubble chart div
      Plotly.newPlot('bubble', data, layout);

    });
}

// this function draws the gauge chart of the default/selected subject ID
function drawGaugeChart(sampleID)
{
  d3.json("samples.json").then((importedData) => 
  { 
    // returns the data of the selected subject ID
    function filterSample(sampleData)
    {
      return sampleData.id == sampleID;
    }
      
    // calls the function the returns the data of subject ID and store the filtered data
    var sampleMetadata = importedData.metadata.filter(filterSample);
    
    // extract the washing frequency data of the subject ID
    var washingFreq = sampleMetadata[0].wfreq;
    
    //var washingFreqArray = importedData.metadata;
    
    // select the element by class name and clear
    var gaugeDiv = d3.select("#gauge");
    gaugeDiv.html("");

    // define the data to be used in creating the gauge chart
    var data = 
    [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: washingFreq,
        title: { text: "<span style='font-weight: bold'>Belly Button Washing Frequency</span><br>Scurbs per Week" },
        type: "indicator",
        mode: "gauge+number"
      }
    ];

    // define the layout
    var layout = 
    { 
      width: 600, 
      height: 500, 
      margin: { t: 0, b: 0 } 
    };
    
    // render the plot to the div tag associated to the gauge chart div
    Plotly.newPlot('gauge', data, layout);
  });
}

// this function is called when test subject ID dorpdown value is changed
function optionChanged(newSampleID)
{   
  // calls the function to draw the graphs of the newly selected subject ID
  drawAllGraphs(newSampleID);
}