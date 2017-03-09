import { omit } from "lodash";

const testDevices = {
    1234: {
        id: "1234",
        friendlyName: "Test Device",
        state: "off",
        host: "123.45.67.890",
        port: "9017",
        iconPath: "icon.jpg"
    }
};

const handlers = {
    toggleDeviceState( state, { deviceId, newState } ) {
        // TODO: mutating state here...look into making this work without mutation
        state.devices[ deviceId ].state = newState;
        return state;
    }
};

const devices = ( state = {}, action ) => {
    // TODO: FOR TESTING ONLY
    state.devices =  testDevices;

    const { type } = action;
    const handler = handlers[ type ];

    if ( handler && typeof handler === "function" ) {
        const args = omit( action, "type" );
        return handlers[ type ]( state, args );
    }

    return state;
};

export default devices;
