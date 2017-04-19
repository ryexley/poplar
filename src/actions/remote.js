import { remote } from "electron";

const postal = remote.getGlobal( "postal" );

function requestQuit() {
    postal.publish( {
        channel: "app",
        topic: "request:quit"
    } );
}

export default {
    quit( clients ) {
        // TODO: This functionality turns off all devices when
        // quitting the app...consider making this a configurable
        // "option" in the future. Could be unwanted in some cases
        // or for some users...if anyone else ever uses it.

        if ( clients.length ) {
            let devicesTurnedOff = 0;
            clients.forEach( ( client, index ) => {
                client.setBinaryState( 0, ( err, response ) => {
                    devicesTurnedOff += 1;

                    if ( devicesTurnedOff === clients.length ) {
                        requestQuit();
                    }
                } );
            } );
        } else {
            requestQuit();
        }
    },

    openDevTools() {
        postal.publish( {
            channel: "app",
            topic: "request:openDevTools"
        } );
    },

    getAppDataPath() {
        return Promise.resolve( remote.getGlobal( "appDataPath" ) );
    },

    devicesUpdated( devices ) {
        postal.publish( {
            channel: "app",
            topic: "devices:updated",
            data: devices
        } );
    }
};
