const mongoose = require('mongoose');

const FacedetectSchema = new mongoose.Schema({
  PersonID: {
    type: String,
    required: true,
    
  },
  Frequency: {
    type: Number,
    required: true,
   
  },
  PersonName:{
    type: String,
    required: true,
  }

});

module.exports =  mongoose.model('Facedetect', FacedetectSchema);
