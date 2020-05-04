import React from 'react';
import API from '../API/api';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import { styled } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Drawer from '@material-ui/core/Drawer';
import Modal from '@material-ui/core/Modal';
import SvgIcon from '@material-ui/core/SvgIcon';
import CloseIcon from '@material-ui/icons/Close';
import FaceIcon from '@material-ui/icons/Face';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';

import './operatorPage.css';

const styles = theme => (
  {
    table: {
    },
    largeIcon: {
      width: 60,
      height: 60
    },
    paper: {
      position: 'absolute',
      width: 700,
      height: 700,
      backgroundColor: '#E5E5E5',
    },
    tableCell: {
      borderBottom: "none"
    }
  }
);

const StyledTableHeadCell = styled(TableCell) ({
	height: 60,
	color: '#7A827F',
	fontFamily: 'Lato, sans-serif',
	fontStyle: 'normal',
	fontWeight: 900,
	fontSize: 16,
	textAlign: 'center'
});

const StyledTableNormalCell = styled(TableCell) ({
  color: '#3A423E',
  fontFamily: 'Lato',
  fontStyle: 'normal',
  fontWeight: 'normal',
  fontSize: 16,
	textAlign: 'center'
});

const StyledTableBoldCell = styled(TableCell) ({
  color: '#3A423E',
  fontFamily: 'Lato',
  fontStyle: 'bold',
  fontWeight: 'normal',
  fontSize: 16,
	textAlign: 'center'
});

class OperatorPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      onScreenData: [],
      tab: props.tab, // 'Day Shift' or 'Night Shift'
      date: props.date,
      viewType: props.viewType, // 'week' or 'day'
      data:null,
      drawer: false,
      modal: false,
      drawer_date: props.date,
      drawer_data: {
        'name' : 'Roger',
        'status': true,
        'assignments': [
          {
            'shift': 'AM',
            'route': '7A',
            'working_hrs': 10,
            'overtime_hrs':10,
            'leave_hrs': '8:00-12:00',
            'acting_7.5_hrs': 0,
            'acting_12.5_hrs': 0,
            'standby_hrs': 0,
            'holiday_hrs': 5
          }
        ]
      },
      modal_data: {
        assignments: {
          'Mon':{
            1: {
              'AM': '7A',
              'PM': '7A-1'
            },
            3: {
              'AM': '7A',
              'PM': '7A-1'
            },
            5: {
              'AM': '7A',
              'PM': '7A-1'
            }
          }
        }
      }
    }
  }

  makeMainPageAPICall(){
    if (this.props.viewType === 'week') {
      API.get("/operator/week", {
        params: {
          'date': this.props.date.toISOString().slice(0, 10)
        }})
        .then(res => res['data'])
        .then(
          (result) => {
            console.log(result)
            this.setState({data: result, onScreenData: result.day});
          },
          (error) => {
            console.log(error)
          }
        )
    }else{
      API.get("/operator/day/onduty", {
        params: {
          'date': this.props.date.toISOString().slice(0, 10)
        }})
        .then(res => res['data'])
        .then(
          (result) => {
            console.log(result)
            this.setState({data: result, onScreenData: result.day});
          },
          (error) => {
            console.log(error)
          }
        )
    }
  }

  makeDrawerAPICall(eid){
    API.get("/operator/individual/info", {
      params: {
        'employee_id': eid,
        'date': this.state.drawer_date.toISOString().slice(0, 10)
      }
    })
      .then(res => res['data'])
      .then(
        (result) => {
          const res = {
            ...result,
            employee_id: eid
          }
          this.setState({drawer_data: res})
          console.log(res)
        },
        (error) => {
          console.log('error')
        }
      )
  }

  componentDidMount() {
    this.makeMainPageAPICall();
  }

  componentDidUpdate(prevProps, prevState) {
    // changes day/night shift tab
    if (prevProps.tab!= this.props.tab && this.state.data) {
      if (this.props.tab === 'Day Shift')
        this.setState({onScreenData: this.state.data.day});
      else if (this.props.tab === 'Night Shift')
        this.setState({onScreenData: this.state.data.night});
    }
    if (prevProps.viewType != this.props.viewType){
      this.makeMainPageAPICall();
    }
    if (prevProps.date != this.props.date){
      this.makeMainPageAPICall();
    }
  }

  handleCellClick(row) {
    console.log('handleCellClick')
    this.setState({drawer: true})
    this.makeDrawerAPICall(row.employee_id)
  }

  handleModalClick(){
    this.setState({modal: true})
  }

  handleDrawerClose() {
    this.setState({drawer: false})
  }

  handleModalClose(){
    this.setState({modal: false})
  }

  handleOperatorDelete = (eid) =>{
    let params = new URLSearchParams();
		params.append('employee_id', eid);
    API({
			method: 'post',
			url: '/operator/week/remove',
			withCredentials: false,
			data: params
		}).then(res => {
			if (res['status'] == 200) {
				alert("Employee removed!");
        this.componentDidMount();
        this.handleDrawerClose();
			} else {
				alert("Error");
			}
		})
  }

  handleAddComment = (eid, comment, shift, date) => {
    let params = new URLSearchParams();
    params.append('employee_id', eid);
    params.append('date', date.toISOString().slice(0, 10));
    params.append('shift', shift);
    params.append('comment', comment);
    API({
			method: 'post',
			url: '/operator/day/comment',
			withCredentials: false,
			data: params
		}).then(res => {
			if (res['status'] == 200) {
        alert("Comment added");
        this.makeDrawerAPICall(eid)
			} else {
				alert("Error");
			}
		})
  }
  
  handleAddLeave = (eid, date, shift, start_time, end_time, reason) => {
    let params = new URLSearchParams();
    params.append('employee_id', eid);
    params.append('date', date.toISOString().slice(0, 10));
    params.append('shift', shift);
    params.append('start_time', start_time);
    params.append('end_time', end_time);
    params.append('reason', reason);
    API({
			method: 'post',
			url: '/operator/individual/add_leave',
			withCredentials: false,
			data: params
		}).then(res => {
			if (res['status'] == 200) {
        alert("Leave added");
        this.makeDrawerAPICall(eid)
			} else {
				alert("Error");
			}
		})
  }

  getIndividualTable() {
    let table = []
    var first = {}
    var second = {}
    var children = []

    if(this.state.tab == 'Day Shift'){
      if (this.state.drawer_data.assignments.length == 1){
        first = this.state.drawer_data.assignments[0].shift === 'AM' ? this.state.drawer_data.assignments[0] : null
        second = this.state.drawer_data.assignments[0].shift === 'PM' ? this.state.drawer_data.assignments[0] : null
      }
      if (this.state.drawer_data.assignments.length == 2){
        first = this.state.drawer_data.assignments[0].shift === 'AM' ? this.state.drawer_data.assignments[0] : this.state.drawer_data.assignments[1]
        second = this.state.drawer_data.assignments[0].shift === 'PM' ? this.state.drawer_data.assignments[0] : this.state.drawer_data.assignments[1]
      }
      if(!first){
        first = {'route': '', 'working_hrs': '', 'leave_hrs': ''}
      }
      if(!second){
        second = {'route': '', 'working_hrs': '', 'leave_hrs': ''}
      }
      children.push(<StyledTableHeadCell align="center">8:00AM<br/>-<br/>12:00AM</StyledTableHeadCell>)
      children.push(<StyledTableNormalCell align="center">{first.route}</StyledTableNormalCell>)
      children.push(<StyledTableNormalCell align="center">{first.working_hrs}</StyledTableNormalCell>)
      if(first.leave_hrs)
        children.push(<StyledTableNormalCell align="center">{first.leave_hrs}</StyledTableNormalCell>)
      else
        children.push(<StyledTableNormalCell align="center">
                        <AddLeaveAlertDialog
                          eid={this.state.drawer_data.employee_id}
                          shift='AM'
                          date={this.state.drawer_date}
                          name={this.state.drawer_data.name}
                          handleAddLeave={this.handleAddLeave} />
                      </StyledTableNormalCell>)
      children.push(<StyledTableNormalCell align="center">{first.comment}</StyledTableNormalCell>)
      children.push(<StyledTableNormalCell align="center">
        <AddCommentAlertDialog 
          eid={this.state.drawer_data.employee_id}
          shift='AM'
          date={this.state.drawer_date}
          name={this.state.drawer_data.name} 
          newComment={first.comment}
          handleAddComment={this.handleAddComment}/></StyledTableNormalCell>)
      table.push(<TableRow>{children}</TableRow>)
      children = []
      children.push(<StyledTableHeadCell align="center">12:00PM <br/>-<br/>4:00PM</StyledTableHeadCell>)
      children.push(<StyledTableNormalCell align="center">{second.route}</StyledTableNormalCell>)
      children.push(<StyledTableNormalCell align="center">{second.working_hrs}</StyledTableNormalCell>)
      if(second.leave_hrs)
        children.push(<StyledTableNormalCell align="center">{second.leave_hrs}</StyledTableNormalCell>)
      else
        children.push(<StyledTableNormalCell align="center">
                        <AddLeaveAlertDialog
                          eid={this.state.drawer_data.employee_id}
                          shift='PM'
                          date={this.state.drawer_date}
                          name={this.state.drawer_data.name}
                          handleAddLeave={this.handleAddLeave} />
                      </StyledTableNormalCell>)
      children.push(<StyledTableNormalCell align="center">{second.comment}</StyledTableNormalCell>)
      children.push(<StyledTableNormalCell align="center">
        <AddCommentAlertDialog 
                        eid={this.state.drawer_data.employee_id} 
                        shift='PM'
                        date={this.state.drawer_date}
                        name={this.state.drawer_data.name}
                        newComment={second.comment}
                        handleAddComment={this.handleAddComment}/>
      </StyledTableNormalCell>)
      table.push(<TableRow>{children}</TableRow>)
    }else{

    }
    return table;
  }

  createModalTable(){
    let table = []
    // Outer loop to create parent
    let assignments = this.state.modal_data.assignments;
    for (let i = 0; i < 10; i++) {
      let children = []
      //create children
      var shift = ''
      if(i % 2 === 0){
        shift = 'AM'
        children.push(<TableCell align="center">{`${Math.ceil((i + 1)/2)} week`}</TableCell>)
        children.push(<TableCell align="center">{`8-12 PM`}</TableCell>)
      }else{
        shift = 'PM'
        children.push(<TableCell align="center"></TableCell>)
        children.push(<TableCell align="center">{`12-4 PM`}</TableCell>)
      }
      let weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
      for(let j = 0; j < 5; j++){
        var route = '';
        if(assignments[weekDays[j]] && assignments[weekDays[j]][Math.ceil((i + 1)/2)] && assignments[weekDays[j]][Math.ceil((i + 1)/2)][shift]){
          route = this.state.modal_data.assignments[weekDays[j]][Math.ceil((i + 1)/2)][shift];
          children.push(<TableCell align="center">
                          <Button size="small" variant="contained" color="primary">
                            {`${route}`}
                          </Button>
                        </TableCell>)
        }else{
          children.push(<TableCell align="center"><Button size="small" variant="outlined" color="primary">+</Button></TableCell>)
        }
      }
      //Create the parent and add the children
      table.push(<TableRow>{children}</TableRow>)
    }
    return table
  }
    render() {
        const { classes } = this.props;
        let viewTypeView;
        if (this.props.viewType === 'day') {
          viewTypeView =
            <div className="content-container">
              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell></TableCell>
                          <StyledTableHeadCell size="large" align="center">Total working hrs</StyledTableHeadCell>
                          <StyledTableHeadCell size="large" align="center">Total leave hrs</StyledTableHeadCell>
                          <StyledTableHeadCell size="large" align="center">Overtime hrs</StyledTableHeadCell>
                          <StyledTableHeadCell size="large" align="center">Holiday hrs</StyledTableHeadCell>
                      </TableRow>
                      </TableHead>
                      <TableBody>
                        {this.state.onScreenData.map((row) => 
                          (
                            <TableRow key={row.employee_id}>
                              <StyledTableBoldCell className={classes.tableCell} component="th" scope="row" onClick={() => this.handleCellClick(row)}>
                                  {row.name}
                              </StyledTableBoldCell>
                              <StyledTableNormalCell className={classes.tableCell} size="large" align="center">{row.working_hrs}</StyledTableNormalCell>
                              <StyledTableNormalCell className={classes.tableCell} size="large" align="center">{row.leave_hrs}</StyledTableNormalCell>
                              <StyledTableNormalCell className={classes.tableCell} size="large" align="center">{row.overtime_hrs}</StyledTableNormalCell>
                              <StyledTableNormalCell className={classes.tableCell} size="large" align="center">{row.holiday_hrs}</StyledTableNormalCell>
                            </TableRow>
                          )
                        )}
                      </TableBody>
                  </Table>
              </TableContainer>
              <Drawer anchor='right' open={this.state.drawer}>
                <div className="operator-drawer">
                  <div className="operator-top-div">
                    <div class="close-btn">
                      <Button className="close-btn" style={{width: 30, height: 45}} onClick={() => this.handleDrawerClose()}>
                        <CloseIcon />
                      </Button>
                    </div>
                    <FaceIcon className="user-icon"/>
                    <div className="operator-top-text">
                      <div className="name-text">
                        <span>{this.state.drawer_data.name} R. Roger</span>
                      </div>
                      <div className="shift-text">
                          {this.state.tab} Operator
                      </div>
                    </div>
                    <div className="action-div">
                      <div className="action-text" onClick={() => this.handleModalClick()}>
                        <div className="align-bottom"><CalendarIcon/>Route Assignment</div>
                      </div>
                      <DeleteOperatorAlertDialog handleOperatorDelete={this.handleOperatorDelete} eid={this.state.drawer_data.employee_id}/>
                    </div>
                  </div>
                  <div>
                    <DayPicker date={this.state.drawer_date}></DayPicker>
                    <div className="drawer-table-container">
                      <TableContainer component={Paper}>
                        <Table className={classes.table} aria-label="simple table">
                            <TableHead>
                            <TableRow>
                                <StyledTableHeadCell></StyledTableHeadCell>
                                <StyledTableHeadCell align="center">Route</StyledTableHeadCell>
                                <StyledTableHeadCell align="center">Working hrs</StyledTableHeadCell>
                                <StyledTableHeadCell align="center">Leaves</StyledTableHeadCell>
                                <StyledTableHeadCell align="center">Comments</StyledTableHeadCell>
                                <StyledTableHeadCell align="center">Edit</StyledTableHeadCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                              {this.getIndividualTable()}
                            </TableBody>
                        </Table>
                      </TableContainer>
                    </div>
                  </div>
                </div>
              </Drawer>
              <Modal 
                style={{display:'flex', alignItems:'center', justifyContent:'center'}}
                open={this.state.modal} 
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description">
                <div className={classes.paper}>
                  <CloseIcon onClick={() => this.handleModalClose()}/>
                  <div id="simple-modal-title">Regular Assignment</div>
                    <TableContainer component={Paper}>
                      <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell align="center">Mon</TableCell>
                            <TableCell align="center">Tue</TableCell>
                            <TableCell align="center">Wed</TableCell>
                            <TableCell align="center">Thu</TableCell>
                            <TableCell align="center">Fri</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.createModalTable()}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                </Modal>
              </div>;
        }else if(this.props.viewType === 'week'){
          viewTypeView = 
            <div className="content-container">
              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell ></TableCell>
                          <StyledTableHeadCell align="center">Total<br/>working hrs</StyledTableHeadCell>
                          <StyledTableHeadCell align="center">Total<br/>leave hrs</StyledTableHeadCell>
                          <StyledTableHeadCell align="center">Overtime<br/>hrs</StyledTableHeadCell>
                          <StyledTableHeadCell align="center">Holiday<br/>hrs</StyledTableHeadCell>
                          <StyledTableHeadCell align="center">Total<br/>swept</StyledTableHeadCell>
                          <StyledTableHeadCell align="center">Total<br/>missed</StyledTableHeadCell>
                      </TableRow>
                      </TableHead>
                      <TableBody>
                        {this.state.onScreenData.map((row) => 
                          (
                            <TableRow key={row.employee_id}>
                            <StyledTableNormalCell className={classes.tableCell} component="th" scope="row">
                                {row.name}
                            </StyledTableNormalCell>
                            <StyledTableNormalCell className={classes.tableCell} align="center">{row.working_hrs}</StyledTableNormalCell>
                            <StyledTableNormalCell className={classes.tableCell} align="center">{row.leave_hrs}</StyledTableNormalCell>
                            <StyledTableNormalCell className={classes.tableCell} align="center">{row.overtime_hrs}</StyledTableNormalCell>
                            <StyledTableNormalCell className={classes.tableCell} align="center">{row.holiday_hrs}</StyledTableNormalCell>
                            <StyledTableNormalCell className={classes.tableCell} align="center">{row.swept_total}</StyledTableNormalCell>
                            <StyledTableNormalCell className={classes.tableCell} align="center">{row.missed_total}</StyledTableNormalCell>
                            </TableRow>
                          )
                        )}
                      </TableBody>
                  </Table>
              </TableContainer>
            </div>;
        }
        return (
          <div>
            {viewTypeView}
          </div>
        );
    }
}

