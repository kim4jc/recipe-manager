const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const RecipeSchema = new Schema({
    recipe_name: {
        type: String,
        required: true,
        trim: true
    },
    cuisine:{
        type: String,
        required: true,
        trim: true
    },
    img_file:{
        type: String
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