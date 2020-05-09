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
      this.processAPIData = this.processAPIData.bind(this);

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
      
      let date = new Date();

      this.state = {date: date,
    			data: tempData};
   }
   componentDidMount() {
   	  API.get("performance/month", {
			params: {'date': GetDateFormat(this.props.date)}
		}).then(res => this.processAPIData(res['data']));
   }

   // componentDidUpdate() {
   //    this.createBarChart()
   // }

   processAPIData(res) {
   	let newData = [];
   	for(var key in res) {
   		if(key.includes('dummy') || key.includes('.')) {
   			continue;
   		}
  		var row = {};
  		row["Route"] = key;
  		row["Scheduled"] = res[key]["frequency"];
  		row["Completion"] = res[key]["times_swept"];
  		newData.push(row);
	}
	this.setState({data: newData});
	console.log(this.state);
	this.createBarChart();
   }

   createBarChart() {
      const node = this.node
      const route = this.state.data

      const width = 430;
	  var height = 600;

      const allRouteSchedule = route.map(function(d){return d.Scheduled});
      const xScaleRoute = d3.scaleLinear().domain([0, d3.max(allRouteSchedule)]).range([0, width-60])

      
	  const n = allRouteSchedule.length;
  	  var barwidth = parseInt(height/(n+1)) - 6;
  	  if (barwidth < 10) {
  	  	barwidth = 10;
  	  	height = (barwidth + 6) * (n+1) + 60
  	  }
	  
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
           .attr("transform", (d, i) => `translate(0, ${((i+1) * (barwidth + 6) + 50)})`); // transform gives the x, y coordinates of each group 
  
  componentGroup
  .append("rect")
  .attr("width", d => xScaleRoute(d.Scheduled))
  .attr("height", barwidth)
  .attr("x", 50)
  .attr("y", 2) // the y-coordinate for the bars has been defined above
  .attr("opacity", 0.2)
  .attr("fill", "#538F6E");
  
  componentGroup
  .append("rect")
  .attr("width", d => xScaleRoute(d.Completion))
  .attr("height", barwidth)
  .attr("x", 50)
  .attr("y", 2) // the y-coordinate for the bars has been defined above
  .attr("fill", "#538F6E");
  
  componentGroup
     .append("text")
       .attr("fill", "#E4d9f3")
        .attr("x", d => xScaleRoute(d.Completion) + 50)
         .attr("y", barwidth/2 + 5)
          .attr("text-anchor","right")
          .attr("font-size", "12px")
       	  .attr("font-family", "sans-serif")
       	  .attr("font-weight", "bold")
         .text(d => ((d.Completion/d.Scheduled)* 100).toFixed(0) + '%');
  
  componentGroup
     .append("text")
       .attr("fill", "black")
        .attr("x", 0)
         .attr("y", barwidth/2 + 5)
          .attr("text-anchor","right")
          .attr("font-size", "14px")
       	  .attr("font-family", "sans-serif")
       	  .attr("font-weight", "bold")
         .text(d => d.Route);
	  

	  return container;

   }


render() {
      return <div ref="routeBar" className="routeBar"></div>
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

export default RouteChart;





