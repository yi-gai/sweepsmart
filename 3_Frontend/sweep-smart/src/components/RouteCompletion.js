import React, { Component } from 'react';
import * as d3 from "d3";

import Paper from '@material-ui/core/Paper';
import { styled } from '@material-ui/core/styles';
import API from "../API/api";
import "./charts.css";



class RouteChart extends Component {
   constructor(props){
      super(props);
      this.createBarChart = this.createBarChart.bind(this);

      let tempData = [{"Route": "2B", "Scheduled": 12, "Completion": 12},
      {"Route": "2A", "Scheduled": 12, "Completion": 10},
      {"Route": "2C", "Scheduled": 10, "Completion": 10},
      {"Route": "7E", "Scheduled": 10, "Completion": 9},
      {"Route": "3B", "Scheduled": 10, "Completion": 9},
      {"Route": "1A", "Scheduled": 10, "Completion": 8},
      {"Route": "6D", "Scheduled": 10, "Completion": 9},
      {"Route": "1C", "Scheduled": 8, "Completion": 8},
      {"Route": "1D", "Scheduled": 8, "Completion": 8},
      {"Route": "1B", "Scheduled": 8, "Completion": 7},
      {"Route": "5E", "Scheduled": 6, "Completion": 6},
      {"Route": "4B", "Scheduled": 6, "Completion": 6}]
      
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
      const route = this.state.data

      const width = 440;
	  const height = 650;

      const allRouteSchedule = route.map(function(d){return d.Scheduled});
      const xScaleRoute = d3.scaleLinear().domain([0, d3.max(allRouteSchedule)]).range([0, width-30])

      
	  const n = allRouteSchedule.length;
  	  const barwidth = parseInt(height/(n+1)) - 6;
	  
	    const container = d3.select(this.refs.routeBar)
	    .append("svg")
	    .attr("width", width)
	    .attr("height", height)
	    .style("margin-left", 10);
	  
	  const componentGroup = 
        container.selectAll("g") 
           .data(route)
           .enter().append("g")
           .attr("class", "barGroup")
           .attr("transform", (d, i) => `translate(0, ${((i+1) * (barwidth + 6))})`); // transform gives the x, y coordinates of each group 
  
  componentGroup
  .append("rect")
  .attr("width", d => xScaleRoute(d.Scheduled))
  .attr("height", barwidth)
  .attr("x", 25)
  .attr("y", 2) // the y-coordinate for the bars has been defined above
  .attr("opacity", 0.2)
  .attr("fill", "steelblue");
  
  componentGroup
  .append("rect")
  .attr("width", d => xScaleRoute(d.Completion))
  .attr("height", barwidth)
  .attr("x", 25)
  .attr("y", 2) // the y-coordinate for the bars has been defined above
  .attr("fill", "steelblue");
  
  componentGroup
     .append("text")
       .attr("fill", "pink")
        .attr("x", d => xScaleRoute(d.Completion) - 15)
         .attr("y", barwidth/2 + 3)
          .attr("text-anchor","right")
         .text(d => ((d.Completion/d.Scheduled)* 100).toFixed(0) + '%');
  
  componentGroup
     .append("text")
       .attr("fill", "black")
        .attr("x", 0)
         .attr("y", barwidth/2 + 3)
          .attr("text-anchor","right")
         .text(d => d.Route);
	  

	  return container;

   }


render() {
      return <div ref="routeBar" className="routeBar"></div>
   }
}



export default RouteChart;





