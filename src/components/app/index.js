import React from "react";
import { connect } from "react-redux";
import Container from "../container";
import Discovery from "../discovery";
import DeviceList from "../DeviceList";
import Footer from "../footer";
import actions from "../../actions";


class App extends Container {
    componentWillMount() {
        const { store: { dispatch } } = this.context;
        const { discovery: { findDevices } } = actions;
        findDevices( dispatch );
    }

    render() {
        const { devicesFound } = this.props;

        return (
            <section className="app">
                { devicesFound() ? <DeviceList /> : <Discovery /> }
                <Footer />
            </section>
        );
    }
}

App.contextTypes = {
    store: React.PropTypes.object
};

const mapStateToProps = state => {
    return {
        devicesFound() {
            return Object.keys( state.devices ).length;
        }
    }
};

const mapDispatchToProps = dispatch => { return {}; };

export default connect( mapStateToProps, mapDispatchToProps )( App );
