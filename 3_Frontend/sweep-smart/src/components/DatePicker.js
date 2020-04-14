import 'date-fns';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  KeyboardDatePicker,
} from '@material-ui/pickers';

class DatePicker extends React.Component {
  constructor(props) {
    super(props);
  };
 
  handleChange = date => {
    this.props.handleDateChange(date);
  };
 
  render() {
    return (
      <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="MM/dd/yyyy"
          margin="normal"
          id="date-picker-inline"
          label="Date picker inline"
          value={this.props.date}
          onChange={this.handleChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
    );
  }
}

export default DatePicker