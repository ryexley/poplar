import WemoClient from "wemo-client";
import { registerDevice } from "./device";

const discoveryActions = {
    checkingForDevices( dispatch, checking ) {
        dispatch( { type: "checkingForDevices", checking } );
    },

    findDevices( dispatch ) {
        const wemo = new WemoClient();
        const checkIntervalDuration = 1000; // check every second
        const timeout = 10 * 1000; // check for 10 seconds before quitting
        let deviceFound = false;

        discoveryActions.checkingForDevices( dispatch, true );

        const checkInterval = setInterval( () => {
            if ( !deviceFound ) {
                wemo.discover( deviceInfo => {
                    dispatch( registerDevice( deviceInfo ) );
                    deviceFound = true;
                    discoveryActions.checkingForDevices( dispatch, false );
                } );
            }
        }, checkIntervalDuration );

        setTimeout( () => {
            clearInterval( checkInterval );
            discoveryActions.checkingForDevices( dispatch, false );
        }, timeout );
    }
};

export default discoveryActions;
