import React from 'react';
import logo from './logo.svg';
import './App.css';
import Sidebar from './Sidebar'
import RouteBlock from './components/RouteBlock'
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
    return (
        <div>
            <h1>Schedule</h1>
            <RouteBlock
                onClick={() => {console.log("Clicked")}}
                style="rtBlock--completed--day"
                route="Route 7A-1"
                operator="R.Rogers">
                Route 10</RouteBlock>
            <RouteBlock
                onClick={() => {console.log("Clicked")}}
                style="rtBlock--completed--night"
                route="Route 11"
                operator="S.Smith">
                Route 10</RouteBlock>
        </div>
    );
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