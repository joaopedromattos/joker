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


exports.countBoards = (req, res) => {
    Board.find({ studyId: { $in: req.params.studyId.split(',') } }, (err, data) => {
        if (err) {
            res.send(err);
        }
        var count = data.length

        res.json({
            results: count
        });
    })
}

exports.createBoard = (req, res) => {

    var newBoard = new Board(req.body);

    console.log(">>> requisition", req.body);

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
            console.log(">>> There was an error");
            res.send(err);
        }
        res.json(data);
    });

}

exports.updateBoard = (req, res) => {
    console.log("Updating board:", req.body);

    Board.findOneAndUpdate({ _id: req.params._id }, { valid: eval(req.body.valid), lists: eval(req.body.lists) }, { new: true }, (err, data) => {
        if (err) {
            console.log(">>> Err", err);
            res.send(err);
        }
        console.log(">>> updateBoard requisition result: ", data)
        res.json(data);
    });
}

exports.deleteBoard = (req, res) => {

    console.log(">>> REQ.body: ", req.params_id);

    Board.deleteMany({
        _id: req.params._id.split(',')
    }, (err, data) => {
        if (err) {
            console.log(">>> Err", err);
            res.send(err)
        }

        console.log(">>> deleteBoard requisition result: ", data);
        res.json(data);

    })

}
