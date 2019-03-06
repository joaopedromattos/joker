'use strict';

var mongoose = require("mongoose");

var boardSchema = new mongoose.Schema({
    studyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Study' },
    title: String,
    color: String,
    lists: [{
        title: String,
        cards: [
            {
                color: String,
                name: String
            }
        ]
    }]
}, { timestamps: true})

module.exports = mongoose.model('Board', boardSchema);