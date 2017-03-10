import React from "react";
import { connect } from "react-redux";
import Container from "../container";
import TryAgainIcon from "react-icons/lib/fa/repeat";
import actions from "../../actions";
import style from "./no-devices-found.css";

const NoDevicesFound = props => {
    const { onTryAgainClick } = props;

    return (
        <div className={ style.container }>
            <div className={ style.content }>
                <span className={ style.label }>No Devices Found</span>
                <span className={ style.tryAgainIcon } onClick={ onTryAgainClick }><TryAgainIcon /></span>
            </div>
        </div>
    );
};

const mapStateToProps = state => {
    return {};
}

const mapDispatchToProps = dispatch => {
    return {
        onTryAgainClick() {
            const { discovery: { findDevices } } = actions;
            findDevices( dispatch );
        }
    };
}

export default connect( mapStateToProps, mapDispatchToProps )( NoDevicesFound );
