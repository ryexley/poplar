import { omit } from "lodash";
import WemoClient from "wemo-client";

const wemo = new WemoClient();

const defaultState = {
    devices: {}
};

const handlers = {
    toggleDeviceState( state, { deviceId, newState } ) {
        state.devices[ deviceId ].client.setBinaryState( newState === "on" ? 1 : 0 );
        // TODO: mutating state here...look into making this work without mutation
        state.devices[ deviceId ].state = newState;
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
            friendlyName,
            host,
            port,
            iconPath
        } } );

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
