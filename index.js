const Server = require( "electron-rpc/server" );
const Menubar = require( "menubar" );

const mb = new Menubar( {
    dir: "./app",
    height: 125,
    width: 250,
    alwaysOnTop: true
} );

const app = new Server();

// mb.on( "after-hide", () => { mb.app.hide(); } );

mb.on( "after-create-window", () => {
    mb.window.setResizable( false );
    mb.window.openDevTools();
} );

mb.on( "ready", () => {
    app.on( "quit", () => {
        mb.app.quit();
    } );
} );
