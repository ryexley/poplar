import React, { Component } from "react";
import PropTypes from "prop-types";

class Container extends Component {
    componentDidMount() {
        const { store } = this.context;
        this.unsubscribe = store.subscribe( () => {
            this.forceUpdate();
        } );
    }

    componentWillUnmount() {
        this.unsubscribe();
    }
};

Container.contextTypes = {
    store: PropTypes.object
};

export default Container;
