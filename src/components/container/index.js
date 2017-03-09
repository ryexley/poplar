import React, { Component } from "react";

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
    store: React.PropTypes.object
};

export default Container;
