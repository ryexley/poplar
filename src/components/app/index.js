import React from "react";
import Footer from "../footer";

const App = ( props, { store } ) => {
    return (
        <section className="app">
            <Footer />
        </section>
    );
};

App.contextTypes = {
    store: React.PropTypes.object
};

export default App;
