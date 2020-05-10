import React, { Component } from 'react';
import * as d3 from "d3";

import Paper from '@material-ui/core/Paper';
import { styled } from '@material-ui/core/styles';
import API from "../API/api";
import "./charts.css";



class VacationChart extends Component {
   constructor(props){
      super(props);
      this.createBarChart = this.createBarChart.bind(this);
      this.processAPIData = this.processAPIData.bind(this);

      let tempData = [{"Operator": "Reginald Tolan", "Month": 3, "Year": 9},
      {"Operator": "Michael Cortez", "Month": 7, "Year": 16},
      {"Operator": "John B.", "Month": 3, "Year": 5},
      {"Operator": "John B.", "Month": 8, "Year": 20},
      {"Operator": "John B.", "Month": 12, "Year": 12},
      {"Operator": "John B.", "Month": 4, "Year": 16},
      {"Operator": "John B.", "Month": 20, "Year": 24},
      {"Operator": "John B.", "Month": 10, "Year": 10},
      {"Operator": "John B.", "Month": 6, "Year": 10},
      {"Operator": "John B.", "Month": 2, "Year": 7},
      {"Operator": "John B.", "Month": 0, "Year": 0},
      {"Operator": "John B.", "Month": 0, "Year": 9}];
      
      let currentTab = "";
      let date = new Date();

      this.state = {currentTab: currentTab,
    			date: date,
    			data: tempData};
   }
   componentDidMount() {
   		API.get("performance/month", {
			params: {'date': GetDateFormat(this.props.date)}
		}).then(res => this.processAPIData(res));

      
   }
   // componentDidUpdate() {
   //    this.createBarChart()
   // }

   processAPIData(res) {
   	let newData = [];
   	for(var key in res) {
  		var row = {};
  		// row[]

	 }
    this.createBarChart();
   }

