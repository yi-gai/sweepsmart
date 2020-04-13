import React from 'react';
import RouteBlock from "./RouteBlock";
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import './schedulepage.css';
import SwipeableTemporaryDrawer from "./Drawer"

class SchdulePage extends React.Component {
	render() {
		return (
			<TableContainer className="content-container">
				<div>
					<SwipeableTemporaryDrawer />
				</div>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell align="center">
								<h1>2</h1>
								<p>Mon</p>
							</TableCell>
							<TableCell align="center">
								<h1>3</h1>
								<p>Tue</p>
							</TableCell>
							<TableCell align="center">
								<h1>4</h1>
								<p>Wed</p>
							</TableCell>
							<TableCell align="center">
								<h1>5</h1>
								<p>Thu</p>
							</TableCell>
							<TableCell align="center">
								<h1>6</h1>
								<p>Fri</p>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						<TableRow>
							<TableCell>
								<RouteBlock
									onClick={() => {console.log("Clicked")}}
									shift="day"
									status="assigned"
									route="Route 7A-1"
									operator="R.Rogers">
									Route 10</RouteBlock>
							</TableCell>
							<TableCell>
								<RouteBlock
									onClick={() => {console.log("Clicked")}}
									shift="day"
									status="completed"
									route="Route 7A-1"
									operator="R.Rogers">
									Route 10</RouteBlock>
							</TableCell>
							<TableCell><RouteBlock
								onClick={() => {console.log("Clicked")}}
								shift="night"
								status="missed"
								route="Route 11"
								operator="S.Smith">
								Route 10</RouteBlock>
								<RouteBlock
									onClick={() => {console.log("Clicked")}}
									shift="night"
									status="assigned"
									route="Route 11"
									operator="S.Smith">
									Route 10</RouteBlock>
							</TableCell>
							<TableCell><RouteBlock
								onClick={() => {console.log("Clicked")}}
								shift="night"
								status="disabled"
								route="Route 11"
								operator="S.Smith">
								Route 10</RouteBlock>
							</TableCell>
							<TableCell>
								<RouteBlock
									onClick={() => {console.log("Clicked")}}
									shift="night"
									status="completed"
									route="Route 11"
									operator="S.Smith">
									Route 10</RouteBlock>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>
								<RouteBlock
									onClick={() => {console.log("Clicked")}}
									shift="day"
									status="assigned"
									route="Route 7A-1"
									operator="R.Rogers">
									Route 10</RouteBlock>
							</TableCell>
							<TableCell>
								<RouteBlock
									onClick={() => {console.log("Clicked")}}
									shift="day"
									status="completed"
									route="Route 7A-1"
									operator="R.Rogers">
									Route 10</RouteBlock>
							</TableCell>
							<TableCell><RouteBlock
								onClick={() => {console.log("Clicked")}}
								shift="night"
								status="missed"
								route="Route 11"
								operator="S.Smith">
								Route 10</RouteBlock>
								<RouteBlock
									onClick={() => {console.log("Clicked")}}
									shift="night"
									status="assigned"
									route="Route 11"
									operator="S.Smith">
									Route 10</RouteBlock>
							</TableCell>
							<TableCell><RouteBlock
								onClick={() => {console.log("Clicked")}}
								shift="night"
								status="disabled"
								route="Route 11"
								operator="S.Smith">
								Route 10</RouteBlock>
							</TableCell>
							<TableCell>
								<RouteBlock
									onClick={() => {console.log("Clicked")}}
									shift="night"
									status="completed"
									route="Route 11"
									operator="S.Smith">
									Route 10</RouteBlock>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>
        );
    }
}
export default SchdulePage;