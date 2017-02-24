const { isEmpty, template } = require( "lodash" );
const Client = require( "electron-rpc/client" );
const Wemo = require( "wemo-client" );

const client = new Client();
const wemo = new Wemo();

const deviceClients = {};
let devicesFound = false;
let rootEl = {};

function quit() {
    shutdownAllDevices();
    client.request( "quit" );
}

function openDevTools() {
    client.request( "openDevTools" );
}

function shutdownAllDevices() {
    Object.keys( deviceClients ).forEach( key => {
        deviceClients[ key ].client.setBinaryState( 0 );
    } );
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
}

function checkForDevices() {
    // for initial startup...
    // check every second until we find a device
    const initialDiscoveryInterval = 1000;
    setInterval( () => {
        if ( !devicesFound ) {
            wemo.discover( registerDeviceClient );
        }
    }, initialDiscoveryInterval );

    // then after that...
    // periodically check for new devices every 10 minutes
    const periodicDiscoveryInterval = 60 * 1000 * 10;
    // check for one minute
    const periodicDiscoveryCheckTimeout = 60 * 1000;
    // every five seconds
    const periodicDiscoveryCheckInterval = 5 * 1000;

    setInterval( () => {
        const periodicCheck = setInterval( () => {
            wemo.discover( registerDeviceClient );
        }, periodicDiscoveryCheckInterval );

        setTimeout( () => {
            clearInterval( periodicCheck );
        }, periodicDiscoveryCheckTimeout );

    }, periodicDiscoveryInterval );
}

function registerDeviceClient( deviceInfo ) {
    const { serialNumber: id, friendlyName, binaryState, host, port, iconList: { icon: { url: iconPath } } } = deviceInfo;
    const state = ( binaryState === 1 ) ? "on" : "off";

    if ( !deviceClients[ id ] ) {
        const deviceClient = wemo.client( deviceInfo );

        // deviceClient.on( "binaryState", value => {
        //     updateDeviceState( { deviceId: id, state: ( value === "1" ) ? "on" : "off" } );
        // } );

        deviceClients[ id ] = { deviceInfo, client: deviceClient };
    }

    renderDevice( { id, friendlyName, state, icon: `http://${ host }:${ port }/${ iconPath }` } );
    devicesFound = true;
}

function updateDeviceState( { deviceId, state } ) {
    const deviceControlEl = document.querySelector( `[data-deviceId='${ deviceId }'] > i` );
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
    document.getElementById( "devTools-button" ).addEventListener( "click", openDevTools );
}

function renderDevice( { id, friendlyName, state, icon } ) {
    if ( rootEl.getAttribute( "data-discovering" ) ) {
        clear( rootEl );
        rootEl.removeAttribute( "data-discovering" );
    }

    const deviceControlTemplate = template( [
        "<div class='device'>",
        "   <img class='device-icon' src='${ icon }' />",
        "   <span class='device-name'>${ friendlyName }</span>",
        "   <span class='device-stateToggle' data-state='${ state }' data-deviceId='${ id }' title='Toggle device state'><i class='fa fa-toggle-${ state }' aria-hidden='true'></i></span>",
        "</div>"
    ].join( "" ) );

    const deviceControlEl = deviceControlTemplate( { id, friendlyName, state, icon } );
    rootEl.innerHTML += deviceControlEl;

    document.querySelector( `[data-deviceId='${ id }']` ).addEventListener( "click", toggleDeviceState );
}

document.addEventListener( "DOMContentLoaded", function() {
    rootEl = document.getElementById( "root" );
    start();
} );
