import React from "react";
import "./main.css";
import SchedulePage from './components/SchedulePage'
import OperatorPage from './components/OperatorPage'
class Main extends React.Component {
	constructor(props) {
    super(props);
    let date = new Date();
    let currentTab = "";
    if (this.props.buttons.length > 0) {
    	currentTab = this.props.buttons[0];
    }
    this.state = {currentTab: currentTab,
    							date: date};
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(newTab) {
  	this.setState({currentTab: newTab});
  }

	render() {
		let mainContent;
		if (this.props.pageName === 'Schedule') {
			mainContent = <SchedulePage tab={this.state.currentTab} date={this.state.date}/>;
		}else if(this.props.pageName === 'Operators' ){
			// TODO: return Operator component
			mainContent = <OperatorPage tab={this.state.currentTab} date={this.state.date}/>;
		}else if(this.props.pageName === 'Vehicles'){
			// TODO: return Vehicle component
			mainContent = <SchedulePage />;
		}else if(this.props.pageName === 'Performance'){
			// TODO: return Performance component
			mainContent = <SchedulePage/>;
		}
		return (
			<div className="main">
				<WeekPicker pageName={this.props.pageName} date={this.state.date}/>
				<div className="main-tab">
					<div className="button-container">
						{this.props.buttons.map((value, index) => 
							{
								if (value == this.state.currentTab) {
									return <CurButton value={value} handleClick={this.handleClick}/>;
								} else {
									return <NotCurButton value={value} handleClick={this.handleClick}/>;
								}
							}
						)}
					</div>
					{mainContent}
				</div>
			</div>
		);
	}
}


Main.defaultProps = {
  buttons: []
};

class CurButton extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="cur-button">
			<a href="#" onClick={()=>this.props.handleClick(this.props.value)}>{this.props.value}</a>
			</div>
		);
	}
}

class NotCurButton extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="not-cur-button">
			<a href="#" onClick={()=>this.props.handleClick(this.props.value)}>{this.props.value}</a>
			</div>
		);
	}
}

class WeekPicker extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {

		return (
			<div className="week-picker">
				<div className="page-name">{this.props.pageName}</div>
				<div className="week-range">
					<div className="week-range-display">{GetWeekRange(this.props.date)}</div>
					<div className="week-picker-arrows"></div>
				</div>
				<div className="week-number">{GetWeekNumber(this.props.date)} week</div>
			</div>
		);
	}
}

function GetWeekRange(date) {
	let week = [];
	let first = date.getDate() - date.getDay() + 1;
	let curr = new Date(date);
	curr.setDate(first);
	console.log(curr);
	for (let i = 0; i < 5; i++) {
		let month = curr.getMonth() + 1;
		let day = curr.getDate();
		let year = curr.getYear() + 1900;
	  curr.setDate(curr.getDate() + 1);
	  week.push(month + "/" + day + ", " + year);
	}
	let weekRange = week[0] + " - " + week[4];
	return weekRange;
}

function GetWeekNumber(date) {
	return "1st";
}

export default Main

