import express, { Router } from "express";
import { MongoClient } from "mongodb";
import mongoose from "mongoose";
import passport from "passport";
import session from "express-session";
import connectMongo from "connect-mongo";
import compression from "compression";
import helmet from "helmet";
// import enforce from "express-sslify";
import favicon from "serve-favicon";
import logger from "morgan";
import dotenv from "dotenv";
import renderPage from "./renderPage";
import api from "./routes/api";
// import configurePassport from "./passport";
// import auth from "./routes/auth";
import fetchBoardData from "./fetchBoardData";
import fs from "fs";
import https from 'https';


// Load environment variables from .env file
dotenv.config();

const app = express();

const MongoStore = connectMongo(session);

  
mongoose.connect(process.env.REACT_APP_MONGODB_HOST_ADDRESS, { useNewUrlParser: true }).then(client => {

  mongoose.Promise = global.Promise;
  const db = mongoose.connection.db;

  //configurePassport(db);

  
  // app.use(enforce.HTTPS({ trustProtoHeader: true }));
  app.use(helmet());
  app.use(logger("tiny"));
  app.use(compression());
  app.use(favicon("dist/public/favicons/favicon.ico"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // aggressive cache static assets (1 year
  app.use("/static", express.static("dist/public", { maxAge: "1y" }));

  app.use(
    session({
      store: new MongoStore({ db }),
      secret: process.env.REACT_APP_MONGODB_SECRET,
      resave: true,
      saveUninitialized: true
    })
  );

  app.use("/api", api(db));

  app.get("*", renderPage);


  const port = process.env.PORT || "1337";
  /* eslint-disable no-console */

  
  app.listen(port, () => console.log(`Server listening on port ${port}`));
}).catch((reason ) => {
  console.log("Crash reason: ", reason);
});

// TODO: Uncomment the lines below to use https. This will be implemented on a later version of Joker...
//   https.createServer({
//     key: fs.readFileSync('server.key'),
//     cert: fs.readFileSync('server.cert')
//   }, app)
//   .listen(port, function () {
//     console.log(`App listening on port ${port}! Go to https://localhost:${port}/`);
//   })
  
//  }).catch((reason ) => {
//    console.log("Crash reason: ", reason);
//  });