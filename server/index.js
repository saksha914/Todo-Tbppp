require('dotenv').config();

const express = require('express');
const connectDB = require('./MongoDb/db');
const todoRoutes = require('./routes/todoRoutes');
const authRoutes = require('./routes/authRoutes'); 
const cors = require('cors');

const app = express();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;


app.use(express.json());
app.use(cors());


connectDB(MONGO_URI);

// Routes
app.use('/api/todos', todoRoutes); 
app.use('/api/auth', authRoutes);  

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
