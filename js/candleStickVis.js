class CandleStickVis{

    constructor(data){

        this.data = data;

        let chartDiv = d3.select("#main").classed("fullView", true);

        //fetch the svg bounds
        this.margin = {top: 10, right: 20, bottom: 20, left: 50};
        this.svgBounds = chartDiv.node().getBoundingClientRect();
        this.svgWidth = (this.svgBounds.width) - this.margin.left - this.margin.right;
        this.svgHeight = 500;

        //add the svg to the div
        this.svg = chartDiv.append("svg")
            .attr("id", "candle-chart-svg")
            .attr("width", this.svgWidth + 30)
            .attr("height", this.svgHeight+70);

        this.update()

    }



    update(){


        //Initialize variables with low and high numbers
        let marketMax = 0;
        let marketMin = 9999999999;
        let data = this.data


        //Calculate min and max values to use to build the scale
        data.forEach( d =>{
            marketMax = d.High > marketMax ? d.High: marketMax;
            marketMin = d.Low < marketMin ? d.Low : marketMin;
        });


        let minDate= new Date(data[data.length - 1].Date);
        let maxDate = new Date(data[0].Date);
        minDate = minDate.setDate(minDate.getDate() - 3);
        maxDate = maxDate.setDate(maxDate.getDate() + 3);


        const xAxisScale = d3.scaleTime().domain([minDate, maxDate]).range([0, (this.svgWidth -40)])

        const yAxisScale = d3.scaleLinear()
            .domain([(.9 * marketMin),(1.1 * marketMax)]) // input
            .range([(this.svgHeight - this.margin.bottom), this.margin.top]);


        //As X axis and a little bit of code to format the text
        this.svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(50," + (this.svgHeight - this.margin.bottom)+ ")")
            .call(d3.axisBottom(xAxisScale)
                .tickFormat(d3.timeFormat("%Y-%m-%d")))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");


        //Add Y Axis
        this.svg.append("g")
            .attr("class", "y-axis")
            .attr("transform", "translate("+ this.margin.left + ", 0)")
            .call(d3.axisLeft(yAxisScale));


        // X Axis Label
        this.svg
            .append('text')
            .attr("class", "axis-label")
            .text("Date")
            .style("text-anchor", "middle")
            .attr('transform', 'translate(' + (this.svgWidth/2) + ', ' + (this.svgHeight + 60) + ')');


        // Y axis Label
        this.svg
            .append('text')
            .attr("class", "axis-label")
            .text("USD")
            .style("text-anchor", "middle")
            .attr('transform', 'translate(' + 15 + ', ' + (this.svgHeight / 2) + ')rotate(-90)');


        //Add candles
        let candleBody =  this.svg.append("g").selectAll("rect")
            .data(data)


        let canndleBodyEnter= candleBody.enter().append("rect")
            .attr("id", d => d.Date)
            .attr("class", "candles")
            .attr("x", d => { return this.margin.left + xAxisScale(new Date(d.Date)) - 1.5})
            .attr("y", d =>{
        if((d.Close - d.Open) < 0){
             return yAxisScale(d.Open)
        }else{
            return yAxisScale(d.Close)
        }
    })
            .attr("width",3)
            .attr("height", d => { return Math.abs(yAxisScale(d.Close) - yAxisScale(d.Open))})
            .attr("fill", d => {
                if((d.Close - d.Open) < 0){
                    return "red"
                }else{
                    return "green"
                }
            });


        candleBody = candleBody.merge(canndleBodyEnter)






        let wicks = this.svg.append("g").selectAll(".wick")
            .data(data)




        //add center wicks
       wicks.enter().append("line")
           .attr("class", "wick")
             .attr("id", d => d.Date)
            .attr("x1", d => { return this.margin.left + xAxisScale(new Date(d.Date))})
            .attr("x2",d => { return  this.margin.left + xAxisScale(new Date(d.Date))})
            .attr("y1", d => { return yAxisScale(d.High)})
            .attr("y2",d => { return yAxisScale(d.Low)})
            .attr("stroke","black")
            .attr("stroke-width", .5)


        //add top wick
        wicks.enter().append("line")
            .attr("class", "wick")
            .attr("id", d => d.Date)
            .attr("x1", d => { return this.margin.left + xAxisScale(new Date(d.Date)) + 1})
            .attr("x2",d => { return  this.margin.left + xAxisScale(new Date(d.Date)) - 1})
            .attr("y1", d => { return yAxisScale(d.High)})
            .attr("y2",d => { return yAxisScale(d.High)})
            .attr("stroke","black")
            .attr("stroke-width", .5)



        //add bottom wick
        wicks.enter().append("line")
            .attr("class", "wick")
            .attr("id", d => d.Date)
            .attr("x1", d => { return this.margin.left + xAxisScale(new Date(d.Date)) + 1})
            .attr("x2",d => { return  this.margin.left + xAxisScale(new Date(d.Date)) - 1})
            .attr("y1", d => { return yAxisScale(d.Low)})
            .attr("y2",d => { return yAxisScale(d.Low)})
            .attr("stroke","black")
            .attr("stroke-width", .5);


    }


}