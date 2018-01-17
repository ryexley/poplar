import React from "react";
import PropTypes from "prop-types";
import boundClassNames from "classnames/bind";
import CameraCheckToggle from "react-icons/lib/fa/bell";
import ToggleOn from "react-icons/lib/fa/toggle-on";
import ToggleOff from "react-icons/lib/fa/toggle-off";
import style from "./device.css";

const classNames = boundClassNames.bind( style );

function renderRemindersToggle( deviceId, cameraReminders, handleClick ) {
    const classes = classNames( style.notify, {
        "notify--on": cameraReminders,
        "notify--off": !cameraReminders
    } );

    const tooltip = cameraReminders ? "Camera check reminders are on. Click here to disable them." : "Camera check reminders are off. Click here to enable them.";

    return (
        <span className={ classes } title={ tooltip }>
            <CameraCheckToggle onClick={ () => handleClick( deviceId, !cameraReminders ) } />
        </span>
    );
}

function renderToggle( state, clickHandler ) {
    if ( state === "on" ) {
        return <ToggleOn onClick={ clickHandler } />;
    }

    return <ToggleOff onClick={ clickHandler } />;
}

const Device = ( { id, friendlyName, state, host, port, iconPath, cameraReminders, toggleCameraReminder, onClick } ) => {
    const newState = ( state === "on" ) ? "off" : "on";
    const deviceStyle = classNames( style.device, {
        on: state === "on",
        off: state !== "on"
    } );

    return (
        <li className={ deviceStyle }>
            <img className={ style.icon } src={ `http://${ host }:${ port }/${ iconPath }` } />
            <span className={ style.name }>{ friendlyName }</span>
            { renderRemindersToggle( id, cameraReminders, toggleCameraReminder ) }
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
    cameraReminders: PropTypes.bool,
    toggleCameraReminder: PropTypes.func,
    onClick: PropTypes.func
};

export default Device;
