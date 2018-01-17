import path from "path";
import { map, values } from "lodash";
import isCameraOn from "is-camera-on";
import { notifyDeviceOff, notifyDeviceOn } from "./notifications";

const CHECK_CAMERA_INTERVAL = 60000;
let monitoringCamera = null;

function notify( devices, cameraIsOn ) {
    if ( cameraIsOn ) {
        const devicesThatAreOff = devices.filter( device => device.state === "off" );
        if ( devicesThatAreOff.length ) {
            devicesThatAreOff.forEach( device => {
                if ( device.cameraReminders ) {
                    notifyDeviceOff( device );
                }
            } );
        }
    } else {
        const devicesThatAreOn = devices.filter( device => device.state === "on" );
        if ( devicesThatAreOn.length ) {
            devicesThatAreOn.forEach( device => {
                if ( device.cameraReminders ) {
                    notifyDeviceOn( device );
                }
            } );
        }
    }
}

function monitorCamera( data, envelope ) {
    const devices = values( data ).map( device => {
        const { id: deviceId, friendlyName, state, cameraReminders } = device;
        return { deviceId, friendlyName, cameraReminders, state };
    } );

    if ( monitoringCamera ) {
        clearInterval( monitoringCamera );
    }

    if ( devices.length ) {
        monitoringCamera = setInterval( () => {
            isCameraOn().then( isOn => notify( devices, isOn ) );
        }, CHECK_CAMERA_INTERVAL );
    }
}

export default monitorCamera;
