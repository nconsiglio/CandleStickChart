function setup() {
    let candleStickChart;



    d3.csv("data/data.csv").then(data => {
     candleStickChart = new candleStickVis(data)
    });


}