class DayPicker extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div className="drawer-date-div">
				<div className="drawer-date-display">{GetDayDisplay(this.props.date)}</div>
				<div className="drawer-date-down-arrow">
					<DownArrowIcon/>
				</div>
			</div>
		);
	}
}

class AddLeaveAlertDialog extends React.Component {
  constructor(props) {
		super(props);
    this.state = {
      open: false, 
      isAvailable: false,
      start_time: '08:00',
      end_time: '12:00',
      reason: '',
    };
		this.handleClickOpen = this.handleClickOpen.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
    this.handleAddLeave = this.handleAddLeave.bind(this);
    this.handleLeaveTimeChange = this.handleLeaveTimeChange.bind(this);
    this.handleLeaveReasonChange = this.handleLeaveReasonChange.bind(this);
  }
  handleClickOpen() {
		this.setState({open: true});
	};

	handleCancel() {
		this.setState({open: false});
	}

	handleAddLeave() {
    this.setState({open: false});
    // (eid, date, shift, start_time, end_time, reason)
    console.log(this.props.eid)
    console.log(this.state.start_time)
    console.log(this.state.end_time)
    console.log(this.state.reason)
    this.props.handleAddLeave(this.props.eid, this.props.date ,this.props.shift, 
                              this.state.start_time, this.state.end_time, this.state.reason);
  };

