import React from 'react';
import API from '../API/api';
import { styled } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/styles';
import { makeStyles } from '@material-ui/core/styles';
import './vehiclePage.css';

const AddVehicleButton = styled(({viewType, ...other}) => <Button {...other}/>)({
	left: (props) => props.viewType === 'week' ? 680 : 450,
	border: 0,
	padding: 0,
	margin: 0,
	minWidth: '40px',
	position: 'absolute',
	width: 150,
	height: 35,
	top: -50,
	zIndex: 1,
});

const NoBottomTableCell = styled(({color, ...other}) => <TableCell {...other}/>)({
	color: (props) => {
		if (props.color === 'green') {
			return '#70C295';
		} else if (props.color === 'red') {
			return '#D68080';
		} else {
			return '#3A423E';
		}
	},
	fontWeight: (props) => props.bold ? 'bold' : 'normal',
	border: 0,
	borderCollapse: 'collapse',
	textAlign: 'center',
	fontSize: 16
});

const StyledTableHeadCell = styled(TableCell) ({
	height: 60,
	color: '#7A827F',
	fontFamily: 'Lato',
	fontStyle: 'normal',
	fontWeight: 900,
	fontSize: 16,
	textAlign: 'center'
});

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

class VehiclePage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			weeklyData: null,
			dailyDayData: null,
			dailyNightData: null
		};
		this.handleDelete = this.handleDelete.bind(this);
		this.handlePost = this.handlePost.bind(this);
		this.fetchVehicleData = this.fetchVehicleData.bind(this);
		this.updateStatus = this.updateStatus.bind(this);
	}

	componentDidMount() {
		this.fetchVehicleData();
	}

	componentDidUpdate(prevProps) {
		if (this.props.date !== prevProps.date) {
			this.fetchVehicleData();
		}
	}

	fetchVehicleData() {
		API.get("/vehicle/week", {
			params: {'date': GetDateFormat(this.props.date)}
		}).then(res => res['data'])
		.then((result) => {
			this.setState({weeklyData: result});
		});
		API.get("/vehicle/day", {
			params: {'date': GetDateFormat(this.props.date), 'shift': 'day'}
		}).then(res => res['data'])
		.then((result) => {
			this.setState({dailyDayData: result});
		});
		API.get("/vehicle/day", {
			params: {'date': GetDateFormat(this.props.date), 'shift': 'night'}
		}).then(res => res['data'])
		.then((result) => {
			this.setState({dailyNightData: result});
		});
	}

	handleDelete(vid) {
		let params = new URLSearchParams();
		params.append('vehicle_id', vid);
		API({
			method: 'delete',
			url: '/vehicle/action',
			withCredentials: false,
			data: params
		}).then(res => {
			if (res['status'] === 204) {
				this.fetchVehicleData();
				alert("Delete successful!");
			} else {
				alert("Delete unsuccessful!");
			}
		});
	}

	handlePost(vid) {
		let params = new URLSearchParams();
		params.append('vehicle_id', vid);
		API({
			method: 'post',
			url: '/vehicle/action',
			withCredentials: false,
			data: params
		}).then(res => {
			if (res['status'] === 201) {
				this.fetchVehicleData();
				alert("Successfully added vehicle " + vid + ".");
			} else {
				alert("Invalid vehicle ID or vehicle ID already exists!");
			}
		})
	}

	updateStatus(vid, shift, currentStat) {
		let res = this.state.dailyDayData;
		if (shift == 'night') {
			res = this.state.dailyNightData;
			res[vid]['night status'] = currentStat;
			this.setState({dailyNightData: res});
			
		} else {
			let dayShift = '8-12 status';
			if (shift == 'PM') {
				dayShift = '12-4 status';
			}
			res[vid][dayShift] = currentStat;
			this.setState({dailyDayData: res});
		}
	}

	render() {
		return (
			<div className="content-container">
				<AddVehicleDialog viewType={this.props.viewType} handlePost={this.handlePost}/>
				<TableContainer>
					<Table fullWidth={true}>
						<VehicleTableHead viewType={this.props.viewType} tab={this.props.tab}/>
						<VehicleTableBody viewType={this.props.viewType}
							tab={this.props.tab}
							weeklyData={this.state.weeklyData}
							dailyDayData={this.state.dailyDayData}
							dailyNightData={this.state.dailyNightData}
							handleDelete={this.handleDelete}
							updateStatus={this.updateStatus}/>
					</Table>
				</TableContainer>
			</div>
		);
	}
}

