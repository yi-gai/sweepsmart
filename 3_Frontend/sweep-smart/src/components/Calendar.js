import React, { Component, useState } from 'react';
// import { render } from "react-dom";
// import DatePicker from "react-datepicker";
import DateFnsUtils from '@date-io/date-fns';

import {
  MuiPickersUtilsProvider,
  DatePicker,
} from '@material-ui/pickers';

import "react-datepicker/dist/react-datepicker.css";

class SSDatePicker extends Component {
  constructor(props) {
    super(props);
    this.state={isOpen: this.props.isOpen}
  };
 
  handleChange = date => {
    this.props.handleDateChange(date);
  };
  
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.isOpen != this.props.isOpen){
      this.setState({isOpen: this.props.isOpen})
    }
  }

  render() {
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DatePicker
              fullWidth
              autoOk
              open={this.state.isOpen}
              onOpen={this.props.handleCalendarOpen}
              onClose={this.props.handleCalendarClose}
              disableToolbar
              variant="inline"
              format="MM/dd/yyyy"
              margin="normal"
              value={this.props.date}
              onChange={(newDate) => {this.handleChange(newDate)}}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
              TextFieldComponent={() => null}
        />
      </MuiPickersUtilsProvider>
      // <DatePicker
      //   selected={this.props.date}
      //   onChange={this.handleChange}
      // />
    );
  }
}

export default SSDatePicker
