jest.mock( "is-camera-on", () => {
    return jest.fn( () => ( Promise.resolve( false ) ) );
} );

jest.mock( "../../src/util/notifications", () => ( {
    notifyDeviceOff: jest.fn(),
    notifyDeviceOn: jest.fn()
} ) );

import isCameraOn from "is-camera-on";
import { notifyDeviceOff, notifyDeviceOn } from "../../src/util/notifications";
import monitorCamera from "../../src/util/camera-monitor";

const deviceOffData = {
    abc123: {
        id: "abc123",
        friendlyName: "Test Device",
        state: "off"
    }
};

const deviceOnData = {
    abc123: {
        id: "abc123",
        friendlyName: "Test Device",
        state: "on"
    }
};

const resolvePromises = () => {
    return new Promise( resolve => setImmediate( resolve ) );
}

describe( "camera-monitor", () => {
    beforeEach( () => {
        jest.useFakeTimers();
    } );

    afterEach( () => {
        // call it with an empty object to clear any running intervals checking the camera state
        monitorCamera( {} );
    } );

    it( "should monitor camera state when given devices to check the state for", () => {
        monitorCamera( deviceOffData );
        jest.runTimersToTime( 60000 );
        expect( isCameraOn ).toHaveBeenCalledTimes( 1 );
    } );

    it( "should not monitor the camera when given no devices to check the state for", () => {
        monitorCamera( {} );
        jest.runTimersToTime( 60000 );
        expect( isCameraOn ).not.toHaveBeenCalled();
    } );

    describe( "when the camera is off", () => {
        describe( "and all devices are off", () => {
            it( "should not call any notification handlers", () => {
                monitorCamera( deviceOffData );
                jest.runTimersToTime( 60000 );
                expect( notifyDeviceOn ).not.toHaveBeenCalled();
                expect( notifyDeviceOff ).not.toHaveBeenCalled();
            } );
        } );

        describe( "and a device is on", () => {
            it( "should call the appropriate notification handler", () => {
                monitorCamera( deviceOnData );
                jest.runTimersToTime( 60000 );
                return resolvePromises().then( () => {
                    expect( notifyDeviceOn ).toHaveBeenCalledTimes( 1 );
                    expect( notifyDeviceOn ).toHaveBeenCalledWith( {
                        deviceId: "abc123",
                        friendlyName: "Test Device",
                        state: "on"
                    } );
                } );
            } );
        } );
    } );

    describe( "when the camera is on", () => {
        beforeEach( () => {
            isCameraOn.mockImplementation( () => ( Promise.resolve( true ) ) );
        } );

        describe( "and a device is off", () => {
            it( "should call the appropriate notification handler", () => {
                monitorCamera( deviceOffData );
                jest.runTimersToTime( 60000 );
                return resolvePromises().then( () => {
                    expect( notifyDeviceOff ).toHaveBeenCalledTimes( 1 );
                    expect( notifyDeviceOff ).toHaveBeenCalledWith( {
                        deviceId: "abc123",
                        friendlyName: "Test Device",
                        state: "off"
                    } );
                } );
            } );
        } );

        describe( "and a device is on", () => {
            it( "should not call any notification handlers", () => {
                monitorCamera( deviceOnData );
                jest.runTimersToTime( 60000 );
                expect( notifyDeviceOn ).not.toHaveBeenCalled();
                expect( notifyDeviceOff ).not.toHaveBeenCalled();
            } );
        } );
    } );
} );
