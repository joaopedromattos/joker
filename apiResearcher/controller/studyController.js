'use strict'

var mongoose = require("mongoose")

var Study = mongoose.model("Study")

var Researcher = mongoose.model("Researcher")

// Here is where the CRUD (create, read, update, delete) Study is implemented

// This will consume a large bandwidth, so I won't create a route for it right now...
exports.listStudies = (req, res) => {
    Study.find({}, (err, data) => {
        if (err) {
            res.send(err);
        }
        res.json(data);
    });

};

exports.createStudy = (req, res) => {

    var newStudy = new Study(req.body);

    console.log("requisition", req.body);

    newStudy.save(function (err, data) {
        if (err) {
            res.send(err);
        }
        res.json(data);
    });

}

exports.getStudy = (req, res) => {
    

    Study.find({ _id: {$in: req.params._id.split(',')} }, (err, data) => {
        if (err) {
            res.send(err);
        }

        res.json(data);
    });
}

exports.updateStudy = (req, res) => {
    console.log("update requisition: ", req.body)
    Study.findOneAndUpdate({ _id: req.params._id }, req.body, { new: true }, (err, data) => {
        if (err) {
            res.send(err);
        }
        res.json(data);
    });
}

exports.deleteStudy = (req, res) => {

    let firstResponse = {}

    Study.deleteMany({
        _id: { $in: req.params._id.split(',') }
    }, (err, data) => {

        if (err) {
            console.log("Não conseguiu deletar o estudo...")
            
            res.send(err)
        } else {

            console.log("Conseguiu deletar o estudo em si")

            
            // Due to the fact that mongoDB is a non-relational DB and to our database models
            Researcher.findOneAndUpdate({ studies: { $in: req.params._id.split(',') } },
                { $pull: { "studies": { $in: req.params._id.split(',') } } } ,
                { new: true },
                (err, data) => {
                    if (err) {
                        console.log("Não foi possível modificar o estudo");
                        
                        res.send(err)
                    } else {

                        console.log("Conseguiu modificar o estudo...", data)
                        res.json(data);
                    }
    
                }
            )
        }


        


    })

    

}