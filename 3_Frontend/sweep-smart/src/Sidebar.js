import React, { Component } from 'react';
import './App.css';
import './sidebar.css';
import {Link} from "react-router-dom";

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Button from '@material-ui/core/Button'
import SvgIcon from '@material-ui/core/SvgIcon';
import { ListItemIcon } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core";

const useStyles = makeStyles({
  settingbtn: {
    width: '50%',
    background: '#70C295',
    marginTop: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
    "&:hover": {
      backgroundColor: "#70C295"
    }
  },
  logoutbtn: {
    width: '50%',
    color: '#70C295',
    borderColor : '#70C295',
    marginTop: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
    "&:hover": {
      borderColor: "#70C295"
    },
    wrapIcon: {
      display: 'block',
      margin: 'aut0'
     }
  },
});


function Sidebar() {
  const classes = useStyles();
  const theme = createMuiTheme({
    props: {
      palette: {
        primary: '#70C295'
      },
      // Name of the component
      MuiButtonBase: {
        // The properties to apply
        disableRipple: true // No more ripple, on the whole application!
      }
    }
  });
  return (
    <div className="sidebar">
      <div className="top-div">
        <div className="logo">
          <SweepSmartLogo/>
          <div className="logo-text">
            SWEEP<br/>SMART
          </div>
        </div>
      </div>
      <MenuList/>
      <div className="button-div">
        <MuiThemeProvider theme={theme}>
          <Button className={classes.settingbtn} variant="contained" color="primary" style={{display:'block'}}>
            Setting
          </Button>
          <Button className={classes.logoutbtn} variant="outlined" color="primary" style={{display:'block'}}>
            Log out
          </Button>
        </MuiThemeProvider>
      </div>
    </div>
  )
}
 
class MenuList extends React.Component{
  constructor(props) {
    super(props);
    this.state = { selected: 0 };
  }

  updateSelected(selectedIndex) {
    this.setState({ selected: selectedIndex });
  }
  
  render() {
    const { selected } = this.state;
    return(
      <List disablePadding dense>
          <ListItem button component={Link} to="/" onClick={() => this.updateSelected(0)} selected={selected === 0}>
            <CalendarIcon/>
            <ListItemText>Schedule</ListItemText>
          </ListItem>
          <ListItem button component={Link} to="/operator" onClick={() => this.updateSelected(1)} selected={selected === 1}>
            <OperatorIcon/>
            <ListItemText>Operator</ListItemText>
          </ListItem>
          <ListItem button component={Link} to="/vehicle" onClick={() => this.updateSelected(2)} selected={selected === 2}>
            <VehicleIcon/>
            <ListItemText>Vehicles</ListItemText>
          </ListItem>
          <ListItem button component={Link} to="/performance" onClick={() => this.updateSelected(3)} selected={selected === 3}>
            <PerformanceIcon/>
            <ListItemText>Performance</ListItemText>
          </ListItem>
        </List>
    )
  }
}

function SweepSmartLogo() {
  return (
    <svg width="84" height="70" viewBox="0 0 74 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14.039 54.349C10.8923 43.0971 13.3686 16.9001 48.4476 2.12766C48.9944 18.778 42.8781 52.5326 14.039 54.349Z" fill="#70C195"/>
      <path d="M13.801 54.2916C17.2313 43.1229 33.4668 22.4149 70.9672 28.933C62.4328 43.2402 39.0514 68.342 13.801 54.2916Z" fill="#538F6E"/>
    </svg>
  )
}

