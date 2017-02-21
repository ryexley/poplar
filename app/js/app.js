const { template } = require( "lodash" );
const Client = require( "electron-rpc/client" );
const client = new Client();

function quit() {
    client.request( "quit" );
}

function toggleDeviceState( e ) {
    const toggle = e.currentTarget;
    const state = toggle.getAttribute( "data-state" );
    const icon = toggle.querySelector( "i" );

    if ( state === "off" ) {
        toggle.setAttribute( "data-state", "on" );
        icon.classList.remove( "fa-toggle-off" );
        icon.classList.add( "fa-toggle-on" );
    } else {
        toggle.setAttribute( "data-state", "off" );
        icon.classList.remove( "fa-toggle-on" );
        icon.classList.add( "fa-toggle-off" );
    }
}

function registerEvents() {
    document.getElementById( "quit-button" ).addEventListener( "click", quit );
    Array.from( document.querySelectorAll( ".device-stateToggle" ) ).forEach( toggle => { toggle.addEventListener( "click", toggleDeviceState ); } );
    // console.log( document.querySelectorAll( ".device-stateToggle" ).length );
}

function renderDevice( { friendlyName } ) {
    const deviceControlTemplate = template( [
        "<div class='device'>",
        "   <span class='device-name'>${ friendlyName }</span>",
        "   <span class='device-stateToggle' data-state='off'><i class='fa fa-toggle-off' aria-hidden='true'></i></span>",
        "</div>"
    ].join( "" ) );

    const deviceControlEl = deviceControlTemplate( { friendlyName } );
    document.getElementById( "root" ).innerHTML += deviceControlEl;
}

document.addEventListener( "DOMContentLoaded", function() {
    // alert( "Wemo Menubar Controller" );
    // document.querySelector( "#root" ).addEventListener( "click", function() {
    //  app.hide();
    // } );
    renderDevice( { friendlyName: "In a meeting" } );
    registerEvents();
} );
