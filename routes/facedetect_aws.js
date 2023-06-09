const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const Facedetect = require('../models/Facedetect');
let multer = require('multer');

const upload = multer();
//AWS access details
AWS.config.update({
    accessKeyId: '',
    secretAccessKey: '',
    region: ''
});

const rekognition = new AWS.Rekognition();

async function detectAndRecognizeFaces(imageBuffer) {
    const params = {
        CollectionId: 'Face_Detect',
        Image: {
            Bytes: imageBuffer
        }
    };

    try {
        const response = await rekognition.searchFacesByImage(params).promise();

        return response.FaceMatches;
    } catch (error) {
        console.error('Error recognizing faces:', error);
        throw error;
    }
}
async function addFaces(buffer, personName) {

    try {
        const response = await rekognition.indexFaces({
            "CollectionId": "Face_Detect",
            "DetectionAttributes": ["ALL"],
            "ExternalImageId": personName,
            "Image": {
                "Bytes": buffer
            }
        }).promise();

        return response.FaceRecords;
    } catch (error) {
        console.error('Error recognizing faces:', error);
        throw error;
    }


}







//@route Post api/Facelandmark
//desc post route
//@access Public
router.post('/', upload.single('image'), async (req, res) => {
    try {

        const { buffer } = req.file;
        let personName = req.body.personName;
        personName= personName.replace(' ', '');
        
        let output = await detectAndRecognizeFaces(buffer)


        if (output.length > 0) {
            
            const result = await Facedetect.updateOne({ PersonID: output[0].Face.FaceId }, { $inc: { Frequency: 1 } });
             const record = await Facedetect.findOne({ PersonID: output[0].Face.FaceId});

            // Create the response object
        

         
            res.json(`Hi ${output[0].Face.ExternalImageId} You appear ${record.Frequency} Times`);



        }
        else {
         

            let indexface = await addFaces(buffer, personName)
            let PersonID = indexface[0].Face.FaceId
            let PersonName = indexface[0].Face.ExternalImageId

            await Facedetect.create({ PersonID, Frequency: 1, PersonName });
            res.json("New Face Detected")
        }


    } catch (error) {
        console.log(error)
        console.error('Error indexing face:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});




module.exports = router;