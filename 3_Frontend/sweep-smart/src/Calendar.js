import React, { Component }, { useState } from 'react';
import { render } from "react-dom";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

class SSDatePicker extends Component {
  const [date, setDate] = useState(new Date());
 
  const onChange = date => {
    setDate(date);
  }
 
  render() {
    return (
      <div>
        <DatePicker
          onChange={this.onChange}
          selected={date}
        />
      </div>
    );
  }
}

export default SSDatePicker