function CalendarIcon(props) {
  const classes = useStyles();
  return (
    <ListItemIcon className={classes.wrapIcon}{...props}>
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.2422 1.17188H12.5391V0H11.3672V1.17188H3.63281V0H2.46094V1.17188H1.75781C0.788555 1.17188 0 1.96043 0 2.92969V13.2422C0 14.2114 0.788555 15 1.75781 15H13.2422C14.2114 15 15 14.2114 15 13.2422V2.92969C15 1.96043 14.2114 1.17188 13.2422 1.17188ZM13.8281 13.2422C13.8281 13.5653 13.5653 13.8281 13.2422 13.8281H1.75781C1.43473 13.8281 1.17188 13.5653 1.17188 13.2422V5.50781H13.8281V13.2422ZM13.8281 4.33594H1.17188V2.92969C1.17188 2.6066 1.43473 2.34375 1.75781 2.34375H2.46094V3.51562H3.63281V2.34375H11.3672V3.51562H12.5391V2.34375H13.2422C13.5653 2.34375 13.8281 2.6066 13.8281 2.92969V4.33594Z" fill="#9AA7A0"/>
        <path d="M3.39844 6.73828H2.22656V7.91016H3.39844V6.73828Z" fill="#9AA7A0"/>
        <path d="M5.74219 6.73828H4.57031V7.91016H5.74219V6.73828Z" fill="#9AA7A0"/>
        <path d="M8.08594 6.73828H6.91406V7.91016H8.08594V6.73828Z" fill="#9AA7A0"/>
        <path d="M10.4297 6.73828H9.25781V7.91016H10.4297V6.73828Z" fill="#9AA7A0"/>
        <path d="M12.7734 6.73828H11.6016V7.91016H12.7734V6.73828Z" fill="#9AA7A0"/>
        <path d="M3.39844 9.08203H2.22656V10.2539H3.39844V9.08203Z" fill="#9AA7A0"/>
        <path d="M5.74219 9.08203H4.57031V10.2539H5.74219V9.08203Z" fill="#9AA7A0"/>
        <path d="M8.08594 9.08203H6.91406V10.2539H8.08594V9.08203Z" fill="#9AA7A0"/>
        <path d="M10.4297 9.08203H9.25781V10.2539H10.4297V9.08203Z" fill="#9AA7A0"/>
        <path d="M3.39844 11.4258H2.22656V12.5977H3.39844V11.4258Z" fill="#9AA7A0"/>
        <path d="M5.74219 11.4258H4.57031V12.5977H5.74219V11.4258Z" fill="#9AA7A0"/>
        <path d="M8.08594 11.4258H6.91406V12.5977H8.08594V11.4258Z" fill="#9AA7A0"/>
        <path d="M10.4297 11.4258H9.25781V12.5977H10.4297V11.4258Z" fill="#9AA7A0"/>
        <path d="M12.7734 9.08203H11.6016V10.2539H12.7734V9.08203Z" fill="#9AA7A0"/>
      </svg>
    </ListItemIcon>
  );
}

function OperatorIcon(props) {
  return (
    <ListItemIcon {...props}>
      <svg width="15" height="17" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.5 0C5.0187 0 3 2.0187 3 4.5C3 6.9813 5.0187 9 7.5 9C9.9813 9 12 6.9813 12 4.5C12 2.0187 9.9813 0 7.5 0ZM7.5 8C5.5701 8 4 6.4299 4 4.5C4 2.5701 5.5701 1 7.5 1C9.4299 1 11 2.5701 11 4.5C11 6.4299 9.4299 8 7.5 8Z" fill="#9AA7A0"/>
        <path d="M13.0989 11.0398C11.8669 9.78888 10.2336 9.09998 8.5 9.09998H6.5C4.7664 9.09998 3.13313 9.78888 1.90113 11.0398C0.675167 12.2846 0 13.9277 0 15.6666C0 15.9428 0.223867 16.1666 0.5 16.1666H14.5C14.7761 16.1666 15 15.9428 15 15.6666C15 13.9277 14.3248 12.2846 13.0989 11.0398ZM1.022 15.1666C1.2725 12.3304 3.6337 10.1 6.5 10.1H8.5C11.3663 10.1 13.7275 12.3304 13.978 15.1666H1.022Z" fill="#9AA7A0"/>
      </svg>
    </ListItemIcon>
  );
}