function VehicleTableHead (props) {
	let headRow;
	if (props.viewType === 'week') {
		headRow = (
			<TableRow>
				<StyledTableHeadCell width="150">Vehicle #</StyledTableHeadCell>
				<StyledTableHeadCell width="200">Status</StyledTableHeadCell>
				<StyledTableHeadCell width="150">Total maps swept</StyledTableHeadCell>
				<StyledTableHeadCell width="150">Available days</StyledTableHeadCell>
				<StyledTableHeadCell width="150">Out-of-service days</StyledTableHeadCell>
				<StyledTableHeadCell width="150">Delete</StyledTableHeadCell>
			</TableRow>
		);
	} else if (props.viewType === 'day' && props.tab === 'Day Shift') {
		headRow = (
			<TableRow>
				<StyledTableHeadCell width="100">Vehicle #</StyledTableHeadCell>
				<StyledTableHeadCell width="95">AM<br/>shift</StyledTableHeadCell>
				<StyledTableHeadCell width="150">AM<br/>operator</StyledTableHeadCell>
				<StyledTableHeadCell width="130">AM<br/>status</StyledTableHeadCell>
				<StyledTableHeadCell width="95">PM<br/>shift</StyledTableHeadCell>
				<StyledTableHeadCell width="150">PM<br/>operator</StyledTableHeadCell>
				<StyledTableHeadCell width="130">PM<br/>status</StyledTableHeadCell>
				<StyledTableHeadCell width="100">Comment</StyledTableHeadCell>
			</TableRow>
		);
	} else if (props.viewType === 'day' && props.tab === 'Night Shift') {
		headRow = (
			<TableRow>
				<StyledTableHeadCell width="100">Vehicle #</StyledTableHeadCell>
				<StyledTableHeadCell width="95">night<br/>shift</StyledTableHeadCell>
				<StyledTableHeadCell width="150">night<br/>operator</StyledTableHeadCell>
				<StyledTableHeadCell width="130">night<br/>status</StyledTableHeadCell>
				<StyledTableHeadCell width="100">Comment</StyledTableHeadCell>
			</TableRow>
		);
	}
	return <TableHead>{headRow}</TableHead>;
}

function VehicleTableBody (props) {
	let content;
	if (props.viewType === 'week' && props.weeklyData !== null) {
		content = Object.entries(props.weeklyData).map((value) => {
			let color = value[1]['status'] === 'available' ? 'green' : 'red';
			let status = value[1]['status'] === 'available' ? 'Available' : 'Out-of-service';
			return (
				<TableRow>
					<NoBottomTableCell size="small" bold={true}>{value[0]}</NoBottomTableCell>
					<NoBottomTableCell size="small" color={color} bold={true}>{status}</NoBottomTableCell>
					<NoBottomTableCell size="small">{value[1]['maps_swept']}</NoBottomTableCell>
					<NoBottomTableCell size="small">{value[1]['available_days']}</NoBottomTableCell>
					<NoBottomTableCell size="small">{value[1]['out_of_service_days']}</NoBottomTableCell>
					<NoBottomTableCell size="small">
						<DeleteAlertDialog handleDelete={props.handleDelete} vid={value[0]}/>
					</NoBottomTableCell>
				</TableRow>
			);
		});
	} else if (props.viewType === 'day' && props.tab === 'Day Shift' && props.dailyDayData !== null) {
		content = Object.entries(props.dailyDayData).map((value) => 
			<TableRow>
				<NoBottomTableCell size="small" bold={true}>{value[0]}</NoBottomTableCell>
				<NoBottomTableCell size="small">{value[1]['8-12 shift']}</NoBottomTableCell>
				<NoBottomTableCell size="small">{value[1]['8-12 operator']}</NoBottomTableCell>
				<NoBottomTableCell size="small"><DialogSelect status={value[1]['8-12 status']} vehicle={value[0]} shift={'AM'} updateState={props.updateStatus}/></NoBottomTableCell>
				<NoBottomTableCell size="small">{value[1]['12-4 shift']}</NoBottomTableCell>
				<NoBottomTableCell size="small">{value[1]['12-4 operator']}</NoBottomTableCell>
				<NoBottomTableCell size="small"><DialogSelect status={value[1]['12-4 status']} vehicle={value[0]} shift={'PM'} updateState={props.updateStatus}/></NoBottomTableCell>
				<NoBottomTableCell size="small"><AddCommentDialog/></NoBottomTableCell>
			</TableRow>
		);
	} else if (props.viewType === 'day' && props.tab === 'Night Shift' && props.dailyNightData !== null) {
		content = Object.entries(props.dailyNightData).map((value) => 
			<TableRow>
				<NoBottomTableCell size="small" bold={true}>{value[0]}</NoBottomTableCell>
				<NoBottomTableCell size="small">{value[1]['night shift']}</NoBottomTableCell>
				<NoBottomTableCell size="small">{value[1]['night operator']}</NoBottomTableCell>
				<NoBottomTableCell size="small"><DialogSelect status={value[1]['night status']} vehicle={value[0]} shift={'night'} updateState={props.updateStatus}/></NoBottomTableCell>
				<NoBottomTableCell size="small"><AddCommentDialog/></NoBottomTableCell>
			</TableRow>
		);
	}
	return <TableBody>{content}</TableBody>;
}

class AddVehicleDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {open: false,
			isAvailable: false,
			newVID: ''};
		this.handleClickOpen = this.handleClickOpen.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.handlePost = this.handlePost.bind(this);
		this.handleVIDChange = this.handleVIDChange.bind(this);
	}

	handleClickOpen() {
		this.setState({open: true});
	};

	handleCancel() {
		this.setState({open: false});
	}

	handlePost(event) {
		event.preventDefault();
		let vid = this.state.newVID;
		if (vid != '') {
			this.props.handlePost(vid);
		}
		this.setState({open: false,
			newVID: ''});
	};

	handleVIDChange(event) {
		let vid = event.target.value;
		if (vid != '') {
			this.setState({isAvailable: true});
		} else {
			this.setState({isAvailable: false});
		}
		this.setState({newVID: vid});
	}

	render() {
		return (
			<div>
				<AddVehicleButton color="primary" viewType={this.props.viewType} onClick={this.handleClickOpen}>
					<AddVehicleIcon/>
				</AddVehicleButton>
			<Dialog open={this.state.open} onClose={this.handleCancel} aria-labelledby="form-dialog-title">
			<DialogTitle id="form-dialog-title">Add Vehicle</DialogTitle>
			<DialogContent>
			<DialogContentText>
			Fill in the vehicle information.
			</DialogContentText>
			<TextField
				required
				autoFocus
				id="vid"
				label="Vehicle ID"
				fullWidth
				onChange={this.handleVIDChange}
			/>
			</DialogContent>
			<DialogActions>
			<Button onClick={this.handleCancel} color="primary">
			Cancel
			</Button>
			<Button onClick={this.handlePost} disabled={!this.state.isAvailable} color="primary">
			Submit
			</Button>
			</DialogActions>
			</Dialog>
			</div>
		);
	}
}

class DeleteAlertDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {open: false};
		this.handleClickOpen = this.handleClickOpen.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
	}

	handleClickOpen() {
		this.setState({open: true});
	};

	handleCancel() {
		this.setState({open: false});
	}

	handleDelete() {
		this.setState({open: false});
		this.props.handleDelete(this.props.vid);
	};

	render() {
		return (
			<div>
				<Button onClick={this.handleClickOpen} >
					<TrashIcon />
				</Button>
				<Dialog open={this.state.open}
				onClose={this.handleCancel}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description">
					<DialogTitle id="alert-dialog-title">{"WARNING: Are you sure to remove this vehicle?"}</DialogTitle>
					<DialogContent>
					<DialogContentText id="alert-dialog-description">
					This action will delete this vehicle forever for future schedules, remove all data about it, and cannot be undone.
					</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={this.handleCancel} color="primary">
						Cancel
						</Button>
						<Button onClick={this.handleDelete} color="primary" autoFocus>
						Yes
						</Button>
					</DialogActions>
				</Dialog>
			</div>
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
					<DialogTitle id="alert-dialog-title">{"Add comment for this vehicle."}</DialogTitle>
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

///////////////////////////For daily status button drop down /////////////////////////////////

const statusStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

function DialogSelect(props) {
  const classes = statusStyles();
  const [open, setOpen] = React.useState(false);
  const [status, setStatus] = React.useState('');

  const vehicleID = props.vehicle;
  const shift = props.shift;
  var currentStat = props.status;
  var optionValue = 0;

  const handleChange = (event) => {
  	optionValue = Number(event.target.value);
    setStatus(Number(event.target.value) || '');
    console.log(optionValue); // 10 -> available, 20 -> out-of-service, 0 -> nothing happened
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
  	if (optionValue == 20) {
  		currentStat = "out-of-service";
  	} else if (optionValue == 10) {
  		currentStat = "available";
  	}
  	props.updateState(vehicleID, shift, currentStat);
  	// add PUT API to update vehicle status
    setOpen(false);
  };

  return (
    <div>
      <DailyStatus handleClickOpen={handleClickOpen} status={currentStat}/>
      <Dialog disableBackdropClick disableEscapeKeyDown open={open} onClose={handleClose}>
        <DialogTitle>Change the status</DialogTitle>
        <DialogContent>
          <form className={classes.container}>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="demo-dialog-native">Status</InputLabel>
              <Select
                native
                value={status}
                onChange={handleChange}
                input={<Input id="demo-dialog-native" />}>
                <option aria-label="None" value="" />
                <option value={10}>Available</option>
                <option value={20}>Out-of-service</option>
              </Select>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
///////////////////////////For daily status button drop down /////////////////////////////////

function DailyStatus(props) {
	if (props.status == 'in-use') {
		return <InUseIcon/>;
	} else if (props.status === 'available') {
		return <Button onClick={props.handleClickOpen}><AvailableIcon/></Button>;
	} else if (props.status === 'out-of-service') {
		return <Button onClick={props.handleClickOpen}><OutOfServiceIcon/></Button>;
	} else {
		return;
	}
}

function TrashIcon() {
	return (
		<svg width="15" height="19" viewBox="0 0 15 19" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M14.9535 4.10505L14.548 2.88952C14.3935 2.42657 13.9618 2.11551 13.474 2.11551H10.0658V1.00591C10.0658 0.451322 9.61495 0 9.0605 0H5.9395C5.38519 0 4.93415 0.451322 4.93415 1.00591V2.11551H1.52619C1.03816 2.11551 0.606452 2.42657 0.452042 2.88952L0.0465391 4.10505C-0.045799 4.38178 0.00100057 4.68822 0.171525 4.92488C0.342049 5.16154 0.617942 5.30292 0.909669 5.30292H1.33353L2.26644 16.839C2.33579 17.695 3.06217 18.3656 3.92039 18.3656H11.2689C12.127 18.3656 12.8535 17.695 12.9227 16.8389L13.8556 5.30292H14.0903C14.3821 5.30292 14.658 5.16154 14.8285 4.92502C14.999 4.68836 15.0458 4.38178 14.9535 4.10505ZM6.01026 1.07611H8.98974V2.11551H6.01026V1.07611ZM11.8501 16.7521C11.8257 17.0535 11.5704 17.2895 11.2689 17.2895H3.92039C3.61886 17.2895 3.36356 17.0535 3.33918 16.7521L2.41314 5.30292H12.776L11.8501 16.7521ZM1.14044 4.22681L1.47294 3.23001C1.48051 3.20703 1.50195 3.19162 1.52619 3.19162H13.474C13.4982 3.19162 13.5195 3.20703 13.5272 3.23001L13.8597 4.22681H1.14044Z" fill="#7A827F"/>
			<path d="M10.134 16.714C10.1435 16.7145 10.1529 16.7147 10.1624 16.7147C10.4467 16.7147 10.6844 16.4919 10.6992 16.2046L11.2045 6.50536C11.2199 6.20859 10.9918 5.9554 10.6951 5.93998C10.3977 5.92415 10.1453 6.15254 10.1298 6.44932L9.62464 16.1486C9.60923 16.4454 9.8372 16.6986 10.134 16.714Z" fill="#7A827F"/>
			<path d="M4.32475 16.2061C4.34045 16.4929 4.57781 16.7148 4.86155 16.7148C4.87136 16.7148 4.88144 16.7145 4.89139 16.714C5.18802 16.6979 5.41544 16.4443 5.39932 16.1475L4.8701 6.4482C4.85398 6.15143 4.60037 5.92402 4.3036 5.94027C4.00697 5.95639 3.77955 6.21 3.79567 6.50677L4.32475 16.2061Z" fill="#7A827F"/>
			<path d="M7.50601 16.7148C7.8032 16.7148 8.04407 16.474 8.04407 16.1768V6.47751C8.04407 6.18032 7.8032 5.93945 7.50601 5.93945C7.20882 5.93945 6.96796 6.18032 6.96796 6.47751V16.1768C6.96796 16.474 7.20882 16.7148 7.50601 16.7148Z" fill="#7A827F"/>
		</svg>
	);
}

function CommentIcon() {
	return (
		<svg width="15" height="19" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M13.2776 0.603755C12.4712 -0.201252 11.1652 -0.201252 10.3588 0.603755L9.62819 1.33838L1.85072 9.11172L1.83419 9.12838C1.83019 9.13238 1.83019 9.13664 1.82593 9.13664C1.81766 9.14904 1.80527 9.16131 1.79713 9.1737C1.79713 9.17784 1.79287 9.17784 1.79287 9.18197C1.78461 9.19436 1.7806 9.20263 1.77221 9.21503C1.76821 9.21916 1.76821 9.22316 1.76407 9.22742C1.75994 9.23982 1.75581 9.24808 1.75155 9.26048C1.75155 9.26448 1.74755 9.26448 1.74755 9.26874L0.0219598 14.4578C-0.0286598 14.6055 0.00982144 14.7691 0.121004 14.8787C0.199128 14.9558 0.3045 14.999 0.414133 14.9986C0.458941 14.9978 0.503362 14.9908 0.546234 14.9779L5.73126 13.2482C5.73526 13.2482 5.73526 13.2482 5.73952 13.2442C5.75256 13.2403 5.76509 13.2348 5.77658 13.2275C5.77981 13.2271 5.78265 13.2257 5.78497 13.2235C5.79724 13.2153 5.81377 13.2069 5.82617 13.1986C5.83844 13.1905 5.85096 13.1781 5.86336 13.1698C5.86749 13.1655 5.87149 13.1655 5.87149 13.1615C5.87575 13.1574 5.88402 13.1534 5.88815 13.145L14.3962 4.63692C15.2013 3.8305 15.2013 2.52459 14.3962 1.71829L13.2776 0.603755ZM5.59915 12.278L2.72598 9.40498L9.91719 2.21377L12.7904 5.08682L5.59915 12.278ZM2.32128 10.1687L4.83134 12.6786L1.06224 13.9335L2.32128 10.1687ZM13.8142 4.05893L13.3766 4.50069L10.5033 1.62738L10.9452 1.18575C11.4285 0.702799 12.212 0.702799 12.6955 1.18575L13.8183 2.30855C14.298 2.79409 14.2962 3.57572 13.8142 4.05893Z" fill="#7A827F"/>
		</svg>
	);
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

function AddVehicleIcon() {
	return (
		<svg width="151" height="35" viewBox="0 0 151 35" fill="none" xmlns="http://www.w3.org/2000/svg">
		<rect x="0.0627441" width="150" height="35" rx="5" fill="#70C295"/>
		<path d="M66.5549 23H65.0989C64.9355 23 64.8002 22.9603 64.6929 22.881C64.5902 22.797 64.5155 22.6943 64.4689 22.573L63.7129 20.508H59.5199L58.7639 22.573C58.7265 22.6803 58.6519 22.7783 58.5399 22.867C58.4325 22.9557 58.2995 23 58.1409 23H56.6779L60.6539 12.878H62.5789L66.5549 23ZM60.0029 19.178H63.2299L61.9979 15.811C61.9419 15.6617 61.8789 15.4867 61.8089 15.286C61.7435 15.0807 61.6782 14.859 61.6129 14.621C61.5475 14.859 61.4822 15.0807 61.4169 15.286C61.3562 15.4913 61.2955 15.671 61.2349 15.825L60.0029 19.178ZM72.5533 23C72.3293 23 72.1823 22.895 72.1123 22.685L71.9723 21.992C71.823 22.16 71.6667 22.3117 71.5033 22.447C71.34 22.5823 71.1627 22.699 70.9713 22.797C70.7847 22.895 70.5817 22.9697 70.3623 23.021C70.1477 23.077 69.9143 23.105 69.6623 23.105C69.2703 23.105 68.911 23.0233 68.5843 22.86C68.2577 22.6967 67.9753 22.461 67.7373 22.153C67.504 21.8403 67.322 21.4553 67.1913 20.998C67.0653 20.5407 67.0023 20.018 67.0023 19.43C67.0023 18.898 67.0747 18.4033 67.2193 17.946C67.364 17.4887 67.5717 17.092 67.8423 16.756C68.113 16.42 68.4373 16.1587 68.8153 15.972C69.1933 15.7807 69.618 15.685 70.0893 15.685C70.4907 15.685 70.8337 15.7503 71.1183 15.881C71.403 16.007 71.6573 16.1773 71.8813 16.392V12.598H73.6103V23H72.5533ZM70.2503 21.733C70.6097 21.733 70.9153 21.6583 71.1673 21.509C71.4193 21.3597 71.6573 21.1473 71.8813 20.872V17.652C71.6853 17.414 71.4707 17.246 71.2373 17.148C71.0087 17.05 70.7613 17.001 70.4953 17.001C70.234 17.001 69.996 17.05 69.7813 17.148C69.5713 17.246 69.3917 17.3953 69.2423 17.596C69.0977 17.792 68.9857 18.044 68.9063 18.352C68.827 18.6553 68.7873 19.0147 68.7873 19.43C68.7873 19.85 68.82 20.207 68.8853 20.501C68.9553 20.7903 69.0533 21.0283 69.1793 21.215C69.3053 21.397 69.4593 21.53 69.6413 21.614C69.8233 21.6933 70.0263 21.733 70.2503 21.733ZM80.5377 23C80.3137 23 80.1667 22.895 80.0967 22.685L79.9567 21.992C79.8074 22.16 79.651 22.3117 79.4877 22.447C79.3244 22.5823 79.147 22.699 78.9557 22.797C78.769 22.895 78.566 22.9697 78.3467 23.021C78.132 23.077 77.8987 23.105 77.6467 23.105C77.2547 23.105 76.8954 23.0233 76.5687 22.86C76.242 22.6967 75.9597 22.461 75.7217 22.153C75.4884 21.8403 75.3064 21.4553 75.1757 20.998C75.0497 20.5407 74.9867 20.018 74.9867 19.43C74.9867 18.898 75.059 18.4033 75.2037 17.946C75.3484 17.4887 75.556 17.092 75.8267 16.756C76.0974 16.42 76.4217 16.1587 76.7997 15.972C77.1777 15.7807 77.6024 15.685 78.0737 15.685C78.475 15.685 78.818 15.7503 79.1027 15.881C79.3874 16.007 79.6417 16.1773 79.8657 16.392V12.598H81.5947V23H80.5377ZM78.2347 21.733C78.594 21.733 78.8997 21.6583 79.1517 21.509C79.4037 21.3597 79.6417 21.1473 79.8657 20.872V17.652C79.6697 17.414 79.455 17.246 79.2217 17.148C78.993 17.05 78.7457 17.001 78.4797 17.001C78.2184 17.001 77.9804 17.05 77.7657 17.148C77.5557 17.246 77.376 17.3953 77.2267 17.596C77.082 17.792 76.97 18.044 76.8907 18.352C76.8114 18.6553 76.7717 19.0147 76.7717 19.43C76.7717 19.85 76.8044 20.207 76.8697 20.501C76.9397 20.7903 77.0377 21.0283 77.1637 21.215C77.2897 21.397 77.4437 21.53 77.6257 21.614C77.8077 21.6933 78.0107 21.733 78.2347 21.733ZM85.2791 12.878H86.7981C86.9614 12.878 87.0944 12.9177 87.1971 12.997C87.2998 13.0763 87.3768 13.179 87.4281 13.305L89.8081 19.479C89.8874 19.6797 89.9621 19.9013 90.0321 20.144C90.1068 20.382 90.1768 20.634 90.2421 20.9C90.3494 20.3633 90.4824 19.8897 90.6411 19.479L93.0141 13.305C93.0561 13.1977 93.1308 13.0997 93.2381 13.011C93.3454 12.9223 93.4784 12.878 93.6371 12.878H95.1561L91.0681 23H89.3671L85.2791 12.878ZM98.2212 15.706C98.6739 15.706 99.0892 15.7783 99.4672 15.923C99.8499 16.0677 100.179 16.28 100.454 16.56C100.73 16.8353 100.944 17.176 101.098 17.582C101.252 17.9833 101.329 18.443 101.329 18.961C101.329 19.0917 101.322 19.2013 101.308 19.29C101.299 19.374 101.278 19.4417 101.245 19.493C101.217 19.5397 101.178 19.5747 101.126 19.598C101.075 19.6167 101.01 19.626 100.93 19.626H96.4922C96.5436 20.3633 96.7419 20.9047 97.0872 21.25C97.4326 21.5953 97.8899 21.768 98.4592 21.768C98.7392 21.768 98.9796 21.7353 99.1802 21.67C99.3856 21.6047 99.5629 21.5323 99.7122 21.453C99.8662 21.3737 99.9992 21.3013 100.111 21.236C100.228 21.1707 100.34 21.138 100.447 21.138C100.517 21.138 100.578 21.152 100.629 21.18C100.681 21.208 100.725 21.2477 100.762 21.299L101.266 21.929C101.075 22.153 100.86 22.342 100.622 22.496C100.384 22.6453 100.135 22.7667 99.8732 22.86C99.6166 22.9487 99.3529 23.0117 99.0822 23.049C98.8162 23.0863 98.5572 23.105 98.3052 23.105C97.8059 23.105 97.3416 23.0233 96.9122 22.86C96.4829 22.692 96.1096 22.447 95.7922 22.125C95.4749 21.7983 95.2252 21.397 95.0432 20.921C94.8612 20.4403 94.7702 19.885 94.7702 19.255C94.7702 18.765 94.8496 18.3053 95.0082 17.876C95.1669 17.442 95.3932 17.0663 95.6872 16.749C95.9859 16.427 96.3476 16.1727 96.7722 15.986C97.2016 15.7993 97.6846 15.706 98.2212 15.706ZM98.2562 16.945C97.7522 16.945 97.3579 17.0873 97.0732 17.372C96.7886 17.6567 96.6066 18.0603 96.5272 18.583H99.7752C99.7752 18.359 99.7449 18.149 99.6842 17.953C99.6236 17.7523 99.5302 17.5773 99.4042 17.428C99.2782 17.2787 99.1196 17.162 98.9282 17.078C98.7369 16.9893 98.5129 16.945 98.2562 16.945ZM102.732 23V12.598H104.461V16.595C104.741 16.329 105.049 16.1143 105.385 15.951C105.721 15.7877 106.115 15.706 106.568 15.706C106.96 15.706 107.307 15.7737 107.611 15.909C107.914 16.0397 108.166 16.2263 108.367 16.469C108.572 16.707 108.726 16.994 108.829 17.33C108.936 17.6613 108.99 18.0277 108.99 18.429V23H107.261V18.429C107.261 17.9903 107.158 17.652 106.953 17.414C106.752 17.1713 106.449 17.05 106.043 17.05C105.744 17.05 105.464 17.1177 105.203 17.253C104.941 17.3883 104.694 17.5727 104.461 17.806V23H102.732ZM112.53 15.818V23H110.801V15.818H112.53ZM112.789 13.725C112.789 13.8743 112.758 14.0143 112.698 14.145C112.637 14.2757 112.555 14.39 112.453 14.488C112.355 14.586 112.238 14.6653 112.103 14.726C111.967 14.782 111.823 14.81 111.669 14.81C111.519 14.81 111.377 14.782 111.242 14.726C111.111 14.6653 110.997 14.586 110.899 14.488C110.801 14.39 110.721 14.2757 110.661 14.145C110.605 14.0143 110.577 13.8743 110.577 13.725C110.577 13.571 110.605 13.4263 110.661 13.291C110.721 13.1557 110.801 13.039 110.899 12.941C110.997 12.843 111.111 12.766 111.242 12.71C111.377 12.6493 111.519 12.619 111.669 12.619C111.823 12.619 111.967 12.6493 112.103 12.71C112.238 12.766 112.355 12.843 112.453 12.941C112.555 13.039 112.637 13.1557 112.698 13.291C112.758 13.4263 112.789 13.571 112.789 13.725ZM119.537 17.337C119.485 17.4023 119.434 17.4537 119.383 17.491C119.336 17.5283 119.266 17.547 119.173 17.547C119.084 17.547 118.998 17.5213 118.914 17.47C118.83 17.414 118.729 17.3533 118.613 17.288C118.496 17.218 118.356 17.1573 118.193 17.106C118.034 17.05 117.836 17.022 117.598 17.022C117.294 17.022 117.028 17.078 116.8 17.19C116.571 17.2973 116.38 17.4537 116.226 17.659C116.076 17.8643 115.964 18.114 115.89 18.408C115.815 18.6973 115.778 19.0263 115.778 19.395C115.778 19.7777 115.817 20.1183 115.897 20.417C115.981 20.7157 116.1 20.9677 116.254 21.173C116.408 21.3737 116.594 21.5277 116.814 21.635C117.033 21.7377 117.28 21.789 117.556 21.789C117.831 21.789 118.053 21.7563 118.221 21.691C118.393 21.621 118.538 21.5463 118.655 21.467C118.771 21.383 118.872 21.3083 118.956 21.243C119.044 21.173 119.142 21.138 119.25 21.138C119.39 21.138 119.495 21.1917 119.565 21.299L120.062 21.929C119.87 22.153 119.663 22.342 119.439 22.496C119.215 22.6453 118.981 22.7667 118.739 22.86C118.501 22.9487 118.253 23.0117 117.997 23.049C117.74 23.0863 117.486 23.105 117.234 23.105C116.79 23.105 116.373 23.0233 115.981 22.86C115.589 22.692 115.246 22.4493 114.952 22.132C114.662 21.8147 114.431 21.4273 114.259 20.97C114.091 20.508 114.007 19.983 114.007 19.395C114.007 18.8677 114.081 18.38 114.231 17.932C114.385 17.4793 114.609 17.0897 114.903 16.763C115.197 16.4317 115.561 16.1727 115.995 15.986C116.429 15.7993 116.928 15.706 117.493 15.706C118.029 15.706 118.498 15.7923 118.9 15.965C119.306 16.1377 119.67 16.385 119.992 16.707L119.537 17.337ZM123.002 12.598V23H121.273V12.598H123.002ZM127.93 15.706C128.383 15.706 128.798 15.7783 129.176 15.923C129.559 16.0677 129.888 16.28 130.163 16.56C130.439 16.8353 130.653 17.176 130.807 17.582C130.961 17.9833 131.038 18.443 131.038 18.961C131.038 19.0917 131.031 19.2013 131.017 19.29C131.008 19.374 130.987 19.4417 130.954 19.493C130.926 19.5397 130.887 19.5747 130.835 19.598C130.784 19.6167 130.719 19.626 130.639 19.626H126.201C126.253 20.3633 126.451 20.9047 126.796 21.25C127.142 21.5953 127.599 21.768 128.168 21.768C128.448 21.768 128.689 21.7353 128.889 21.67C129.095 21.6047 129.272 21.5323 129.421 21.453C129.575 21.3737 129.708 21.3013 129.82 21.236C129.937 21.1707 130.049 21.138 130.156 21.138C130.226 21.138 130.287 21.152 130.338 21.18C130.39 21.208 130.434 21.2477 130.471 21.299L130.975 21.929C130.784 22.153 130.569 22.342 130.331 22.496C130.093 22.6453 129.844 22.7667 129.582 22.86C129.326 22.9487 129.062 23.0117 128.791 23.049C128.525 23.0863 128.266 23.105 128.014 23.105C127.515 23.105 127.051 23.0233 126.621 22.86C126.192 22.692 125.819 22.447 125.501 22.125C125.184 21.7983 124.934 21.397 124.752 20.921C124.57 20.4403 124.479 19.885 124.479 19.255C124.479 18.765 124.559 18.3053 124.717 17.876C124.876 17.442 125.102 17.0663 125.396 16.749C125.695 16.427 126.057 16.1727 126.481 15.986C126.911 15.7993 127.394 15.706 127.93 15.706ZM127.965 16.945C127.461 16.945 127.067 17.0873 126.782 17.372C126.498 17.6567 126.316 18.0603 126.236 18.583H129.484C129.484 18.359 129.454 18.149 129.393 17.953C129.333 17.7523 129.239 17.5773 129.113 17.428C128.987 17.2787 128.829 17.162 128.637 17.078C128.446 16.9893 128.222 16.945 127.965 16.945Z" fill="white"/>
		<path d="M42.4126 10.9347H37.0431V8H19V25.1274H22.3041C22.6734 26.7694 24.1423 28 25.8941 28C27.6459 28 29.1147 26.7694 29.484 25.1274H35.5177C35.887 26.7694 37.3559 28 39.1077 28C40.8595 28 42.3283 26.7694 42.6976 25.1274H46.5763V17.1809L42.4126 10.9347ZM25.8941 26.3842C24.7556 26.3842 23.8295 25.458 23.8295 24.3195C23.8295 23.1811 24.7556 22.2549 25.8941 22.2549C27.0325 22.2549 27.9587 23.1811 27.9587 24.3195C27.9587 25.458 27.0325 26.3842 25.8941 26.3842ZM35.4273 23.5116H29.484C29.1147 21.8698 27.6459 20.6391 25.8941 20.6391C24.1423 20.6391 22.6734 21.8698 22.3041 23.5116H20.6158V9.6158H35.4273V23.5116ZM39.1077 26.3842C37.9693 26.3842 37.0431 25.458 37.0431 24.3195C37.0431 23.1811 37.9692 22.2549 39.1077 22.2549C40.2461 22.2549 41.1723 23.1811 41.1723 24.3195C41.1723 25.458 40.2462 26.3842 39.1077 26.3842ZM44.9605 23.5116H42.6976C42.3283 21.8698 40.8595 20.6391 39.1077 20.6391C38.343 20.6391 37.6322 20.8737 37.0431 21.2745V12.5505H41.5478L44.6418 17.1921H40.4901V14.553H38.8743V18.8079H44.9605V23.5116Z" fill="white"/>
		</svg>
	);
}

export default VehiclePage;
