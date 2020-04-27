import React from 'react';
import RouteBlock from "./RouteBlock";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';

import './schedulePage.css';
import ScheduleDrawer from "./ScheduleDrawer";
import { styled } from '@material-ui/core/styles';
import API from "../API/api";

const styles = theme => (
    { }
);

function ProcessRawData (rawData) {
	let processedData = {};
	let daySchedule = [
		{
			"shift_time": "1st_half",
			"Mon": [],
			"Tue": [],
			"Wed": [],
			"Thu": [],
			"Fri": []
		},
		{
            "shift_time": "2nd_half",
            "Mon": [],
            "Tue": [],
            "Wed": [],
            "Thu": [],
            "Fri": []
		}
	];
	let nightSchedule = [
        {
            "shift_time": "1st_half",
            "Mon": [],
            "Tue": [],
            "Wed": [],
            "Thu": [],
            "Fri": []
        },
        {
            "shift_time": "2nd_half",
            "Mon": [],
            "Tue": [],
            "Wed": [],
            "Thu": [],
            "Fri": []
        }
	];

    for (let [key, value] of Object.entries(rawData)) {
    	let scheduleInfo = value[0];

        // Decide date of week and shift time
        if (key.includes('Mon')) {
            if (key.includes('AM')) {
                scheduleInfo['shift'] = 'day';
                daySchedule[0]["Mon"].push(scheduleInfo);
            } else if (key.includes('PM')) {
                scheduleInfo['shift'] = 'day';
                daySchedule[1]["Mon"].push(scheduleInfo);
            } else if (key.includes('night')) {
                // TODO: might need to update to 1st haf & 2nd half as well
                scheduleInfo['shift'] = 'night';
                nightSchedule[0]["Mon"].push(scheduleInfo);
            }
        } else if (key.includes('Tue')) {
            if (key.includes('AM')) {
                scheduleInfo['shift'] = 'day';
                daySchedule[0]["Tue"].push(scheduleInfo);
            } else if (key.includes('PM')) {
                scheduleInfo['shift'] = 'day';
                daySchedule[1]["Tue"].push(scheduleInfo);
            } else if (key.includes('night')) {
                scheduleInfo['shift'] = 'night';
                nightSchedule[0]["Tue"].push(scheduleInfo);
            }
        } else if (key.includes('Wed')) {
            if (key.includes('AM')) {
                scheduleInfo['shift'] = 'day';
                daySchedule[0]["Wed"].push(scheduleInfo);
            } else if (key.includes('PM')) {
                scheduleInfo['shift'] = 'day';
                daySchedule[1]["Wed"].push(scheduleInfo);
            } else if (key.includes('night')) {
                scheduleInfo['shift'] = 'night';
                nightSchedule[0]["Wed"].push(scheduleInfo);
            }
        } else if (key.includes('Thu')) {
            if (key.includes('AM')) {
                scheduleInfo['shift'] = 'day';
                daySchedule[0]["Thu"].push(scheduleInfo);
            } else if (key.includes('PM')) {
                scheduleInfo['shift'] = 'day';
                daySchedule[1]["Thu"].push(scheduleInfo);
            } else if (key.includes('night')) {
                scheduleInfo['shift'] = 'night';
                nightSchedule[0]["Thu"].push(scheduleInfo);
            }
        } else if (key.includes('Fri')) {
            if (key.includes('AM')) {
                scheduleInfo['shift'] = 'day';
                daySchedule[0]["Fri"].push(scheduleInfo);
            } else if (key.includes('PM')) {
                scheduleInfo['shift'] = 'day';
                daySchedule[1]["Fri"].push(scheduleInfo);
            } else if (key.includes('night')) {
                scheduleInfo['shift'] = 'night';
                nightSchedule[0]["Fri"].push(scheduleInfo);
            }
        }
    }

    // update data
	processedData.daySchedule = daySchedule;
    processedData.nightSchedule = nightSchedule;
    console.log(JSON.stringify(processedData));

	return processedData;
}

const DateClickButton = styled(Button)({
    fontFamily:  'Lato',
    fontStyle: 'normal',
    fontWeight: 'bold',
    color: '#7A827F',
    textTransform: 'none',
    display: 'inline-block',
});

class SchedulePage extends React.Component {

