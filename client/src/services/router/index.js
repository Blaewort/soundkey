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
            <Switch>
                <Route sensitive path="/visualizer/:mode(chord|scale)/:notation">
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