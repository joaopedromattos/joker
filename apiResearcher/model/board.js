'use strict';

var mongoose = require("mongoose");

var boardSchema = new mongoose.Schema({
    studyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Study' },
    title: String,
    color: String,
    valid: { type: Boolean, default: false },
    lists: [{
        title: String,
        cards: [
            {
                color: String,
                text: String
            }
        ]
    }]
}, { timestamps: true})

module.exports = mongoose.model('Board', boardSchema);