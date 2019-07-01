import { readFileSync } from "fs";
import React from "react";
import { renderToString } from "react-dom/server";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { StaticRouter } from "react-router";
import { Helmet } from "react-helmet";
import { resetContext } from "react-beautiful-dnd";
import App from "../app/components/App";
import rootReducer from "../app/reducers";
import ResearcherAuth from "../app/components/admin/auth/researcherAuth";
import ResearcherDashboard from "../app/components/admin/dashboard/researcherDashboard";
import BoardComponent from "../app/components/Board/BoardComponent";
import BoardContainer from '../app/components/Board/BoardContainer';
import { Switch, Route } from "react-router-dom";
import { ServerStyleSheets, ThemeProvider } from '@material-ui/styles';
import theme from '../assets/theme/theme';


// Get the manifest which contains the names of the generated files. The files contain hashes
// that change every time they are updated, which enables aggressive caching.
const manifest = JSON.parse(
  readFileSync(`./dist/public/manifest.json`, "utf8")
);


const renderPage = (req, res) => {

  const sheets = new ServerStyleSheets();

  // Put initialState (which contains board state) into a redux store that will be passed to the client
  // through the window object in the generated html string  
  const store = createStore(rootReducer);

  const context = {};

  resetContext();

  // This is where the magic happens
  // Some kind of route black-magic is happening here.
  // Please, keep yourself away, little wanderer.
  const appString = renderToString( 
    sheets.collect(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <StaticRouter location={req.url} context={context}>        
            <Switch>
              <Route path="/" exact={true} component={App}/>
              <Route path="/researcherAuth" component={ResearcherAuth}/>
              <Route path="/researcherDashboard" component={ResearcherDashboard} />
              <Route path="/b/:boardId" component={BoardContainer} />
              <Route path="/boardAccess" component={BoardComponent} />
              <Route path="/boardAccess/:boardId" component={BoardComponent} />
            </Switch>
          </StaticRouter>
        </ThemeProvider>
      </Provider>
    )
  );
  
  const css = sheets.toString();

  const preloadedState = store.getState();


  // Extract head data (title) from the app
  const helmet = Helmet.renderStatic();

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
        <meta name="description" content="An open source kanban application created with React and Redux. ">
        <link rel="apple-touch-icon-precomposed" sizes="144x144" href="/static/favicons/apple-touch-icon-144x144.png" />
        <link rel="apple-touch-icon-precomposed" sizes="152x152" href="/static/favicons/apple-touch-icon-152x152.png" />
        <link rel="icon" type="image/png" href="/static/favicons/favicon-32x32.png" sizes="32x32" />
        <link rel="icon" type="image/png" href="/static/favicons/favicon-16x16.png" sizes="16x16" />
        <meta name="msapplication-TileColor" content="#FFFFFF" />
        <meta name="msapplication-TileImage" content="/static/favicons/mstile-144x144.png" />
        <meta property="og:image" content="https://reactkanban.com/static/favicons/og-kanban-logo.png">
        <link rel="stylesheet" href=${manifest["main.css"]}>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        <link href="https://fonts.googleapis.com/css?family=Lato|Lato:300" rel="stylesheet">
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />

        ${helmet.title.toString()}

        <style id="jss-server-side">${css}</style>
      </head>
      <body>
        <div id="app">${appString}</div>
      </body>
      <script>
        window.PRELOADED_STATE = ${JSON.stringify(preloadedState)}
      </script>
      <script src=${manifest["main.js"]}></script>
    </html>
  `;
  res.send(html);
};

export default renderPage;
