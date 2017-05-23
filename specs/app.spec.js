import events from "events";
import postal from "postal";
import notifier from "node-notifier";
import { defer } from "lodash";
import app from "../src/app";

describe( "app", () => {
    let menubarMock = {},
        webContentsMock = {},
        instance ={};

    function runApp( menubarOptions = {} ) {
        webContentsMock = new events.EventEmitter();

        menubarMock = Object.assign( new events.EventEmitter(), {
            app: {
                getPath: jest.fn( () => "/app/data/path/" ),
                quit: jest.fn()
            },
            setOption: jest.fn(),
            window: {
                webContents: webContentsMock,
                openDevTools: jest.fn(),
                show: jest.fn(),
                showInactive: jest.fn(),
                hide: jest.fn(),
                setResizable: jest.fn()
            },
            positioner: {
                move: jest.fn()
            }
        }, menubarOptions );

        instance = app( menubarMock, { hideInitializedWindowAfter: 0 } );
    }

    beforeEach( () => {
        runApp();
    } );

    it( "should setup postal.js as a global module", () => {
        expect( global.postal ).toEqual( postal );
    } );

    it( "should setup the appData path as globally available", () => {
        expect( global.appDataPath ).toEqual( "/app/data/path/" );
    } );

    it( "should handle the menubar's `ready` and `on-create-window` events", () => {
        runApp( {
            on: jest.fn()
        } );

        expect( menubarMock.on ).toHaveBeenCalledTimes( 2 );
        const onReady = menubarMock.on.mock.calls[ 0 ];
        const onCreateWindow = menubarMock.on.mock.calls[ 1 ];
        expect( onReady ).toEqual( [ "ready", expect.any( Function ) ] );
        expect( onCreateWindow ).toEqual( [ "after-create-window", expect.any( Function ) ] );
    } );

    it( "should set call `setResizable` on the window after the window is created", () => {
        menubarMock.emit( "after-create-window" );
        expect( menubarMock.window.setResizable ).toHaveBeenCalledTimes( 1 );
        expect( menubarMock.window.setResizable ).toHaveBeenCalledWith( false );
    } );

    it( "should initialize the window and wire up events when the window is ready", done => {
        postal.subscribe = jest.spyOn( postal, "subscribe" );
        menubarMock.emit( "ready" );

        setTimeout( () => {
            expect( menubarMock.window.showInactive ).toHaveBeenCalledTimes( 1 );
            expect( menubarMock.positioner.move ).toHaveBeenCalledTimes( 1 );
            expect( menubarMock.positioner.move ).toHaveBeenCalledWith( "topRight" );

            expect( postal.subscribe ).toHaveBeenCalledTimes( 3 );
            const requestQuit = postal.subscribe.mock.calls[ 0 ];
            const requestOpenDevTools = postal.subscribe.mock.calls[ 1 ];
            const devicesUpdated = postal.subscribe.mock.calls[ 2 ];

            expect( requestQuit ).toEqual( [ expect.objectContaining( {
                channel: "app",
                topic: "request:quit",
                callback: expect.any( Function )
            } ) ] );

            expect( requestOpenDevTools ).toEqual( [ expect.objectContaining( {
                channel: "app",
                topic: "request:openDevTools",
                callback: expect.any( Function )
            } ) ] );

            expect( devicesUpdated ).toEqual( [ expect.objectContaining( {
                channel: "app",
                topic: "devices:updated",
                callback: expect.any( Function )
            } ) ] );

            postal.subscribe.mockRestore();
            done();
        }, 100 );
    } );

    it( "should handle requests to open devtools", done => {
        const webContentsOn = jest.spyOn( menubarMock.window.webContents, "on" );
        const openDevTools = jest.spyOn( menubarMock.window, "openDevTools" );

        menubarMock.emit( "ready" );
        postal.publish( {
            channel: "app",
            topic: "request:openDevTools"
        } );

        defer( () => {
            expect( menubarMock.setOption ).toHaveBeenCalledTimes( 1 );
            expect( menubarMock.setOption ).toHaveBeenCalledWith( "alwaysOnTop", true );
            expect( webContentsOn ).toHaveBeenCalledTimes( 1 );
            expect( webContentsOn ).toHaveBeenCalledWith( "devtools-closed", expect.any( Function ) );
            expect( openDevTools ).toHaveBeenCalledTimes( 1 );
            expect( openDevTools ).toHaveBeenCalledWith( { mode: "undocked" } );
            done();
        } );
    } );

    it( "should reset state when devtools have been closed", done => {
        const webContentsOn = jest.spyOn( menubarMock.window.webContents, "on" );

        menubarMock.emit( "ready" );
        postal.publish( {
            channel: "app",
            topic: "request:openDevTools"
        } );

        defer( () => {
            menubarMock.setOption.mockClear();
            webContentsMock.emit( "devtools-closed" );

            expect( menubarMock.setOption ).toHaveBeenCalledTimes( 1 );
            expect( menubarMock.setOption ).toHaveBeenCalledWith( "alwaysOnTop", false );
            done();
        } );
    } );

    it( "should handle requests to quit", done => {
        menubarMock.emit( "ready" );
        postal.publish( {
            channel: "app",
            topic: "request:quit"
        } );

        defer( () => {
            expect( menubarMock.app.quit ).toHaveBeenCalledTimes( 1 );
            done();
        } );
    } );

    it( "should handle notifier click events", done => {
        menubarMock.emit( "ready" );
        notifier.emit( "click" );

        defer( () => {
            expect( menubarMock.window.show ).toHaveBeenCalledTimes( 1 );
            done();
        } );
    } );
} );
