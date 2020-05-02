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

const DateClickButton = styled(Button)({
    fontFamily:  'Lato, sans-serif',
    fontStyle: 'normal',
    fontWeight: 'bold',
    color: '#7A827F',
    textTransform: 'none',
    display: 'inline-block',
});

const NoBorderTableCell = styled(TableCell) ({
    border: 0,
    borderCollapse: 'collapse'
});

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
        // Decide date of week and shift time
        if (key.includes('Mon')) {
            if (key.includes('AM')) {
                daySchedule[0]["Mon"] = value;
            } else if (key.includes('PM')) {
                daySchedule[1]["Mon"] = value;
            } else if (key.includes('night')) {
                // TODO: might need to update to 1st haf & 2nd half as well
                nightSchedule[0]["Mon"] = value;
            }
        } else if (key.includes('Tue')) {
            if (key.includes('AM')) {
                daySchedule[0]["Tue"] = value;
            } else if (key.includes('PM')) {
                daySchedule[1]["Tue"] = value;
            } else if (key.includes('night')) {
                nightSchedule[0]["Tue"] = value;
            }
        } else if (key.includes('Wed')) {
            if (key.includes('AM')) {
                daySchedule[0]["Wed"] = value;
            } else if (key.includes('PM')) {
                daySchedule[1]["Wed"] = value;
            } else if (key.includes('night')) {
                nightSchedule[0]["Wed"] = value;
            }
        } else if (key.includes('Thu')) {
            if (key.includes('AM')) {
                daySchedule[0]["Thu"] = value;
            } else if (key.includes('PM')) {
                daySchedule[1]["Thu"] = value;
            } else if (key.includes('night')) {
                nightSchedule[0]["Thu"] = value;
            }
        } else if (key.includes('Fri')) {
            if (key.includes('AM')) {
                daySchedule[0]["Fri"] = value;
            } else if (key.includes('PM')) {
                daySchedule[1]["Fri"] = value;
            } else if (key.includes('night')) {
                nightSchedule[0]["Fri"] = value;
            }
        }
    }

    // update data
	processedData.daySchedule = daySchedule;
    processedData.nightSchedule = nightSchedule;
	return processedData;
}

class SchedulePage extends React.Component {
    constructor(props) {
		super(props);
		this.state = {
			onScreenData: [],
			data: null,
            drawer: false,
            dailyViewDate: this.props.date
		};
        this.handleDateClick = this.handleDateClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.fetchWeeklyScheduleData = this.fetchWeeklyScheduleData.bind(this);
        this.updateOnScreenData = this.updateOnScreenData.bind(this);
    }

    componentDidMount() {
    	this.fetchWeeklyScheduleData();
    }

    componentDidUpdate(prevProps) {
        if (this.props.date !== prevProps.date) {
            this.fetchWeeklyScheduleData();
        } else if (this.props.tab !== prevProps.tab) {
            this.updateOnScreenData();
        }
    }

    fetchWeeklyScheduleData() {
        API.get("/schedule/week/route", {
            params: {date: this.props.date}
        }).then(res => res['data'])
        .then(
            (result) => {
                let processedData = ProcessRawData(result);
                this.setState({data: processedData});
                if (this.props.tab === 'Day Shift') {
                    this.setState({onScreenData: processedData.daySchedule});
                } else if (this.props.tab === 'Night Shift') {
                    this.setState({onScreenData: processedData.nightSchedule});
                }
            },
            (error) => {
                console.log('week route error : ' + error)
            }
        );
    }

    updateOnScreenData() {
        if (this.props.tab === 'Day Shift') {
            this.setState({onScreenData: this.state.data.daySchedule});
        } else if (this.props.tab === 'Night Shift') {
            this.setState({onScreenData: this.state.data.nightSchedule});
        }
    }

    handleDateClick(weekday) {
        let diff = weekday - this.props.date.getDay();
        let curr = new Date(this.props.date);
        curr.setDate(this.props.date.getDate() + diff);

        this.setState({drawer: true, dailyViewDate: curr});
    }

    handleClose() {
        this.setState({drawer: false});
    }

	render() {
        const { classes } = this.props;
		return (
			<div className="content-container">
                <div>
                    <ScheduleDrawer date={this.state.dailyViewDate}
                        drawer={this.state.drawer}
                        handleClose={this.handleClose}/>
                </div>
				<TableContainer>
					<Table>
						<ScheduleTableHead date={this.props.date} handleDateClick={this.handleDateClick}/>
						<ScheduleTableBody onScreenData={this.state.onScreenData}/>
					</Table>
				</TableContainer>
			</div>
        );
    }
}

class ScheduleTableHead extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
        return (
            <TableHead>
                <TableRow>
                    {[1,2,3,4,5].map((value) => (
                        <TableCell align="center">
                            <DateClickButton textAlign="center" onClick={() => this.props.handleDateClick(value)}>
                                <h1 style={{"line-height": '15px'}}>{GetWeekdayDate(this.props.date, value).getDate()}</h1>
                                <p style={{"line-height": '10px'}}>{weekdays[value-1]}</p>
                            </DateClickButton>
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
        );
    }
}

class ScheduleTableBody extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let first_half;
        let second_half;
        if (this.props.onScreenData.length !== 0) {
            let first = GetScheduleDataByRow(this.props.onScreenData[0]);
            let second = GetScheduleDataByRow(this.props.onScreenData[1]);
            first_half = first.map((row, index) => (GetSingleRow(row, index===first.length-1)));
            second_half = second.map((row, index) => (GetSingleRow(row, index===second.length-1)));
        }
        return (
            <TableBody>
                {first_half}
                {second_half}
            </TableBody>
        );
    }
}

function GetScheduleDataByRow(data) {
    let arrays = [data.Mon, data.Tue, data.Wed, data.Thu, data.Fri];
    let lengths = arrays.map((array) => (array.length));
    let max_len = Math.max(...lengths);

    let rows = [];
    for (let i = 0; i < max_len; i++) {
        rows.push([]);
        for (let array of arrays) {
            if (i < array.length) {
                rows[i].push(array[i]);
            } else {
                rows[i].push(null);
            }
        }
    }

    return rows;
}

function GetSingleRow(row, border) {
    return (
        <TableRow>
            {row.map((route) => {
                let block;
                if (route !== null) {
                    block = <RouteBlock key={route.route}
                                onClick={() => {console.log("Clicked")}}
                                shift={route.shift}
                                status={route.route_status}
                                route={route.route}
                                operator={route.driver}></RouteBlock>;
                }
                if (border) {
                    return <TableCell align="center">{block}</TableCell>;
                } else {
                    return <NoBorderTableCell align="center">{block}</NoBorderTableCell>;
                }
            })}
        </TableRow>
    );
}

function GetWeekdayDate(date, weekday) {
    let curr = new Date(date);
    curr.setDate(date.getDate() - date.getDay() + weekday);
    return curr;
}

export default SchedulePage;
