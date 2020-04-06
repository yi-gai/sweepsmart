import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const styles = theme => (
  {
    table: {
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
      data:null
    }
  }

  componentDidMount() {
    fetch("/operator/day/onduty")
      .then(res => res.json())
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
    if (prevProps.tab!= this.props.tab) {
      if (this.props.tab === 'Day Shift')
        this.setState({onScreenData: this.state.data.day});
      else if (this.props.tab === 'Night Shift')
        this.setState({onScreenData: this.state.data.night});
    }
  }

    render() {
        const { classes } = this.props;
        return (
            <div className="content-container">
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
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
                              <TableCell component="th" scope="row">
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
            </div>
        );
    }
}

OperatorPage.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OperatorPage);