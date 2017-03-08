import React from "react";
import PowerIcon from "react-icons/lib/md/power-settings-new";
import TerminalIcon from "react-icons/lib/fa/terminal";
import { remote } from "../../actions";
import style from "./style.css";

const { quit, openDevTools } = remote;

const Footer = props => {
    return (
        <footer className={ style.footer }>
            <span title="Quit device controller"><PowerIcon className={ style.quitButton } onClick={ quit } /></span>
            <span title="Open dev tools"><TerminalIcon className={ style.devtoolsButton } onClick={ openDevTools } /></span>
        </footer>
    );
};

export default Footer;
