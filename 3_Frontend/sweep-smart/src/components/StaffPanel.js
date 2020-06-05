import React from "react";
import "./staffPanel.css";
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import API from "../API/api";
import {withStyles} from "@material-ui/styles/index";
import PropTypes from 'prop-types';

const styles = theme => ({
    expansion_details: {
        flexDirection: "column"
    }
});

const dummyData = {"day": ["A.Andres","B.Bob","C.Clark"], "night": ["D.Davis", "E.Ellen", "F.Flores"], "off-duty": ["G.Galvin", "H.Howard"]};

function GetDateFormat(date) {
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let year = date.getYear() + 1900;
    if (day < 10) {
        day = '0' + day;
    }
    if (month < 10) {
        month = '0' + month;
    }
    return year + '-' + month + '-' + day;
}

function ProcessRawData(rawData) {
    let processedData = {
        "day": [],
        "night": [],
        "off-duty": []
    };

    // process day operators
    rawData["day"].forEach(staff => {
        processedData["day"].push(staff.name);
    });

    // process night operators
    rawData["night"].forEach(staff => {
        processedData["night"].push(staff.name);
    });

    return processedData;
}

function ProcessOffDutyStaffData(rawData) {
    let offDuty = [];

    rawData["Off-Duty"].forEach(staff => {
        offDuty.push(staff.name);
    });

    return offDuty;
}
class StaffPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: dummyData,
            date: props.date,
        };
        this.fetchOndutyStaffList = this.fetchOndutyStaffList.bind(this);
        this.fetchOffdutyStaffLit = this.fetchOffdutyStaffLit.bind(this);
    }

    componentDidMount() {
        this.fetchOndutyStaffList();
        this.fetchOffdutyStaffLit();
    }

    componentDidUpdate(prevProps) {
        if (this.props.date !== prevProps.date) {
            this.fetchOndutyStaffList();
            this.fetchOffdutyStaffLit();
        }
    }

    fetchOndutyStaffList() {
        API.get("/operator/day/onduty", {
            params: {date: GetDateFormat(this.props.date)}
        }).then(res => res['data'])
            .then(
                (result) => {
                    this.setState ({data: ProcessRawData(result)});
                },
                (error) => {
                    this.setState ({data: dummyData});
                    console.log('week route error : ' + error)
                }
            );
    }

    fetchOffdutyStaffLit () {
        API.get("/operator/day/offduty", {
            params: {date: GetDateFormat(this.props.date)}
        }).then(res => res['data'])
            .then(
                (result) => {
                    // console.log("StaffPanel: " + JSON.stringify(result));
                    let updateddata = this.state.data;
                    updateddata["off-duty"] = ProcessOffDutyStaffData(result);
                    this.setState ({data: updateddata});
                },
                (error) => {
                    let updateddata = this.state.data;
                    updateddata["off-duty"] = ["G", "H"];
                    this.setState ({data: updateddata});
                    console.log('week route error : ' + error)
                }
            );
    }

    render() {
        const { classes } = this.props;
        return (
            <div className="staff-container">
                <div style={{paddingLeft: 20}}><h2><strong>Staff</strong></h2></div>
                <ExpansionPanel>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                    >
                        <h3>Day</h3>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails className={classes.expansion_details}>
                        {this.state.data["day"].map(name => (
                            <p>
                                {name}
                            </p>
                        ))}
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                <ExpansionPanel>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                    >
                        <h3>Night</h3>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails className={classes.expansion_details}>
                        {this.state.data["night"].map(name => (
                            <p>{name}</p>
                        ))}
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                <ExpansionPanel>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                    >
                        <h3>Off-duty</h3>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails className={classes.expansion_details}>
                        {this.state.data["off-duty"].map(name => (
                            <p>
                                {name}
                            </p>
                        ))}
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </div>
        );
    }
}

StaffPanel.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(StaffPanel)
