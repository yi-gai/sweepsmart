import React from 'react';
import {AccessTime, Block, CheckCircle, Cancel, HelpOutline} from '@material-ui/icons';
import Grid from '@material-ui/core/Grid';
import Popover from '@material-ui/core/Popover';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import '../App.css';
import './routeBlock.css';

function rtBlockIcon(status) {
    if (status === 'assigned') {
        return <AccessTime />;
    } else if (status === 'disabled') {
        return <Block />;
    } else if (status === 'completed') {
        return <CheckCircle />;
    } else if (status === 'missed') {
        return <Cancel />;
    } else if (status === 'unassigned') {
        return <HelpOutline />;
    }
}

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

function RouteBlock({
                        route,
                        operator,
                        onclick,
                        shift,
                        status
                    }) {

    /* Popover */
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);

    /* Form */
    const classes = useStyles();
    const [operatorName, setOperatorName] = React.useState('');
    const handleChange = (event) => {
        console.log('event triggered');
        setOperatorName(event.currentTarget.value);
    };

    if (operator === '') {
        operator = 'Unassigned';
    } else {
        let name = operator.split(' ');
        operator = name[1].charAt(0) + '. ' + name[0];
    }

    if (status === null) {
        if (operator === 'Unassigned') {
            status = 'unassigned';
        } else {
            status = 'assigned';
        }
    }

    return (
        <div>
            <div className={`rtBlock rtBlock--${shift}--${status}`} onClick={handleClick}>
                <Grid container wrap="nowrap" direction="row" alignItems="center">
                    <Grid item xs={4}>
                        {rtBlockIcon(status)}
                    </Grid>
                    <Grid item xs={8}>
                        <p className={`routeTxt`}>{route}</p>
                        <p className={`operatorTxt`}>{operator}</p>
                    </Grid>
                </Grid>
            </div>
            <Popover
                id={`${route}--4-5-20`}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}>
                <div className={`routePopover`}>
                    <h3>{route}</h3>
                    <Grid container wrap="nowrap" direction="row" alignItems="center">
                        <Grid item xs={4}>
                            <p>Assign to: </p>
                        </Grid>
                        <Grid item xs={8}>
                            <FormControl className={classes.formControl}>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={operatorName}
                                    onChange={handleChange}>
                                    <MenuItem>R.Rogers</MenuItem>
                                    <MenuItem>J.Smith</MenuItem>
                                    <MenuItem>G.Garrett</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </div>
            </Popover>
        </div>
    )
}

export default RouteBlock