import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import './drawer.css';


const useStyles = makeStyles({
  overview: {
    position: "absolute",
  width: 696,
  height: 172,
  left: 27,
  top: 217,
},

weatherPaper: {
    position: "absolute",
  width: 430,
  height: 172,
  left: 731,
  top: 217,
},

operatorPaper: {
    position: "absolute",
  width: 1135,
  height: 547,
  left: 27,
  top: 397,
},

vehiclePaper: {
    position: "absolute",
  width: 240,
  height: 516,
  left: 1169,
  top: 217,
},

drawerMain: {
  background: "#E5E5E5",
},
});

export default function SwipeableTemporaryDrawer(props) {
  const classes = useStyles();
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
      id="drawer-main"
    >
      <h3> Daily Schedule </h3>
      <Paper className={classes.overview}> 
        <h4> Overview </h4>
      </Paper>

      <Paper className={classes.weatherPaper}> 
        <h4> Weather </h4>
      </Paper>

      <Paper className={classes.operatorPaper}> 
        <h4> Daily View by Operators </h4>
      </Paper>

      <Paper className={classes.vehiclePaper}> 
        <h4> Vehicles </h4>
      </Paper>

    </div>
  );

  return (
    <div>
      {['right'].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)}> Day Schedule Drawer </Button>
          <SwipeableDrawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            onOpen={toggleDrawer(anchor, true)}
          >
            {list(anchor)}
          </SwipeableDrawer>
        </React.Fragment>
      ))}
    </div>
  );
}

class DayScheduleDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      onScreenData: [],
      tab: props.tab,
      date: props.date,
      data:null,
    }
    }

  render() {
        const { classes } = this.props;
    return (
      <div>
        
      </div>
        );
    }
  
}





