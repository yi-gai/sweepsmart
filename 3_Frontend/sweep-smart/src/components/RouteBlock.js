import React from 'react';
import {
    AccessTimeRoundedIcon,
    BlockRoundedIcon,
    CancelRoundedIcon,
    CheckCircleRoundedIcon,
    HelpRoundedIcon
} from '@material-ui/icons';
import '../App.css';
import './routeBlock.css';

function RouteBlock({
                        route,
                        operator,
                        type,
                        onclick,
                        style
                    }) {
    return (
        <div className={`rtBlock ${style}`} onClick={onclick} type={type}>
            <p className={`routeTxt`}>{route}</p>
            <p className={`operatorTxt`}>{operator}</p>
        </div>
    )
}

export default RouteBlock