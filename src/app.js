import notifier from "node-notifier";
import postal from "postal";
import monitorCamera from "./util/camera-monitor";

const defaultOptions = {
    hideInitializedWindowAfter: 2000
};

export default function( menubar, options = defaultOptions ) {
    global.postal = postal;
    global.appDataPath = menubar.app.getPath( "appData" );

    function openDevTools() {
        menubar.setOption( "alwaysOnTop", true );
        menubar.window.webContents.on( "devtools-closed", () => menubar.setOption( "alwaysOnTop", false ) );
        menubar.window.openDevTools( { mode: "undocked" } );
    }

    function wireupEvents() {
        postal.subscribe( {
            channel: "app",
            topic: "request:quit",
            callback: () => menubar.app.quit()
        } );

        postal.subscribe( {
            channel: "app",
            topic: "request:openDevTools",
            callback: () => openDevTools()
        } );

        postal.subscribe( {
            channel: "app",
            topic: "devices:updated",
            callback: monitorCamera
        } );

        notifier.on( "click", () => menubar.window.show() );
    }

    function initializeWindow() {
        menubar.window.showInactive();
        menubar.positioner.move( "topRight" );
    }

    function onReady() {
        setTimeout( () => initializeWindow(), 100 );
        setTimeout( () => menubar.window.hide(), options.hideInitializedWindowAfter );
        wireupEvents();
    }

    function onCreateWindow() {
        menubar.window.setResizable( false );
    }

    menubar.on( "ready", onReady );
    menubar.on( "after-create-window", onCreateWindow );
}
