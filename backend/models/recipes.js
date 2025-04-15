const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const RecipeSchema = new Schema({
    userID:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    recipeName: {
        type: String,
        required: true,
        trim: true,
    },
    cuisine:{
        type: String,
        required: true,
        trim: true,
    },
    difficulty:{
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    imgFile:{
        type: String,
    },
    ingredients:{
        type: [String],
        required: true,
    },
    steps:{
        type: [String],
        required: true,
    }
});

const RecipeModel = model('Recipe', RecipeSchema);

module.exports = RecipeModel;