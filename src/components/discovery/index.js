import React from "react";
import SpinnerIcon from "react-icons/lib/fa/circle-o-notch";
import style from "./style.css";

const Discovery = () => {
    return (
        <div className={ style.discovery }>
            <div className={ style.discoveringDevices }>
                <span>Discovering devices</span>
                <span><SpinnerIcon className={ style.spinnerIcon } /></span>
            </div>
        </div>
    );
};

export default Discovery;
