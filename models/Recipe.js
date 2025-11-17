const mongoose = require('mongoose');


const RecipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a recipe title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  ingredients: {
    type: [String], 
    required: [true, 'Please provide at least one ingredient'],
    validate: {
      
      validator: function (v) {
        return v.length > 0;
      },
      message: 'Ingredients array cannot be empty'
    }
  },
  instructions: {
    type: String,
    required: [true, 'Please provide recipe instructions'],
    trim: true
  },
  prepTime: {
    type: Number,
    min: [0, 'Preparation time cannot be negative'], 
    default: 0 
  },
  author: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Recipe must belong to a user'] 
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model('Recipe', RecipeSchema);