  handleLeaveTimeChange(event) {
    let time = event.target.value;
    console.log(time)
		if(event.target.id === 'start_time'){
      this.setState({start_time: time});
    }else if (event.target.id === 'end_time'){
      this.setState({end_time: time});
    }
  }

  handleLeaveReasonChange(event) {
    let reason = event.target.value
    if (reason != '') {
			this.setState({isAvailable: true});
		} else {
			this.setState({isAvailable: false});
		}
		this.setState({reason: reason});
  }
  
  render() {
		return (
			<div>
        <div onClick={this.handleClickOpen}>
          <Button size="small" variant="outlined" color="primary" onClick={this.handleClickOpen}>+</Button>
        </div>
				<Dialog open={this.state.open}
				onClose={this.handleCancel}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description">
					<DialogTitle id="alert-dialog-title">Add Leave for {this.props.name} on {this.props.shift} shift</DialogTitle>
					<DialogContent>
            <TextField id="start_time" label="Leave from" type="time" defaultValue="08:00" onChange={this.handleLeaveTimeChange}
                       InputLabelProps={{shrink: true,}}
                       inputProps={{step: 600}}/>
            <TextField id="end_time" label="Leave to" type="time" defaultValue="12:00" onChange={this.handleLeaveTimeChange}
                       InputLabelProps={{shrink: true,}}
                       inputProps={{step: 600}}/><br/>
            <InputLabel shrink>Reason</InputLabel>
            <Select onChange={this.handleLeaveReasonChange} autoWidth>
              <MenuItem value='PBL' >Personal Businsess Leave</MenuItem>
              <MenuItem value='SICK' >Sick</MenuItem>
              <MenuItem value='VOC' >Vacation</MenuItem>
              <MenuItem value='FAM' >Family</MenuItem>
            </Select>
          </DialogContent>
					<DialogActions>
						<Button onClick={this.handleCancel} color="primary"> Cancel </Button>
						<Button onClick={this.handleAddLeave} color="primary" disabled={!this.state.isAvailable} autoFocus> Update </Button>
					</DialogActions>
				</Dialog>
			</div>
		);
	}
}


