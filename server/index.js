require('dotenv').config();

const express = require('express');
const connectDB = require('./MongoDb/db');

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

app.use(express.json());

connectDB(MONGO_URI);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
