export default {
    toggleDeviceState( deviceId, newState ) {
        return {
            type: "toggleDeviceState",
            deviceId,
            newState
        };
    },

    registerDevice( deviceInfo ) {
        return {
            type: "registerDevice",
            deviceInfo
        };
    }
};