   createBarChart() {
      const node = this.node
      const vacation = this.state.data

      const width = 920;
      const height = 1000;
      const spaceForName = 90;
      const ySpaceForTitle = 50
      const chartWidth = width - 10 - spaceForName - 100

      const allYearVacation = vacation.map(function(d){return d.Year});

      const n = allYearVacation.length;
      const barwidth = 30;
      var maxDay = d3.max(allYearVacation);
      if (maxDay < 10) {
        maxDay = 24};

      
      const xScaleVacation = d3.scaleLinear().domain([0, maxDay]).range([0, chartWidth])
      
      
      var axisLabel = [...Array(maxDay).keys()];
      axisLabel.push(maxDay);

      
	  
	    const container = d3.select(this.refs.vacChart)
	    .append("svg")
	    .attr("width", width)
	    .attr("height", height)
	    .style("margin-left", 10);


  
      // add horizontal axis line
      container.append("line")
        .style("stroke", "dimgray")
        .style("stroke-width", 3)
        .attr("x1", spaceForName)
        .attr("y1", (n+1) * barwidth + ySpaceForTitle)
        .attr("x2", spaceForName + chartWidth)
        .attr("y2", (n+1) * barwidth + ySpaceForTitle);

        container.append("text")
        .attr("font-size", "20px")
        .attr("font-weight", "bold")
        .attr("font-family", "sans-serif")
        .style("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", 40)
        .text("Vacation Tracking Diagram");

        container.append("text")
        .attr("font-size", "15px")
        .attr("font-weight", "bold")
        .attr("font-family", "sans-serif")
        .style("text-anchor", "middle")
        .attr("fill", 'dimgrey')
        .attr("x", width / 2)
        .attr("y", (n+1) * barwidth + ySpaceForTitle + 50)
        .text("Vacation Hours Taken");

        // Add markers for legend  
      container
      .append("circle")
      .attr("r", 5)
      .attr("cx", chartWidth + spaceForName + 17)
      .attr("cy", ySpaceForTitle  + 50) 
      .attr("fill", "#538F6E");
      
      container
      .append("rect")
      .attr("width", 14)
      .attr("height", 14)
      .attr("x", chartWidth + spaceForName + 17 - 7)
      .attr("y", ySpaceForTitle + 80 - 7) 
      .attr("opacity", 0.5)
      .attr("fill", "#A680d6");

      // Add text for legend
      container.append("text")
        .attr("font-size", "12px")
        .attr("font-weight", "bold")
        .attr("font-family", "sans-serif")
        .style("text-anchor", "left")
        .attr("fill", 'dimgrey')
        .attr("x", chartWidth + spaceForName + 30)
        .attr("y", ySpaceForTitle  + 55) 
        .text("month to date");

        container.append("text")
        .attr("font-size", "12px")
        .attr("font-weight", "bold")
        .attr("font-family", "sans-serif")
        .style("text-anchor", "left")
        .attr("fill", 'dimgrey')
        .attr("x", chartWidth + spaceForName + 30)
        .attr("y", ySpaceForTitle  + 89 - 7) 
        .text("year to date");
      
      // Add axis labels
      container.selectAll("contiLabels")
        .data(axisLabel)
        .enter().append("text")
          .attr("x", d => xScaleVacation(d) + spaceForName)
          .attr("y", d => (n+1) * barwidth + 20 + ySpaceForTitle)
          .attr("fill", "dimgrey")
          .attr("font-size", "12px")
          .attr("font-family", "sans-serif")
          .attr("font-weight", "bold")
          .style("text-anchor", "middle")
          .text(d => d)
      
      // Add axis label vertical Reference Lines
      container.selectAll("contiLabels")
        .data(axisLabel)
        .enter().append("line")
          .attr("x1", d => xScaleVacation(d) + spaceForName)
          .attr("y1", d => (n+1) * barwidth + ySpaceForTitle)
          .attr("x2", d => xScaleVacation(d) + spaceForName)
          .attr("y2", d => barwidth + ySpaceForTitle)
          .attr("stroke", "dimgrey")
          .attr("stroke-width", 1)
          .attr("opacity", 0.2);

   // Now add groups and bar and circles for data points   
      const componentGroup = 
            container.selectAll("g") 
               .data(vacation)
               .enter().append("g")
               .attr("class", "barGroup")
               .attr("transform", (d, i) => `translate(0, ${((i+1) * (barwidth) + (ySpaceForTitle))})`); // transform gives the x, y coordinates of each group 

    // Add background bar for each operator  
      componentGroup
      .append("rect")
      .attr("width", chartWidth)
      .attr("height", barwidth)
      .attr("x", spaceForName)
      .attr("y", 0) // the y-coordinate for the bars has been defined above
      .attr("opacity", (d, i) => 0.1 * parseInt((i+1) % 2))
      .attr("fill", "dimgrey");

    // Add markers for month-to-date vacations taken  
      componentGroup
      .append("circle")
      .attr("r", 5)
      .attr("cx", d => xScaleVacation(d.Month) + spaceForName)
      .attr("cy", 15) // the y-coordinate for the bars has been defined above
      .attr("fill", "#538F6E");
      
    // Add markers for year-to-date vacations taken  
      componentGroup
      .append("rect")
      .attr("width", 14)
      .attr("height", 14)
      .attr("x", d => xScaleVacation(d.Year) + spaceForName - 7)
      .attr("y", 8) // the y-coordinate for the bars has been defined above
      .attr("opacity", 0.5)
      .attr("fill", "#A680d6");
      
      componentGroup
         .append("text")
           .attr("fill", "black")
           .attr("font-weight", "bold")
           .attr("font-size", "13px")
           .attr("font-family", "sans-serif")
            .attr("x", 0)
             .attr("y", 17)
              .attr("text-anchor","right")
             .text(d => d.Operator.split(" ")[0] + " " + d.Operator.split(" ")[1][0] + ".");
  
	  

	  return container;

   }


render() {
      return <div ref="vacChart" className="vacChart"></div>
   }
}

function GetDateFormat(date) {
	let month = date.getMonth() + 1;
	let day = date.getDate();
	let year = date.getYear() + 1900;
	if (day < 10) {
		day = '0' + day;
	}
	if (month < 10) {
		month = '0' + month;
	}
	return year + '-' + month + '-' + day;
}

export default VacationChart;





