// takes an id and then plots the charts for that id
function charts(id_no){
    // read the data
    d3.json('samples.json').then(function(data){
        console.log("Here is the data:")
        console.log(data);
        // get data required

        //  get sample
        var values = data.samples;
        console.log(`Here is the sample values:`);
        console.log(values);

        //filter for chosen id
        var filtered_values = values.filter(row => row.id == id_no);
        console.log(`This is the chosen id:`);
        console.log(filtered_values);

        var otu_ids = filtered_values[0].otu_ids;
        var sv = filtered_values[0].sample_values;
        var otu_labels = filtered_values[0].otu_labels;  
        

        // ---------------------------------------------------//
        // -------------------- Bar chart --------------------//

        bar_trace = [{
            type:"bar",
            text: otu_labels.slice(0,10).reverse(),
            y: otu_ids.slice(0,10).map(id => `OTU ${id}`).map(id => `OTU ${id}`).reverse(),
            x: sv.slice(0,10).reverse(),
            orientation: "h"
        }];

        bar_layout ={
            title: "Top 10 OTU's",
            margin: { t: 30, l: 150 }
        }
        Plotly.newPlot("bar",bar_trace,bar_layout);

        // ---------------------------------------------------//
        // ----------------- Bubble chart --------------------//

        bubble_trace =[{
            mode:"markers",
            x: otu_ids,
            y: sv,
            marker : {
                size: sv, 
                color : otu_ids},
            text: otu_labels
        }]

        bubble_layout ={
            xaxis: {title: "OTU ID"},
            hovermode: "closest",
            margin: { t: 30, l: 150 }
        }

        Plotly.newPlot("bubble",bubble_trace,bubble_layout);

    }
    );
}

// create gauge
function gauge(id_no){
    d3.json('samples.json').then(function(data){
        var md = data.metadata;
        var filtered_values = md.filter(row => row.id == id_no);
        gauge_trace =[
            {
              type: "indicator",
              mode: "gauge+number",
              value: filtered_values[0].wfreq,
              title: { text: "Belly Button Washing Frequency <br> Scrubs per week", font: { size: 24 } },
              delta: { reference: 9, increasing: { color: "RebeccaPurple" } },
              gauge: {
                axis: { range: [null, 9], tickwidth: 1, tickcolor: "darkblue" },
                bar: { color: "darkblue" },
                bgcolor: "lightgrey",
                borderwidth: 2,
                bordercolor: "gray",
              }
            }
          ];

        gauge_layout ={
            xaxis: {title: "Belly Button Washing Frequency"}
        };

        Plotly.newPlot("gauge",gauge_trace,gauge_layout);
    });

    
}



function metadata(id_no){
        // read the data
        d3.json('samples.json').then(function(data){
            // get data required
            var metadata = data.metadata;
            console.log("This is the metadata:")
            console.log(metadata);

            //filter for chosen id
            var filtered_values = metadata.filter(row => row.id == id_no);

            // select where the data will be displayed
            var box = d3.select("#sample-metadata");

            Object.entries(filtered_values[0]).forEach(([key,value]) => {
                box.append("h6").text(`${key}: ${value}`);
            });
        }
        );
}

// init function
function init(){
    // select dropdown
    var dropdown = d3.select("#selDataset");

    d3.json('samples.json').then(function(data){
        var names = data.names;

        names.forEach(name => dropdown.append("option").text(name).property("value", name));

        // This will plot the graphs when the page is first loaded
        charts(names[0]);
        metadata(names[0]);
        gauge(names[0]);

        dropdown.on("change", changID);
    }
    );
    
}

function changeOption(new_id){
    charts(new_id);
    d3.select("#sample-metadata").selectAll("h6").remove();
    metadata(new_id);
    gauge(new_id);
}

function changID() {
    // Prevent the page from refreshing
    d3.event.preventDefault();
  
    // Select the value from the dropdown
    var dropdown = d3.select("#selDataset").node().value;

    // Build the plot with the new stock
    changeOption(dropdown)
  }

init();

