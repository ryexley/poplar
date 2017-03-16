import AppRemote from "electron-rpc/client";

const appRemote = new AppRemote();

export default {
    quit( clients ) {
        // TODO: This functionality turns off all devices when
        // quitting the app...consider making this a configurable
        // "option" in the future. Could be unwanted in some cases
        // or for some users...if anyone else ever uses it.

        if ( clients.length ) {
            let devicesTurnedOff = 0;
            clients.forEach( ( client, index ) => {
                client.setBinaryState( 0 );
                devicesTurnedOff = devicesTurnedOff + 1;
                if ( devicesTurnedOff === clients.length ) {
                    appRemote.request( "quit" );
                }
            } );
        } else {
            appRemote.request( "quit" );
        }
    },

    openDevTools() {
        appRemote.request( "openDevTools" );
    },

    getAppDataPath() {
        return new Promise( ( resolve, reject ) => {
            appRemote.request( "appDataPath", ( err, path ) => {
                if ( err ) {
                    reject( err );
                }

                resolve( path );
            } );
        } );
    }
};
