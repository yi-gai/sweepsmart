import React from 'react';
import API from '../API/api';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import Paper from '@material-ui/core/Paper';
import Drawer from '@material-ui/core/Drawer';
import CloseIcon from '@material-ui/icons/Close';

const styles = theme => ({
  overview: {
    position: "absolute",
  width: 696,
  height: 172,
  left: 27,
  top: 217,
},

weatherPaper: {
    position: "absolute",
  width: 430,
  height: 172,
  left: 731,
  top: 217,
},

operatorPaper: {
    position: "absolute",
  width: 1135,
  height: 547,
  left: 27,
  top: 397,
},

vehiclePaper: {
    position: "absolute",
  width: 240,
  height: 516,
  left: 1169,
  top: 217,
},

drawerMain: {
  background: "#E5E5E5",
},
});

class ScheduleDrawer extends React.Component {

	constructor(props) {
    super(props);
    this.state = {
      date: props.date,
      drawer: props.drawer}
	}

	handleDrawerClose() {
    this.setState({drawer: false})
  	}

	render() {
        
        return (
            <div> 
            	<Drawer anchor='right' open={this.state.drawer} className="drawerMain">
                  <CloseIcon onClick={() => this.handleDrawerClose()}/>
                  <h3> Daily Schedule </h3>
                  <div> {this.state.date} </div>
                  <Paper className="overview"> 
                  	<h4> Overview </h4>
                  </Paper>
                  <Paper className="weatherPaper"> 
                  	<h4> Weather </h4>
                  </Paper>
                  <Paper className="operatorPaper"> 
                  	<h4> Daily View by Operators </h4>
                  </Paper>
                  <Paper className="vehiclePaper"> 
                  	<h4> Vehicles </h4>
                  </Paper>
                </Drawer>
            </div>
            );
	}
}

export default withStyles(styles)(ScheduleDrawer);