class AddCommentAlertDialog extends React.Component {
  constructor(props) {
		super(props);
    this.state = {
      open: false, 
      isAvailable: false,
      newComment: this.props.newComment
    };
		this.handleClickOpen = this.handleClickOpen.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
    this.handleAddComment = this.handleAddComment.bind(this);
    this.handleCommentChange = this.handleCommentChange.bind(this);
  }
  handleClickOpen() {
		this.setState({open: true});
	};

	handleCancel() {
		this.setState({open: false});
	}

	handleAddComment() {
		this.setState({open: false});
		this.props.handleAddComment(this.props.eid, this.state.newComment ,this.props.shift, this.props.date);
  };

  handleCommentChange(event) {
		let comment = event.target.value;
		if (comment != '') {
			this.setState({isAvailable: true});
		} else {
			this.setState({isAvailable: false});
		}
		this.setState({newComment: comment});
  }
  
  render() {
		return (
			<div>
        <div onClick={this.handleClickOpen}>
          <EditIcon onClick={this.handleClickOpen}/>
        </div>
				<Dialog open={this.state.open}
				onClose={this.handleCancel}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description">
					<DialogTitle id="alert-dialog-title">Add comment for {this.props.name} on {this.props.shift} shift</DialogTitle>
					<DialogContent>
            <TextField autoFocus margin="dense" id="comment" label="Comment" type="text" fullWidth
              defaultValue={this.state.newComment}
              onChange={this.handleCommentChange}/>
					</DialogContent>
					<DialogActions>
						<Button onClick={this.handleCancel} color="primary"> Cancel </Button>
						<Button onClick={this.handleAddComment} color="primary" disabled={!this.state.isAvailable} autoFocus>Update</Button>
					</DialogActions>
				</Dialog>
			</div>
		);
	}
}

class DeleteOperatorAlertDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {open: false};
		this.handleClickOpen = this.handleClickOpen.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.handleOperatorDelete = this.handleOperatorDelete.bind(this);
	}

	handleClickOpen() {
		this.setState({open: true});
	};

	handleCancel() {
		this.setState({open: false});
	}

	handleOperatorDelete() {
		this.setState({open: false});
		this.props.handleOperatorDelete(this.props.eid);
	};

	render() {
		return (
			<div>
				<div className="action-text" onClick={this.handleClickOpen} >
					<TrashIcon /> Remove
				</div>
        <Dialog open={this.state.open} onClose={this.handleCancel} 
          aria-labelledby="alert-dialog-title"
				  aria-describedby="alert-dialog-description">
					<DialogTitle id="alert-dialog-title">"WARNING: Are you sure to remove this Operator?"</DialogTitle>
					<DialogContent>
            <DialogContentText id="alert-dialog-description">
              This action will delete this operator forever for future schedules, remove all data about it, and cannot be undone.
            </DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={this.handleCancel} color="primary">Cancel</Button>
						<Button onClick={this.handleOperatorDelete} color="primary" autoFocus>Yes</Button>
					</DialogActions>
				</Dialog>
			</div>
		);
	}
}

function GetDayDisplay(date) {
	let month = date.getMonth() + 1;
	let day = date.getDate();
	let year = date.getYear() + 1900;
	return month + "/" + day + ", " + year;
}

