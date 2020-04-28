import React, { Component } from 'react';
import * as d3 from "d3";


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
   componentDidUpdate() {
      this.createBarChart()
   }
   createBarChart() {
      const node = this.node
      const stats = this.state.data
      
      


   }


render() {
      return <svg ref={node => this.node = node}
      width={500} height={500}>
      </svg>
   }
}

export default OperatorChart;





