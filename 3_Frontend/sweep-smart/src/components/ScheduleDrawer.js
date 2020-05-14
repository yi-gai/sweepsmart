import React from 'react';
import API from '../API/api';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import { styled } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Drawer from '@material-ui/core/Drawer';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import "./scheduleDrawer.css";

const ContainerPaper = styled(Paper)({
	position: "absolute",
	width: 1450,
	height: '100%',

	background: '#E5E5E5',
});

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
	height: 560,
	left: 27,
	top: 347,

	background: '#FFFFFF',
	borderRadius: 5,
});

const VehiclePanel = styled(Paper)({
	position: "absolute",
	width: 250,
	height: 516,
	left: 1169,
	top: 167,

	background: '#FFFFFF',
	borderRadius: 5,
});

const UnplannedPanel = styled(Paper)({
	position: "absolute",
	width: 250,
	height: 216,
	left: 1169,
	top: 691,

	background: '#FFFFFF',
	borderRadius: 5,
});

const OverviewNameTableCell = styled(({column, ...other}) => <TableCell {...other}/>)({
	width: (props) => {
		if (props.column === 1) {return  100;}
		if (props.column === 2) {return  120;}
		if (props.column === 3) {return  120;}
	},
	paddingLeft: (props) => props.column === 1 ? 25 : 0,
	fontFamily: 'Lato',
	fontStyle: 'normal',
	fontWeight: 'bold',
	fontSize: 16,
	color: '#3A423E',
	paddingRight: 0,
	marginRight: 0,

	border: 0,
	borderCollapse: 'collapse',
});

const OverviewNumberTableCell = styled(TableCell)({
	fontFamily: 'Lato',
	fontStyle: 'normal',
	fontWeight: 'normal',
	fontSize: 16,
	color: '#3A423E',
	width: 40,
	textAlign: 'center',
	paddingLeft: 0,

	border: 0,
	borderCollapse: 'collapse',
});

const OperatorTableHeadCell = styled(TableCell)({
	fontFamily: 'Lato',
	fontStyle: 'normal',
	textAlign: 'center',
	fontSize: 16,
	color: '#7A827F',
	fontWeight: 900,
	height: 40
});

const OperatorNameTableCell = styled(TableCell) ({
	border: 0,
	borderCollapse: 'collapse',

	fontFamily: 'Lato',
	fontStyle: 'normal',
	fontWeight: 'bold',
	fontSize: 16,

	color:' #3A423E'
});

const OperatorStatusRegularTableCell = styled(TableCell) ({
	border: 0,
	borderCollapse: 'collapse',

	fontFamily: 'Lato',
	fontStyle: 'normal',
	fontWeight: 'bold',
	fontSize: 16,

	color: '#70C295'
});

const OperatorTableCell = styled(TableCell) ({
	border: 0,
	borderCollapse: 'collapse'
});

const VehicleTableCell = styled(TableCell) ({
	border: 0,
	borderCollapse: 'collapse'
});

const PageUpButton = styled(Button) ({
	position: "absolute",
	top: 15,
});

const PageDownButton = styled(Button) ({
	position: "absolute",
	top: 40,
});

const StyledSelect = styled(Select) ({
	height: 16,
	minWidth: 30,
});

const WeatherButton = styled(({order, current, ...other}) => <Button {...other}/>) ({
	left: (props) => (props.order - 1) * 100 + 30,
	border: (props) => props.current === true ? '1px solid #70C295' : 0,
	background: (props) => props.current === true ? '#F5F5F5' : '#FFFFFF',
	top: 75,
	position: "absolute",
	padding: '10px 0 0 0',
	margin: 0,
	width: 70,
	height: 70,
	align: 'center',
	display: 'block'
})

class ScheduleDrawer extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			operators: [],
			vehiclesDay: null,
			vehiclesNight: null,
			morning: 1,
			afternoon: 0,
			holiday: 1,
			served: 0,
			missed: 0,
			todo: 0,
			success: 0.0,
			weather: ''
		};
		this.makeAPICalls = this.makeAPICalls.bind(this);
		this.handleWeatherClick = this.handleWeatherClick.bind(this);
		this.handleClose = this.handleClose.bind(this);
	}

	componentDidMount() {
		this.makeAPICalls();
	}

	componentDidUpdate(prevProps) {
		if (this.props.date !== prevProps.date) {
			this.makeAPICalls();
		}
	}

	handleClose() {
		this.props.handleClose();
		this.setState({'weather': ''});
	}

	makeAPICalls() {
		API.get("/schedule/day/weather", {
			params: {'date': GetDateFormat(this.props.date)}
		}).then(res => this.setState({weather: res['data']['weather']}));

		API.get("/vehicle/day", {
			params: {'date': GetDateFormat(this.props.date), 'shift': 'day'}
		}).then(res => this.setState({vehiclesDay: res['data']}));

		API.get("/vehicle/day", {
			params: {'date': GetDateFormat(this.props.date), 'shift': 'night'}
		}).then(res => this.setState({vehiclesNight: res['data']}));

		API.get("/operator/day/onduty", {
			params: {'date': GetDateFormat(this.props.date)}
		}).then(res => this.setState({operators: res['data']['day']}));

		API.get("/schedule/day/overview", {
			params: {'date': GetDateFormat(this.props.date)}
		}).then(res => this.setState({morning: res['data']['maps_am'],
			afternoon: res['data']['maps_pm'],
			holiday: res['data']['maps_holiday'],
			served: res['data']['maps_served'],
			missed: res['data']['maps_missed'],
			todo: res['data']['maps_to_do'],
			success: res['data']['success_rate']}));
	}

	handleWeatherClick(weather) {
		let params = new URLSearchParams();
		params.append('weather', weather);
		API({
			method: 'put',
			url: '/schedule/day/weather',
			withCredentials: false,
			data: params,
			params: {'date': GetDateFormat(this.props.date)}
		}).then(res => {
			if (res['status'] === 200) {
				this.setState({weather: weather});
				alert("Set weather to " + weather + "!");
			}
		})
	}

	render() {
				
		return (
			<Drawer anchor='right' open={this.props.drawer}>
				<div className="background-container">
				<ContainerPaper>
				<Button style={{width: 75, height: 80}} onClick={this.handleClose}>
					<CloseIcon />
				</Button>
				<div className="date">
					<div className="day-display"> {GetDayDisplay(this.props.date)} </div>
					<div className="week-numebr-display">{GetWeekdayNumber(this.props.date)}</div>
				</div>
					<OverviewPanel className="overview"> 
						<OverviewPanelContent morning={this.state.morning}
							afternoon={this.state.afternoon}
							served={this.state.served}
							missed={this.state.missed}
							success={this.state.success}
							todo={this.state.todo}
							holiday={this.state.holiday}/>
					</OverviewPanel>
					<WeatherPanel className="weatherPaper"> 
						<WeatherPanelContent weather={this.state.weather} handleClick={this.handleWeatherClick}/>
					</WeatherPanel>
					<OperatorPanel className="operatorPaper"> 
						<OperatorPanelContent operators={this.state.operators}
							length={this.state.operators.length}
							vehiclesDay={this.state.vehiclesDay}
							vehiclesNight={this.state.vehiclesNight}/>
					</OperatorPanel>
					<VehiclePanel className="vehiclePaper"> 
						<VehiclePanelContent vehiclesDay={this.state.vehiclesDay} vehiclesNight={this.state.vehiclesNight}/>
					</VehiclePanel>
					<UnplannedPanel>
						<h4> Unplanned routes </h4>
					</UnplannedPanel>
				</ContainerPaper>
				</div>

			</Drawer>
		);
	}
}

class OverviewPanelContent extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<TableContainer>
			<h4> Overview </h4>
			<Table fullWidth={true}>
				<TableRow>
					<OverviewNameTableCell size="small" column={1}>Morning maps</OverviewNameTableCell>
					<OverviewNumberTableCell size="small" >{this.props.morning}</OverviewNumberTableCell>
					<OverviewNameTableCell size="small" column={2}>Total maps served</OverviewNameTableCell>
					<OverviewNumberTableCell size="small" >{this.props.served}</OverviewNumberTableCell>
					<OverviewNameTableCell size="small" column={3}>Total Holiday Maps</OverviewNameTableCell>
					<OverviewNumberTableCell size="small" >{this.props.holiday}</OverviewNumberTableCell>
				</TableRow>
				<TableRow>
					<OverviewNameTableCell size="small" column={1}>Afternoon maps</OverviewNameTableCell>
					<OverviewNumberTableCell size="small" >{this.props.afternoon}</OverviewNumberTableCell>
					<OverviewNameTableCell size="small" column={2}>Total maps missed</OverviewNameTableCell>
					<OverviewNumberTableCell size="small" >{this.props.missed}</OverviewNumberTableCell>
					<OverviewNameTableCell size="small" column={3}>Success Rate</OverviewNameTableCell>
					<OverviewNumberTableCell size="small" >{this.props.success}</OverviewNumberTableCell>
				</TableRow>
				<TableRow>
					<OverviewNameTableCell size="small" column={1}>Total maps</OverviewNameTableCell>
					<OverviewNumberTableCell size="small" >{this.props.morning + this.props.afternoon}</OverviewNumberTableCell>
					<OverviewNameTableCell size="small" column={2}>Total maps to-do</OverviewNameTableCell>
					<OverviewNumberTableCell size="small" >{this.props.todo} </OverviewNumberTableCell>
				</TableRow>
			</Table>
			</TableContainer>
		);
	}
}

class WeatherPanelContent extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<h4>Weather</h4>
				<WeatherButton order={1} current={this.props.weather === 'sunny'} onClick={() => this.props.handleClick('sunny')}>
					<div><SunnyIcon/></div>
					<div><SunnyText/></div>
				</WeatherButton>
				<WeatherButton order={2} current={this.props.weather === 'rainy'} onClick={() => this.props.handleClick('rainy')}>
					<div><RainyIcon/></div>
					<div><RainyText/></div>
				</WeatherButton>
				<WeatherButton order={3} current={this.props.weather === 'clear'} onClick={() => this.props.handleClick('clear')}>
					<div><ClearIcon/></div>
					<div><ClearText/></div>
				</WeatherButton>
				<WeatherButton order={4} current={this.props.weather === 'windy'} onClick={() => this.props.handleClick('windy')}>
					<div><WindyIcon/></div>
					<div><WindyText/></div>
				</WeatherButton>
			</div>
		);
	}
}

class OperatorPanelContent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {curPage: 1};
		this.handlePageUp = this.handlePageUp.bind(this);
		this.handlePageDown = this.handlePageDown.bind(this);
	}

	handlePageUp() {
		this.setState({curPage: Math.max(this.state.curPage - 1, 1)});
	}

	handlePageDown() {
		let numPages = Math.floor((this.props.length - 1) / 9) + 1;
		this.setState({curPage: Math.min(this.state.curPage + 1, numPages)});
	}

	render() {
		let heads = (
			<TableHead>
				<TableRow>
					<OperatorTableHeadCell width="18%">Name</OperatorTableHeadCell>
					<OperatorTableHeadCell width="14%">Status</OperatorTableHeadCell>
					<OperatorTableHeadCell width="10%">Vehicle #</OperatorTableHeadCell>
					<OperatorTableHeadCell width="10%">AM Route</OperatorTableHeadCell>
					<OperatorTableHeadCell width="14%">AM Completion</OperatorTableHeadCell>
					<OperatorTableHeadCell width="10%">PM Route</OperatorTableHeadCell>
					<OperatorTableHeadCell width="14%">PM Completion</OperatorTableHeadCell>
					<OperatorTableHeadCell width="10%">Comment</OperatorTableHeadCell>
				</TableRow>
			</TableHead>
		);
		let numPages = Math.floor((this.props.length - 1) / 9) + 1;
		let start_idx = 9 * (this.state.curPage - 1);
		let end_idx = Math.min(start_idx + 9, this.props.length);
		let vehicles = [];
		if (this.props.vehiclesDay !== null) {
			vehicles = Object.entries(this.props.vehiclesDay);
		}
		let contents = this.props.operators.slice(start_idx, end_idx).map((row, _) => 
			<TableRow>
				<OperatorNameTableCell align="center" size="medium">{row['name']}</OperatorNameTableCell>
				<OperatorStatusRegularTableCell align="center" size="medium">Regular</OperatorStatusRegularTableCell>
				<OperatorTableCell align="center" size="medium">
					<StyledSelect autoWidth={true}>
						{vehicles.map((vid) => <MenuItem value={vid[0]}>{vid[0]}</MenuItem>)}
					</StyledSelect>
				</OperatorTableCell>
				<OperatorTableCell align="center" size="medium">
					<StyledSelect autoWidth={true}>
						<MenuItem value="completed">7</MenuItem>
						<MenuItem value="missed">7A</MenuItem>
						<MenuItem value="assigned">7B</MenuItem>
					</StyledSelect>
				</OperatorTableCell>
				<OperatorTableCell align="center" size="medium">
					<StyledSelect autoWidth={true}>
						<MenuItem value="completed">Completed</MenuItem>
						<MenuItem value="missed">Missed</MenuItem>
						<MenuItem value="assigned">Assigned</MenuItem>
					</StyledSelect>
				</OperatorTableCell>
				<OperatorTableCell align="center" size="medium">
					<StyledSelect autoWidth={true}>
						<MenuItem value="completed">7</MenuItem>
						<MenuItem value="missed">7A</MenuItem>
						<MenuItem value="assigned">7B</MenuItem>
					</StyledSelect>
				</OperatorTableCell>
				<OperatorTableCell align="center" size="medium">
				 	<StyledSelect autoWidth={true}>
						<MenuItem value="completed">Completed</MenuItem>
						<MenuItem value="missed">Missed</MenuItem>
						<MenuItem value="assigned">Assigned</MenuItem>
					</StyledSelect>
				</OperatorTableCell>
				<OperatorTableCell align="center" size="small"><AddCommentDialog/></OperatorTableCell>
			</TableRow>
		);
		let scrolls;
		if (numPages > 1) {
			scrolls = (
				<div className="scrolls">
					<PageUpButton onClick={this.handlePageUp}><ArrowUpSmall/></PageUpButton>
					<PageDownButton onClick={this.handlePageDown}><ArrowDownSmall/></PageDownButton>
				</div>
			);
		} else {
			scrolls = (<div className="scrolls"></div>);
		}
		return (
			<TableContainer>
			<Table fullWidth={true}>
				{heads}
			<TableBody>
				{contents}
			</TableBody>
			</Table>
				{scrolls}
			</TableContainer>
		);
	}
}

class AddCommentDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {open: false};
		this.handleClickOpen = this.handleClickOpen.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
	}

	handleClickOpen() {
		this.setState({open: true});
	};

	handleCancel() {
		this.setState({open: false});
	}

	render() {
		return (
			<div>
				<Button onClick={this.handleClickOpen} >
					<CommentIcon />
				</Button>
				<Dialog open={this.state.open}
				onClose={this.handleCancel}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description">
					<DialogTitle id="alert-dialog-title">{"Add comment for this operator."}</DialogTitle>
					<DialogContent>
						<TextField
							required
							autoFocus
							label="Comment"
							fullWidth/>
					</DialogContent>
					<DialogActions>
						<Button onClick={this.handleCancel} color="primary">
						Cancel
						</Button>
						<Button onClick={this.handleCancel} color="primary" autoFocus>
						Submit
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		);
	}
}

function VehiclePanelContent(props) {
	let entries = [];
	if (props.vehiclesDay !== null) {
		entries = Object.entries(props.vehiclesDay);
	}
	let	contents = entries.map((value) => (
		<TableRow>
			<VehicleTableCell align="center" size="small">{value[0]}</VehicleTableCell>
			<VehicleTableCell align="center" size="small"><DailyStatus status={value[1]['8-12 status']}/></VehicleTableCell>
		</TableRow>
	));
	return (
		<div>
			<h4>Vehicles ({entries.length})</h4>
			<TableContainer>
				<Table>
					<TableBody>
						{contents}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
}

function DailyStatus(props) {
	if (props.status == 'in-use') {
		return <InUseIcon/>;
	} else if (props.status === 'available') {
		return <AvailableIcon/>;
	} else if (props.status === 'out-of-service') {
		return <OutOfServiceIcon/>;
	} else {
		return;
	}
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

function GetDayDisplay(date) {
	let month = date.getMonth() + 1;
	let day = date.getDate();
	let year = date.getYear() + 1900;
	return month + "/" + day + ", " + year;
}

function GetWeekdayNumber(date) {
	let day = date.getDay();
	let number = Math.floor((date.getDate() - 1) / 7);

	let day_array = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
	let number_array = ['1st', '2nd', '3rd', '4th', '5th'];

	let day_str = day_array[day - 1];
	let number_str = number_array[number];

	return number_str + ' ' + day_str;
}

function InUseIcon() {
	return (
		<svg width="100" height="20" viewBox="0 0 100 20" fill="none" xmlns="http://www.w3.org/2000/svg">
		<rect width="100" height="20" rx="5" fill="#70C295"/>
		<path d="M32.765 7.818V15H31.036V7.818H32.765ZM33.024 5.725C33.024 5.87433 32.9937 6.01433 32.933 6.145C32.8723 6.27567 32.7907 6.39 32.688 6.488C32.59 6.586 32.4733 6.66533 32.338 6.726C32.2027 6.782 32.058 6.81 31.904 6.81C31.7547 6.81 31.6123 6.782 31.477 6.726C31.3463 6.66533 31.232 6.586 31.134 6.488C31.036 6.39 30.9567 6.27567 30.896 6.145C30.84 6.01433 30.812 5.87433 30.812 5.725C30.812 5.571 30.84 5.42633 30.896 5.291C30.9567 5.15567 31.036 5.039 31.134 4.941C31.232 4.843 31.3463 4.766 31.477 4.71C31.6123 4.64933 31.7547 4.619 31.904 4.619C32.058 4.619 32.2027 4.64933 32.338 4.71C32.4733 4.766 32.59 4.843 32.688 4.941C32.7907 5.039 32.8723 5.15567 32.933 5.291C32.9937 5.42633 33.024 5.571 33.024 5.725ZM34.7248 15V7.818H35.7818C36.0058 7.818 36.1528 7.923 36.2228 8.133L36.3418 8.7C36.4864 8.55067 36.6381 8.41533 36.7968 8.294C36.9601 8.17267 37.1304 8.06767 37.3078 7.979C37.4898 7.89033 37.6834 7.82267 37.8888 7.776C38.0941 7.72933 38.3181 7.706 38.5608 7.706C38.9528 7.706 39.3004 7.77367 39.6038 7.909C39.9071 8.03967 40.1591 8.22633 40.3598 8.469C40.5651 8.707 40.7191 8.994 40.8218 9.33C40.9291 9.66133 40.9828 10.0277 40.9828 10.429V15H39.2538V10.429C39.2538 9.99033 39.1511 9.652 38.9458 9.414C38.7451 9.17133 38.4418 9.05 38.0358 9.05C37.7371 9.05 37.4571 9.11767 37.1958 9.253C36.9344 9.38833 36.6871 9.57267 36.4538 9.806V15H34.7248ZM42.4578 10.051H46.0838V11.493H42.4578V10.051ZM49.2951 7.818V12.382C49.2951 12.8207 49.3954 13.1613 49.5961 13.404C49.8014 13.642 50.1071 13.761 50.5131 13.761C50.8117 13.761 51.0917 13.6957 51.3531 13.565C51.6144 13.4297 51.8617 13.2453 52.0951 13.012V7.818H53.8241V15H52.7671C52.5431 15 52.3961 14.895 52.3261 14.685L52.2071 14.111C52.0577 14.2603 51.9037 14.398 51.7451 14.524C51.5864 14.6453 51.4161 14.7503 51.2341 14.839C51.0567 14.923 50.8631 14.9883 50.6531 15.035C50.4477 15.0863 50.2261 15.112 49.9881 15.112C49.5961 15.112 49.2484 15.0467 48.9451 14.916C48.6464 14.7807 48.3944 14.5917 48.1891 14.349C47.9837 14.1063 47.8274 13.8193 47.7201 13.488C47.6174 13.152 47.5661 12.7833 47.5661 12.382V7.818H49.2951ZM59.9331 9.218C59.8864 9.29267 59.8374 9.34633 59.7861 9.379C59.7348 9.407 59.6694 9.421 59.5901 9.421C59.5061 9.421 59.4151 9.39767 59.3171 9.351C59.2238 9.30433 59.1141 9.253 58.9881 9.197C58.8621 9.13633 58.7174 9.08267 58.5541 9.036C58.3954 8.98933 58.2064 8.966 57.9871 8.966C57.6464 8.966 57.3781 9.03833 57.1821 9.183C56.9861 9.32767 56.8881 9.51667 56.8881 9.75C56.8881 9.904 56.9371 10.0347 57.0351 10.142C57.1378 10.2447 57.2708 10.3357 57.4341 10.415C57.6021 10.4943 57.7911 10.5667 58.0011 10.632C58.2111 10.6927 58.4258 10.7603 58.6451 10.835C58.8644 10.9097 59.0791 10.996 59.2891 11.094C59.4991 11.1873 59.6858 11.3087 59.8491 11.458C60.0171 11.6027 60.1501 11.7777 60.2481 11.983C60.3508 12.1883 60.4021 12.4357 60.4021 12.725C60.4021 13.0703 60.3391 13.39 60.2131 13.684C60.0871 13.9733 59.9028 14.2253 59.6601 14.44C59.4174 14.65 59.1164 14.8157 58.7571 14.937C58.4024 15.0537 57.9941 15.112 57.5321 15.112C57.2848 15.112 57.0421 15.0887 56.8041 15.042C56.5708 15 56.3444 14.9393 56.1251 14.86C55.9104 14.7807 55.7098 14.6873 55.5231 14.58C55.3411 14.4727 55.1801 14.356 55.0401 14.23L55.4391 13.572C55.4904 13.4927 55.5511 13.432 55.6211 13.39C55.6911 13.348 55.7798 13.327 55.8871 13.327C55.9944 13.327 56.0948 13.3573 56.1881 13.418C56.2861 13.4787 56.3981 13.544 56.5241 13.614C56.6501 13.684 56.7971 13.7493 56.9651 13.81C57.1378 13.8707 57.3548 13.901 57.6161 13.901C57.8214 13.901 57.9964 13.8777 58.1411 13.831C58.2904 13.7797 58.4118 13.7143 58.5051 13.635C58.6031 13.5557 58.6731 13.4647 58.7151 13.362C58.7618 13.2547 58.7851 13.145 58.7851 13.033C58.7851 12.865 58.7338 12.7273 58.6311 12.62C58.5331 12.5127 58.4001 12.4193 58.2321 12.34C58.0688 12.2607 57.8798 12.1907 57.6651 12.13C57.4551 12.0647 57.2381 11.9947 57.0141 11.92C56.7948 11.8453 56.5778 11.759 56.3631 11.661C56.1531 11.5583 55.9641 11.43 55.7961 11.276C55.6328 11.122 55.4998 10.933 55.3971 10.709C55.2991 10.485 55.2501 10.2143 55.2501 9.897C55.2501 9.603 55.3084 9.323 55.4251 9.057C55.5418 8.791 55.7121 8.56 55.9361 8.364C56.1648 8.16333 56.4471 8.00467 56.7831 7.888C57.1238 7.76667 57.5158 7.706 57.9591 7.706C58.4538 7.706 58.9041 7.78767 59.3101 7.951C59.7161 8.11433 60.0544 8.329 60.3251 8.595L59.9331 9.218ZM64.7494 7.706C65.2021 7.706 65.6174 7.77833 65.9954 7.923C66.3781 8.06767 66.7071 8.28 66.9824 8.56C67.2578 8.83533 67.4724 9.176 67.6264 9.582C67.7804 9.98333 67.8574 10.443 67.8574 10.961C67.8574 11.0917 67.8504 11.2013 67.8364 11.29C67.8271 11.374 67.8061 11.4417 67.7734 11.493C67.7454 11.5397 67.7058 11.5747 67.6544 11.598C67.6031 11.6167 67.5378 11.626 67.4584 11.626H63.0204C63.0718 12.3633 63.2701 12.9047 63.6154 13.25C63.9608 13.5953 64.4181 13.768 64.9874 13.768C65.2674 13.768 65.5078 13.7353 65.7084 13.67C65.9138 13.6047 66.0911 13.5323 66.2404 13.453C66.3944 13.3737 66.5274 13.3013 66.6394 13.236C66.7561 13.1707 66.8681 13.138 66.9754 13.138C67.0454 13.138 67.1061 13.152 67.1574 13.18C67.2088 13.208 67.2531 13.2477 67.2904 13.299L67.7944 13.929C67.6031 14.153 67.3884 14.342 67.1504 14.496C66.9124 14.6453 66.6628 14.7667 66.4014 14.86C66.1448 14.9487 65.8811 15.0117 65.6104 15.049C65.3444 15.0863 65.0854 15.105 64.8334 15.105C64.3341 15.105 63.8698 15.0233 63.4404 14.86C63.0111 14.692 62.6378 14.447 62.3204 14.125C62.0031 13.7983 61.7534 13.397 61.5714 12.921C61.3894 12.4403 61.2984 11.885 61.2984 11.255C61.2984 10.765 61.3778 10.3053 61.5364 9.876C61.6951 9.442 61.9214 9.06633 62.2154 8.749C62.5141 8.427 62.8758 8.17267 63.3004 7.986C63.7298 7.79933 64.2128 7.706 64.7494 7.706ZM64.7844 8.945C64.2804 8.945 63.8861 9.08733 63.6014 9.372C63.3168 9.65667 63.1348 10.0603 63.0554 10.583H66.3034C66.3034 10.359 66.2731 10.149 66.2124 9.953C66.1518 9.75233 66.0584 9.57733 65.9324 9.428C65.8064 9.27867 65.6478 9.162 65.4564 9.078C65.2651 8.98933 65.0411 8.945 64.7844 8.945Z" fill="white"/>
		</svg>
	);
}

function AvailableIcon() {
	return (
		<svg width="100" height="20" viewBox="0 0 100 20" fill="none" xmlns="http://www.w3.org/2000/svg">
		<rect width="100" height="20" rx="5" fill="#E9BF6F"/>
		<path d="M29.0178 16H28.2408C28.0775 16 27.9492 15.9767 27.8558 15.93C27.7625 15.8787 27.6925 15.7783 27.6458 15.629L27.4918 15.118C27.3098 15.2813 27.1302 15.426 26.9528 15.552C26.7802 15.6733 26.6005 15.776 26.4138 15.86C26.2272 15.944 26.0288 16.007 25.8188 16.049C25.6088 16.091 25.3755 16.112 25.1188 16.112C24.8155 16.112 24.5355 16.0723 24.2788 15.993C24.0222 15.909 23.8005 15.7853 23.6138 15.622C23.4318 15.4587 23.2895 15.2557 23.1868 15.013C23.0842 14.7703 23.0328 14.488 23.0328 14.166C23.0328 13.8953 23.1028 13.6293 23.2428 13.368C23.3875 13.102 23.6255 12.864 23.9568 12.654C24.2882 12.4393 24.7292 12.262 25.2798 12.122C25.8305 11.982 26.5142 11.9027 27.3308 11.884V11.464C27.3308 10.9833 27.2282 10.6287 27.0228 10.4C26.8222 10.1667 26.5282 10.05 26.1408 10.05C25.8608 10.05 25.6275 10.0827 25.4408 10.148C25.2542 10.2133 25.0908 10.288 24.9508 10.372C24.8155 10.4513 24.6895 10.5237 24.5728 10.589C24.4562 10.6543 24.3278 10.687 24.1878 10.687C24.0712 10.687 23.9708 10.6567 23.8868 10.596C23.8028 10.5353 23.7352 10.4607 23.6838 10.372L23.3688 9.819C24.1948 9.063 25.1912 8.685 26.3578 8.685C26.7778 8.685 27.1512 8.755 27.4778 8.895C27.8092 9.03033 28.0892 9.22167 28.3178 9.469C28.5465 9.71167 28.7192 10.0033 28.8358 10.344C28.9572 10.6847 29.0178 11.058 29.0178 11.464V16ZM25.6578 14.922C25.8352 14.922 25.9985 14.9057 26.1478 14.873C26.2972 14.8403 26.4372 14.7913 26.5678 14.726C26.7032 14.6607 26.8315 14.5813 26.9528 14.488C27.0788 14.39 27.2048 14.2757 27.3308 14.145V12.934C26.8268 12.9573 26.4045 13.0017 26.0638 13.067C25.7278 13.1277 25.4572 13.207 25.2518 13.305C25.0465 13.403 24.8995 13.5173 24.8108 13.648C24.7268 13.7787 24.6848 13.921 24.6848 14.075C24.6848 14.3783 24.7735 14.5953 24.9508 14.726C25.1328 14.8567 25.3685 14.922 25.6578 14.922ZM34.0699 16H32.5019L29.6459 8.818H31.0809C31.2069 8.818 31.3119 8.84833 31.3959 8.909C31.4845 8.96967 31.5452 9.04667 31.5779 9.14L32.9639 12.976C33.0432 13.2 33.1085 13.4193 33.1599 13.634C33.2159 13.8487 33.2649 14.0633 33.3069 14.278C33.3489 14.0633 33.3955 13.8487 33.4469 13.634C33.5029 13.4193 33.5729 13.2 33.6569 12.976L35.0779 9.14C35.1105 9.04667 35.1689 8.96967 35.2529 8.909C35.3369 8.84833 35.4372 8.818 35.5539 8.818H36.9189L34.0699 16ZM43.5647 16H42.7877C42.6244 16 42.496 15.9767 42.4027 15.93C42.3094 15.8787 42.2394 15.7783 42.1927 15.629L42.0387 15.118C41.8567 15.2813 41.677 15.426 41.4997 15.552C41.327 15.6733 41.1474 15.776 40.9607 15.86C40.774 15.944 40.5757 16.007 40.3657 16.049C40.1557 16.091 39.9224 16.112 39.6657 16.112C39.3624 16.112 39.0824 16.0723 38.8257 15.993C38.569 15.909 38.3474 15.7853 38.1607 15.622C37.9787 15.4587 37.8364 15.2557 37.7337 15.013C37.631 14.7703 37.5797 14.488 37.5797 14.166C37.5797 13.8953 37.6497 13.6293 37.7897 13.368C37.9344 13.102 38.1724 12.864 38.5037 12.654C38.835 12.4393 39.276 12.262 39.8267 12.122C40.3774 11.982 41.061 11.9027 41.8777 11.884V11.464C41.8777 10.9833 41.775 10.6287 41.5697 10.4C41.369 10.1667 41.075 10.05 40.6877 10.05C40.4077 10.05 40.1744 10.0827 39.9877 10.148C39.801 10.2133 39.6377 10.288 39.4977 10.372C39.3624 10.4513 39.2364 10.5237 39.1197 10.589C39.003 10.6543 38.8747 10.687 38.7347 10.687C38.618 10.687 38.5177 10.6567 38.4337 10.596C38.3497 10.5353 38.282 10.4607 38.2307 10.372L37.9157 9.819C38.7417 9.063 39.738 8.685 40.9047 8.685C41.3247 8.685 41.698 8.755 42.0247 8.895C42.356 9.03033 42.636 9.22167 42.8647 9.469C43.0934 9.71167 43.266 10.0033 43.3827 10.344C43.504 10.6847 43.5647 11.058 43.5647 11.464V16ZM40.2047 14.922C40.382 14.922 40.5454 14.9057 40.6947 14.873C40.844 14.8403 40.984 14.7913 41.1147 14.726C41.25 14.6607 41.3784 14.5813 41.4997 14.488C41.6257 14.39 41.7517 14.2757 41.8777 14.145V12.934C41.3737 12.9573 40.9514 13.0017 40.6107 13.067C40.2747 13.1277 40.004 13.207 39.7987 13.305C39.5934 13.403 39.4464 13.5173 39.3577 13.648C39.2737 13.7787 39.2317 13.921 39.2317 14.075C39.2317 14.3783 39.3204 14.5953 39.4977 14.726C39.6797 14.8567 39.9154 14.922 40.2047 14.922ZM47.1058 8.818V16H45.3768V8.818H47.1058ZM47.3648 6.725C47.3648 6.87433 47.3345 7.01433 47.2738 7.145C47.2132 7.27567 47.1315 7.39 47.0288 7.488C46.9308 7.586 46.8142 7.66533 46.6788 7.726C46.5435 7.782 46.3988 7.81 46.2448 7.81C46.0955 7.81 45.9532 7.782 45.8178 7.726C45.6872 7.66533 45.5728 7.586 45.4748 7.488C45.3768 7.39 45.2975 7.27567 45.2368 7.145C45.1808 7.01433 45.1528 6.87433 45.1528 6.725C45.1528 6.571 45.1808 6.42633 45.2368 6.291C45.2975 6.15567 45.3768 6.039 45.4748 5.941C45.5728 5.843 45.6872 5.766 45.8178 5.71C45.9532 5.64933 46.0955 5.619 46.2448 5.619C46.3988 5.619 46.5435 5.64933 46.6788 5.71C46.8142 5.766 46.9308 5.843 47.0288 5.941C47.1315 6.039 47.2132 6.15567 47.2738 6.291C47.3345 6.42633 47.3648 6.571 47.3648 6.725ZM50.9066 5.598V16H49.1776V5.598H50.9066ZM58.4944 16H57.7174C57.554 16 57.4257 15.9767 57.3324 15.93C57.239 15.8787 57.169 15.7783 57.1224 15.629L56.9684 15.118C56.7864 15.2813 56.6067 15.426 56.4294 15.552C56.2567 15.6733 56.077 15.776 55.8904 15.86C55.7037 15.944 55.5054 16.007 55.2954 16.049C55.0854 16.091 54.852 16.112 54.5954 16.112C54.292 16.112 54.012 16.0723 53.7554 15.993C53.4987 15.909 53.277 15.7853 53.0904 15.622C52.9084 15.4587 52.766 15.2557 52.6634 15.013C52.5607 14.7703 52.5094 14.488 52.5094 14.166C52.5094 13.8953 52.5794 13.6293 52.7194 13.368C52.864 13.102 53.102 12.864 53.4334 12.654C53.7647 12.4393 54.2057 12.262 54.7564 12.122C55.307 11.982 55.9907 11.9027 56.8074 11.884V11.464C56.8074 10.9833 56.7047 10.6287 56.4994 10.4C56.2987 10.1667 56.0047 10.05 55.6174 10.05C55.3374 10.05 55.104 10.0827 54.9174 10.148C54.7307 10.2133 54.5674 10.288 54.4274 10.372C54.292 10.4513 54.166 10.5237 54.0494 10.589C53.9327 10.6543 53.8044 10.687 53.6644 10.687C53.5477 10.687 53.4474 10.6567 53.3634 10.596C53.2794 10.5353 53.2117 10.4607 53.1604 10.372L52.8454 9.819C53.6714 9.063 54.6677 8.685 55.8344 8.685C56.2544 8.685 56.6277 8.755 56.9544 8.895C57.2857 9.03033 57.5657 9.22167 57.7944 9.469C58.023 9.71167 58.1957 10.0033 58.3124 10.344C58.4337 10.6847 58.4944 11.058 58.4944 11.464V16ZM55.1344 14.922C55.3117 14.922 55.475 14.9057 55.6244 14.873C55.7737 14.8403 55.9137 14.7913 56.0444 14.726C56.1797 14.6607 56.308 14.5813 56.4294 14.488C56.5554 14.39 56.6814 14.2757 56.8074 14.145V12.934C56.3034 12.9573 55.881 13.0017 55.5404 13.067C55.2044 13.1277 54.9337 13.207 54.7284 13.305C54.523 13.403 54.376 13.5173 54.2874 13.648C54.2034 13.7787 54.1614 13.921 54.1614 14.075C54.1614 14.3783 54.25 14.5953 54.4274 14.726C54.6094 14.8567 54.845 14.922 55.1344 14.922ZM60.2155 16V5.598H61.9445V9.7C62.2292 9.39667 62.5512 9.15633 62.9105 8.979C63.2698 8.797 63.6898 8.706 64.1705 8.706C64.5625 8.706 64.9195 8.78767 65.2415 8.951C65.5682 9.10967 65.8482 9.343 66.0815 9.651C66.3195 9.959 66.5015 10.3393 66.6275 10.792C66.7582 11.2447 66.8235 11.765 66.8235 12.353C66.8235 12.8897 66.7512 13.3867 66.6065 13.844C66.4618 14.3013 66.2542 14.698 65.9835 15.034C65.7175 15.37 65.3932 15.6337 65.0105 15.825C64.6325 16.0117 64.2078 16.105 63.7365 16.105C63.5172 16.105 63.3165 16.0817 63.1345 16.035C62.9525 15.993 62.7868 15.9323 62.6375 15.853C62.4882 15.7737 62.3482 15.678 62.2175 15.566C62.0915 15.4493 61.9702 15.321 61.8535 15.181L61.7765 15.664C61.7485 15.7853 61.6995 15.8717 61.6295 15.923C61.5642 15.9743 61.4732 16 61.3565 16H60.2155ZM63.5755 10.05C63.2162 10.05 62.9082 10.127 62.6515 10.281C62.3995 10.4303 62.1638 10.6427 61.9445 10.918V14.138C62.1405 14.3807 62.3528 14.551 62.5815 14.649C62.8148 14.7423 63.0668 14.789 63.3375 14.789C63.5988 14.789 63.8345 14.74 64.0445 14.642C64.2545 14.544 64.4318 14.3947 64.5765 14.194C64.7258 13.9933 64.8402 13.7413 64.9195 13.438C64.9988 13.13 65.0385 12.7683 65.0385 12.353C65.0385 11.933 65.0035 11.5783 64.9335 11.289C64.8682 10.995 64.7725 10.757 64.6465 10.575C64.5205 10.393 64.3665 10.26 64.1845 10.176C64.0072 10.092 63.8042 10.05 63.5755 10.05ZM70.0199 5.598V16H68.2909V5.598H70.0199ZM74.9477 8.706C75.4003 8.706 75.8157 8.77833 76.1937 8.923C76.5763 9.06767 76.9053 9.28 77.1807 9.56C77.456 9.83533 77.6707 10.176 77.8247 10.582C77.9787 10.9833 78.0557 11.443 78.0557 11.961C78.0557 12.0917 78.0487 12.2013 78.0347 12.29C78.0253 12.374 78.0043 12.4417 77.9717 12.493C77.9437 12.5397 77.904 12.5747 77.8527 12.598C77.8013 12.6167 77.736 12.626 77.6567 12.626H73.2187C73.27 13.3633 73.4683 13.9047 73.8137 14.25C74.159 14.5953 74.6163 14.768 75.1857 14.768C75.4657 14.768 75.706 14.7353 75.9067 14.67C76.112 14.6047 76.2893 14.5323 76.4387 14.453C76.5927 14.3737 76.7257 14.3013 76.8377 14.236C76.9543 14.1707 77.0663 14.138 77.1737 14.138C77.2437 14.138 77.3043 14.152 77.3557 14.18C77.407 14.208 77.4513 14.2477 77.4887 14.299L77.9927 14.929C77.8013 15.153 77.5867 15.342 77.3487 15.496C77.1107 15.6453 76.861 15.7667 76.5997 15.86C76.343 15.9487 76.0793 16.0117 75.8087 16.049C75.5427 16.0863 75.2837 16.105 75.0317 16.105C74.5323 16.105 74.068 16.0233 73.6387 15.86C73.2093 15.692 72.836 15.447 72.5187 15.125C72.2013 14.7983 71.9517 14.397 71.7697 13.921C71.5877 13.4403 71.4967 12.885 71.4967 12.255C71.4967 11.765 71.576 11.3053 71.7347 10.876C71.8933 10.442 72.1197 10.0663 72.4137 9.749C72.7123 9.427 73.074 9.17267 73.4987 8.986C73.928 8.79933 74.411 8.706 74.9477 8.706ZM74.9827 9.945C74.4787 9.945 74.0843 10.0873 73.7997 10.372C73.515 10.6567 73.333 11.0603 73.2537 11.583H76.5017C76.5017 11.359 76.4713 11.149 76.4107 10.953C76.35 10.7523 76.2567 10.5773 76.1307 10.428C76.0047 10.2787 75.846 10.162 75.6547 10.078C75.4633 9.98933 75.2393 9.945 74.9827 9.945Z" fill="white"/>
		</svg>
	);
}

function OutOfServiceIcon() {
	return (
		<svg width="100" height="20" viewBox="0 0 100 20" fill="none" xmlns="http://www.w3.org/2000/svg">
		<rect width="100" height="20" rx="5" fill="#D68080"/>
		<path d="M10.0017 7.706C10.5384 7.706 11.0237 7.79233 11.4577 7.965C11.8964 8.13767 12.2697 8.38267 12.5777 8.7C12.8857 9.01733 13.1237 9.40467 13.2917 9.862C13.4597 10.3193 13.5437 10.8303 13.5437 11.395C13.5437 11.9643 13.4597 12.4777 13.2917 12.935C13.1237 13.3923 12.8857 13.782 12.5777 14.104C12.2697 14.426 11.8964 14.6733 11.4577 14.846C11.0237 15.0187 10.5384 15.105 10.0017 15.105C9.46505 15.105 8.97739 15.0187 8.53872 14.846C8.10005 14.6733 7.72439 14.426 7.41172 14.104C7.10372 13.782 6.86339 13.3923 6.69072 12.935C6.52272 12.4777 6.43872 11.9643 6.43872 11.395C6.43872 10.8303 6.52272 10.3193 6.69072 9.862C6.86339 9.40467 7.10372 9.01733 7.41172 8.7C7.72439 8.38267 8.10005 8.13767 8.53872 7.965C8.97739 7.79233 9.46505 7.706 10.0017 7.706ZM10.0017 13.775C10.5991 13.775 11.0401 13.5743 11.3247 13.173C11.6141 12.7717 11.7587 12.1837 11.7587 11.409C11.7587 10.6343 11.6141 10.044 11.3247 9.638C11.0401 9.232 10.5991 9.029 10.0017 9.029C9.39505 9.029 8.94705 9.23433 8.65772 9.645C8.36839 10.051 8.22372 10.639 8.22372 11.409C8.22372 12.179 8.36839 12.767 8.65772 13.173C8.94705 13.5743 9.39505 13.775 10.0017 13.775ZM16.4748 7.818V12.382C16.4748 12.8207 16.5751 13.1613 16.7758 13.404C16.9811 13.642 17.2868 13.761 17.6928 13.761C17.9914 13.761 18.2714 13.6957 18.5328 13.565C18.7941 13.4297 19.0414 13.2453 19.2748 13.012V7.818H21.0037V15H19.9468C19.7228 15 19.5758 14.895 19.5058 14.685L19.3868 14.111C19.2374 14.2603 19.0834 14.398 18.9248 14.524C18.7661 14.6453 18.5958 14.7503 18.4138 14.839C18.2364 14.923 18.0428 14.9883 17.8328 15.035C17.6274 15.0863 17.4058 15.112 17.1678 15.112C16.7758 15.112 16.4281 15.0467 16.1248 14.916C15.8261 14.7807 15.5741 14.5917 15.3688 14.349C15.1634 14.1063 15.0071 13.8193 14.8998 13.488C14.7971 13.152 14.7458 12.7833 14.7458 12.382V7.818H16.4748ZM25.2088 15.112C24.5881 15.112 24.1098 14.937 23.7738 14.587C23.4378 14.2323 23.2698 13.7447 23.2698 13.124V9.113H22.5418C22.4484 9.113 22.3668 9.08267 22.2968 9.022C22.2314 8.96133 22.1988 8.87033 22.1988 8.749V8.063L23.3538 7.874L23.7178 5.914C23.7364 5.82067 23.7784 5.74833 23.8438 5.697C23.9138 5.64567 24.0001 5.62 24.1028 5.62H24.9988V7.881H26.8888V9.113H24.9988V13.005C24.9988 13.229 25.0548 13.404 25.1668 13.53C25.2788 13.656 25.4281 13.719 25.6148 13.719C25.7221 13.719 25.8108 13.7073 25.8808 13.684C25.9554 13.656 26.0184 13.628 26.0698 13.6C26.1258 13.572 26.1748 13.5463 26.2168 13.523C26.2588 13.495 26.3008 13.481 26.3428 13.481C26.3941 13.481 26.4361 13.495 26.4688 13.523C26.5014 13.5463 26.5364 13.5837 26.5738 13.635L27.0918 14.475C26.8398 14.685 26.5504 14.8437 26.2238 14.951C25.8971 15.0583 25.5588 15.112 25.2088 15.112ZM28.0398 10.051H31.6658V11.493H28.0398V10.051ZM36.3611 7.706C36.8978 7.706 37.3831 7.79233 37.8171 7.965C38.2558 8.13767 38.6291 8.38267 38.9371 8.7C39.2451 9.01733 39.4831 9.40467 39.6511 9.862C39.8191 10.3193 39.9031 10.8303 39.9031 11.395C39.9031 11.9643 39.8191 12.4777 39.6511 12.935C39.4831 13.3923 39.2451 13.782 38.9371 14.104C38.6291 14.426 38.2558 14.6733 37.8171 14.846C37.3831 15.0187 36.8978 15.105 36.3611 15.105C35.8244 15.105 35.3368 15.0187 34.8981 14.846C34.4594 14.6733 34.0838 14.426 33.7711 14.104C33.4631 13.782 33.2228 13.3923 33.0501 12.935C32.8821 12.4777 32.7981 11.9643 32.7981 11.395C32.7981 10.8303 32.8821 10.3193 33.0501 9.862C33.2228 9.40467 33.4631 9.01733 33.7711 8.7C34.0838 8.38267 34.4594 8.13767 34.8981 7.965C35.3368 7.79233 35.8244 7.706 36.3611 7.706ZM36.3611 13.775C36.9584 13.775 37.3994 13.5743 37.6841 13.173C37.9734 12.7717 38.1181 12.1837 38.1181 11.409C38.1181 10.6343 37.9734 10.044 37.6841 9.638C37.3994 9.232 36.9584 9.029 36.3611 9.029C35.7544 9.029 35.3064 9.23433 35.0171 9.645C34.7278 10.051 34.5831 10.639 34.5831 11.409C34.5831 12.179 34.7278 12.767 35.0171 13.173C35.3064 13.5743 35.7544 13.775 36.3611 13.775ZM41.5601 15V9.12L40.9371 9.022C40.8018 8.99867 40.6921 8.952 40.6081 8.882C40.5288 8.812 40.4891 8.714 40.4891 8.588V7.881H41.5601V7.349C41.5601 6.93833 41.6208 6.56967 41.7421 6.243C41.8681 5.91633 42.0455 5.63867 42.2741 5.41C42.5075 5.18133 42.7898 5.00633 43.1211 4.885C43.4525 4.76367 43.8258 4.703 44.2411 4.703C44.5725 4.703 44.8805 4.74733 45.1651 4.836L45.1301 5.704C45.1208 5.83933 45.0578 5.92333 44.9411 5.956C44.8245 5.98867 44.6891 6.005 44.5351 6.005C44.3298 6.005 44.1455 6.02833 43.9821 6.075C43.8235 6.117 43.6881 6.194 43.5761 6.306C43.4641 6.41333 43.3778 6.558 43.3171 6.74C43.2611 6.91733 43.2331 7.139 43.2331 7.405V7.881H45.1021V9.113H43.2891V15H41.5601ZM45.9363 10.051H49.5623V11.493H45.9363V10.051ZM55.4546 9.218C55.4079 9.29267 55.3589 9.34633 55.3076 9.379C55.2562 9.407 55.1909 9.421 55.1116 9.421C55.0276 9.421 54.9366 9.39767 54.8386 9.351C54.7452 9.30433 54.6356 9.253 54.5096 9.197C54.3836 9.13633 54.2389 9.08267 54.0756 9.036C53.9169 8.98933 53.7279 8.966 53.5086 8.966C53.1679 8.966 52.8996 9.03833 52.7036 9.183C52.5076 9.32767 52.4096 9.51667 52.4096 9.75C52.4096 9.904 52.4586 10.0347 52.5566 10.142C52.6592 10.2447 52.7922 10.3357 52.9556 10.415C53.1236 10.4943 53.3126 10.5667 53.5226 10.632C53.7326 10.6927 53.9472 10.7603 54.1666 10.835C54.3859 10.9097 54.6006 10.996 54.8106 11.094C55.0206 11.1873 55.2072 11.3087 55.3706 11.458C55.5386 11.6027 55.6716 11.7777 55.7696 11.983C55.8722 12.1883 55.9236 12.4357 55.9236 12.725C55.9236 13.0703 55.8606 13.39 55.7346 13.684C55.6086 13.9733 55.4242 14.2253 55.1816 14.44C54.9389 14.65 54.6379 14.8157 54.2786 14.937C53.9239 15.0537 53.5156 15.112 53.0536 15.112C52.8062 15.112 52.5636 15.0887 52.3256 15.042C52.0922 15 51.8659 14.9393 51.6466 14.86C51.4319 14.7807 51.2312 14.6873 51.0446 14.58C50.8626 14.4727 50.7016 14.356 50.5616 14.23L50.9606 13.572C51.0119 13.4927 51.0726 13.432 51.1426 13.39C51.2126 13.348 51.3012 13.327 51.4086 13.327C51.5159 13.327 51.6162 13.3573 51.7096 13.418C51.8076 13.4787 51.9196 13.544 52.0456 13.614C52.1716 13.684 52.3186 13.7493 52.4866 13.81C52.6592 13.8707 52.8762 13.901 53.1376 13.901C53.3429 13.901 53.5179 13.8777 53.6626 13.831C53.8119 13.7797 53.9332 13.7143 54.0266 13.635C54.1246 13.5557 54.1946 13.4647 54.2366 13.362C54.2832 13.2547 54.3066 13.145 54.3066 13.033C54.3066 12.865 54.2552 12.7273 54.1526 12.62C54.0546 12.5127 53.9216 12.4193 53.7536 12.34C53.5902 12.2607 53.4012 12.1907 53.1866 12.13C52.9766 12.0647 52.7596 11.9947 52.5356 11.92C52.3162 11.8453 52.0992 11.759 51.8846 11.661C51.6746 11.5583 51.4856 11.43 51.3176 11.276C51.1542 11.122 51.0212 10.933 50.9186 10.709C50.8206 10.485 50.7716 10.2143 50.7716 9.897C50.7716 9.603 50.8299 9.323 50.9466 9.057C51.0632 8.791 51.2336 8.56 51.4576 8.364C51.6862 8.16333 51.9686 8.00467 52.3046 7.888C52.6452 7.76667 53.0372 7.706 53.4806 7.706C53.9752 7.706 54.4256 7.78767 54.8316 7.951C55.2376 8.11433 55.5759 8.329 55.8466 8.595L55.4546 9.218ZM60.2709 7.706C60.7236 7.706 61.1389 7.77833 61.5169 7.923C61.8996 8.06767 62.2286 8.28 62.5039 8.56C62.7792 8.83533 62.9939 9.176 63.1479 9.582C63.3019 9.98333 63.3789 10.443 63.3789 10.961C63.3789 11.0917 63.3719 11.2013 63.3579 11.29C63.3486 11.374 63.3276 11.4417 63.2949 11.493C63.2669 11.5397 63.2272 11.5747 63.1759 11.598C63.1246 11.6167 63.0592 11.626 62.9799 11.626H58.5419C58.5932 12.3633 58.7916 12.9047 59.1369 13.25C59.4822 13.5953 59.9396 13.768 60.5089 13.768C60.7889 13.768 61.0292 13.7353 61.2299 13.67C61.4352 13.6047 61.6126 13.5323 61.7619 13.453C61.9159 13.3737 62.0489 13.3013 62.1609 13.236C62.2776 13.1707 62.3896 13.138 62.4969 13.138C62.5669 13.138 62.6276 13.152 62.6789 13.18C62.7302 13.208 62.7746 13.2477 62.8119 13.299L63.3159 13.929C63.1246 14.153 62.9099 14.342 62.6719 14.496C62.4339 14.6453 62.1842 14.7667 61.9229 14.86C61.6662 14.9487 61.4026 15.0117 61.1319 15.049C60.8659 15.0863 60.6069 15.105 60.3549 15.105C59.8556 15.105 59.3912 15.0233 58.9619 14.86C58.5326 14.692 58.1592 14.447 57.8419 14.125C57.5246 13.7983 57.2749 13.397 57.0929 12.921C56.9109 12.4403 56.8199 11.885 56.8199 11.255C56.8199 10.765 56.8992 10.3053 57.0579 9.876C57.2166 9.442 57.4429 9.06633 57.7369 8.749C58.0356 8.427 58.3972 8.17267 58.8219 7.986C59.2512 7.79933 59.7342 7.706 60.2709 7.706ZM60.3059 8.945C59.8019 8.945 59.4076 9.08733 59.1229 9.372C58.8382 9.65667 58.6562 10.0603 58.5769 10.583H61.8249C61.8249 10.359 61.7946 10.149 61.7339 9.953C61.6732 9.75233 61.5799 9.57733 61.4539 9.428C61.3279 9.27867 61.1692 9.162 60.9779 9.078C60.7866 8.98933 60.5626 8.945 60.3059 8.945ZM64.7814 15V7.818H65.7964C65.9738 7.818 66.0974 7.85067 66.1674 7.916C66.2374 7.98133 66.2841 8.09333 66.3074 8.252L66.4124 9.12C66.6691 8.67667 66.9701 8.32667 67.3154 8.07C67.6608 7.81333 68.0481 7.685 68.4774 7.685C68.8321 7.685 69.1261 7.76667 69.3594 7.93L69.1354 9.225C69.1214 9.309 69.0911 9.36967 69.0444 9.407C68.9978 9.43967 68.9348 9.456 68.8554 9.456C68.7854 9.456 68.6898 9.43967 68.5684 9.407C68.4471 9.37433 68.2861 9.358 68.0854 9.358C67.7261 9.358 67.4181 9.45833 67.1614 9.659C66.9048 9.855 66.6878 10.1443 66.5104 10.527V15H64.7814ZM74.0943 15H72.5263L69.6703 7.818H71.1053C71.2313 7.818 71.3363 7.84833 71.4203 7.909C71.5089 7.96967 71.5696 8.04667 71.6023 8.14L72.9883 11.976C73.0676 12.2 73.1329 12.4193 73.1843 12.634C73.2403 12.8487 73.2893 13.0633 73.3313 13.278C73.3733 13.0633 73.4199 12.8487 73.4713 12.634C73.5273 12.4193 73.5973 12.2 73.6813 11.976L75.1023 8.14C75.1349 8.04667 75.1933 7.96967 75.2773 7.909C75.3613 7.84833 75.4616 7.818 75.5783 7.818H76.9433L74.0943 15ZM79.8021 7.818V15H78.0731V7.818H79.8021ZM80.0611 5.725C80.0611 5.87433 80.0308 6.01433 79.9701 6.145C79.9094 6.27567 79.8278 6.39 79.7251 6.488C79.6271 6.586 79.5104 6.66533 79.3751 6.726C79.2398 6.782 79.0951 6.81 78.9411 6.81C78.7918 6.81 78.6494 6.782 78.5141 6.726C78.3834 6.66533 78.2691 6.586 78.1711 6.488C78.0731 6.39 77.9938 6.27567 77.9331 6.145C77.8771 6.01433 77.8491 5.87433 77.8491 5.725C77.8491 5.571 77.8771 5.42633 77.9331 5.291C77.9938 5.15567 78.0731 5.039 78.1711 4.941C78.2691 4.843 78.3834 4.766 78.5141 4.71C78.6494 4.64933 78.7918 4.619 78.9411 4.619C79.0951 4.619 79.2398 4.64933 79.3751 4.71C79.5104 4.766 79.6271 4.843 79.7251 4.941C79.8278 5.039 79.9094 5.15567 79.9701 5.291C80.0308 5.42633 80.0611 5.571 80.0611 5.725ZM86.8089 9.337C86.7576 9.40233 86.7062 9.45367 86.6549 9.491C86.6082 9.52833 86.5382 9.547 86.4449 9.547C86.3562 9.547 86.2699 9.52133 86.1859 9.47C86.1019 9.414 86.0016 9.35333 85.8849 9.288C85.7682 9.218 85.6282 9.15733 85.4649 9.106C85.3062 9.05 85.1079 9.022 84.8699 9.022C84.5666 9.022 84.3006 9.078 84.0719 9.19C83.8432 9.29733 83.6519 9.45367 83.4979 9.659C83.3486 9.86433 83.2366 10.114 83.1619 10.408C83.0872 10.6973 83.0499 11.0263 83.0499 11.395C83.0499 11.7777 83.0896 12.1183 83.1689 12.417C83.2529 12.7157 83.3719 12.9677 83.5259 13.173C83.6799 13.3737 83.8666 13.5277 84.0859 13.635C84.3052 13.7377 84.5526 13.789 84.8279 13.789C85.1032 13.789 85.3249 13.7563 85.4929 13.691C85.6656 13.621 85.8102 13.5463 85.9269 13.467C86.0436 13.383 86.1439 13.3083 86.2279 13.243C86.3166 13.173 86.4146 13.138 86.5219 13.138C86.6619 13.138 86.7669 13.1917 86.8369 13.299L87.3339 13.929C87.1426 14.153 86.9349 14.342 86.7109 14.496C86.4869 14.6453 86.2536 14.7667 86.0109 14.86C85.7729 14.9487 85.5256 15.0117 85.2689 15.049C85.0122 15.0863 84.7579 15.105 84.5059 15.105C84.0626 15.105 83.6449 15.0233 83.2529 14.86C82.8609 14.692 82.5179 14.4493 82.2239 14.132C81.9346 13.8147 81.7036 13.4273 81.5309 12.97C81.3629 12.508 81.2789 11.983 81.2789 11.395C81.2789 10.8677 81.3536 10.38 81.5029 9.932C81.6569 9.47933 81.8809 9.08967 82.1749 8.763C82.4689 8.43167 82.8329 8.17267 83.2669 7.986C83.7009 7.79933 84.2002 7.706 84.7649 7.706C85.3016 7.706 85.7706 7.79233 86.1719 7.965C86.5779 8.13767 86.9419 8.385 87.2639 8.707L86.8089 9.337ZM91.4018 7.706C91.8544 7.706 92.2698 7.77833 92.6478 7.923C93.0304 8.06767 93.3594 8.28 93.6348 8.56C93.9101 8.83533 94.1248 9.176 94.2788 9.582C94.4328 9.98333 94.5098 10.443 94.5098 10.961C94.5098 11.0917 94.5028 11.2013 94.4888 11.29C94.4794 11.374 94.4584 11.4417 94.4258 11.493C94.3978 11.5397 94.3581 11.5747 94.3068 11.598C94.2554 11.6167 94.1901 11.626 94.1108 11.626H89.6728C89.7241 12.3633 89.9224 12.9047 90.2678 13.25C90.6131 13.5953 91.0704 13.768 91.6398 13.768C91.9198 13.768 92.1601 13.7353 92.3608 13.67C92.5661 13.6047 92.7434 13.5323 92.8928 13.453C93.0468 13.3737 93.1798 13.3013 93.2918 13.236C93.4084 13.1707 93.5204 13.138 93.6278 13.138C93.6978 13.138 93.7584 13.152 93.8098 13.18C93.8611 13.208 93.9054 13.2477 93.9428 13.299L94.4468 13.929C94.2554 14.153 94.0408 14.342 93.8028 14.496C93.5648 14.6453 93.3151 14.7667 93.0538 14.86C92.7971 14.9487 92.5334 15.0117 92.2628 15.049C91.9968 15.0863 91.7378 15.105 91.4858 15.105C90.9864 15.105 90.5221 15.0233 90.0928 14.86C89.6634 14.692 89.2901 14.447 88.9728 14.125C88.6554 13.7983 88.4058 13.397 88.2238 12.921C88.0418 12.4403 87.9508 11.885 87.9508 11.255C87.9508 10.765 88.0301 10.3053 88.1888 9.876C88.3474 9.442 88.5738 9.06633 88.8678 8.749C89.1664 8.427 89.5281 8.17267 89.9528 7.986C90.3821 7.79933 90.8651 7.706 91.4018 7.706ZM91.4368 8.945C90.9328 8.945 90.5384 9.08733 90.2538 9.372C89.9691 9.65667 89.7871 10.0603 89.7078 10.583H92.9558C92.9558 10.359 92.9254 10.149 92.8648 9.953C92.8041 9.75233 92.7108 9.57733 92.5848 9.428C92.4588 9.27867 92.3001 9.162 92.1088 9.078C91.9174 8.98933 91.6934 8.945 91.4368 8.945Z" fill="white"/>
		</svg>
	);
}

function CommentIcon() {
	return (
		<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M13.2776 0.603755C12.4712 -0.201252 11.1652 -0.201252 10.3588 0.603755L9.62819 1.33838L1.85072 9.11172L1.83419 9.12838C1.83019 9.13238 1.83019 9.13664 1.82593 9.13664C1.81766 9.14904 1.80527 9.16131 1.79713 9.1737C1.79713 9.17784 1.79287 9.17784 1.79287 9.18197C1.78461 9.19436 1.7806 9.20263 1.77221 9.21503C1.76821 9.21916 1.76821 9.22316 1.76407 9.22742C1.75994 9.23982 1.75581 9.24808 1.75155 9.26048C1.75155 9.26448 1.74755 9.26448 1.74755 9.26874L0.0219598 14.4578C-0.0286598 14.6055 0.00982144 14.7691 0.121004 14.8787C0.199128 14.9558 0.3045 14.999 0.414133 14.9986C0.458941 14.9978 0.503362 14.9908 0.546234 14.9779L5.73126 13.2482C5.73526 13.2482 5.73526 13.2482 5.73952 13.2442C5.75256 13.2403 5.76509 13.2348 5.77658 13.2275C5.77981 13.2271 5.78265 13.2257 5.78497 13.2235C5.79724 13.2153 5.81377 13.2069 5.82617 13.1986C5.83844 13.1905 5.85096 13.1781 5.86336 13.1698C5.86749 13.1655 5.87149 13.1655 5.87149 13.1615C5.87575 13.1574 5.88402 13.1534 5.88815 13.145L14.3962 4.63692C15.2013 3.8305 15.2013 2.52459 14.3962 1.71829L13.2776 0.603755ZM5.59915 12.278L2.72598 9.40498L9.91719 2.21377L12.7904 5.08682L5.59915 12.278ZM2.32128 10.1687L4.83134 12.6786L1.06224 13.9335L2.32128 10.1687ZM13.8142 4.05893L13.3766 4.50069L10.5033 1.62738L10.9452 1.18575C11.4285 0.702799 12.212 0.702799 12.6955 1.18575L13.8183 2.30855C14.298 2.79409 14.2962 3.57572 13.8142 4.05893Z" fill="#7A827F"/>
		</svg>
	);
}

function ArrowUpSmall() {
	return (
		<svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path id="arrow" d="M9.81437 0.185523C9.69076 0.0618069 9.54423 0 9.37492 0H0.625047C0.455668 0 0.30924 0.0618069 0.185523 0.185523C0.0618069 0.309377 0 0.455805 0 0.625081C0 0.794323 0.0618069 0.940751 0.185523 1.0645L4.56048 5.43946C4.68433 5.56317 4.83076 5.62512 5 5.62512C5.16924 5.62512 5.31581 5.56317 5.43942 5.43946L9.81437 1.06447C9.93795 0.940752 10 0.794323 10 0.625047C10 0.455805 9.93795 0.309377 9.81437 0.185523Z"/>
		<g transform="rotate(180 5 3)">
			<use href="#arrow" fill="#7A827F"/>
		</g>
		</svg>
	);
}

function ArrowDownSmall() {
	return (
		<svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path id="arrow" d="M9.81437 0.185523C9.69076 0.0618069 9.54423 0 9.37492 0H0.625047C0.455668 0 0.30924 0.0618069 0.185523 0.185523C0.0618069 0.309377 0 0.455805 0 0.625081C0 0.794323 0.0618069 0.940751 0.185523 1.0645L4.56048 5.43946C4.68433 5.56317 4.83076 5.62512 5 5.62512C5.16924 5.62512 5.31581 5.56317 5.43942 5.43946L9.81437 1.06447C9.93795 0.940752 10 0.794323 10 0.625047C10 0.455805 9.93795 0.309377 9.81437 0.185523Z" fill="#7A827F"/>
		</svg>
	);
}

function SunnyIcon() {
	return (
		<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M12.5001 5.56421C8.66948 5.56421 5.56421 8.66948 5.56421 12.5001C5.56421 16.3307 8.66948 19.436 12.5001 19.436C16.3307 19.436 19.436 16.3307 19.436 12.5001C19.4316 8.67135 16.3289 5.56857 12.5001 5.56421ZM12.5001 18.3722C9.25708 18.3722 6.62804 15.7431 6.62804 12.5001C6.62804 9.25708 9.25708 6.62804 12.5001 6.62804C15.7431 6.62804 18.3722 9.25708 18.3722 12.5001C18.3684 15.7417 15.7417 18.3684 12.5001 18.3722Z" fill="#3A423E"/>
			<path d="M13.0321 3.24469V0.531916C13.0321 0.238116 12.794 0 12.5002 0C12.2064 0 11.9683 0.238116 11.9683 0.531916V3.24469C11.9683 3.53849 12.2064 3.7766 12.5002 3.7766C12.794 3.7766 13.0321 3.53849 13.0321 3.24469Z" fill="#3A423E"/>
			<path d="M12.5002 21.2234C12.2064 21.2234 11.9683 21.4616 11.9683 21.7554V24.4681C11.9683 24.7619 12.2064 25.0001 12.5002 25.0001C12.794 25.0001 13.0321 24.7619 13.0321 24.4681V21.7554C13.0321 21.4616 12.794 21.2234 12.5002 21.2234Z" fill="#3A423E"/>
			<path d="M24.4681 11.9681H21.7553C21.4615 11.9681 21.2234 12.2063 21.2234 12.5001C21.2234 12.7939 21.4615 13.032 21.7553 13.032H24.4681C24.7619 13.032 25 12.7939 25 12.5001C25 12.2063 24.7619 11.9681 24.4681 11.9681Z" fill="#3A423E"/>
			<path d="M3.7766 12.5001C3.7766 12.2063 3.53849 11.9681 3.24469 11.9681H0.531916C0.238116 11.9681 0 12.2063 0 12.5001C0 12.7939 0.238116 13.032 0.531916 13.032H3.24469C3.53849 13.032 3.7766 12.7939 3.7766 12.5001Z" fill="#3A423E"/>
			<path d="M19.4287 6.32351L21.3156 4.43666C21.5219 4.22867 21.5211 3.89311 21.3139 3.68616C21.107 3.47901 20.7714 3.47817 20.5634 3.6845L18.6766 5.57135C18.5413 5.70536 18.4879 5.90172 18.5369 6.08602C18.5862 6.27011 18.73 6.41389 18.9141 6.46314C19.0984 6.51217 19.2947 6.45877 19.4287 6.32351Z" fill="#3A423E"/>
			<path d="M5.5715 18.6765L3.68465 20.5634C3.54918 20.6976 3.49599 20.8939 3.54503 21.078C3.59406 21.2621 3.73805 21.4061 3.92215 21.4551C4.10624 21.5042 4.30259 21.451 4.43682 21.3155L6.32366 19.4287C6.45893 19.2947 6.51233 19.0983 6.46329 18.914C6.41405 18.7299 6.27026 18.5861 6.08617 18.5369C5.90187 18.4878 5.70552 18.5412 5.5715 18.6765Z" fill="#3A423E"/>
			<path d="M19.4287 18.6765C19.2947 18.5412 19.0984 18.4878 18.9141 18.5369C18.73 18.5861 18.5862 18.7299 18.5369 18.914C18.4879 19.0983 18.5413 19.2947 18.6766 19.4287L20.5634 21.3155C20.7714 21.5218 21.107 21.521 21.3139 21.3139C21.5211 21.1069 21.5219 20.7713 21.3156 20.5634L19.4287 18.6765Z" fill="#3A423E"/>
			<path d="M5.57135 6.32351C5.70536 6.45877 5.90172 6.51217 6.08602 6.46314C6.27011 6.41389 6.41389 6.27011 6.46314 6.08602C6.51217 5.90172 6.45877 5.70536 6.32351 5.57135L4.43666 3.6845C4.22867 3.47817 3.89311 3.47901 3.68616 3.68616C3.47901 3.89311 3.47817 4.22867 3.6845 4.43666L5.57135 6.32351Z" fill="#3A423E"/>
		</svg>
	);
}

function SunnyText() {
	return (
		<svg width="37" height="11" viewBox="0 0 37 11" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M5.40524 2.078C5.34924 2.18067 5.26291 2.232 5.14624 2.232C5.07624 2.232 4.99691 2.20633 4.90824 2.155C4.81958 2.10367 4.70991 2.04767 4.57924 1.987C4.45324 1.92167 4.30158 1.86333 4.12424 1.812C3.94691 1.756 3.73691 1.728 3.49424 1.728C3.28424 1.728 3.09524 1.756 2.92724 1.812C2.75924 1.86333 2.61458 1.93567 2.49324 2.029C2.37658 2.12233 2.28558 2.232 2.22024 2.358C2.15958 2.47933 2.12924 2.61233 2.12924 2.757C2.12924 2.939 2.18058 3.09067 2.28324 3.212C2.39058 3.33333 2.53058 3.43833 2.70324 3.527C2.87591 3.61567 3.07191 3.695 3.29124 3.765C3.51058 3.83033 3.73458 3.90267 3.96324 3.982C4.19658 4.05667 4.42291 4.14067 4.64224 4.234C4.86158 4.32733 5.05758 4.444 5.23024 4.584C5.40291 4.724 5.54058 4.89667 5.64324 5.102C5.75058 5.30267 5.80424 5.54533 5.80424 5.83C5.80424 6.15667 5.74591 6.46 5.62924 6.74C5.51258 7.01533 5.33991 7.25567 5.11124 7.461C4.88258 7.66167 4.60258 7.82033 4.27124 7.937C3.93991 8.05367 3.55724 8.112 3.12324 8.112C2.62858 8.112 2.18058 8.03267 1.77924 7.874C1.37791 7.71067 1.03724 7.503 0.757242 7.251L1.05124 6.775C1.08858 6.71433 1.13291 6.66767 1.18424 6.635C1.23558 6.60233 1.30324 6.586 1.38724 6.586C1.47124 6.586 1.55991 6.61867 1.65324 6.684C1.74658 6.74933 1.85858 6.82167 1.98924 6.901C2.12458 6.98033 2.28558 7.05267 2.47224 7.118C2.66358 7.18333 2.90158 7.216 3.18624 7.216C3.42891 7.216 3.64124 7.18567 3.82324 7.125C4.00524 7.05967 4.15691 6.97333 4.27824 6.866C4.39958 6.75867 4.48824 6.635 4.54424 6.495C4.60491 6.355 4.63524 6.20567 4.63524 6.047C4.63524 5.851 4.58158 5.69 4.47424 5.564C4.37158 5.43333 4.23391 5.32367 4.06124 5.235C3.88858 5.14167 3.69024 5.06233 3.46624 4.997C3.24691 4.927 3.02058 4.85467 2.78724 4.78C2.55858 4.70533 2.33224 4.62133 2.10824 4.528C1.88891 4.43 1.69291 4.30867 1.52024 4.164C1.34758 4.01933 1.20758 3.842 1.10024 3.632C0.997576 3.41733 0.946242 3.15833 0.946242 2.855C0.946242 2.58433 1.00224 2.32533 1.11424 2.078C1.22624 1.826 1.38958 1.60667 1.60424 1.42C1.81891 1.22867 2.08258 1.077 2.39524 0.965C2.70791 0.853 3.06491 0.797 3.46624 0.797C3.93291 0.797 4.35058 0.871666 4.71924 1.021C5.09258 1.16567 5.41458 1.36633 5.68524 1.623L5.40524 2.078ZM8.49355 0.909V5.431C8.49355 5.96767 8.61722 6.383 8.86455 6.677C9.11189 6.971 9.48522 7.118 9.98455 7.118C10.3486 7.118 10.6916 7.03167 11.0136 6.859C11.3356 6.68633 11.6319 6.446 11.9026 6.138V0.909H13.1486V8H12.4066C12.2292 8 12.1172 7.91367 12.0706 7.741L11.9726 6.978C11.6646 7.31867 11.3192 7.594 10.9366 7.804C10.5539 8.00933 10.1152 8.112 9.62055 8.112C9.23322 8.112 8.89022 8.049 8.59155 7.923C8.29755 7.79233 8.05022 7.61033 7.84955 7.377C7.64889 7.14367 7.49722 6.86133 7.39455 6.53C7.29655 6.19867 7.24755 5.83233 7.24755 5.431V0.909H8.49355ZM15.1949 8V0.909H15.9369C16.1142 0.909 16.2262 0.995333 16.2729 1.168L16.3709 1.938C16.6789 1.59733 17.0219 1.322 17.3999 1.112C17.7825 0.902 18.2235 0.797 18.7229 0.797C19.1102 0.797 19.4509 0.862333 19.7449 0.993C20.0435 1.119 20.2909 1.301 20.4869 1.539C20.6875 1.77233 20.8392 2.05467 20.9419 2.386C21.0445 2.71733 21.0959 3.08367 21.0959 3.485V8H19.8499V3.485C19.8499 2.94833 19.7262 2.533 19.4789 2.239C19.2362 1.94033 18.8629 1.791 18.3589 1.791C17.9902 1.791 17.6449 1.87967 17.3229 2.057C17.0055 2.23433 16.7115 2.47467 16.4409 2.778V8H15.1949ZM22.9741 8V0.909H23.7161C23.8935 0.909 24.0055 0.995333 24.0521 1.168L24.1501 1.938C24.4581 1.59733 24.8011 1.322 25.1791 1.112C25.5618 0.902 26.0028 0.797 26.5021 0.797C26.8895 0.797 27.2301 0.862333 27.5241 0.993C27.8228 1.119 28.0701 1.301 28.2661 1.539C28.4668 1.77233 28.6185 2.05467 28.7211 2.386C28.8238 2.71733 28.8751 3.08367 28.8751 3.485V8H27.6291V3.485C27.6291 2.94833 27.5055 2.533 27.2581 2.239C27.0155 1.94033 26.6421 1.791 26.1381 1.791C25.7695 1.791 25.4241 1.87967 25.1021 2.057C24.7848 2.23433 24.4908 2.47467 24.2201 2.778V8H22.9741ZM32.6137 10.093C32.5717 10.1863 32.518 10.261 32.4527 10.317C32.392 10.373 32.2964 10.401 32.1657 10.401H31.2417L32.5367 7.587L29.6107 0.909H30.6887C30.796 0.909 30.88 0.937 30.9407 0.993C31.0014 1.04433 31.0457 1.10267 31.0737 1.168L32.9707 5.634C33.0127 5.73667 33.0477 5.83933 33.0757 5.942C33.1084 6.04467 33.1364 6.14967 33.1597 6.257C33.1924 6.14967 33.225 6.04467 33.2577 5.942C33.2904 5.83933 33.3277 5.73433 33.3697 5.627L35.2107 1.168C35.2387 1.09333 35.2854 1.03267 35.3507 0.985999C35.4207 0.934666 35.4954 0.909 35.5747 0.909H36.5687L32.6137 10.093Z" fill="#7A827F"/>
		</svg>
	);
}

function RainyIcon() {
	return (
		<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M5.44667 18.2461C5.22231 18.0965 4.91918 18.1572 4.76957 18.3815L2.81645 21.3112C2.66684 21.5356 2.72748 21.8387 2.95185 21.9883C3.17524 22.1372 3.47875 22.0782 3.62895 21.8529L5.58207 18.9232C5.73168 18.6988 5.67104 18.3957 5.44667 18.2461Z" fill="#3A423E"/>
			<path d="M5.88154 24.918C6.10492 25.0669 6.40844 25.0079 6.55864 24.7826L7.5352 23.3178C7.68476 23.0934 7.62416 22.7902 7.3998 22.6407C7.17543 22.4911 6.87226 22.5516 6.7227 22.7761L5.74614 24.2409C5.59653 24.4653 5.65717 24.7684 5.88154 24.918Z" fill="#3A423E"/>
			<path d="M9.16408 18.3815L8.18752 19.8464C8.03796 20.0707 8.09856 20.3739 8.32292 20.5235C8.54631 20.6724 8.84983 20.6134 9.00002 20.3881L9.97658 18.9232C10.1261 18.6988 10.0655 18.3957 9.84118 18.2461C9.61682 18.0966 9.31364 18.1571 9.16408 18.3815Z" fill="#3A423E"/>
			<path d="M11.7409 21.9883C11.9643 22.1372 12.2678 22.0782 12.418 21.8529L14.3711 18.9232C14.5207 18.6988 14.4601 18.3957 14.2357 18.2461C14.0114 18.0965 13.7082 18.1572 13.5586 18.3815L11.6055 21.3112C11.4559 21.5356 11.5165 21.8387 11.7409 21.9883Z" fill="#3A423E"/>
			<path d="M14.6706 24.918C14.894 25.0669 15.1975 25.0079 15.3477 24.7826L16.3243 23.3178C16.4738 23.0934 16.4132 22.7902 16.1889 22.6407C15.9645 22.4911 15.6614 22.5516 15.5118 22.7761L14.5352 24.2409C14.3856 24.4653 14.4462 24.7684 14.6706 24.918Z" fill="#3A423E"/>
			<path d="M17.9531 18.3815L16.9766 19.8464C16.827 20.0707 16.8876 20.3739 17.112 20.5235C17.3354 20.6724 17.6389 20.6134 17.7891 20.3881L18.7656 18.9232C18.9152 18.6988 18.8546 18.3957 18.6302 18.2461C18.4059 18.0966 18.1028 18.1571 17.9531 18.3815Z" fill="#3A423E"/>
			<path d="M22.3477 18.3815L20.3946 21.3112C20.245 21.5356 20.3056 21.8387 20.53 21.9883C20.7534 22.1372 21.0569 22.0782 21.2071 21.8529L23.1602 18.9232C23.3098 18.6988 23.2492 18.3957 23.0248 18.2461C22.8005 18.0966 22.4973 18.1571 22.3477 18.3815Z" fill="#3A423E"/>
			<path d="M12.5 15.625C12.7697 15.625 12.9883 15.4064 12.9883 15.1367C12.9883 14.867 12.7697 14.6484 12.5 14.6484C12.2303 14.6484 12.0117 14.867 12.0117 15.1367C12.0117 15.4064 12.2303 15.625 12.5 15.625Z" fill="#3A423E"/>
			<path d="M3.51562 15.625H10.3027C10.5724 15.625 10.791 15.4064 10.791 15.1367C10.791 14.867 10.5724 14.6484 10.3027 14.6484H3.51562C2.13931 14.6484 0.976562 13.5304 0.976562 12.207C0.976562 10.8328 2.20688 9.73291 3.57686 9.76645C3.8916 9.77393 4.12949 9.48716 4.06733 9.18115C3.85391 8.13018 4.20083 7.04897 4.99536 6.28897C5.70493 5.61021 6.65068 5.28818 7.59492 5.38623C7.54512 5.70371 7.51953 6.02539 7.51953 6.34766C7.51953 6.61733 7.73813 6.83594 8.00781 6.83594C8.27749 6.83594 8.49609 6.61733 8.49609 6.34766C8.49609 3.34692 11.0468 0.976562 13.9648 0.976562C16.821 0.976562 19.2572 3.18061 19.5093 5.88545C17.0586 6.13516 15.0391 8.19839 15.0391 10.7422C15.0391 11.0119 15.2577 11.2305 15.5273 11.2305C15.797 11.2305 16.0156 11.0119 16.0156 10.7422C16.0156 8.6248 17.8492 6.83594 20.0195 6.83594C22.1899 6.83594 24.0234 8.6248 24.0234 10.7422C24.0234 12.8596 22.1899 14.6484 20.0195 14.6484H14.6973C14.4276 14.6484 14.209 14.867 14.209 15.1367C14.209 15.4064 14.4276 15.625 14.6973 15.625H20.0195C22.7292 15.625 25 13.4317 25 10.7422C25 8.18979 22.9643 6.11353 20.49 5.88135C20.2328 2.53193 17.2445 0 13.9648 0C11.1934 0 8.68589 1.79824 7.82519 4.43032C6.55469 4.25801 5.27241 4.67261 4.32041 5.58325C3.42046 6.44409 2.96069 7.62388 3.03691 8.82261C1.35903 9.05684 0 10.4754 0 12.207C0 14.1094 1.64243 15.625 3.51562 15.625Z" fill="#3A423E"/>
		</svg>
	);
}

function RainyText() {
	return (
		<svg width="30" height="14" viewBox="0 0 30 14" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M0.0220001 11V3.909H0.736C0.871333 3.909 0.964667 3.93467 1.016 3.986C1.06733 4.03733 1.10233 4.126 1.121 4.252L1.205 5.358C1.44767 4.86333 1.74633 4.47833 2.101 4.203C2.46033 3.923 2.88033 3.783 3.361 3.783C3.557 3.783 3.73433 3.80633 3.893 3.853C4.05167 3.895 4.19867 3.95567 4.334 4.035L4.173 4.966C4.14033 5.08267 4.068 5.141 3.956 5.141C3.89067 5.141 3.79033 5.12 3.655 5.078C3.51967 5.03133 3.33067 5.008 3.088 5.008C2.654 5.008 2.29 5.134 1.996 5.386C1.70667 5.638 1.464 6.00433 1.268 6.485V11H0.0220001ZM10.6167 11H10.0637C9.94239 11 9.84439 10.9813 9.76972 10.944C9.69505 10.9067 9.64605 10.8273 9.62272 10.706L9.48272 10.048C9.29605 10.216 9.11405 10.3677 8.93672 10.503C8.75939 10.6337 8.57272 10.7457 8.37672 10.839C8.18072 10.9277 7.97072 10.9953 7.74672 11.042C7.52739 11.0887 7.28239 11.112 7.01172 11.112C6.73639 11.112 6.47739 11.0747 6.23472 11C5.99672 10.9207 5.78905 10.804 5.61172 10.65C5.43439 10.496 5.29205 10.3023 5.18472 10.069C5.08205 9.831 5.03072 9.551 5.03072 9.229C5.03072 8.949 5.10772 8.68067 5.26172 8.424C5.41572 8.16267 5.66305 7.93167 6.00372 7.731C6.34905 7.53033 6.79939 7.367 7.35472 7.241C7.91005 7.11033 8.58905 7.03567 9.39172 7.017V6.464C9.39172 5.91333 9.27272 5.498 9.03472 5.218C8.80139 4.93333 8.45372 4.791 7.99172 4.791C7.68839 4.791 7.43172 4.83067 7.22172 4.91C7.01639 4.98467 6.83672 5.071 6.68272 5.169C6.53339 5.26233 6.40272 5.34867 6.29072 5.428C6.18339 5.50267 6.07605 5.54 5.96872 5.54C5.88472 5.54 5.81005 5.519 5.74472 5.477C5.68405 5.43033 5.63505 5.37433 5.59772 5.309L5.37372 4.91C5.76572 4.532 6.18805 4.24967 6.64072 4.063C7.09339 3.87633 7.59505 3.783 8.14572 3.783C8.54239 3.783 8.89472 3.84833 9.20272 3.979C9.51072 4.10967 9.76972 4.29167 9.97972 4.525C10.1897 4.75833 10.3484 5.04067 10.4557 5.372C10.5631 5.70333 10.6167 6.06733 10.6167 6.464V11ZM7.38272 10.237C7.60205 10.237 7.80272 10.216 7.98472 10.174C8.16672 10.1273 8.33705 10.0643 8.49572 9.985C8.65905 9.901 8.81305 9.80067 8.95772 9.684C9.10705 9.56733 9.25172 9.43433 9.39172 9.285V7.808C8.81772 7.82667 8.33005 7.87333 7.92872 7.948C7.52739 8.018 7.20072 8.11133 6.94872 8.228C6.69672 8.34467 6.51239 8.48233 6.39572 8.641C6.28372 8.79967 6.22772 8.977 6.22772 9.173C6.22772 9.35967 6.25805 9.52067 6.31872 9.656C6.37939 9.79133 6.46105 9.90333 6.56372 9.992C6.66639 10.076 6.78772 10.139 6.92772 10.181C7.06772 10.2183 7.21939 10.237 7.38272 10.237ZM13.8904 3.909V11H12.6444V3.909H13.8904ZM14.1704 1.683C14.1704 1.80433 14.1448 1.91867 14.0934 2.026C14.0468 2.12867 13.9814 2.222 13.8974 2.306C13.8181 2.38533 13.7248 2.44833 13.6174 2.495C13.5101 2.54167 13.3958 2.565 13.2744 2.565C13.1531 2.565 13.0388 2.54167 12.9314 2.495C12.8288 2.44833 12.7354 2.38533 12.6514 2.306C12.5721 2.222 12.5091 2.12867 12.4624 2.026C12.4158 1.91867 12.3924 1.80433 12.3924 1.683C12.3924 1.56167 12.4158 1.44733 12.4624 1.34C12.5091 1.228 12.5721 1.13233 12.6514 1.053C12.7354 0.969 12.8288 0.903666 12.9314 0.856999C13.0388 0.810333 13.1531 0.786999 13.2744 0.786999C13.3958 0.786999 13.5101 0.810333 13.6174 0.856999C13.7248 0.903666 13.8181 0.969 13.8974 1.053C13.9814 1.13233 14.0468 1.228 14.0934 1.34C14.1448 1.44733 14.1704 1.56167 14.1704 1.683ZM16.0865 11V3.909H16.8285C17.0058 3.909 17.1178 3.99533 17.1645 4.168L17.2625 4.938C17.5705 4.59733 17.9135 4.322 18.2915 4.112C18.6741 3.902 19.1151 3.797 19.6145 3.797C20.0018 3.797 20.3425 3.86233 20.6365 3.993C20.9351 4.119 21.1825 4.301 21.3785 4.539C21.5791 4.77233 21.7308 5.05467 21.8335 5.386C21.9361 5.71733 21.9875 6.08367 21.9875 6.485V11H20.7415V6.485C20.7415 5.94833 20.6178 5.533 20.3705 5.239C20.1278 4.94033 19.7545 4.791 19.2505 4.791C18.8818 4.791 18.5365 4.87967 18.2145 5.057C17.8971 5.23433 17.6031 5.47467 17.3325 5.778V11H16.0865ZM25.726 13.093C25.684 13.1863 25.6303 13.261 25.565 13.317C25.5043 13.373 25.4087 13.401 25.278 13.401H24.354L25.649 10.587L22.723 3.909H23.801C23.9083 3.909 23.9923 3.937 24.053 3.993C24.1137 4.04433 24.158 4.10267 24.186 4.168L26.083 8.634C26.125 8.73667 26.16 8.83933 26.188 8.942C26.2207 9.04467 26.2487 9.14967 26.272 9.257C26.3047 9.14967 26.3373 9.04467 26.37 8.942C26.4027 8.83933 26.44 8.73433 26.482 8.627L28.323 4.168C28.351 4.09333 28.3977 4.03267 28.463 3.986C28.533 3.93467 28.6077 3.909 28.687 3.909H29.681L25.726 13.093Z" fill="#7A827F"/>
		</svg>
	);
}

function ClearIcon() {
	return (
		<svg width="25" height="20" viewBox="0 0 25 15" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M23.292 8.44654C23.356 8.05276 23.3904 7.65406 23.3904 7.26028C23.3904 3.25851 20.1319 0 16.1301 0C13.4869 0 11.1045 1.40283 9.81491 3.69167C9.14057 3.38649 8.40224 3.22898 7.65898 3.22898C4.87792 3.22898 2.59401 5.4046 2.42666 8.17089C1.02382 8.53021 0 9.81491 0 11.2916C0 13.0685 1.44713 14.5156 3.22406 14.5156H21.7759C23.5528 14.5156 25 13.0685 25 11.2916C25.0049 10.0856 24.3453 9.00275 23.292 8.44654ZM21.7808 13.7133H3.22406C1.89013 13.7133 0.802322 12.6255 0.802322 11.2916C0.802322 8.98798 3.22406 8.82063 3.22406 8.82063V8.47115C3.22406 6.0248 5.21264 4.03622 7.65898 4.03622C9.10611 4.03622 10.1595 4.7844 10.1595 4.7844C10.1595 4.7844 11.8281 0.807245 16.1252 0.807245C19.684 0.807245 22.5782 3.70151 22.5782 7.26028C22.5782 8.32348 22.3715 8.92399 22.3715 8.92399C22.3715 8.92399 24.1927 9.39652 24.1927 11.2916C24.1977 12.6255 23.1148 13.7133 21.7808 13.7133Z" fill="#3A423E"/>
			<path d="M16.1299 2.01825V2.82549C18.5762 2.82549 20.5648 4.81407 20.5648 7.26042H21.3721C21.377 4.37107 19.0242 2.01825 16.1299 2.01825Z" fill="#3A423E"/>
		</svg>
	);
}

function ClearText() {
	return (
		<svg width="31" height="12" viewBox="0 0 31 12" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M6.25841 5.169C6.22108 5.22033 6.18375 5.26 6.14641 5.288C6.10908 5.316 6.05541 5.33 5.98541 5.33C5.91541 5.33 5.83841 5.302 5.75441 5.246C5.67508 5.18533 5.57241 5.12 5.44641 5.05C5.32041 4.98 5.16641 4.917 4.98441 4.861C4.80708 4.80033 4.58775 4.77 4.32641 4.77C3.98108 4.77 3.67541 4.833 3.40941 4.959C3.14341 5.08033 2.91941 5.25767 2.73741 5.491C2.56008 5.72433 2.42475 6.00667 2.33141 6.338C2.24275 6.66933 2.19841 7.04033 2.19841 7.451C2.19841 7.88033 2.24741 8.263 2.34541 8.599C2.44341 8.93033 2.58108 9.21033 2.75841 9.439C2.93575 9.663 3.15041 9.83567 3.40241 9.957C3.65908 10.0737 3.94608 10.132 4.26341 10.132C4.56675 10.132 4.81641 10.097 5.01241 10.027C5.20841 9.95233 5.37175 9.87067 5.50241 9.782C5.63308 9.69333 5.74041 9.614 5.82441 9.544C5.90841 9.46933 5.99241 9.432 6.07641 9.432C6.18375 9.432 6.26308 9.47167 6.31441 9.551L6.66441 10.006C6.35641 10.384 5.97141 10.6617 5.50941 10.839C5.04741 11.0117 4.55975 11.098 4.04641 11.098C3.60308 11.098 3.19008 11.0163 2.80741 10.853C2.42941 10.6897 2.10041 10.454 1.82041 10.146C1.54041 9.83333 1.31875 9.45067 1.15541 8.998C0.996747 8.54533 0.917414 8.02967 0.917414 7.451C0.917414 6.92367 0.989747 6.436 1.13441 5.988C1.28375 5.54 1.49841 5.155 1.77841 4.833C2.06308 4.50633 2.41308 4.252 2.82841 4.07C3.24375 3.888 3.71975 3.797 4.25641 3.797C4.75108 3.797 5.18975 3.87867 5.57241 4.042C5.95508 4.20067 6.29341 4.427 6.58741 4.721L6.25841 5.169ZM9.34257 0.689V11H8.09657V0.689H9.34257ZM14.3456 3.797C14.7703 3.797 15.1623 3.86933 15.5216 4.014C15.8809 4.154 16.1913 4.35933 16.4526 4.63C16.7139 4.896 16.9169 5.22733 17.0616 5.624C17.2109 6.016 17.2856 6.464 17.2856 6.968C17.2856 7.164 17.2646 7.29467 17.2226 7.36C17.1806 7.42533 17.1013 7.458 16.9846 7.458H12.2666C12.2759 7.906 12.3366 8.29567 12.4486 8.627C12.5606 8.95833 12.7146 9.236 12.9106 9.46C13.1066 9.67933 13.3399 9.845 13.6106 9.957C13.8813 10.0643 14.1846 10.118 14.5206 10.118C14.8333 10.118 15.1016 10.083 15.3256 10.013C15.5543 9.93833 15.7503 9.859 15.9136 9.775C16.0769 9.691 16.2123 9.614 16.3196 9.544C16.4316 9.46933 16.5273 9.432 16.6066 9.432C16.7093 9.432 16.7886 9.47167 16.8446 9.551L17.1946 10.006C17.0406 10.1927 16.8563 10.356 16.6416 10.496C16.4269 10.6313 16.1959 10.7433 15.9486 10.832C15.7059 10.9207 15.4539 10.986 15.1926 11.028C14.9313 11.0747 14.6723 11.098 14.4156 11.098C13.9256 11.098 13.4729 11.0163 13.0576 10.853C12.6469 10.685 12.2899 10.4423 11.9866 10.125C11.6879 9.803 11.4546 9.40633 11.2866 8.935C11.1186 8.46367 11.0346 7.92233 11.0346 7.311C11.0346 6.81633 11.1093 6.35433 11.2586 5.925C11.4126 5.49567 11.6319 5.12467 11.9166 4.812C12.2013 4.49467 12.5489 4.24733 12.9596 4.07C13.3703 3.888 13.8323 3.797 14.3456 3.797ZM14.3736 4.714C13.7716 4.714 13.2979 4.889 12.9526 5.239C12.6073 5.58433 12.3926 6.065 12.3086 6.681H16.1656C16.1656 6.39167 16.1259 6.128 16.0466 5.89C15.9673 5.64733 15.8506 5.43967 15.6966 5.267C15.5426 5.08967 15.3536 4.95433 15.1296 4.861C14.9103 4.763 14.6583 4.714 14.3736 4.714ZM24.0884 11H23.5354C23.4141 11 23.3161 10.9813 23.2414 10.944C23.1667 10.9067 23.1177 10.8273 23.0944 10.706L22.9544 10.048C22.7677 10.216 22.5857 10.3677 22.4084 10.503C22.2311 10.6337 22.0444 10.7457 21.8484 10.839C21.6524 10.9277 21.4424 10.9953 21.2184 11.042C20.9991 11.0887 20.7541 11.112 20.4834 11.112C20.2081 11.112 19.9491 11.0747 19.7064 11C19.4684 10.9207 19.2607 10.804 19.0834 10.65C18.9061 10.496 18.7637 10.3023 18.6564 10.069C18.5537 9.831 18.5024 9.551 18.5024 9.229C18.5024 8.949 18.5794 8.68067 18.7334 8.424C18.8874 8.16267 19.1347 7.93167 19.4754 7.731C19.8207 7.53033 20.2711 7.367 20.8264 7.241C21.3817 7.11033 22.0607 7.03567 22.8634 7.017V6.464C22.8634 5.91333 22.7444 5.498 22.5064 5.218C22.2731 4.93333 21.9254 4.791 21.4634 4.791C21.1601 4.791 20.9034 4.83067 20.6934 4.91C20.4881 4.98467 20.3084 5.071 20.1544 5.169C20.0051 5.26233 19.8744 5.34867 19.7624 5.428C19.6551 5.50267 19.5477 5.54 19.4404 5.54C19.3564 5.54 19.2817 5.519 19.2164 5.477C19.1557 5.43033 19.1067 5.37433 19.0694 5.309L18.8454 4.91C19.2374 4.532 19.6597 4.24967 20.1124 4.063C20.5651 3.87633 21.0667 3.783 21.6174 3.783C22.0141 3.783 22.3664 3.84833 22.6744 3.979C22.9824 4.10967 23.2414 4.29167 23.4514 4.525C23.6614 4.75833 23.8201 5.04067 23.9274 5.372C24.0347 5.70333 24.0884 6.06733 24.0884 6.464V11ZM20.8544 10.237C21.0737 10.237 21.2744 10.216 21.4564 10.174C21.6384 10.1273 21.8087 10.0643 21.9674 9.985C22.1307 9.901 22.2847 9.80067 22.4294 9.684C22.5787 9.56733 22.7234 9.43433 22.8634 9.285V7.808C22.2894 7.82667 21.8017 7.87333 21.4004 7.948C20.9991 8.018 20.6724 8.11133 20.4204 8.228C20.1684 8.34467 19.9841 8.48233 19.8674 8.641C19.7554 8.79967 19.6994 8.977 19.6994 9.173C19.6994 9.35967 19.7297 9.52067 19.7904 9.656C19.8511 9.79133 19.9327 9.90333 20.0354 9.992C20.1381 10.076 20.2594 10.139 20.3994 10.181C20.5394 10.2183 20.6911 10.237 20.8544 10.237ZM25.9761 11V3.909H26.6901C26.8254 3.909 26.9188 3.93467 26.9701 3.986C27.0214 4.03733 27.0564 4.126 27.0751 4.252L27.1591 5.358C27.4018 4.86333 27.7004 4.47833 28.0551 4.203C28.4144 3.923 28.8344 3.783 29.3151 3.783C29.5111 3.783 29.6884 3.80633 29.8471 3.853C30.0058 3.895 30.1528 3.95567 30.2881 4.035L30.1271 4.966C30.0944 5.08267 30.0221 5.141 29.9101 5.141C29.8448 5.141 29.7444 5.12 29.6091 5.078C29.4738 5.03133 29.2848 5.008 29.0421 5.008C28.6081 5.008 28.2441 5.134 27.9501 5.386C27.6608 5.638 27.4181 6.00433 27.2221 6.485V11H25.9761Z" fill="#7A827F"/>
		</svg>
	);
}

function WindyIcon() {
	return (
		<svg width="23" height="25" viewBox="0 0 23 19" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M18.5 0.999939C16.0185 0.999939 14 3.01894 14 5.49994C14 5.77594 14.2235 5.99994 14.5 5.99994C14.7765 5.99994 15 5.77594 15 5.49994C15 3.56994 16.5705 1.99994 18.5 1.99994C20.4295 1.99994 22 3.56994 22 5.49994C22 7.42994 20.4295 8.99994 18.5 8.99994H0.5C0.224 8.99994 0 9.22394 0 9.49994C0 9.77594 0.224 9.99994 0.5 9.99994H18.5C20.9815 9.99994 23 7.98094 23 5.49994C23 3.01894 20.9815 0.999939 18.5 0.999939Z" fill="#3A423E"/>
			<path d="M9 0C7.07 0 5.5 1.57 5.5 3.5C5.5 3.776 5.724 4 6 4C6.276 4 6.5 3.776 6.5 3.5C6.5 2.1215 7.6215 1 9 1C10.3785 1 11.5 2.1215 11.5 3.5C11.5 4.8785 10.3785 6 9 6H0.5C0.224 6 0 6.224 0 6.5C0 6.776 0.224 7 0.5 7H9C10.93 7 12.5 5.43 12.5 3.5C12.5 1.57 10.93 0 9 0Z" fill="#3A423E"/>
			<path d="M17.5 12H0.5C0.224 12 0 12.224 0 12.5C0 12.776 0.224 13 0.5 13H17.5C18.8785 13 20 14.1215 20 15.5C20 16.8785 18.8785 18 17.5 18C16.1215 18 15 16.8785 15 15.5C15 15.224 14.7765 15 14.5 15C14.2235 15 14 15.224 14 15.5C14 17.43 15.5705 19 17.5 19C19.4295 19 21 17.43 21 15.5C21 13.57 19.4295 12 17.5 12Z" fill="#3A423E"/>
		</svg>
	);
}

function WindyText() {
	return (
		<svg width="38" height="14" viewBox="0 0 38 14" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M0.565773 3.909H1.54577C1.64844 3.909 1.73244 3.93467 1.79777 3.986C1.86311 4.03733 1.90744 4.098 1.93077 4.168L3.28877 8.732C3.32611 8.9 3.36111 9.06333 3.39377 9.222C3.42644 9.376 3.45444 9.53233 3.47777 9.691C3.51511 9.53233 3.55711 9.376 3.60377 9.222C3.65044 9.06333 3.69944 8.9 3.75077 8.732L5.24877 4.14C5.27211 4.07 5.31177 4.01167 5.36777 3.965C5.42844 3.91833 5.50311 3.895 5.59177 3.895H6.13077C6.22411 3.895 6.30111 3.91833 6.36177 3.965C6.42244 4.01167 6.46444 4.07 6.48777 4.14L7.95077 8.732C8.00211 8.89533 8.04644 9.05633 8.08377 9.215C8.12577 9.37367 8.16544 9.53 8.20277 9.684C8.22611 9.53 8.25644 9.369 8.29377 9.201C8.33111 9.033 8.37077 8.87667 8.41277 8.732L9.79877 4.168C9.82211 4.09333 9.86644 4.03267 9.93177 3.986C9.99711 3.93467 10.0741 3.909 10.1628 3.909H11.1008L8.80477 11H7.81777C7.69644 11 7.61244 10.9207 7.56577 10.762L5.99777 5.953C5.96044 5.84567 5.93011 5.73833 5.90677 5.631C5.88344 5.519 5.86011 5.40933 5.83677 5.302C5.81344 5.40933 5.79011 5.519 5.76677 5.631C5.74344 5.743 5.71311 5.85267 5.67577 5.96L4.08677 10.762C4.03544 10.9207 3.93977 11 3.79977 11H2.86177L0.565773 3.909ZM13.5945 3.909V11H12.3485V3.909H13.5945ZM13.8745 1.683C13.8745 1.80433 13.8489 1.91867 13.7975 2.026C13.7509 2.12867 13.6855 2.222 13.6015 2.306C13.5222 2.38533 13.4289 2.44833 13.3215 2.495C13.2142 2.54167 13.0999 2.565 12.9785 2.565C12.8572 2.565 12.7429 2.54167 12.6355 2.495C12.5329 2.44833 12.4395 2.38533 12.3555 2.306C12.2762 2.222 12.2132 2.12867 12.1665 2.026C12.1199 1.91867 12.0965 1.80433 12.0965 1.683C12.0965 1.56167 12.1199 1.44733 12.1665 1.34C12.2132 1.228 12.2762 1.13233 12.3555 1.053C12.4395 0.969 12.5329 0.903666 12.6355 0.856999C12.7429 0.810333 12.8572 0.786999 12.9785 0.786999C13.0999 0.786999 13.2142 0.810333 13.3215 0.856999C13.4289 0.903666 13.5222 0.969 13.6015 1.053C13.6855 1.13233 13.7509 1.228 13.7975 1.34C13.8489 1.44733 13.8745 1.56167 13.8745 1.683ZM15.7906 11V3.909H16.5326C16.7099 3.909 16.8219 3.99533 16.8686 4.168L16.9666 4.938C17.2746 4.59733 17.6176 4.322 17.9956 4.112C18.3782 3.902 18.8192 3.797 19.3186 3.797C19.7059 3.797 20.0466 3.86233 20.3406 3.993C20.6392 4.119 20.8866 4.301 21.0826 4.539C21.2832 4.77233 21.4349 5.05467 21.5376 5.386C21.6402 5.71733 21.6916 6.08367 21.6916 6.485V11H20.4456V6.485C20.4456 5.94833 20.3219 5.533 20.0746 5.239C19.8319 4.94033 19.4586 4.791 18.9546 4.791C18.5859 4.791 18.2406 4.87967 17.9186 5.057C17.6012 5.23433 17.3072 5.47467 17.0366 5.778V11H15.7906ZM28.5609 11C28.3835 11 28.2715 10.9137 28.2249 10.741L28.1129 9.88C27.8095 10.2487 27.4619 10.545 27.0699 10.769C26.6825 10.9883 26.2369 11.098 25.7329 11.098C25.3269 11.098 24.9582 11.021 24.6269 10.867C24.2955 10.7083 24.0132 10.4773 23.7799 10.174C23.5465 9.87067 23.3669 9.49267 23.2409 9.04C23.1149 8.58733 23.0519 8.067 23.0519 7.479C23.0519 6.95633 23.1219 6.471 23.2619 6.023C23.4019 5.57033 23.6025 5.17833 23.8639 4.847C24.1299 4.51567 24.4519 4.25667 24.8299 4.07C25.2079 3.87867 25.6372 3.783 26.1179 3.783C26.5519 3.783 26.9229 3.85767 27.2309 4.007C27.5389 4.15167 27.8142 4.357 28.0569 4.623V0.689H29.3029V11H28.5609ZM26.1459 10.09C26.5519 10.09 26.9065 9.99667 27.2099 9.81C27.5179 9.62333 27.8002 9.35967 28.0569 9.019V5.589C27.8282 5.281 27.5762 5.06633 27.3009 4.945C27.0302 4.819 26.7292 4.756 26.3979 4.756C25.7352 4.756 25.2265 4.99167 24.8719 5.463C24.5172 5.93433 24.3399 6.60633 24.3399 7.479C24.3399 7.941 24.3795 8.33767 24.4589 8.669C24.5382 8.99567 24.6549 9.26633 24.8089 9.481C24.9629 9.691 25.1519 9.845 25.3759 9.943C25.5999 10.041 25.8565 10.09 26.1459 10.09ZM33.4692 13.093C33.4272 13.1863 33.3735 13.261 33.3082 13.317C33.2475 13.373 33.1518 13.401 33.0212 13.401H32.0972L33.3922 10.587L30.4662 3.909H31.5442C31.6515 3.909 31.7355 3.937 31.7962 3.993C31.8568 4.04433 31.9012 4.10267 31.9292 4.168L33.8262 8.634C33.8682 8.73667 33.9032 8.83933 33.9312 8.942C33.9638 9.04467 33.9918 9.14967 34.0152 9.257C34.0478 9.14967 34.0805 9.04467 34.1132 8.942C34.1458 8.83933 34.1832 8.73433 34.2252 8.627L36.0662 4.168C36.0942 4.09333 36.1408 4.03267 36.2062 3.986C36.2762 3.93467 36.3508 3.909 36.4302 3.909H37.4242L33.4692 13.093Z" fill="#7A827F"/>
		</svg>
	);
}

export default ScheduleDrawer;
