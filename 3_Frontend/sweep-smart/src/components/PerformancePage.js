import React from 'react';
import Paper from '@material-ui/core/Paper';
import OperatorChart from './OperatorCompletion';
import RouteChart from './RouteCompletion';
import VacationChart from './VacationChart';

import './schedulePage.css';
import { styled } from '@material-ui/core/styles';
import API from "../API/api";


const OperatorBar = styled(Paper)({
  position: "absolute",
  width: 450,
  height: 1540,
  left: 10,
  top: 80,

  background: '#FFFFFF',
  borderRadius: 5,
});

const RouteBar = styled(Paper)({
  position: "absolute",
  width: 450,
  height: 1540,
  left: 480,
  top: 80,

  background: '#FFFFFF',
  borderRadius: 5,
});

const VacationPaper = styled(Paper)({
  position: "absolute",
  width: 930,
  height: 1540,
  left: 10,
  top: 80,

  background: '#FFFFFF',
  borderRadius: 5,
});



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
        let mainContent;
        if (this.props.tab === 'Completion') {
            mainContent = (<div> 
                            <OperatorBar> <OperatorChart date={this.props.date}/> </OperatorBar>
                            <RouteBar> <RouteChart date={this.props.date}/> </RouteBar> 
                          </div>);
        } else {
            mainContent = (<div> <VacationPaper><VacationChart date={this.props.date}/></VacationPaper></div>);
        }

        return (
                <div className="big-container">
                    {mainContent}
                </div>
            );
    }
}

export default PerformancePage;