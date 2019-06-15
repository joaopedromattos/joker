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
import BoardComponent from "./app/components/Board/BoardComponent";
import firebase from "firebase";
import { loadState, saveState } from "./server/reloadManager";

// Extract initial redux state received from the server
// const preloadedState = window.PRELOADED_STATE;
// delete window.PRELOADED_STATE;


const persistedState = loadState();
const store = createStore(
  rootReducer,
  persistedState,
  composeWithDevTools(applyMiddleware(persistMiddleware)),
);

store.subscribe(() => {
  saveState(store.getState());
})


var config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
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
        <Route path="/boardAccess/:boardId" component={BoardComponent} />
        <Route path="/boardAccess" component={BoardComponent} />
      </Switch>
    </BrowserRouter>
  </Provider>,
  document.getElementById("app")
);
