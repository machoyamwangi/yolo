const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const upload = multer();

const productRoute = require('./routes/api/productRoute');

// Connecting to the Database
let mongodb_url = 'mongodb://localhost/';
let dbName = 'yolomy';

// define a url to connect to the database
//const MONGODB_URI = process.env.MONGODB_URI || mongodb_url + dbName
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/yolo';
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
let db = mongoose.connection;

// Check Connection
db.once('open', ()=>{
    console.log('Database connected successfully')
})

// Check for DB Errors
db.on('error', (error)=>{
    console.log(error);
})

// Initializing express
const app = express()

// Body parser middleware
app.use(express.json())

// Only apply multer middleware to specific routes that handle file uploads
// Remove the global usage of upload.array()

// Cors 
app.use(cors());

// Use Route
app.use('/api/products', productRoute)

// Define the PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`Server listening on port ${PORT}`)
})
