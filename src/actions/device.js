export default {
    toggleDeviceState( deviceId, newState ) {
        return {
            type: "toggleDeviceState",
            deviceId,
            newState
        };
    }
};
