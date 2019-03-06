'use strict';

var mongoose = require("mongoose");

var Board = mongoose.model("Board");

// Here is where the CRUD (create, read, update, delete) Researcher is implemented 

// This will consume a large bandwidth, so I won't create a route for it right now...
exports.listBoard = (req, res) => {
    Board.find({}, (err, data) => {
        if (err) {
            res.send(err);
        }
        res.json(data);
    });

};


exports.createBoard = (req, res) => {

    var newBoard = new Researcher(req.body);

    console.log("requisition", req.body);

    newBoard.save(function (err, data) {
        if (err) {
            res.send(err);
        }
        res.json(data);
    });

}

exports.getBoard = (req, res) => {
    Board.find({ studyId: { $in: req.params.studyId.split(',') } }, (err, data) => {
        if (err) {
            res.send(err);
        }

        res.json(data);
    });
}

exports.updateBoard = (req, res) => {
    Board.findOneAndUpdate({ _id: req.params._id }, { $push: req.body }, { new: true }, (err, data) => {
        if (err) {
            res.send(err);
        }
        res.json(data);
    });
}

exports.deleteBoard = (req, res) => {

    Board.remove({
        _id: req.params._id
    }, (err, data) => {
        if (err) {
            res.send(err)
        }

        res.json(data);

    })

}