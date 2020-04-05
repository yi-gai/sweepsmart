import React from 'react';
import RouteBlock from "./RouteBlock";

class SchdulePage extends React.Component {
    render() {
		return (
                <div className="content-container">
                    <div>
						<RouteBlock
							onClick={() => {console.log("Clicked")}}
							shift="day"
							status="assigned"
							route="Route 7A-1"
							operator="R.Rogers">
							Route 10</RouteBlock>
                        <RouteBlock
                            onClick={() => {console.log("Clicked")}}
                            shift="day"
                            status="completed"
                            route="Route 7A-1"
                            operator="R.Rogers">
                            Route 10</RouteBlock>
						<RouteBlock
							onClick={() => {console.log("Clicked")}}
							shift="night"
							status="disabled"
							route="Route 11"
							operator="S.Smith">
							Route 10</RouteBlock>
                        <RouteBlock
                            onClick={() => {console.log("Clicked")}}
                            shift="night"
                            status="completed"
                            route="Route 11"
                            operator="S.Smith">
                            Route 10</RouteBlock>
                        <RouteBlock
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
                    </div>
				</div>
        );
    }
}
export default SchdulePage;