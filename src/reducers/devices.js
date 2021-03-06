import { omit, values } from "lodash";
import WemoClient from "wemo-client";
import { saveState } from "../util/disk-io";
import actions from "../actions";

const wemo = new WemoClient();
const { remote: { devicesUpdated } } = actions;

const defaultState = {
    discovering: false,
    devices: {}
};

function prepareState( state ) {
    const currentState = Object.assign( {}, state );
    const stateToSave = {};

    stateToSave.devices = values( currentState.devices ).map( device => {
        return omit( device, "client" );
    } );

    return JSON.stringify( stateToSave );
}

const handlers = {
    checkingForDevices( state, { checking } ) {
        state.discovering = checking;
        return state;
    },

    toggleCameraReminder( state, { deviceId, newState } ) {
        const { devices } = state;
        devices[ deviceId ] = {
            ...devices[ deviceId ],
            cameraReminders: newState
        };

        devicesUpdated( devices );

        return {
            ...state,
            devices: { ...devices }
        };
    },

    toggleDeviceState( state, { deviceId, newState } ) {
        // TODO: mutating state here...look into making this work without mutation
        state.devices[ deviceId ].state = newState;
        const newBinaryState = newState === "on" ? 1 : 0;
        state.devices[ deviceId ].client.setBinaryState( newBinaryState, ( err, response ) => {
            if ( err ) {
                console.error( `Error toggling binary state for device ${ deviceId }: ${ err }` );
            }
        } );

        devicesUpdated( state.devices );
        return state;
    },

    registerDevice( state, { deviceInfo } ) {
        const { devices } = state;
        const { serialNumber, friendlyName, binaryState, host, port, iconList: { icon: { url: iconPath } } } = deviceInfo;
        const deviceState = binaryState === "0" ? "off" : "on";
        const deviceClient = wemo.client( deviceInfo );

        state.devices = Object.assign( {}, ...devices, { [ serialNumber ]: {
            id: serialNumber,
            state: deviceState,
            client: deviceClient,
            deviceInfo,
            friendlyName,
            host,
            port,
            iconPath,
            cameraReminders: true
        } } );

        devicesUpdated( state.devices );
        saveState( prepareState( state ) );

        return state;
    }
};

const devices = ( state = defaultState, action ) => {
    const { type } = action;
    const handler = handlers[ type ];

    if ( handler && typeof handler === "function" ) {
        const args = omit( action, "type" );
        return handlers[ type ]( state, args );
    }

    return state;
};

export default devices;
