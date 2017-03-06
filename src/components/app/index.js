import React from "react";

const App = ( props, { store } ) => {
    return (
        <div>Wemo Menubar Controller</div>
    );
};

App.contextTypes = {
    store: React.PropTypes.object
};

export default App;
