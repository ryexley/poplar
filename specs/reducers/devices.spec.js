jest.mock( "electron", () => ( {
    remote: {
        getGlobal: jest.fn( () => ( {
            publish: jest.fn(),
            subscribe: jest.fn()
        } ) )
    }
} ) );

jest.mock( "wemo-client", () => {
    return function() {
        return {
            client: function() {
                return {
                    setBinaryState: jest.fn()
                };
            }
        };
    };
} );

jest.mock( "../../src/util/disk-io", () => ( {
    saveState: jest.fn()
} ) );

import { remote } from "electron";
import WemoClient from "wemo-client";
import { saveState } from "../../src/util/disk-io";
import actions from "../../src/actions";
import devices from "../../src/reducers/devices";

describe( "devices", () => {
    const initialState = () => ( {
        discovering: false,
        devices: {}
    } );

    const sampleDeviceInfo = {
        serialNumber: "abc123",
        friendlyName: "test device",
        binaryState: "0",
        host: "example.com",
        port: "1234",
        iconList: {
            icon: {
                url: "/device-image.png"
            }
        }
    };

    it( "should return initial state", () => {
        const state = devices( undefined, {} );
        expect( state ).toEqual( initialState() );
    } );

    describe( "actions", () => {
        describe( "checkingForDevices", () => {
            it( "should set the `discovering` flag appropriately", () => {
                const state = devices( initialState(), {
                    type: "checkingForDevices",
                    checking: true
                } );

                expect( state ).toEqual( {
                    discovering: true,
                    devices: {}
                } );
            } );
        } );

        describe( "registerDevice", () => {
            beforeEach( () => {
                actions.remote.devicesUpdated = jest.fn();
            } );

            it( "should add the device to state", () => {
                const state = devices( initialState(), {
                    type: "registerDevice",
                    deviceInfo: sampleDeviceInfo
                } );

                expect( state ).toEqual( {
                    discovering: false,
                    devices: {
                        abc123: {
                            id: "abc123",
                            state: "off",
                            client: {
                                setBinaryState: expect.any( Function )
                            },
                            deviceInfo: {
                                serialNumber: "abc123",
                                friendlyName: "test device",
                                binaryState: "0",
                                host: "example.com",
                                port: "1234",
                                iconList: {
                                    icon: {
                                        url: "/device-image.png"
                                    }
                                }
                            },
                            friendlyName: "test device",
                            host: "example.com",
                            port: "1234",
                            iconPath: "/device-image.png"
                        }
                    }
                } );
            } );

            it( "should set the device state correctly when the registered device is on", () => {
                const state = devices( initialState(), {
                    type: "registerDevice",
                    deviceInfo: Object.assign( sampleDeviceInfo, {
                        binaryState: "1"
                    } )
                } );

                expect( state ).toEqual( {
                    discovering: false,
                    devices: {
                        abc123: {
                            id: "abc123",
                            state: "on",
                            client: {
                                setBinaryState: expect.any( Function )
                            },
                            deviceInfo: {
                                serialNumber: "abc123",
                                friendlyName: "test device",
                                binaryState: "1",
                                host: "example.com",
                                port: "1234",
                                iconList: {
                                    icon: {
                                        url: "/device-image.png"
                                    }
                                }
                            },
                            friendlyName: "test device",
                            host: "example.com",
                            port: "1234",
                            iconPath: "/device-image.png"
                        }
                    }
                } );
            } );
        } );

        describe( "toggleDeviceState", () => {
            let state = initialState();

            beforeEach( () => {
                state = devices( state, {
                    type: "registerDevice",
                    deviceInfo: sampleDeviceInfo
                } );
            } );

            it( "should toggle the state of an existing device on state appropriately", () => {
                state = devices( state, {
                    type: "toggleDeviceState",
                    deviceId: "abc123",
                    newState: "on"
                } );

                expect( state ).toEqual( {
                    discovering: false,
                    devices: {
                        abc123: {
                            id: "abc123",
                            state: "on",
                            client: {
                                setBinaryState: expect.any( Function )
                            },
                            deviceInfo: {
                                serialNumber: "abc123",
                                friendlyName: "test device",
                                binaryState: "1",
                                host: "example.com",
                                port: "1234",
                                iconList: {
                                    icon: {
                                        url: "/device-image.png"
                                    }
                                }
                            },
                            friendlyName: "test device",
                            host: "example.com",
                            port: "1234",
                            iconPath: "/device-image.png"
                        }
                    }
                } );
            } );
        } );
    } );
} );
