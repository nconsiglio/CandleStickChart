function setup() {

    //declare variable in function scope
    let candleStickChart;



    //Read in the CSV and pass the data to instantiate the candleStickVis class
    d3.csv("data/data.csv").then(data => {
        candleStickChart = new CandleStickVis(data);
});


}