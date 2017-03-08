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

const devices = ( state = {}, action ) => {
    state = {
        devices: testDevices
    };

    return state;
};

export default devices;
