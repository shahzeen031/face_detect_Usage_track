const mongoose = require('mongoose');

const FacelandmarkSchema = new mongoose.Schema({
  landmarks: {
    type: [Number],
    required: true,
    
  },
  Frequency: {
    type: Number,
    required: true,
   
  },

});

module.exports =  mongoose.model('facelandmark', FacelandmarkSchema);
