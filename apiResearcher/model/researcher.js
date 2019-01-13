'use strict';

// Here we create our Researcher model with mongoose!


var mongoose = require('mongoose')

var researcherSchema = new mongoose.Schema({
    authId: String,
    email: String,
    name: String,
    studies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Study' }]

});

module.exports = mongoose.model("Researcher", researcherSchema);
