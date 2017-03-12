import React from "react";
import { connect } from "react-redux";
import PowerIcon from "react-icons/lib/md/power-settings-new";
import TerminalIcon from "react-icons/lib/fa/terminal";
import { remote } from "../../actions";
import style from "./style.css";

const { quit, openDevTools } = remote;

const Footer = ( { clients } ) => {
    return (
        <footer className={ style.footer }>
            <span title="Quit device controller"><PowerIcon className={ style.quitButton } onClick={ () => quit( clients() ) } /></span>
            <span title="Open dev tools"><TerminalIcon className={ style.devtoolsButton } onClick={ openDevTools } /></span>
        </footer>
    );
};

const mapStateToProps = state => {
    return {
        clients() {
            const { devices } = state;
            const deviceKeys = Object.keys( devices );
            if ( deviceKeys.length ) {
                return deviceKeys.map( key => {
                    return devices[ key ].client;
                } );
            }

            return [];
        }
    };
}

export default connect( mapStateToProps, null )( Footer );
