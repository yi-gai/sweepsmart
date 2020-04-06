import React, { Component, useState } from 'react';
import { render } from "react-dom";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

class SSDatePicker extends Component {
  constructor(props) {
    super(props);
  };
 
  handleChange = date => {
    this.props.handleDateChange(date);
  };
 
  render() {
    return (
      <DatePicker
        selected={this.props.date}
        onChange={this.handleChange}
      />
    );
  }
}

export default SSDatePicker
