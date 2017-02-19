const Menubar = require( "menubar" );

const mb = new Menubar( {
	dir: "./app",
	height: 125,
	width: 250
} );

mb.on( "after-hide", () => { mb.app.hide(); } );

