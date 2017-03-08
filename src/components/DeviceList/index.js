import React from "react";
import Device from "../Device";
import actions from "../../actions";
import { connect } from "react-redux";
import style from "./deviceList.css";

const { device: deviceActions } = actions;

const DeviceList = ( { devices, onDeviceClick }, { store } ) => {
    console.log( "onDeviceClick?", onDeviceClick );
    return (
        <ul className={ style.list }>
            { Object.keys( devices ).map( deviceId => {
                const device = devices[ deviceId ];
                // TODO: how do I pass `onDeviceClick` on to the Device component as a prop??
                const deviceProps = Object.assign( {}, device, onDeviceClick );
                return <Device key={ deviceId } { ...deviceProps } />;
            } ) }
        </ul>
    );
};

DeviceList.contextTypes = {
    store: React.PropTypes.object
};

DeviceList.propTypes = {
    devices: React.PropTypes.shape( {
        id: React.PropTypes.string,
        friendlyName: React.PropTypes.string,
        state: React.PropTypes.string,
        host: React.PropTypes.string,
        port: React.PropTypes.string,
        iconPath: React.PropTypes.string
    } ),
    onDeviceClick: React.PropTypes.func
};

const mapStateToProps = state => {
    return {
        devices: state.devices
    };
};

const mapDispatchToProps = dispatch => {
    // const { toggleDeviceState } = deviceActions;

    return {
        onDeviceClick( deviceId, newState ) {
            console.log( "dispatching", deviceId, newState );
            // dispatch( toggleDeviceState( deviceId, newState ) );
        }
    };
};

export default connect( mapStateToProps, mapDispatchToProps )( DeviceList );
