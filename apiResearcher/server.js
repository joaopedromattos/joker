var cors = require("cors");
var express = require("express"),
    app = express(), 
    port = process.env.PORT || 3000,
    mongoose = require("mongoose"),
    Study = require("./model/study"),
    Researcher = require("./model/researcher"),
    bodyParser = require("body-parser")

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/admins', { useNewUrlParser: true })

app.use(cors())
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

var routes = require("./routes/routes")

routes(app)

app.listen(port, console.log("API is running on http://localhost:" + port))

app.use((req, res) =>{
    res.status(404).send({url : req.originalUrl + ' not found.'})
})


