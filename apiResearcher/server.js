require("dotenv").config();
var cors = require("cors");
var express = require("express"),
    app = express(), 
    port = process.env.PORT || 3000,
    mongoose = require("mongoose"),
    https = require('https'),
    Study = require("./model/study"),
    Researcher = require("./model/researcher"),
    Board = require("./model/board"),
    fs = require("fs"),
    bodyParser = require("body-parser")

mongoose.Promise = global.Promise;
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect("mongodb://mongo:27017/admins", { useNewUrlParser: true })
// mongoose.connect('mongodb+srv://joaopedromattos:PAHgrR3SlzxPy3fT@joker-wrw9o.mongodb.net/test?retryWrites=true', {useNewUrlParser: true}).catch((reason) =>{
//     console.log("API Server crashed: ", reason);
// })
app.use(express.static('./statisticalModule/results'))
app.use(cors())
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

var routes = require("./routes/routes")

routes(app);

app.use((req, res) =>{
    res.status(404).send({url : req.originalUrl + ' not found.'})
})

app.listen(port, console.log("API is running on http://mongo:" + port))


  