'use strict';

var mongoose = require("mongoose")

var Researcher = mongoose.model("Researcher")

// Here is where the CRUD (create, read, update, delete) Researcher is implemented 

// This will consume a large bandwidth, so I won't create a route for it right now...
exports.listResearchers = (req, res) => {
    Researcher.find({}, (err, data) => {
        if (err){
            res.send(err);
        }
        res.json(data);
    });

};


exports.createResearcher = (req, res) => {
    
    var newResearcher = new Researcher(req.body);

    console.log("requisition" , req.body);

    newResearcher.save(function(err, data){
        if (err){
            res.send(err);
        }
        res.json(data);
    });

}

exports.getResearcher = (req, res) =>{
    Researcher.find({email: req.params.email}, (err, data) => {
        if (err){
            res.send(err);
        }
        
        res.json(data);
    });
}

exports.updateResearcher = (req, res) => {
    Researcher.findOneAndUpdate({ authId: req.params.authId }, {$push: req.body}, {new:true}, (err, data) =>{
        if (err){
            res.send(err);
        }
        res.json(data);
    });
}

exports.deleteResearcher = (req, res) => {

    Researcher.remove({
        authId: req.params.authId
    }, (err, data) => {
        if (err){
            res.send(err)
        }

        res.json("Researcher successfully deleted.");

    })

}