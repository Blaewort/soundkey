import React from "react";
import {
    Switch,
    Route
  } from "react-router-dom";
import Home from '../../scenes/home/index';
import Visualizer from '../../scenes/visualizer/index';
import Dictionary from '../../scenes/dictionary/index';

function App() {
    return (
        <>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css"></link>
            <Switch>
                <Route sensitive path="/visualizer/:instrument/:mode(chord|scale)/:notation">
                    <Visualizer />
                </Route>
                <Route path="/dictionary">
                    <Dictionary />
                </Route>
                <Route path="/">
                    <Home />
                </Route >
            </Switch>
        </>
    );
}

export default App;