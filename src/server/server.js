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


// Load environment variables from .env file
dotenv.config();

const app = express();

const MongoStore = connectMongo(session);

  //MongoClient.connect("mongodb://localhost:27017").then(client => {
mongoose.connect("mongodb://localhost:27017/joker", { useNewUrlParser: true }).then(client => {
  mongoose.Promise = global.Promise;
  const db = mongoose.connection.db;

  //configurePassport(db);

// Uncomment next line for production to force https redirect
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
    secret: "123456",
    resave: true,
    saveUninitialized: true
  })
);

// This configs were made by the original developer
//app.use(passport.initialize());
//app.use(passport.session());
// app.use("/auth", auth);

// app.use(passport.initialize())


app.use("/api", api(db));
// app.use(fetchBoardData(db));

// app.use("/fetchBoard", fetchBoardData())

// app.route("/fetchBoard/_id=:_id")
//     .get(fetchBoardData(db));

//app.use(fetchBoardData());

app.get("*", renderPage);

var router = Router()

const port = process.env.PORT || "1337";
/* eslint-disable no-console */
app.listen(port, () => console.log(`Server listening on port ${port}`));
 });