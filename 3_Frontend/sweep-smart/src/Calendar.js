import React, { Component, useState } from 'react';
import { render } from "react-dom";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

class SSDatePicker extends Component {
  constructor(props) {
    super(props);
  };

  state = {
    startDate: new Date()
  };
 
  handleChange = date => {
    this.setState({
      startDate: date
    });

    this.props.handleDateChange(date);
  };
 
  render() {
    return (
      <DatePicker
        selected={this.state.startDate}
        onChange={this.handleChange}
      />
    );
  }
}

export default SSDatePicker
