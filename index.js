const path = require( "path" );
const Server = require( "electron-rpc/server" );
const Menubar = require( "menubar" );

const mb = new Menubar( {
    dir: path.join( __dirname, "./app" ),
    icon: path.join( __dirname, "./app/icons/PlugIconTemplate.png" ),
    height: 125,
    width: 250,
    alwaysOnTop: true
} );

const app = new Server();

// mb.on( "after-hide", () => { mb.app.hide(); } );

mb.on( "after-create-window", () => {
    mb.window.setResizable( false );
} );

mb.on( "ready", () => {
    app.on( "quit", () => {
        mb.app.quit();
    } );

    app.on( "openDevTools", () => {
        mb.window.openDevTools( { mode: "undocked" } );
    } );
} );
