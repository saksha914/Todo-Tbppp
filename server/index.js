require('dotenv').config();

const express = require('express');
const connectDB = require('./MongoDb/db');
const todoRoutes = require('./routes/todoRoutes');
const cors = require('cors');

const app = express();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

app.use(express.json());
app.use(cors());

connectDB(MONGO_URI);


app.use('/api/todos', todoRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
