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
import ResearcherAuth from "./app/components/admin/auth/researcherAuth";
import ResearcherDashboard from "./app/components/admin/dashboard/researcherDashboard";
import BoardContainer from './app/components/Board/BoardContainer';
import firebase from "firebase";

// Extract initial redux state received from the server
const preloadedState = window.PRELOADED_STATE;
delete window.PRELOADED_STATE;

const store = createStore(
  rootReducer,
  preloadedState,
  composeWithDevTools(applyMiddleware(persistMiddleware))
);

var config = {
  apiKey: "AIzaSyB_NnYnVtuvvLQizJfjC3_3dlJ0hhfSXuU",
  authDomain: "joker-1544625266228.firebaseapp.com",
  databaseURL: "https://joker-1544625266228.firebaseio.com",
  projectId: "joker-1544625266228",
  storageBucket: "joker-1544625266228.appspot.com",
  messagingSenderId: "20089384964"
};

firebase.initializeApp(config);

ReactDOM.hydrate(
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route path="/" exact={true} component={App}/>
        <Route path="/researcherAuth" component={ResearcherAuth}/>
        <Route path="/researcherDashboard" component={ResearcherDashboard} />
        <Route path="/b/:boardId" component={BoardContainer} />

      </Switch>
    </BrowserRouter>
  </Provider>,
  document.getElementById("app")
);
