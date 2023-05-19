const express = require('express');
const connectDB = require('./config/db');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

//app.set('view engine', ejs);

//connect Database
connectDB();

//Middleware


app.use(cors());
app.use(bodyParser.json());
//app.use(
//bodyParser.urlencoded({
//extended: false,
//})
//);

//Define Routes
// app.use('/api/user', require('./routes/api/user'));
// app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/face', require('./routes/facedetect'));

// Serve static assets in production


const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`server started on port ${PORT}`));
