const express = require('express');
const router = express.Router();
const Facelandmark = require('../models/Facelandmarks');



async function extractAllLandmarks() {
  try {
    const distinctEntries = await Facelandmark.find({});
   
    return distinctEntries;
   
  
  } catch (error) {
    console.error('Error extracting landmarks:', error);
    // Handle the error appropriately
    throw error;
  }
}

function calculateEuclideanDistance(landmarks1, landmarks2) {
  let squaredSum = 0;
  for (let i = 0; i < landmarks1.length; i += 3) {
    const dx = landmarks1[i] - landmarks2[i];
    const dy = landmarks1[i + 1] - landmarks2[i + 1];
    const dz = landmarks1[i + 2] - landmarks2[i + 2];
    squaredSum += dx * dx + dy * dy + dz * dz;
  }
  return Math.sqrt(squaredSum);
}



async function detectAllLandmarks(newKeypoints, similarityThreshold) {
  //await loadModels();
  const allKeypoints = await extractAllLandmarks()

  console.log(allKeypoints.length);

  // Compare new keypoints with each set of keypoints in the database
  if (allKeypoints.length > 0) {
    console.log("level 1");
    for (const keypoints of allKeypoints) {
      // Calculate similarity score using face-api.js euclideanDistance function
      // const similarityScore = faceapi.utils.round(
      //   faceapi.euclideanDistance(keypoints.landmarks, newKeypoints)
      // );
      const distance = calculateEuclideanDistance(keypoints.landmarks, newKeypoints);
      // You can adjust the scaling factor as per your requirements
      const similarityScore = 1 / (1 + distance);
        console.log(similarityScore)
      // Compare similarity score with threshold
      if (similarityScore > similarityThreshold) {
        // Match found, face already in the database
        console.log("level 2");
        return [true,keypoints._id, keypoints.Frequency];
      }
    }
    console.log('level 3');
    // No match found, new face
    return [false,''];
  } else {
    console.log("No keypoints in the database");
    // No keypoints in the database, new face
    return [false,''];
  }
}


//@route Post api/Facelandmark
//desc post route
//@access Public
router.post('/',
  async (req, res) => {
   

    const landmarks = req.body.keypoints;
  

    try {
     
   let x= await detectAllLandmarks(landmarks,0.8)
   
        if (x[0]) {
          console.log("done")
          await Facelandmark.updateOne({ _id: x[1] }, { $inc: {  Frequency: 1 } });
          res.json(x[2]+1);
        } else {
          console.log("doneOK")
          await Facelandmark.create({ landmarks,  Frequency: 1 });
          res.json(1)
        }

      // for (const landmarks of landmarksData) {
      //   const existingEntry = await Facelandmark.findOne({ landmarks });
  
      //   if (existingEntry) {
      //     await Facelandmark.updateOne({ landmarks }, { $inc: { count: 1 } });
      //   } else {
      //     await Facelandmark.insertOne({ landmarks, count: 1 });
      //   }
      // }

      //res.json("process");
    } catch (err) {
      console.log(err)
      res.status(500).json({ errors: [{ message: err.message }] });
    }
  }
);


module.exports = router;