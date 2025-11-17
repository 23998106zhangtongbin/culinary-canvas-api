require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');


const app = express();


connectDB();


app.use(express.json());


app.use('/api/users', require('./routes/authRoutes')); 
app.use('/api/recipes', require('./routes/recipeRoutes')); 


app.use(errorHandler);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running in development mode on port ${PORT}`);
});