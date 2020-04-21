import React from 'react';
import {vl} from '@vega/vega-lite-api';
import API from "../API/api";

import 

const d3 = require('d3');

const stats = d3.csv("/mock_data/operator_completion.csv");

class OperatorChart extends React.Component {
	constructor(props) {
    super(props);
}

	renderOperatorChart() {

  const sched = vl.markBar({fill: 'pink', stroke: 'firebrick'})
   .data(stats)
     .encode(
             vl.y().fieldN('Operator'),   
             vl.x().fieldQ('Scheduled')
          );
  
  const schedText = vl.markText({'dx': 5})
    .data(stats)
    .encode(
      vl.y().fieldN('Operator'),   
      vl.x().fieldQ('Scheduled'),
      vl.text({'field': 'Scheduled', 'type': 'quantitative', 'align': 'left'})
    );
  
  const schedStack = vl.layer(sched, schedText);
  
  const compl = vl.markBar({fill: 'firebrick'})
     .data(stats)
     .encode(
             vl.y().fieldN('Operator'),   
             vl.x().fieldQ('Completion')
    );
  
  const complText = vl.markText({'dx': 5})
    .data(stats)
    .encode(
      vl.y().fieldN('Operator'),   
      vl.x().fieldQ('Completion'),
      vl.text({'field': 'Completion', 'type': 'quantitative', 'align': 'left'})
    );
  
  const compStack = vl.layer(compl, complText);

  return vl.layer(schedStack, compStack)
    .title({
  	text: 'Completion by Operator',
  	fontSize: 14, 
  	font: 'Tahoma'       
	}).render();

	}  

	render() {
    return (
      <div> 
        {this.renderOperatorChart()}
      </div>
    );
  }
}

export default OperatorChart;





