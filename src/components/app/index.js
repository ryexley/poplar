import React from "react";
import { connect } from "react-redux";
import Container from "../container";
import Discovery from "../discovery";
import NoDevicesFound from "../no-devices-found";
import DeviceList from "../DeviceList";
import Footer from "../footer";
import actions from "../../actions";

class App extends Container {
    componentWillMount() {
        const { store: { dispatch } } = this.context;
        const { discovery: { findDevices } } = actions;
        findDevices( dispatch );
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
    store: React.PropTypes.object
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
