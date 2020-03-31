import React from "react";
import "./main.css";
import RouteBlock from "./components/RouteBlock"

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
					<div className="content-container">
                        <div>
                            <h1>Schedule</h1>
                            <RouteBlock
                                onClick={() => {console.log("Clicked")}}
                                style="rtBlock--completed--day"
                                route="Route 7A-1"
                                operator="R.Rogers">
                                Route 10</RouteBlock>
                            <RouteBlock
                                onClick={() => {console.log("Clicked")}}
                                style="rtBlock--completed--night"
                                route="Route 11"
                                operator="S.Smith">
                                Route 10</RouteBlock>
                        </div>
					</div>
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

