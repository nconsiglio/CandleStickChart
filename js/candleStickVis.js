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


        let minDate= data[data.length - 1].Date;
        let maxDate = data[0].Date;

        const xAxisScale = d3.scaleTime().domain([new Date(minDate), new Date(maxDate)]).range([0, (this.svgWidth -40)])

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



        //add center wicks
        this.svg.selectAll(".wicks")
            .data(data)
            .enter().append("line")
            .attr("x1", d => { return this.margin.left + xAxisScale(new Date(d.Date))})
            .attr("x2",d => { return  this.margin.left + xAxisScale(new Date(d.Date))})
            .attr("y1", d => { return yAxisScale(d.High)})
            .attr("y2",d => { return yAxisScale(d.Low)})
            .attr("stroke","black")
            .attr("stroke-width", 1)


        //add top wick
        this.svg.selectAll(".wicks")
            .data(data)
            .enter().append("line")
            .attr("x1", d => { return this.margin.left + xAxisScale(new Date(d.Date)) + 2})
            .attr("x2",d => { return  this.margin.left + xAxisScale(new Date(d.Date)) - 2})
            .attr("y1", d => { return yAxisScale(d.High)})
            .attr("y2",d => { return yAxisScale(d.High)})
            .attr("stroke","black")
            .attr("stroke-width", 1)



        //add bottom wick
        this.svg.selectAll(".wicks")
            .data(data)
            .enter().append("line")
            .attr("x1", d => { return this.margin.left + xAxisScale(new Date(d.Date)) + 2})
            .attr("x2",d => { return  this.margin.left + xAxisScale(new Date(d.Date)) - 2})
            .attr("y1", d => { return yAxisScale(d.Low)})
            .attr("y2",d => { return yAxisScale(d.Low)})
            .attr("stroke","black")
            .attr("stroke-width", 1)


    }


}