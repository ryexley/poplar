import React from "react";
import Discovery from "../discovery";
import Footer from "../footer";

const App = ( props, { store } ) => {
    return (
        <section className="app">
            <Discovery />
            <Footer />
        </section>
    );
};

App.contextTypes = {
    store: React.PropTypes.object
};

export default App;
