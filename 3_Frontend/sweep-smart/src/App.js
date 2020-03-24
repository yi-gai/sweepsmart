import React from 'react';
import logo from './logo.svg';
import './App.css';
import Sidebar from './Sidebar'
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
    return <h1>Schedule</h1>;
  }
}

class Operator extends React.Component {
  render() {
    return <h1>Operator</h1>;
  }
}

class Vehicle extends React.Component {
  render() {
    return <h1>Vehicle</h1>;
  }
}

class Performance extends React.Component {
  render() {
    return <h1>Performance</h1>;
  }
}