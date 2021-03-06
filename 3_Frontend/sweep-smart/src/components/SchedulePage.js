import React from 'react';
import RouteBlock from "./RouteBlock";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import StaffPanel from './StaffPanel';

import './schedulePage.css';
import ScheduleDrawer from "./ScheduleDrawer";
import { styled } from '@material-ui/core/styles';
import API from "../API/api";

const styles = theme => (
    { }
);

const StyledTableCell = styled(({bottom, right, ...other}) => <TableCell {...other}/>)({
    borderBottom: (props) => props.bottom ? '1px solid #DCDCDC' : 0,
    borderRight: (props) => props.right ? '1px solid #DCDCDC' : 0,
    padding: (props) => props.bottom ? '10px 15px 10px 15px' : '10px 15px 0px 15px',
    borderCollapse: 'collapse',
});

const DateClickButton = styled(Button)({
    fontFamily:  'Lato',
    fontStyle: 'normal',
    fontWeight: 'bold',
    color: '#7A827F',
    textTransform: 'none',
    display: 'inline-block',
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
            this.updateOnScreenData(this.state.data);
        }
    }

    fetchWeeklyScheduleData() {

        API.get("/schedule/week/route", {
            params: {date: GetDateFormat(this.props.date)}
        }).then(res => res['data'])
        .then(
            (result) => {
                let processedData = ProcessRawData(result);
                this.setState({data: processedData});
                this.updateOnScreenData(processedData);
            },
            (error) => {
                console.log('week route error : ' + error)
            }
        );
    }

    updateOnScreenData(data) {
        if (this.props.tab === 'Day Shift') {
            this.setState({onScreenData: data.daySchedule});
        } else if (this.props.tab === 'Night Shift') {
            this.setState({onScreenData: data.nightSchedule});
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
        this.fetchWeeklyScheduleData();
    }

	render() {
        const { classes } = this.props;
		return (
            <div>
    			<div className="content-container">
                    <div>
                        <ScheduleDrawer date={this.state.dailyViewDate}
                            tab={this.props.tab}
                            drawer={this.state.drawer}
                            handleClose={this.handleClose}/>
                    </div>
    				<TableContainer fullWidth={true}>
    					<Table fullWidth={true}>
    						<ScheduleTableHead date={this.props.date} handleDateClick={this.handleDateClick}/>
    						<ScheduleTableBody curMonday={GetMonday(this.props.date)} onScreenData={this.state.onScreenData} tab={this.props.tab}/>
    					</Table>
    				</TableContainer>
    			</div>
                <StaffPanel date={this.props.date}/>
            </div>
        );
    }
}

function GetMonday(date) {
    let monday = date.getDate() - date.getDay() + 1;
    let curr = new Date(date);
    curr.setDate(monday);
    return curr;
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
                        <TableCell align="center" width="20%">
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
        this.state = {
            first_half: null,
            second_half: null
        };
        this.updateOnScreenData = this.updateOnScreenData.bind(this);
    }

    updateOnScreenData() {
        if (this.props.onScreenData.length !== 0) {
            let first = GetScheduleDataByRow(this.props.onScreenData[0]);
            let second = GetScheduleDataByRow(this.props.onScreenData[1]);
            let first_half = first.map((row, index) => (GetSingleRow(row, index === first.length-1, this.props.tab, true, this.props.curMonday)));
            let second_half = second.map((row, index) => (GetSingleRow(row, index === second.length-1, this.props.tab, false, this.props.curMonday)));
            this.setState({first_half: first_half});
            this.setState({second_half: second_half});
        }
    }

    componentDidMount() {
        this.updateOnScreenData();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.onScreenData !== this.props.onScreenData) {
            this.updateOnScreenData();
        }
    }

    render() {
        return (
            <TableBody>
                {this.state.first_half}
                {this.state.second_half}
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

function GetSingleRow(row, border, tab, first_half, curMonday) {
    let shift;
    if (tab === 'Day Shift') {
        if (first_half === true) {
            shift = 'AM';
        } else {
            shift = 'PM';
        }
    } else if (tab === 'Night Shift') {
        shift = 'night';
    }
    return (
        <TableRow>
            {row.map((route, index) => {
                let block;
                if (route !== null) {
                    block = <RouteBlock
                                date={GetBlockDate(curMonday, index)}
                                shift={shift}
                                route={route.route}
                                status_init={route.route_status}
                                operator_init={route.driver}
                                operator_id_init={route.driver_id}
                            ></RouteBlock>;
                }
                return <StyledTableCell bottom={border} right={index<4} align="center" width="20%" size="small">{block}</StyledTableCell>
            })}
        </TableRow>
    );
}

function GetBlockDate(curMonday, index) {
    let curr = new Date(curMonday);
    curr.setDate(curMonday.getDate() + index);
    return curr;
}

function GetWeekdayDate(date, weekday) {
    let curr = new Date(date);
    curr.setDate(date.getDate() - date.getDay() + weekday);
    return curr;
}

export default SchedulePage;
