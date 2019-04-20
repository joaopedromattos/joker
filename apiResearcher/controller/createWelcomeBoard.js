'use strict'

var mongoose = require("mongoose");
var shortid = require("shortid");
var Study = mongoose.model("Study");

// Give every card in a list an _id and the color white UNLESS those properties already exist
const appendAttributes = list =>
    list.map(card => ({
        color: "white",
        _id: shortid.generate(),
        ...card
    }));

// Generate the initial showcase board that every user and guest gets when they first log in
exports.createWelcomeBoard = (req, res, userId) => {
    console.log("createWelcomeBoard requisition...");

    Study.find({_id: req.params._id}, (err, data) => {
        if (err){
            console.log("createWelcomeBoard error...");
            res.send(err);
        }

        
        let study = data[0];

        // Converting our cards to the format used by our open source code.
        const list1 = study.cards.map((cur) => {
            return { text: cur.name }
        });

        let board = {
            _id: shortid.generate(),
            title: study.name,
            studyId: req.params._id,
            color: "green",
            lists: [
                {
                    _id: 1,
                    title: "Arraste um cartão de cada vez",
                    cards: appendAttributes(list1)
                },
                {
                    _id: shortid.generate(),
                    title: "Categoria 1",
                    cards: []
                },
            ],
            users: userId ? [userId] : []
        };

        console.log("Board requested: ", board);
        res.json(board);
        
        
    })
    
};


