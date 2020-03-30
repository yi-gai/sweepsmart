import React from 'react';
import logo from './logo.svg';
import './App.css';
import Sidebar from './Sidebar'
import Main from './Main'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function App() {
  return (
    <Router>
      <div>
        <Sidebar/>
      </div>
      <div className='main-content'>
        <Switch>
          <Route path="/operator">
            <Operator />
          </Route>
          <Route path="/vehicle">
            <Vehicle/>
          </Route>
          <Route path="/performance">
            <Performance/>
          </Route>
          <Route path="/">
            <Schedule />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}
export default App;


class Schedule extends React.Component {
  render() {
    let buttons = ["Day Shift", "Night Shift"];
    return <Main buttons={buttons} pageName="Schedule"/>;
  }
}

class Operator extends React.Component {
  render() {
    let buttons = ["Day Shift", "Night Shift"];
    return <Main buttons={buttons} pageName="Operators"/>;
  }
}

class Vehicle extends React.Component {
  render() {
    let buttons = ["Day Shift", "Night Shift"];
    return <Main pageName="Vehicles"/>;
  }
}

class Performance extends React.Component {
  render() {
    let buttons = ["Month", "Week", "Day"];
    return <Main buttons={buttons} pageName="Performance"/>;
  }
}