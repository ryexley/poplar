import React from "react";
import PropTypes from "prop-types";
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

const Device = ( { id, friendlyName, state, host, port, iconPath, onClick } ) => {
    const newState = ( state === "on" ) ? "off" : "on";
    const deviceStyle = classNames( style.device, {
        on: state === "on",
        off: state !== "on"
    } );

    return (
        <li className={ deviceStyle }>
            <img className={ style.icon } src={ `http://${ host }:${ port }/${ iconPath }` } />
            <span className={ style.name }>{ friendlyName }</span>
            <span className={ style.stateToggle }>
                { renderToggle( state, () => onClick( id, newState ) ) }
            </span>
        </li>
    );
};

Device.propTypes = {
    id: PropTypes.string,
    friendlyName: PropTypes.string,
    state: PropTypes.string,
    host: PropTypes.string,
    port: PropTypes.string,
    iconPath: PropTypes.string,
    onClick: PropTypes.func
};

export default Device;
