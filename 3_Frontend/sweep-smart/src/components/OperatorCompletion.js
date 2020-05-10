import React, { Component } from 'react';
import * as d3 from "d3";

import Paper from '@material-ui/core/Paper';
import { styled } from '@material-ui/core/styles';
import API from "../API/api";
import "./charts.css";



class OperatorChart extends Component {
   constructor(props){
      super(props);
      this.createBarChart = this.createBarChart.bind(this);
      this.processAPIData = this.processAPIData.bind(this);

      let tempData = [{"Operator": "John B.", "Scheduled": 10, "Completion": 9},
      {"Operator": "Reginald Tolan", "Scheduled": 12, "Completion": 11},
      {"Operator": "Michael Cortez", "Scheduled": 14, "Completion": 12},
      {"Operator": "Jack A.", "Scheduled": 10, "Completion": 8},
      {"Operator": "Allen D.", "Scheduled": 10, "Completion": 6},
      {"Operator": "Henry H.", "Scheduled": 10, "Completion": 9},
      {"Operator": "Zack K.", "Scheduled": 10, "Completion": 7},
      {"Operator": "Christ H.", "Scheduled": 10, "Completion": 10},
      {"Operator": "Martin S.", "Scheduled": 10, "Completion": 9},
      {"Operator": "Josh E.", "Scheduled": 10, "Completion": 10}];
      
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

      this.createBarChart();
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

   }

   createBarChart() {
      const node = this.node
      const stats = this.state.data

      const width = 430;
	  const height = 600;

      const allOperatorSchedule = stats.map(function(d){return d.Scheduled});
      const xScaleOp = d3.scaleLinear().domain([0, d3.max(allOperatorSchedule)]).range([0, width-190]);

      
	  const n = allOperatorSchedule.length;
  	  const barwidth = parseInt(height/(n+1)) - 6;
	  
	    const container = d3.select(this.refs.opBar)
	    .append("svg")
	    .attr("width", width)
	    .attr("height", height)
	    .style("margin-left", 10);

	    // Added Graph Title and number column title (legend)
	    container.append("text")
	    	.attr("fill", "black")
	        .attr("x", 235)
	         .attr("y", 30)
	          .attr("text-anchor","middle")
	          .attr("font-size", "20px")
	       	  .attr("font-family", "sans-serif")
	       	  .attr("font-weight", "bold")
	         .text("Monthly Completion by Operator");

	    container.append("text")
	    	.attr("fill", "#A680d6")
	        .attr("x", 235)
	         .attr("y", 60)
	          .attr("text-anchor","left")
	          .attr("font-size", "10px")
	       	  .attr("font-family", "sans-serif")
	       	  .attr("font-weight", "bold")
	         .text("Completion%");

	    container.append("text")
	    	.attr("fill", "#538F6E")
	        .attr("x", 325)
	         .attr("y", 60)
	          .attr("text-anchor","left")
	          .attr("font-size", "10px")
	       	  .attr("font-family", "sans-serif")
	       	  .attr("font-weight", "bold")
	         .text("Completed");

	    container.append("text")
	    	.attr("fill", "#538F6E")
	        .attr("x", 380)
	         .attr("y", 60)
	          .attr("text-anchor","left")
	          .attr("font-size", "10px")
	       	  .attr("font-family", "sans-serif")
	       	  .attr("font-weight", "bold")
	       	  .attr("opacity", 0.6)
	         .text("Scheduled");
	  
	  const componentGroup = 
        container.selectAll("g") 
           .data(stats)
           .enter().append("g")
           .attr("class", "barGroup")
           .attr("transform", (d, i) => `translate(0, ${((i+1) * (barwidth + 6)) + 10})`); // transform gives the x, y coordinates of each group 
  
  componentGroup
  .append("rect")
  .attr("width", d => xScaleOp(d.Scheduled))
  .attr("height", barwidth)
  .attr("x", 75)
  .attr("y", 2) // the y-coordinate for the bars has been defined above
  .attr("opacity", 0.2)
  .attr("fill", "#538F6E");
  
  componentGroup
  .append("rect")
  .attr("width", d => xScaleOp(d.Completion))
  .attr("height", barwidth)
  .attr("x", 75)
  .attr("y", 2) // the y-coordinate for the bars has been defined above
  .attr("fill", "#538F6E");
  
  componentGroup
     .append("text")
       .attr("fill", "#E4d9f3")
        .attr("x", d => xScaleOp(d.Completion) + 30)
         .attr("y", barwidth/2 + 5)
          .attr("text-anchor","right")
          .attr("font-size", "15px")
       	  .attr("font-family", "sans-serif")
       	  .attr("font-weight", "bold")
         .text(d => ((d.Completion/d.Scheduled)* 100).toFixed(0) + '%');

  componentGroup
     .append("text")
       .attr("fill", "#538F6E")
        .attr("x", 340)
         .attr("y", barwidth/2 + 5)
          .attr("text-anchor","right")
          .attr("font-size", "15px")
       	  .attr("font-family", "sans-serif")
       	  .attr("font-weight", "bold")
         .text(d => d.Completion);

   componentGroup
     .append("text")
       .attr("fill", "#538F6E")
        .attr("x", 390)
         .attr("y", barwidth/2 + 5)
          .attr("text-anchor","right")
          .attr("font-size", "15px")
       	  .attr("font-family", "sans-serif")
       	  .attr("font-weight", "bold")
       	  .attr("opacity", 0.4)
         .text(d => d.Scheduled);
  
  componentGroup
     .append("text")
       .attr("fill", "black")
        .attr("x", 0)
         .attr("y", barwidth/2 + 5)
          .attr("text-anchor","right")
          .attr("font-size", "13px")
       	  .attr("font-family", "sans-serif")
       	  .attr("font-weight", "bold")
         .text(d => d.Operator.split(" ")[0] + " " + d.Operator.split(" ")[1][0] + ".");
	  

	  return container;

   }


render() {
      return <div ref="opBar" className="opBar"></div>
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

export default OperatorChart;





