import WemoClient from "wemo-client";
import { registerDevice } from "./device";

export default {
    findDevices( dispatch ) {
        const wemo = new WemoClient();
        const checkIntervalDuration = 1000; // check every second
        const timeout = 30 * 1000; // check for 30 seconds before quitting
        let deviceFound = false;

        const checkInterval = setInterval( () => {
            if ( !deviceFound ) {
                wemo.discover( deviceInfo => {
                    dispatch( registerDevice( deviceInfo ) );
                    deviceFound = true;
                } );
            }
        }, checkIntervalDuration );

        setTimeout( () => clearInterval( checkInterval ), timeout );
    }
};
