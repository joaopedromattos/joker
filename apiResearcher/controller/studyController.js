'use strict'

var mongoose = require("mongoose")

var Study = mongoose.model("Study")

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
    Study.findOneAndUpdate({ _id: req.params._id }, req.body, { new: true }, (err, data) => {
        if (err) {
            res.send(err);
        }
        res.json(data);
    });
}

exports.deleteStudy = (req, res) => {

    Study.remove({
        _id: req.params._id
    }, (err, data) => {
        if (err) {
            res.send(err)
        }

        res.json("Researcher successfully deleted.");

    })

}