const { isEmpty, template } = require( "lodash" );
const Client = require( "electron-rpc/client" );
const Wemo = require( "wemo-client" );

const client = new Client();
const wemo = new Wemo();
const discoveryInterval = 10000;

const deviceClients = {};

let rootEl = {};

function quit() {
    client.request( "quit" );
}

function clear( el ) {
    while ( el.hasChildNodes() ) {
        rootEl.removeChild( rootEl.firstChild );
    }
}

function renderDiscoveringDevices() {
    rootEl.setAttribute( "data-discovering", true );

    const discoveringDevicesEl = [
        "<div class='discovering-devices'>",
        "   <span>Discovering devices</span>",
        "   <span class='spinner'><i class='fa fa-cog fa-spin fa-fw'></i></span>",
        "</div>"
    ].join( "" );

    rootEl.innerHTML += discoveringDevicesEl;
}

function start() {
    registerEvents();
    renderDiscoveringDevices();
    checkForDevices();
    setInterval( checkForDevices, discoveryInterval );
}

function checkForDevices() {
    console.log( "Discovering devices..." );
    wemo.discover( registerDeviceClient );
}

function registerDeviceClient( deviceInfo ) {
    const { serialNumber: id, friendlyName, binaryState } = deviceInfo;
    const state = ( binaryState === 1 ) ? "on" : "off";

    if ( !deviceClients[ id ] ) {
        const deviceClient = wemo.client( deviceInfo );

        // deviceClient.on( "binaryState", value => {
        //     updateDeviceState( { deviceId: id, state: ( value === "1" ) ? "on" : "off" } );
        // } );

        deviceClients[ id ] = { deviceInfo, client: deviceClient };
    }

    renderDevice( { id, friendlyName, state } );
}

function updateDeviceState( { deviceId, state } ) {
    const deviceControlEl = document.querySelector( `[data-deviceId='${ deviceId }'] > i` );
    console.log( "device state updated", deviceId, state, deviceControlEl );
}

function toggleDeviceState( e ) {
    const toggle = e.currentTarget;
    const clientId = toggle.getAttribute( "data-deviceId" );
    const state = toggle.getAttribute( "data-state" );
    const icon = toggle.querySelector( "i" );

    if ( state === "off" ) {
        deviceClients[ clientId ].client.setBinaryState( 1 );
        toggle.setAttribute( "data-state", "on" );
        icon.classList.remove( "fa-toggle-off" );
        icon.classList.add( "fa-toggle-on" );
    } else {
        deviceClients[ clientId ].client.setBinaryState( 0 );
        toggle.setAttribute( "data-state", "off" );
        icon.classList.remove( "fa-toggle-on" );
        icon.classList.add( "fa-toggle-off" );
    }
}

function registerEvents() {
    document.getElementById( "quit-button" ).addEventListener( "click", quit );
}

function renderDevice( { id, friendlyName, state } ) {
    if ( rootEl.getAttribute( "data-discovering" ) ) {
        clear( rootEl );
        rootEl.removeAttribute( "data-discovering" );
    }

    const deviceControlTemplate = template( [
        "<div class='device'>",
        "   <span class='device-name'>${ friendlyName }</span>",
        "   <span class='device-stateToggle' data-state='${ state }' data-deviceId='${ id }' title='Toggle device state'><i class='fa fa-toggle-${ state }' aria-hidden='true'></i></span>",
        "   <span class='device-flash' title='Make device flash'><i class='fa fa-flash' aria-hidden='true'></i></span>",
        "</div>"
    ].join( "" ) );

    const deviceControlEl = deviceControlTemplate( { id, friendlyName, state } );
    rootEl.innerHTML += deviceControlEl;

    document.querySelector( `[data-deviceId='${ id }']` ).addEventListener( "click", toggleDeviceState );
}

document.addEventListener( "DOMContentLoaded", function() {
    rootEl = document.getElementById( "root" );
    start();
} );
