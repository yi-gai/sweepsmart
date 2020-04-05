import React from 'react';
import {AccessTime, Block, CheckCircle, Cancel} from '@material-ui/icons';
import Grid from '@material-ui/core/Grid';
import Popover from '@material-ui/core/Popover';
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

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
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
                className={`routePopover`}
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
                }}
            >
                <p>The content of the Popover.</p>
            </Popover>
        </div>
    )
}

export default RouteBlock