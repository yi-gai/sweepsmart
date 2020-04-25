import React from 'react';
import API from '../API/api';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import { styled } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Drawer from '@material-ui/core/Drawer';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import "./scheduleDrawer.css";

// const styles = theme => ({
//   overview: {
//     position: "absolute",
//   width: 696,
//   height: 172,
//   left: 27,
//   top: 217,
// },

// weatherPaper: {
//     position: "absolute",
//   width: 430,
//   height: 172,
//   left: 731,
//   top: 217,
// },

// operatorPaper: {
//     position: "absolute",
//   width: 1135,
//   height: 547,
//   left: 27,
//   top: 397,
// },

// vehiclePaper: {
//     position: "absolute",
//   width: 240,
//   height: 516,
//   left: 1169,
//   top: 217,
// },

// drawerMain: {
//   background: "#E5E5E5",
// },
// });

const OverviewPanel = styled(Paper)({
  position: "absolute",
  width: 696,
  height: 172,
  left: 27,
  top: 167,

  background: '#FFFFFF',
  borderRadius: 5,
});

const WeatherPanel = styled(Paper)({
  position: "absolute",
  width: 430,
  height: 172,
  left: 731,
  top: 167,

  background: '#FFFFFF',
  borderRadius: 5,
});

const OperatorPanel = styled(Paper)({
  position: "absolute",
  width: 1135,
  height: 547,
  left: 27,
  top: 347,

  background: '#FFFFFF',
  borderRadius: 5,
});

const VehiclePanel = styled(Paper)({
  position: "absolute",
  width: 240,
  height: 516,
  left: 1169,
  top: 167,

  background: '#FFFFFF',
  borderRadius: 5,
});

const UnplannedPanel = styled(Paper)({
  position: "absolute",
  width: 240,
  height: 203,
  left: 1169,
  top: 691,

  background: '#FFFFFF',
  borderRadius: 5,
});

class ScheduleDrawer extends React.Component {

	constructor(props) {
    super(props);
	}

	render() {
        
    return (
    	<Drawer anchor='right' open={this.props.drawer} className="drawerMain">
        <div className="background-container">
        <Button style={{width: 75, height: 80}} onClick={this.props.handleClose}>
          <CloseIcon />
        </Button>
        <div className="date">
          <div className="day-display"> {GetDayDisplay(this.props.date)} </div>
          <div className="week-numebr-display">{GetWeekdayNumber(this.props.date)}</div>
        </div>
          <OverviewPanel className="overview"> 
          	<h4> Overview </h4>
          </OverviewPanel>
          <WeatherPanel className="weatherPaper"> 
          	<h4> Weather </h4>
          </WeatherPanel>
          <OperatorPanel className="operatorPaper"> 
          	<h4> Daily View by Operators </h4>
          </OperatorPanel>
          <VehiclePanel className="vehiclePaper"> 
          	<h4> Vehicles </h4>
          </VehiclePanel>
          <UnplannedPanel> 
            <h4> Unplanned routes </h4>
          </UnplannedPanel>
        </div>
      </Drawer>
    );
	}
}

function GetDayDisplay(date) {
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let year = date.getYear() + 1900;
  return month + "/" + day + ", " + year;
}

function GetWeekdayNumber(date) {
  let day = date.getDay();
  let number = Math.floor((date.getDate() - 1) / 7) + 1;
  let day_str;
  if (day == 1) {
    day_str = 'Monday';
  } else if (day == 2) {
    day_str = 'Tuesday';
  } else if (day == 3) {
    day_str = 'Wednesday';
  } else if (day == 4) {
    day_str = 'Thursday';
  } else if (day == 5) {
    day_str = 'Friday';
  }
  let number_str;
  if (number == 1) {
    number_str = '1st';
  } else if (number == 2) {
    number_str = '2nd';
  } else if (number == 3) {
    number_str = '3rd';
  } else if (number == 4) {
    number_str = '4th';
  } else if (number == 5) {
    number_str = '5th';
  }
  return number_str + ' ' + day_str;
}

export default ScheduleDrawer;
