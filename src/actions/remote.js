import Client from "electron-rpc/client";

const client = new Client();

export default {
    quit() {
        client.request( "quit" );
    },

    openDevTools() {
        client.request( "openDevTools" );
    }
};