function CalendarIcon() {
  return (
    <SvgIcon>
      <svg width="100%" height="100%" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.4068 1.95312H21.2315V0H19.2727V1.95312H6.3447V0H4.38591V1.95312H3.21064C1.59053 1.95312 0.272461 3.26738 0.272461 4.88281V22.0703C0.272461 23.6857 1.59053 25 3.21064 25H22.4068C24.0269 25 25.3449 23.6857 25.3449 22.0703V4.88281C25.3449 3.26738 24.0269 1.95312 22.4068 1.95312ZM23.3862 22.0703C23.3862 22.6088 22.9468 23.0469 22.4068 23.0469H3.21064C2.6706 23.0469 2.23125 22.6088 2.23125 22.0703V9.17969H23.3862V22.0703ZM23.3862 7.22656H2.23125V4.88281C2.23125 4.34434 2.6706 3.90625 3.21064 3.90625H4.38591V5.85938H6.3447V3.90625H19.2727V5.85938H21.2315V3.90625H22.4068C22.9468 3.90625 23.3862 4.34434 23.3862 4.88281V7.22656Z" fill="#7A827F"/>
        <path d="M5.95291 11.2305H3.99414V13.1836H5.95291V11.2305Z" fill="#7A827F"/>
        <path d="M9.87054 11.2305H7.91174V13.1836H9.87054V11.2305Z" fill="#7A827F"/>
        <path d="M13.7881 11.2305H11.8293V13.1836H13.7881V11.2305Z" fill="#7A827F"/>
        <path d="M17.7056 11.2305H15.7468V13.1836H17.7056V11.2305Z" fill="#7A827F"/>
        <path d="M21.6232 11.2305H19.6644V13.1836H21.6232V11.2305Z" fill="#7A827F"/>
        <path d="M5.95291 15.1367H3.99414V17.0898H5.95291V15.1367Z" fill="#7A827F"/>
        <path d="M9.87054 15.1367H7.91174V17.0898H9.87054V15.1367Z" fill="#7A827F"/>
        <path d="M13.7881 15.1367H11.8293V17.0898H13.7881V15.1367Z" fill="#7A827F"/>
        <path d="M17.7056 15.1367H15.7468V17.0898H17.7056V15.1367Z" fill="#7A827F"/>
        <path d="M5.95291 19.043H3.99414V20.9961H5.95291V19.043Z" fill="#7A827F"/>
        <path d="M9.87054 19.043H7.91174V20.9961H9.87054V19.043Z" fill="#7A827F"/>
        <path d="M13.7881 19.043H11.8293V20.9961H13.7881V19.043Z" fill="#7A827F"/>
        <path d="M17.7056 19.043H15.7468V20.9961H17.7056V19.043Z" fill="#7A827F"/>
        <path d="M21.6232 15.1367H19.6644V17.0898H21.6232V15.1367Z" fill="#7A827F"/>
      </svg>
    </SvgIcon>
  );
}

