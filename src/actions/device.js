export default {
    toggleCameraReminder( deviceId, newState ) {
        return {
            type: "toggleCameraReminder",
            deviceId,
            newState
        };
    },

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
