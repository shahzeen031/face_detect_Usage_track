const express = require('express');
const connectDB = require('./config/db');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const faceapi = require("face-api.js");
async function LoadModels() {
    // Load the models
    // __dirname gives the root directory of the server
    await faceapi.nets.faceRecognitionNet.loadFromDisk(__dirname + "/weights");
    await faceapi.nets.faceLandmark68Net.loadFromDisk(__dirname + "/weights");
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(__dirname + "/weights");
  }
  LoadModels();
  

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
//app.use('/api/facedetect', require('./routes/facedetect_aws'));
app.use('/api/facedetectAPI', require('./routes/facedetect_faceapi'));
app.use('/out', express.static('out'));
//app.use('/api/face', require('./routes/facedetect'));

// Serve static assets in production


const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`server started on port ${PORT}`));
