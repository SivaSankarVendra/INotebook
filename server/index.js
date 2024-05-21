const connectToMongo = require("./db");
const express = require('express'); 
const cors = require('cors');
require('dotenv').config();

connectToMongo();

const app = express();
const port = process.env.Port || 5000; // Default to port 5000 if not specified in .env

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

// Serve static files from the React app


app.listen(port, () => {
  console.log(`iNotebook backend listening on http://localhost:${port}`);
});