    constructor(props) {
		super(props);
		this.state = {
			onScreenData: [],
			tab: props.tab,
			date: props.date,
			data:null,
            drawer: false,
            daily_view_date: this.props.date
		};
        this.handleDateClick = this.handleDateClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    componentDidMount() {
    	API.get("/schedule/week/route")
            .then(res => res['data'])
            .then(
                (result) => {
                    console.log('week route: ' + JSON.stringify(result));
                    let processedData = ProcessRawData(result);
                    this.setState({data: processedData, onScreenData: processedData.daySchedule, date: result.today});
                    console.log(this.state);
                },
                (error) => {
                    console.log('week route error : ' + error)
                }
            )
    }

    handleDateClick(weekday) {
        let diff = weekday - this.props.date.getDay();
        let curr = new Date(this.props.date);
        curr.setDate(this.props.date.getDate() + diff);

        this.setState({drawer: true});
        this.setState({daily_view_date: curr});
    }

    handleChange(date) {
    	this.props.handleDateChange(date);
    };

    handleClose() {
        this.setState({drawer: false});
    }

	render() {
        const { classes } = this.props;
		return (
			<div className="content-container">
                <div>
                    <ScheduleDrawer date={this.state.daily_view_date}
                        drawer={this.state.drawer}
                        handleClose={this.handleClose}/>
                </div>
				<TableContainer>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell align="center">
                                    <DateClickButton textAlign="center" onClick={() => this.handleDateClick(1)}>
    									<h1 style={{"line-height": '15px'}}>{GetWeekdayDate(this.props.date, 1).getDate()}</h1>
    									<p style={{"line-height": '10px'}}>Mon</p>
                                    </DateClickButton>
								</TableCell>
								<TableCell align="center">
    								<DateClickButton textAlign="center" onClick={() => this.handleDateClick(2)}>
                                        <h1 style={{"line-height": '15px'}}>{GetWeekdayDate(this.props.date, 2).getDate()}</h1>
                                        <p style={{"line-height": '10px'}}>Tue</p>
                                    </DateClickButton>
								</TableCell>
								<TableCell align="center">
									<DateClickButton textAlign="center" onClick={() => this.handleDateClick(3)}>
                                        <h1 style={{"line-height": '15px'}}>{GetWeekdayDate(this.props.date, 3).getDate()}</h1>
                                        <p style={{"line-height": '10px'}}>Wed</p>
                                    </DateClickButton>
								</TableCell>
								<TableCell align="center">
									<DateClickButton textAlign="center" onClick={() => this.handleDateClick(4)}>
                                        <h1 style={{"line-height": '15px'}}>{GetWeekdayDate(this.props.date, 4).getDate()}</h1>
                                        <p style={{"line-height": '10px'}}>Thu</p>
                                    </DateClickButton>
								</TableCell>
								<TableCell align="center">
									<DateClickButton textAlign="center" onClick={() => this.handleDateClick(5)}>
                                        <h1 style={{"line-height": '15px'}}>{GetWeekdayDate(this.props.date, 5).getDate()}</h1>
                                        <p style={{"line-height": '10px'}}>Fri</p>
                                    </DateClickButton>
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
                            {this.state.onScreenData.map((row) =>
                                (
                                    <TableRow key={row.shift_time}>
                                        <TableCell align="center">
											{row.Mon.map((route) => (
                                                <RouteBlock key={route.route}
                                                    onClick={() => {console.log("Clicked")}}
                                                    shift={route.shift}
                                                    status={route.route_status}
                                                    route={route.route}
                                                    operator={route.driver}>
                                                    {route.route}</RouteBlock>
											))}
                                        </TableCell>
                                        <TableCell align="center">
                                            {row.Tue.map((route) => (
                                                <RouteBlock key={route.route}
                                                    onClick={() => {console.log("Clicked")}}
                                                    shift={route.shift}
                                                    status={route.route_status}
                                                    route={route.route}
                                                    operator={route.driver}>
                                                    {route.route}</RouteBlock>
                                            ))}
                                        </TableCell>
                                        <TableCell align="center">
                                            {row.Wed.map((route) => (
                                                <RouteBlock key={route.route}
                                                    onClick={() => {console.log("Clicked")}}
                                                    shift={route.shift}
                                                    status={route.route_status}
                                                    route={route.route}
                                                    operator={route.driver}>
                                                    {route.route}</RouteBlock>
                                            ))}
                                        </TableCell>
                                        <TableCell align="center">
                                            {row.Thu.map((route) => (
                                                <RouteBlock key={route.route}
                                                    onClick={() => {console.log("Clicked")}}
                                                    shift={route.shift}
                                                    status={route.route_status}
                                                    route={route.route}
                                                    operator={route.driver}>
                                                    {route.route}</RouteBlock>
                                            ))}
                                        </TableCell>
                                        <TableCell align="center">
                                            {row.Fri.map((route) => (
                                                <RouteBlock key={route.route}
                                                    onClick={() => {console.log("Clicked")}}
                                                    shift={route.shift}
                                                    status={route.route_status}
                                                    route={route.route}
                                                    operator={route.driver}>
                                                    {route.route}</RouteBlock>
                                            ))}
                                        </TableCell>
                                    </TableRow>
                                )
                            )}
						</TableBody>
					</Table>
				</TableContainer>
			</div>
        );
    }
}

function GetWeekdayDate(date, weekday) {
    let curr = new Date(date);
    curr.setDate(date.getDate() - date.getDay() + weekday);
    return curr;
}

export default SchedulePage;
