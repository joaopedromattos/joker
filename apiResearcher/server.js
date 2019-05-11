var cors = require("cors");
var express = require("express"),
    app = express(), 
    port = process.env.PORT || 3000,
    mongoose = require("mongoose"),
    Study = require("./model/study"),
    Researcher = require("./model/researcher"),
    Board = require("./model/board"),
    bodyParser = require("body-parser")

mongoose.Promise = global.Promise;
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://localhost/admins', { useNewUrlParser: true })
// mongoose.connect('mongodb+srv://joaopedromattos:PAHgrR3SlzxPy3fT@joker-wrw9o.mongodb.net/test?retryWrites=true', {useNewUrlParser: true}).catch((reason) =>{
//     console.log("API Server crashed: ", reason);
// })
app.use(cors())
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

var routes = require("./routes/routes")

routes(app)

app.listen(port, console.log("API is running on http://localhost:" + port))

app.use((req, res) =>{
    res.status(404).send({url : req.originalUrl + ' not found.'})
})


