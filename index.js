require( "babel-register" );
const path = require( "path" );
const Menubar = require( "menubar" );
const App = require( "./src/app" );

const settings = {
    dir: path.join( __dirname, "./app" ),
    icon: path.join( __dirname, "./app/icons/PlugIconTemplate.png" ),
    height: 125,
    width: 250,
    preloadWindow: true
};

const menubar = new Menubar( settings );

App( menubar );
