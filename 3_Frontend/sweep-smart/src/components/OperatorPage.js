import React from 'react';
import API from '../API/api';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Drawer from '@material-ui/core/Drawer';
import SvgIcon from '@material-ui/core/SvgIcon';
import CloseIcon from '@material-ui/icons/Close';
import FaceIcon from '@material-ui/icons/Face';

import './operatorPage.css';
import { amber } from '@material-ui/core/colors';

const styles = theme => (
  {
    table: {
    },
    largeIcon: {
      width: 60,
      height: 60,
    },
  
  }
);

class OperatorPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      onScreenData: [],
      tab: props.tab,
      date: props.date,
      data:null,
      drawer: false,
      drawer_date: new Date(),
      drawer_data: {
        'name' : 'Roger',
        'status': true,
        'assignments': [
          {
            'shift': 'AM',
            'route': '7A',
            'working_hrs': 10,
            'overtime_hrs':10,
            'leave_hrs': 20,
            'acting_7.5_hrs': 0,
            'acting_12.5_hrs': 0,
            'standby_hrs': 0,
            'holiday_hrs': 5
          }
        ],
        'history' : [{
          'week': '1/6-1/10',
          'total_scheduled': 20,
          'total_swept': 18,
          'success_rate': 95,
          'total_working_hrs': 100,
          'total_leave_hrs': 10}
        ]
      }
    }
  }
  componentDidMount() {
    API.get("/operator/week")
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

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.tab!= this.props.tab && this.state.data) {
      if (this.props.tab === 'Day Shift')
        this.setState({onScreenData: this.state.data.day});
      else if (this.props.tab === 'Night Shift')
          this.setState({onScreenData: this.state.data.night});
    }
  }

  handleCellClick(row) {
    this.setState({drawer: true})
    API.get("/operator/individual/info", {
      params: {
      'employee_id': row.employee_id,
      'date': '2010-04-13'
      }
    })
      .then(res => res['data'])
      .then(
        (result) => {
          console.log(result)
          this.setState({drawer_data: result})
        },
        (error) => {
          this.setState({drawer_data: {
            'name' : 'Roger',
            'status': true,
            'assignments': [
              {
                'shift': 'AM',
                'route': '7A',
                'working_hrs': 10,
                'overtime_hrs':10,
                'leave_hrs': 20,
                'acting_7.5_hrs': 0,
                'acting_12.5_hrs': 0,
                'standby_hrs': 0,
                'holiday_hrs': 5
              }
            ]
          }})
        }
      )
  }

  handleDrawerClose() {
    this.setState({drawer: false})
  }

    render() {
        const { classes } = this.props;
        return (
            <div className="content-container">
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell ></TableCell>
                            <TableCell align="center">Total<br/>Working Hrs</TableCell>
                            <TableCell align="center">Total Leave Hrs</TableCell>
                            <TableCell align="center">Acting Hrs</TableCell>
                            <TableCell align="center">Standby Hrs</TableCell>
                            <TableCell align="center">Overtime Hrs</TableCell>
                            <TableCell align="center">Holiday Hrs</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                          {this.state.onScreenData.map((row) => 
                            (
                              <TableRow key={row.name}>
                              <TableCell component="th" scope="row" onClick={() => this.handleCellClick(row)}>
                                  {row.name}
                              </TableCell>
                              <TableCell align="center">{row.working_hrs}</TableCell>
                              <TableCell align="center">{row.leave_hrs}</TableCell>
                              <TableCell align="center">{row.acting_hrs}</TableCell>
                              <TableCell align="center">{row.standby_hrs}</TableCell>
                              <TableCell align="center">{row.overtime_hrs}</TableCell>
                              <TableCell align="center">{row.holiday_hrs}</TableCell>
                              <TableCell align="center">{row.is_reviewed}</TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Drawer anchor='right' open={this.state.drawer}>
                  <CloseIcon onClick={() => this.handleDrawerClose()}/>
                  <div className="operator-top-div">
                    <FaceIcon className="user-icon"/>
                    <div className="name-text">
                      {this.state.drawer_data.name}
                      <div className="shift-text">
                        Day-shift Operator
                      </div>
                    </div>
                    <div>
                      <div className="action-div"><CalendarIcon/>Route Assignment</div>
                      <div className="action-div"><TrashIcon/>Remove</div>
                    </div>
                  </div>
                  <div>
                    <DayPicker date={this.state.drawer_date}></DayPicker>
                    <TableContainer component={Paper}>
                      <Table className={classes.table} aria-label="simple table">
                          <TableHead>
                          <TableRow>
                              <TableCell ></TableCell>
                              <TableCell align="center">Route</TableCell>
                              <TableCell align="center">Working hrs</TableCell>
                              <TableCell align="center">Leaves</TableCell>
                              <TableCell align="center">Comment</TableCell>
                          </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell align="center">8:00AM - 12:00AM</TableCell>
                              <TableCell align="center">7A-1</TableCell>
                              <TableCell align="center">20</TableCell>
                            </TableRow>
                          </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                  <div className="work-history-div">
                    <div className="title-div">Work History</div>
                      <TableContainer component={Paper}>
                        <Table className={classes.table} aria-label="simple table">
                          <TableHead>
                          <TableRow>
                              <TableCell align="center">Week</TableCell>
                              <TableCell align="center">Total scheduled</TableCell>
                              <TableCell align="center">Total swept</TableCell>
                              <TableCell align="center">Sucess rate</TableCell>
                              <TableCell align="center"> Total working hrs</TableCell>
                              <TableCell align="center"> Total leave hrs</TableCell>
                          </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell align="center">1/6-1/10</TableCell>
                              <TableCell align="center">5</TableCell>
                              <TableCell align="center">7</TableCell>
                              <TableCell align="center">95%</TableCell>
                              <TableCell align="center">40</TableCell>
                              <TableCell align="center">40</TableCell>
                            </TableRow>
                          </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                </Drawer>
                
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
			<div className="day-picker">
				<div className="day-display">{GetDayDisplay(this.props.date)}</div>
				<div className="day-picker-arrow">
					<DownArrowIcon/>
				</div>
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