function TrashIcon() {
  return(
    <SvgIcon>
      <svg width="100%" height="100%" viewBox="0 0 23 27" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.0474 6.035L21.4495 4.248C21.2219 3.5674 20.5854 3.11009 19.866 3.11009H14.8411V1.47883C14.8411 0.663505 14.1763 0 13.3588 0H8.75721C7.93994 0 7.27492 0.663505 7.27492 1.47883V3.11009H2.25022C1.53066 3.11009 0.894155 3.5674 0.666491 4.248L0.0686173 6.035C-0.0675261 6.44183 0.00147524 6.89234 0.252896 7.24026C0.504317 7.58819 0.911095 7.79604 1.34122 7.79604H1.96615L3.34164 24.7557C3.4439 26.0141 4.51487 27 5.78024 27H16.6149C17.8801 27 18.9512 26.0141 19.0533 24.7555L20.4288 7.79604H20.7748C21.2049 7.79604 21.6117 7.58819 21.8631 7.24047C22.1146 6.89255 22.1836 6.44183 22.0474 6.035ZM8.86154 1.58203H13.2545V3.11009H8.86154V1.58203ZM17.4718 24.628C17.4359 25.0711 17.0595 25.418 16.6149 25.418H5.78024C5.33565 25.418 4.95924 25.0711 4.9233 24.628L3.55794 7.79604H18.837L17.4718 24.628ZM1.68147 6.214L2.17171 4.74857C2.18287 4.71478 2.21448 4.69212 2.25022 4.69212H19.866C19.9018 4.69212 19.9332 4.71478 19.9445 4.74857L20.4348 6.214H1.68147Z" fill="#7A827F"/>
        <path d="M14.9415 24.5717C14.9555 24.5726 14.9694 24.5728 14.9834 24.5728C15.4026 24.5728 15.753 24.2452 15.7749 23.823L16.5198 9.56365C16.5426 9.12735 16.2062 8.75512 15.7689 8.73246C15.3303 8.70919 14.9582 9.04496 14.9353 9.48125L14.1905 23.7406C14.1678 24.1768 14.5039 24.5491 14.9415 24.5717Z" fill="#7A827F"/>
        <path d="M6.37648 23.8249C6.39962 24.2466 6.74958 24.5729 7.16793 24.5729C7.18239 24.5729 7.19726 24.5724 7.21193 24.5716C7.64928 24.5479 7.98457 24.1751 7.96082 23.7388L7.18053 9.4795C7.15677 9.0432 6.78285 8.70888 6.34529 8.73277C5.90794 8.75646 5.57265 9.12931 5.5964 9.5656L6.37648 23.8249Z" fill="#7A827F"/>
        <path d="M11.067 24.5729C11.5052 24.5729 11.8603 24.2188 11.8603 23.7819V9.52258C11.8603 9.08567 11.5052 8.73157 11.067 8.73157C10.6288 8.73157 10.2737 9.08567 10.2737 9.52258V23.7819C10.2737 24.2188 10.6288 24.5729 11.067 24.5729Z" fill="#7A827F"/>
      </svg>
    </SvgIcon>
  );
}
function EditIcon() {
  return(
    <SvgIcon>
      <svg width="100%" height="100%" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.5072 0.523254C10.8083 -0.174418 9.67654 -0.174418 8.97764 0.523254L8.34443 1.15993L1.60396 7.89682L1.58963 7.91126C1.58616 7.91473 1.58616 7.91842 1.58247 7.91842C1.57531 7.92917 1.56457 7.9398 1.55751 7.95054C1.55751 7.95412 1.55382 7.95412 1.55382 7.95771C1.54666 7.96845 1.54319 7.97561 1.53592 7.98636C1.53245 7.98994 1.53245 7.99341 1.52886 7.9971C1.52528 8.00784 1.5217 8.01501 1.51801 8.02575C1.51801 8.02922 1.51454 8.02922 1.51454 8.03291L0.0190318 12.5301C-0.0248385 12.6581 0.00851191 12.7999 0.10487 12.8949C0.172578 12.9617 0.2639 12.9991 0.358915 12.9988C0.397749 12.9981 0.436247 12.992 0.473403 12.9809L4.96709 11.4818C4.97056 11.4818 4.97056 11.4818 4.97425 11.4783C4.98555 11.4749 4.99641 11.4701 5.00637 11.4639C5.00917 11.4635 5.01163 11.4623 5.01364 11.4604C5.02428 11.4532 5.0386 11.446 5.04935 11.4388C5.05998 11.4317 5.07083 11.421 5.08158 11.4138C5.08516 11.4101 5.08863 11.4101 5.08863 11.4067C5.09232 11.4031 5.09948 11.3996 5.10306 11.3923L12.4767 4.01867C13.1744 3.31976 13.1744 2.18798 12.4767 1.48918L11.5072 0.523254ZM4.8526 10.641L2.36251 8.15098L8.59489 1.9186L11.085 4.40857L4.8526 10.641ZM2.01177 8.81284L4.18716 10.9881L0.920612 12.0757L2.01177 8.81284ZM11.9723 3.51774L11.5931 3.9006L9.10287 1.4104L9.48584 1.02765C9.90474 0.609092 10.5837 0.609092 11.0027 1.02765L11.9758 2.00074C12.3916 2.42154 12.39 3.09896 11.9723 3.51774Z" fill="#7A827F"/>
      </svg>
    </SvgIcon>
  );
}

function DownArrowIcon() {
	return (
		<svg id="svg-down-arrow" width="20" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M19.6287 0.371047C19.3815 0.123614 19.0885 0 18.7498 0H1.25009C0.911336 0 0.61848 0.123614 0.371047 0.371047C0.123614 0.618753 0 0.911609 0 1.25016C0 1.58865 0.123614 1.8815 0.371047 2.129L9.12095 10.8789C9.36866 11.1263 9.66152 11.2502 10 11.2502C10.3385 11.2502 10.6316 11.1263 10.8788 10.8789L19.6287 2.12894C19.8759 1.8815 20 1.58865 20 1.25009C20 0.91161 19.8759 0.618753 19.6287 0.371047Z" fill="#7A827F"/>
		</svg>
	);
}

OperatorPage.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OperatorPage);