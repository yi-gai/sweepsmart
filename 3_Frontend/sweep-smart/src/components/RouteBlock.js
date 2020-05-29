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
import { useEffect } from "react";


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

const RightTableCell = styled(TableCell) ({
    borderBottom: 0,
    borderCollapse: 'collapse',
    width: 120,
    textAlign: 'center'
});

const LeftTableCell = styled(TableCell) ({
    borderBottom: 0,
    borderCollapse: 'collapse',
    width: 120,
    textAlign: 'left'
});

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        padding: '5%',
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    cancelButton: {
        marginTop: theme.spacing(2),
        fontFamily: 'Lato',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',

        color: '#9AA7A0'
    },
    submitButton: {
        marginTop: theme.spacing(2),
        fontFamily: 'Lato',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',

        color: '#FFFFFF',
        background: '#70C295',
        borderRadius: 5
    }
}));

function RouteBlock({shift, date, route, operator_init, operator_id_init, status_init}) {

    /* Props and state */

    let day_night;
    if (shift !== 'night') {
        day_night = 'day';
    } else {
        day_night = 'night';
    }

    useEffect(() => {
       processInitValues();
    }, [date]);

    const processInitValues = () => {
        if (operator_id_init === 0) {
            operator_init = 'Unassigned';
        } else {
            operator_init = GetNameFormat(operator_init);
        }

        if (status_init === 'disabled') {
            operator_init = 'Disabled';
        }
        setStatus(status_init);
        setOperatorID(operator_id_init);
        setOperator(operator_init);
    }

    const [status, setStatus] = React.useState(status_init);
    const [operator_id, setOperatorID] = React.useState(operator_id_init);
    const [operator, setOperator] = React.useState(operator_init);
    const [operators, setOperators] = React.useState([]);
    const [operator_select_id, setOperatorSelectID] = React.useState(-1);
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
        setOperatorSelectID(-1);
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
        setOperatorSelectID(event.currentTarget.getAttribute('data-value'));
        setOperatorSelectName(event.currentTarget.getAttribute('name'));
    };
    
    const handleStatusChange = (event) => {
        setDisableChecked(false);
        setStatusSelect(event.currentTarget.getAttribute('data-value'));
    }

    const handleDisablenCheck = (event) => {
        setDisableChecked(event.target.checked);
    }

    const handleSubmit = (event) => {
        let updated_status;
        let updated_operator_id;
        let updated_operator;

        if (disable_checked) {
            updated_status = 'disabled';
            updated_operator_id = 0;
            updated_operator = 'Disabled';
            finishSubmit(event, updated_operator_id, updated_operator, updated_status);
            return;
        }

        if (status_select === '' && operator_select_id === -1) {
            updated_status = status;
            updated_operator_id = operator_id;
            updated_operator = operator;
            finishSubmit(event, updated_operator_id, updated_operator, updated_status);
            return;
        }

        updated_operator_id = operator_select_id !== -1 ? operator_select_id : operator_id;
        updated_operator = operator_select_name !== '' ? operator_select_name : operator;
        if (updated_operator === 'Disabled') {updated_operator = 'Unassigned';}
        updated_status = updated_operator_id === 0 || updated_operator_id === '0' ? 'unassigned' : 'assigned';

        if (status_select === 'pending') {
            finishSubmit(event, updated_operator_id, updated_operator, updated_status);
            return;
        }

        if (status_select === 'completed' || status_select === 'missed') {
            updated_status = status_select;
            finishSubmit(event, updated_operator_id, updated_operator, updated_status);
            return;
        }

        if (status === 'completed' || status === 'missed') {
            updated_status = status;
        }
        
        finishSubmit(event, updated_operator_id, updated_operator, updated_status);
    }

    const finishSubmit = (event, updated_operator_id, updated_operator, updated_status) => {
        if (updated_operator_id !== operator_id || updated_status !== status) {
            setStatus(updated_status);
            setOperatorID(updated_operator_id);
            setOperator(updated_operator);
            pushUpdate(updated_operator_id, updated_status);
        }

        event.preventDefault();
        handleClose();
    }

    const pushUpdate = (new_operator_id, new_status) => {
        let params = new URLSearchParams();
        params.append('date', GetDateFormat(date));
        params.append('shift', shift);
        params.append('route', route);
        params.append('operator', new_operator_id);
        params.append('status', new_status);
        params.append('permanent', 0);
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
                                    <LeftTableCell><div class='route'>{route}</div></LeftTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <LeftTableCell size="small"><p>Assign to</p></LeftTableCell>
                                    <RightTableCell size="small">
                                        <Select
                                            labelId="operator-select-label"
                                            id="operator-select"
                                            onChange={handleOperatorChange}>
                                            {operators.map(
                                                (driver) => <MenuItem value={driver.employee_id} name={GetNameFormat(driver.employee_name)}>{GetNameFormat(driver.employee_name)}</MenuItem>)
                                            }
                                            <MenuItem value={0} name={'Unassigned'}>Unassigned</MenuItem> 
                                        </Select>
                                    </RightTableCell>
                                </TableRow>
                                <TableRow>
                                    <LeftTableCell size="small"><p>Route Status</p></LeftTableCell>
                                    <RightTableCell size="small">
                                        <Select
                                            labelId="status-select-label"
                                            id="status-select"
                                            onChange={handleStatusChange}>
                                            <MenuItem value={'completed'}>Completed</MenuItem>
                                            <MenuItem value={'missed'}>Missed</MenuItem>
                                            <MenuItem value={'pending'}>Pending</MenuItem>
                                        </Select>
                                    </RightTableCell>
                                </TableRow>
                                <TableRow>
                                    <LeftTableCell size="small"><p>Disable route</p></LeftTableCell>
                                    <RightTableCell size="small">
                                        <Switch
                                            checked={disable_checked}
                                            onChange={handleDisablenCheck}
                                            color="primary"
                                            name="disable-checked"
                                        />
                                    </RightTableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Grid container spacing={1}>
                        <Grid item xs={4}></Grid>
                        <Grid item xs={4}>
                            <Button className={classes.cancelButton} onClick={handleClose}>Cancel</Button>
                        </Grid>
                        <Grid item xs={4}>
                            <Button type="submit"
                                variant="contained"
                                className={classes.submitButton}>Confirm</Button>
                        </Grid>
                    </Grid>
                </form>
            </Popover>
        </div>
    )
}

function GetNameFormat(name) {
    let name_split = name.split(' ');
    return name_split[0].charAt(0) + '. ' + name_split[1];
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