import React from 'react';
import {AccessTime, Block, CheckCircle, Cancel} from '@material-ui/icons';
import Grid from '@material-ui/core/Grid';
import '../App.css';
import './routeBlock.css';

function rtBlockIcon(status) {
    if (status === 'assigned') {
        return (<AccessTime />);
    } else if (status === 'disabled') {
        return (<Block />);
    } else if (status === 'completed') {
        return (<CheckCircle />)
    } else if (status === 'missed') {
        return (<Cancel />)
    }
}

function RouteBlock({
                        route,
                        operator,
                        onclick,
                        shift,
                        status
                    }) {
    return (
        <div className={`rtBlock rtBlock--${shift}--${status}`} onClick={onclick}>
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
    )
}

export default RouteBlock