const faceapi = require('face-api.js');
const express = require('express');
const router = express.Router();
const saveFile = require('../config/saveFile');
const canvas = require('canvas');
let multer = require('multer');
const Facedetect_API = require('../models/Facedetect_API');



const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });



function convertImageToCanvas(imageBuffer) {
    const img = new Image();
    img.src = imageBuffer;
  
    const canvas = new Canvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
  
    return canvas;
  }
  

const upload = multer();


async function extractAllLandmarks() {
    try {
      const distinctEntries = await Facedetect_API.find({});
     
      return distinctEntries;
     
    
    } catch (error) {
      console.error('Error extracting landmarks:', error);
      // Handle the error appropriately
      throw error;
    }
  }



async function run(img) {
    //await faceDetectionNet.loadFromDisk('../weights');
  
    //const img = await canvas.loadImage('../images/bbt1.jpg');
  
    //const out = faceapi.createCanvasFromMedia(img);
    //faceapi.draw.drawDetections(out, detections);
  
    //saveFile('faceDetection.jpg', out.toBuffer('image/jpeg'));
    //console.log('Done! Saved results to out/faceDetection.jpg');

    try {
        const img2 = new Image();
        img2.src = img;
        const canvas = await convertImageToCanvas(img);
        const displaySize = { width: img2.width, height: img2.height }
       // const canvas2 = document.getElementById('overlay')
        const detections = await faceapi.detectAllFaces(canvas).withFaceLandmarks().withFaceDescriptors();
        //const resizedResults = faceapi.resizeResults(detections, displaySize)
        const allKeypoints = await extractAllLandmarks()
        //const out = await faceapi.createCanvasFromMedia(canvas,resizedResults);
        //drawFaceRecognitionCanvas
        //await faceapi.draw.drawDetections(canvas, detections);
        // detections.forEach((detection, i) => {
        //     const { box } = detection;
        //     const { top, left, width, height } = box;
          
        //     // Draw label
        //     const label = `Face ${i+1}`; // Replace with your desired label
        //     const drawOptions = {
        //       label,
        //       lineWidth: 2,
        //       boxColor: 'red',
        //       textColor: 'red',
        //       fontSize: 20
        //     };
        //     new faceapi.draw.DrawTextField([label], { ...box, ...drawOptions }).draw(canvas);
        //   });

       // const faceMatcher = new faceapi.FaceMatcher(detections)
        let i=0
        const threshold = 0.5
        //console.log(detections.length,detections)
        if (allKeypoints.length > 0) {
          
            //console.log(allKeypoints.length,detections.length)
            for(let i=0;i<detections.length;i++)
            {//console.log(allKeypoints.length,detections.length)
              let count=0;
               let flag=false
                for(let j=0;j<allKeypoints.length;j++)
                {
                       // console.log(landmarks)
                const values = Object.values(allKeypoints[j].landmarks[0]);
                // console.log(values)
                // Convert the values to a Float32Array
               const floatArray = Float32Array.from(values);
                 //console.log(floatArray, descriptor)
                 const distance = faceapi.utils.round(
                     faceapi.euclideanDistance(floatArray, detections[i].descriptor)
                   )
                  // console.log(distance)
                   if(distance < threshold)
                   { console.log("Match")
                     //const label = faceMatcher.findBestMatch(detections[i].descriptor).toString()
                     const options = { label: `Person detected:(${allKeypoints[j].Frequency+1})` }
                     const drawBox = new faceapi.draw.DrawBox(detections[i].detection.box, options)
                     drawBox.draw(canvas)
                     let obj=allKeypoints[j]._id
                    let result= await Facedetect_API.updateOne({ _id: obj}, { $inc: {  Frequency: 1 } } );
                     //console.log("Match",i,j)
                     flag=true
                   }
                  
                   //console.log(i,j)

                }
                if(flag!=true)
                {  
                    const options = { label: `New face ${count++}` }
                    console.log(i,"hi I")
                    Facedetect_API.create({ landmarks: detections[i].descriptor,  Frequency: 1 });
                    const drawBox = new faceapi.draw.DrawBox(detections[i].detection.box, options)
                    drawBox.draw(canvas)

                }
                
            }
        }
         
          else{
            detections.forEach(({ detection, descriptor }) => {

                
               // const label = faceMatcher.findBestMatch(descriptor).toString()
                const options = { label: `New face ${i++}` }
                Facedetect_API.create({ landmarks: descriptor,  Frequency: 1 });
                const drawBox = new faceapi.draw.DrawBox(detection.box, options)
                drawBox.draw(canvas)
              })
          }
        
        saveFile('faceDetection.jpg', canvas.toBuffer('image/jpeg'));
        //console.log(detections)
        //console.log('Done! Saved results to out/faceDetection.jpg');
        

       return detections
    } catch (error) {
        console.log(error)
       
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
        let output=await run(buffer)


       res.json(true)


    } catch (error) {
        console.log(error)
        console.error('Error indexing face:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});
  
module.exports = router;