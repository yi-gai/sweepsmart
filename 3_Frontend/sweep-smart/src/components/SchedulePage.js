import React from 'react';
import RouteBlock from "./RouteBlock";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import './schedulepage.css';
import SwipeableTemporaryDrawer from "./Drawer";
import ScheduleDrawer from "./ScheduleDrawer";
import {withStyles} from "@material-ui/styles/index";
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

class SchedulePage extends React.Component {

    constructor(props) {
		super(props);
		this.state = {
			onScreenData: [],
			tab: props.tab,
			date: props.date,
			data:null,
            drawer: false
		}
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

    handleDateClick() {
    this.setState({drawer: true})
    }

    handleChange = date => {
    	this.props.handleDateChange(date);
    };

	render() {
        const { classes } = this.props;
		return (
			<div className="content-container">
                <div>
                    <SwipeableTemporaryDrawer date={this.props.date}/>
                    <ScheduleDrawer date={this.props.date} drawer={this.props.drawer}/>
                </div>
				<TableContainer>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell align="center" >
									<h1 onClick={() => this.handleDateClick()}> 2 </h1>
									<p>Mon</p>
								</TableCell>
								<TableCell align="center">
									<h1>3</h1>
									<p>Tue</p>
								</TableCell>
								<TableCell align="center">
									<h1>4</h1>
									<p>Wed</p>
								</TableCell>
								<TableCell align="center">
									<h1>5</h1>
									<p>Thu</p>
								</TableCell>
								<TableCell align="center">
									<h1>6</h1>
									<p>Fri</p>
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

export default SchedulePage;
