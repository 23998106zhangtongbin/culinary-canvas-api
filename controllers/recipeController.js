const Recipe = require('../models/Recipe');


exports.createRecipe = async (req, res, next) => {
  try {
    
    req.body.author = req.user.id;

    
    const recipe = await Recipe.create(req.body);

    
    res.status(201).json({
      success: true,
      data: recipe
    });
  } catch (error) {
    next(error);
  }
};


exports.getMyRecipes = async (req, res, next) => {
  try {
    
    const recipes = await Recipe.find({ author: req.user.id });

    
    res.status(200).json({
      success: true,
      count: recipes.length,
      data: recipes
    });
  } catch (error) {
    next(error);
  }
};


exports.updateRecipe = async (req, res, next) => {
  try {
    
    let recipe = await Recipe.findById(req.params.id);

    
    if (!recipe) {
      return res.status(404).json({ 
        success: false,
        error: `Recipe not found with id of ${req.params.id}`
      });
    }

    
    if (recipe.author.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        error: 'Not authorized to update this recipe (not the owner)'
      });
    }

    
    delete req.body.author;
    recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
      new: true, 
      runValidators: true 
    });

    
    res.status(200).json({
      success: true,
      data: recipe
    });
  } catch (error) {
    next(error);
  }
};


exports.deleteRecipe = async (req, res, next) => {
  try {
    
    const recipe = await Recipe.findById(req.params.id);

    
    if (!recipe) {
      return res.status(404).json({
        success: false,
        error: `Recipe not found with id of ${req.params.id}`
      });
    }

    
    if (recipe.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this recipe (not the owner)'
      });
    }

    
    await recipe.deleteOne();

    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};