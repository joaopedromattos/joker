// Required polyfills
import "core-js/fn/array/values";
import "core-js/fn/object/values";

import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import rootReducer from "./app/reducers";
import persistMiddleware from "./app/middleware/persistMiddleware";
import App from "./app/components/App";
import ResearcherAuth from "./app/components/admin/researcherAuth";

// Extract initial redux state received from the server
const preloadedState = window.PRELOADED_STATE;
delete window.PRELOADED_STATE;

const store = createStore(
  rootReducer,
  preloadedState,
  composeWithDevTools(applyMiddleware(persistMiddleware))
);

ReactDOM.hydrate(
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route path="/" exact={true} component={App}/>
        <Route path="/researcherAuth" component={ResearcherAuth}/>
      </Switch>
    </BrowserRouter>
  </Provider>,
  document.getElementById("app")
);
