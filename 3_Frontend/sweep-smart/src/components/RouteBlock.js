import React from 'react';
import {AccessTime, Block, CheckCircle, Cancel, HelpOutline} from '@material-ui/icons';
import Grid from '@material-ui/core/Grid';
import Popover from '@material-ui/core/Popover';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableBody';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import { styled } from '@material-ui/core/styles';


import '../App.css';
import './routeBlock.css';
import API from "../API/api";

function rtBlockIcon(status) {
    if (status === 'assigned') {
        return <AccessTime style={{paddingTop: '5px'}}/>;
    } else if (status === 'disabled') {
        return <Block style={{paddingTop: '5px'}}/>;
    } else if (status === 'completed') {
        return <CheckCircle style={{paddingTop: '5px'}}/>;
    } else if (status === 'missed') {
        return <Cancel style={{paddingTop: '5px'}}/>;
    } else if (status === 'unassigned') {
        return <HelpOutline style={{paddingTop: '5px'}}/>;
    }
}

const NoBottomTableCell = styled(TableCell) ({
    borderBottom: 0,
    borderCollapse: 'collapse',
    width: 120,
});

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        padding: '5%',
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    }
}));

function RouteBlock({shift, date, route, operator_init, status_init}) {

    /* Props and state */

    let day_night;
    if (shift !== 'night') {
        day_night = 'day';
    } else {
        day_night = 'night';
    }

    if (operator_init === '') {
        operator_init = status_init;
    } else {
        operator_init = GetNameFormat(operator_init);
    }

    if (status_init === null) {
        status_init = 'unassigned';
    } else {
        status_init = status_init.toLowerCase();
    }

    const [status, setStatus] = React.useState(status_init);
    const [operator, setOperator] = React.useState(operator_init);
    const [operators, setOperators] = React.useState([]);
    const [operator_select_id, setOperatorSelectID] = React.useState('');
    const [operator_select_name, setOperatorSelectName] = React.useState('');
    const [status_select, setStatusSelect] = React.useState('');
    const [disable_checked, setDisableChecked] = React.useState(false);

    /* Popover */
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = (event, date, shift) => {
        API.get("/schedule/operator", {
            params: {date: GetDateFormat(date), shift: shift}
        }).then(res => setOperators(res['data']));
        setAnchorEl(event.currentTarget);
        setOperatorSelectName('');
        setOperatorSelectID('');
        setStatusSelect('');
        setDisableChecked(false);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);

    /* Form */
    const classes = useStyles();

    const handleOperatorChange = (event) => {
        setDisableChecked(false);
        console.log(event.currentTarget);
        setOperatorSelectID(event.currentTarget.getAttribute('data-value'));
        setOperatorSelectName(event.currentTarget.getAttribute('name'));
    };
    
    const handleStatusChange = (event) => {
        setDisableChecked(false);
        console.log(event.currentTarget);
        setStatusSelect(event.currentTarget.getAttribute('data-value'));
    }

    const handleDisablenCheck = (event) => {
        setDisableChecked(event.target.checked);
    }

    const handleSubmit = (event) => {
        let updated_status;
        let updated_operator;

        if (disable_checked) {
            updated_status = 'disabled';
            updated_operator = 'Disabled';
            finishSubmit(event, updated_operator, updated_status);
            return;
        }

        if (status_select === '' && operator_select_name === '') {
            updated_status = status;
            updated_operator = operator;
            finishSubmit(event, updated_operator, updated_status);
            return;
        }

        updated_operator = operator_select_name !== '' ? operator_select_name : operator;
        if (updated_operator === 'Disabled') {updated_operator = 'Unassigned';}
        updated_status = updated_operator === 'Unassigned' ? 'unassigned' : 'assigned';

        if (status_select === 'pending') {
            finishSubmit(event, updated_operator, updated_status);
            return;
        }

        if (status_select === 'completed' || status_select === 'missed') {
            updated_status = status_select;
            finishSubmit(event, updated_operator, updated_status);
            return;
        }

        if (status === 'completed' || status === 'missed') {
            updated_status = status;
        }

        finishSubmit(event, updated_operator, updated_status);
    }

    const finishSubmit = (event, updated_operator, updated_status) => {
        if (updated_status !== status || updated_operator !== operator) {
            pushUpdate();
            setStatus(updated_status);
            setOperator(updated_operator);
        }

        event.preventDefault();
        handleClose();
    }

    const pushUpdate = () => {
        let params = new URLSearchParams();
        params.append('date', date);
        params.append('shift', shift);
        params.append('operator', operator);
        params.append('status', status);
        API({
            method: 'put',
            url: '/schedule/week/route/action',
            withCredentials: false,
            data: params
        });
    }

    return (
        <div>
            <div className={`rtBlock rtBlock--${day_night}--${status}`} onClick={(event) => handleClick(event, date, shift)}>
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
                <form className={classes.formControl} onSubmit={handleSubmit}>
                    <TableContainer>
                        <Table fullWidth={true}>
                            <TableHead>
                                <TableRow>
                                    <NoBottomTableCell><div class='route'>{route}</div></NoBottomTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <NoBottomTableCell size="small"><p>Assign to</p></NoBottomTableCell>
                                    <NoBottomTableCell size="small">
                                        <Select
                                            labelId="operator-select-label"
                                            id="operator-select"
                                            onChange={handleOperatorChange}>
                                            {operators.map(
                                                (driver) => <MenuItem value={driver.employee_id} name={GetNameFormat(driver.employee_name)}>{GetNameFormat(driver.employee_name)}</MenuItem>)
                                            }
                                            <MenuItem value={'unassigned'} name={'Unassigned'}>Unassigned</MenuItem> 
                                        </Select>
                                    </NoBottomTableCell>
                                </TableRow>
                                <TableRow>
                                    <NoBottomTableCell size="small"><p>Route Status</p></NoBottomTableCell>
                                    <NoBottomTableCell size="small">
                                        <Select
                                            labelId="status-select-label"
                                            id="status-select"
                                            onChange={handleStatusChange}>
                                            <MenuItem value={'completed'}>Completed</MenuItem>
                                            <MenuItem value={'missed'}>Missed</MenuItem>
                                            <MenuItem value={'pending'}>Pending</MenuItem>
                                        </Select>
                                    </NoBottomTableCell>
                                </TableRow>
                                <TableRow>
                                    <NoBottomTableCell size="small"><p>Disable route</p></NoBottomTableCell>
                                    <NoBottomTableCell size="small">
                                        <Switch
                                            checked={disable_checked}
                                            onChange={handleDisablenCheck}
                                            color="primary"
                                            name="disable-checked"
                                        />
                                    </NoBottomTableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Grid container spacing={1}>
                        <Grid item xs={4}></Grid>
                        <Grid item xs={4}>
                            <Button onClick={handleClose}>Cancel</Button>
                        </Grid>
                        <Grid item xs={4}>
                            <Button type="submit"
                                variant="contained"
                                color="#70C295"
                                className={classes.submit}>Submit</Button>
                        </Grid>
                    </Grid>
                </form>
            </Popover>
        </div>
    )
}

function GetNameFormat(name) {
    let name_split = name.split(' ');
    return name_split[1].charAt(0) + '. ' + name_split[0];
}

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

export default RouteBlock