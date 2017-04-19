import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Container from "../container";
import Discovery from "../discovery";
import NoDevicesFound from "../no-devices-found";
import DeviceList from "../device-list";
import Footer from "../footer";
import actions from "../../actions";

class App extends Container {
    componentWillMount() {
        const { store: { dispatch } } = this.context;
        const { discovery: { loadDevices } } = actions;
        loadDevices( dispatch );
    }

    renderContent() {
        const { checkingForDevices, devicesFound } = this.props;

        if ( checkingForDevices() ) {
            return <Discovery />;
        } else {
            return ( devicesFound() ? <DeviceList /> : <NoDevicesFound /> );
        }
    }

    render() {
        return (
            <section className="app">
                { this.renderContent() }
                <Footer />
            </section>
        );
    }
}

App.contextTypes = {
    store: PropTypes.object
};

const mapStateToProps = state => {
    return {
        checkingForDevices() {
            return state.discovering;
        },
        devicesFound() {
            return Object.keys( state.devices ).length;
        }
    }
};

const mapDispatchToProps = dispatch => { return {}; };

export default connect( mapStateToProps, mapDispatchToProps )( App );
