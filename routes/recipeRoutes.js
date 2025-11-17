const express = require('express');
const {
  createRecipe,
  getMyRecipes,
  updateRecipe,
  deleteRecipe
} = require('../controllers/recipeController');
const { protect } = require('../middleware/auth'); 

const router = express.Router();


router.use(protect);


router.post('/', createRecipe); 
router.get('/', getMyRecipes); 
router.put('/:id', updateRecipe); 
router.delete('/:id', deleteRecipe); 

module.exports = router;