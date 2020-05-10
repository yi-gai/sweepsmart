import React from 'react';
import Paper from '@material-ui/core/Paper';
import OperatorChart from './charts';

// import './schedulePage.css';
import {withStyles} from "@material-ui/styles/index";
import API from "../API/api";

const styles = theme => (
    { }
);



class PerformancePage extends React.Component {

    constructor(props) {
		super(props);
		this.state = {
			onScreenData: [],
			tab: props.tab,
			date: props.date,
			data:null,
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

    handleChange = date => {
    	this.props.handleDateChange(date);
    };

	render() {
        const { classes } = this.props;
		return (
			<div className="content-container">
                <div>
                    <OperatorChart/>
                </div>
				
			</div>
        );
    }
}

export default PerformancePage;