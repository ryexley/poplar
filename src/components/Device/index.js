import React from "react";
import boundClassNames from "classnames/bind";
import ToggleOn from "react-icons/lib/fa/toggle-on";
import ToggleOff from "react-icons/lib/fa/toggle-off";
import style from "./device.css";

const classNames = boundClassNames.bind( style );

function renderToggle( state, clickHandler ) {
    if ( state === "on" ) {
        return <ToggleOn onClick={ clickHandler } />;
    }

    return <ToggleOff onClick={ clickHandler } />;
}

const Device = ( { id, friendlyName, state, host, port, iconPath, onDeviceClick } ) => {
    console.log( "onDeviceClick", onDeviceClick );
    const stateToggleStyle = classNames( style.stateToggle, {
        on: state === "on",
        off: state !== "on"
    } );

    return (
        <li className={ style.device }>
            <img className={ style.icon } src={ `http://${ host }:${ port }/${ iconPath }` } />
            <span className={ style.name }>{ friendlyName }</span>
            <span className={ stateToggleStyle }>
                { renderToggle( state, onDeviceClick ) }
            </span>
        </li>
    );
};

Device.propTypes = {
    id: React.PropTypes.string,
    friendlyName: React.PropTypes.string,
    state: React.PropTypes.string,
    host: React.PropTypes.string,
    port: React.PropTypes.string,
    iconPath: React.PropTypes.string
};

export default Device;
