const path = require( "path" );
const Server = require( "electron-rpc/server" );
const Menubar = require( "menubar" );

const mb = new Menubar( {
    dir: path.join( __dirname, "./app" ),
    icon: path.join( __dirname, "./app/icons/PlugIconTemplate.png" ),
    height: 125,
    width: 250
} );

const host = new Server();

mb.on( "after-create-window", () => {
    host.configure( mb.window.webContents );
    mb.window.setResizable( false );
} );

mb.on( "ready", () => {
    host.on( "quit", () => {
        mb.app.quit();
    } );

    host.on( "openDevTools", () => {
        mb.setOption( "alwaysOnTop", true );
        mb.window.webContents.on( "devtools-closed", () => {
            mb.setOption( "alwaysOnTop", false );
        } );

        mb.window.openDevTools( { mode: "undocked" } );
    } );

    host.on( "appDataPath", ( req, next ) => {
        const appDataPath = mb.app.getPath( "appData" );
        next( null, appDataPath );
    } );
} );
