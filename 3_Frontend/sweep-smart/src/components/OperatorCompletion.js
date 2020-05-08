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

      let tempData = [{"Operator": "John B.", "Scheduled": 10, "Completion": 9},
      {"Operator": "Jack A.", "Scheduled": 10, "Completion": 9},
      {"Operator": "Allen D.", "Scheduled": 10, "Completion": 9},
      {"Operator": "Henry H.", "Scheduled": 10, "Completion": 9},
      {"Operator": "Zack K.", "Scheduled": 10, "Completion": 9},
      {"Operator": "Christ H.", "Scheduled": 10, "Completion": 9},
      {"Operator": "Martin S.", "Scheduled": 10, "Completion": 9},
      {"Operator": "Josh E.", "Scheduled": 10, "Completion": 9}]
      
      let currentTab = "";
      let date = new Date();

      this.state = {currentTab: currentTab,
    			date: date,
    			data: tempData};
   }
   componentDidMount() {
      this.createBarChart()
   }
   // componentDidUpdate() {
   //    this.createBarChart()
   // }
   createBarChart() {
      const node = this.node
      const stats = this.state.data

      const width = 450;
	  const height = 650;
	  const barwidth = 30;
	  
	    const container = d3.select(this.refs.opBar)
	    .append("svg")
	    .attr("width", width)
	    .attr("height", height)
	    .style("margin-left", 10);
	  
	  const componentGroup = 
	        container.selectAll("g") 
	           .data(stats)
	           .enter().append("g")
	           .attr("class", "barGroup")
	           .attr("transform", (d, i) => `translate(0, ${((i+1) * 35)})`); // transform gives the x, y coordinates of each group 
	  
	  componentGroup
	  .append("rect")
	  .attr("width", d => d.Scheduled*30)
	  .attr("height", barwidth)
	  .attr("x", 75)
	  .attr("y", 2) // the y-coordinate for the bars has been defined above
	  .attr("opacity", 0.2)
	  .attr("fill", "steelblue");
	  
	  componentGroup
	  .append("rect")
	  .attr("width", d => d.Completion*30)
	  .attr("height", barwidth)
	  .attr("x", 75)
	  .attr("y", 2) // the y-coordinate for the bars has been defined above
	  .attr("fill", "steelblue");
	  
	  componentGroup
	     .append("text")
	       .attr("fill", "pink")
	        .attr("x", d => d.Completion*30 + 30)
	         .attr("y", 23)
	          .attr("text-anchor","right")
	         .text(d => ((d.Completion/d.Scheduled)* 100).toFixed(0) + '%');
	  
	  componentGroup
	     .append("text")
	       .attr("fill", "black")
	        .attr("x", 0)
	         .attr("y", 23)
	          .attr("text-anchor","right")
	         .text(d => d.Operator);
	  

	  return container;

   }


render() {
      return <div ref="opBar" className="opBar"></div>
   }
}



export default OperatorChart;





