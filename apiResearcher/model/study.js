'use strict';
// Here we create our Study model with mongoose!

var mongoose = require('mongoose');

var studySchema = new mongoose.Schema({

    name: String,
    objective: String,
    cards: {
        type: [{ titles: String, description: String }]
    },
}, { timestamps: true })

module.exports = mongoose.model('Study', studySchema);