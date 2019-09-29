require("dotenv").config();
var cors = require("cors");
var express = require("express"),
    helmet = require("helmet"),
    app = express(),
    port = process.env.PORT || 3000,
    mongoose = require("mongoose"),
    https = require("https"),
    Study = require("./model/study"),
    Researcher = require("./model/researcher"),
    Board = require("./model/board"),
    fs = require("fs"),
    bodyParser = require("body-parser");

app.use(helmet());
mongoose.Promise = global.Promise;
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

const dbUrl = process.env.NODE_ENV === "development" ? "localhost" : "mongo";

mongoose
    .connect("mongodb://" + dbUrl + ":27017/admins", {
        useNewUrlParser: true
    })
    .catch(reason => {
        // Catching an error of when we can't connect to DB.
        console.log(
            "Could not reach MongoDB. Please verify the status of your database or try running the API again."
        );
        process.exit(1);
    });

app.use(express.static("./statisticalModule/results"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require("./routes/routes");

routes(app);

app.use((req, res) => {
    res.status(404).send({ url: req.originalUrl + " not found." });
});

app.listen(port, console.log(`API is running on http://${dbUrl}:` + port));
