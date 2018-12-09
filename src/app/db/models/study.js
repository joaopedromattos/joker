import mongoose from "mongoose";

var studySchema = new mongoose.Schema({

    name: String, 
    objective: Text,
    cards: [{titles: String, description: Text}],
    data: Date

})

export default studySchema;