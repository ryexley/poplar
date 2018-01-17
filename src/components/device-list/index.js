import React from "react";
import PropTypes from "prop-types";
import Container from "../container";
import Device from "../device";
import actions from "../../actions";
import { connect } from "react-redux";
import style from "./deviceList.css";

const { device: deviceActions } = actions;

class DeviceList extends Container {
    render() {
        const { devices, onToggleCameraReminderClick, onDeviceClick } = this.props;
        const deviceKeys = Object.keys( devices || {} );

        return (
            <ul className={ style.list }>
                { deviceKeys.length ? deviceKeys.map( deviceId => {
                    const device = devices[ deviceId ];
                    return (
                        <Device
                            { ...device }
                            key={ deviceId }
                            toggleCameraReminder={ onToggleCameraReminderClick }
                            onClick={ onDeviceClick } />
                    );
                } ) : null }
            </ul>
        );
    }
};

DeviceList.propTypes = {
    devices: PropTypes.shape( {
        id: PropTypes.string,
        friendlyName: PropTypes.string,
        state: PropTypes.string,
        host: PropTypes.string,
        port: PropTypes.string,
        iconPath: PropTypes.string,
        cameraReminders: PropTypes.bool
    } ),
    onDeviceClick: PropTypes.func
};

const mapStateToProps = state => {
    return {
        devices: state.devices
    };
};

const mapDispatchToProps = dispatch => {
    const { toggleCameraReminder, toggleDeviceState } = deviceActions;

    return {
        onToggleCameraReminderClick( deviceId, newState ) {
            dispatch( toggleCameraReminder( deviceId, newState ) );
        },

        onDeviceClick( deviceId, newState ) {
            dispatch( toggleDeviceState( deviceId, newState ) );
        }
    };
};

export default connect( mapStateToProps, mapDispatchToProps )( DeviceList );