function VehicleIcon(props) {
  return (
    <ListItemIcon {...props}>
      <svg width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.2182 1.90757H11.728V0H0V11.1328H2.14766C2.38771 12.2001 3.34248 13 4.48114 13C5.61981 13 6.57457 12.2001 6.81463 11.1328H10.7365C10.9766 12.2001 11.9313 13 13.07 13C14.2086 13 15.1634 12.2001 15.4035 11.1328H17.9246V5.96759L15.2182 1.90757ZM4.48114 11.9497C3.74116 11.9497 3.13914 11.3477 3.13914 10.6077C3.13914 9.86772 3.74116 9.2657 4.48114 9.2657C5.22112 9.2657 5.82314 9.86772 5.82314 10.6077C5.82314 11.3477 5.22112 11.9497 4.48114 11.9497ZM10.6777 10.0826H6.81463C6.57457 9.01536 5.61981 8.21544 4.48114 8.21544C3.34248 8.21544 2.38771 9.01536 2.14766 10.0826H1.05027V1.05027H10.6777V10.0826ZM13.07 11.9497C12.33 11.9497 11.728 11.3477 11.728 10.6077C11.728 9.86772 12.33 9.2657 13.07 9.2657C13.81 9.2657 14.412 9.86772 14.412 10.6077C14.412 11.3477 13.81 11.9497 13.07 11.9497ZM16.8743 10.0826H15.4035C15.1634 9.01536 14.2087 8.21544 13.07 8.21544C12.573 8.21544 12.1109 8.3679 11.728 8.6284V2.95783H14.6561L16.6672 5.97487H13.9686V4.25943H12.9183V7.02513H16.8743V10.0826Z" fill="#9AA7A0"/>
      </svg>
    </ListItemIcon>
  );
}

function PerformanceIcon(props) {
  return (
    <ListItemIcon {...props}>
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.9137 4.41422L11.7756 0.177841C11.6927 0.0660324 11.5617 0 11.4225 0C11.2832 0 11.1522 0.0660324 11.0694 0.177841L7.93133 4.41422C7.83257 4.54754 7.81734 4.72527 7.89207 4.87347C7.96669 5.02167 8.11855 5.11528 8.28449 5.11528H9.41402V7.2393C9.19281 7.12532 8.9423 7.06055 8.67668 7.06055H7.89219C7.00104 7.06055 6.27605 7.78553 6.27605 8.67668V9.59278C6.05484 9.4788 5.80421 9.41402 5.53871 9.41402H4.75422C3.86307 9.41402 3.13808 10.1391 3.13808 11.0303V11.9463C2.91676 11.8324 2.66624 11.7675 2.40074 11.7675H1.61613C0.724983 11.7675 0 12.4926 0 13.3838V14.5605C0 14.8033 0.196724 15 0.439453 15H12.9914C13.2342 15 13.4309 14.8033 13.4309 14.5605V5.11528H14.5605C14.7265 5.11528 14.8783 5.02167 14.953 4.87347C15.0277 4.72527 15.0125 4.54754 14.9137 4.41422ZM0.878906 13.3838C0.878906 12.9773 1.20964 12.6464 1.61613 12.6464H2.40063C2.80724 12.6464 3.13797 12.9773 3.13797 13.3838V14.1211H0.878906V13.3838ZM4.01688 13.3838V11.0303C4.01688 10.6237 4.34761 10.2929 4.75422 10.2929H5.53871C5.94521 10.2929 6.27594 10.6237 6.27594 11.0303V14.1211H4.01688V13.3838ZM7.15496 11.0303V8.67668C7.15496 8.27019 7.48569 7.93945 7.89219 7.93945H8.67668C9.08318 7.93945 9.41402 8.27019 9.41402 8.67668V14.1211H7.15496V11.0303ZM12.9914 4.23637C12.7487 4.23637 12.552 4.4331 12.552 4.67583V14.1211H10.2929V4.67583C10.2929 4.4331 10.0961 4.23637 9.85348 4.23637H9.15688L11.4225 1.17771L13.6882 4.23637H12.9914Z" fill="#9AA7A0"/>
      </svg>
    </ListItemIcon>
  );
}

export default Sidebar

