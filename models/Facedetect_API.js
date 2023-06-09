const mongoose = require('mongoose');

const Facedetect_APISchema = new mongoose.Schema({
  landmarks: {
    type: [Object],
    required: true,
    
  },
  Frequency: {
    type: Number,
    required: true,
   
  },

  


});

module.exports =  mongoose.model('Facedetect_API', Facedetect_APISchema);
