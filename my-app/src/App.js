import React, { useRef,useState } from "react";
import Webcam from 'react-webcam';
import axios from "axios";

function App() {
  const [keypoints, setKeypoints] = useState([]);
  const [Appreance, setAppreance] = useState('');
  const [loading, setloading] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [name, setName] = useState('');
  const webcamRef = useRef(null);

  const handleImageCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
  
    setCapturedImage(imageSrc);
    // Do something with the captured image
  };
  const handleNameChange = (e) => {
    setName(e.target.value);
  };
 // Helper function to resize the image using the HTML Canvas API
function resizeImage(imageSrc, maxWidth, maxHeight) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = function () {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      if (height > maxHeight) {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg');
    };

    img.onerror = function (error) {
      reject(error);
    };

    img.src = imageSrc;
  });
}
  
  const Tryagain = async ()=>{
    window.location.reload(true)
  }

  const handleImageUpload = async () => {
    const imageSrc = await webcamRef.current.getScreenshot();

   setCapturedImage(imageSrc);
   
    try {
// Preprocess the image using the HTML Canvas API
const resizedImage = await resizeImage(imageSrc, 800, 600);

const formData = new FormData();
formData.append('personName', name);
formData.append('image', resizedImage, { filename: 'image.jpg' });


      const response = await axios.post('http://localhost:5001/api/facedetect', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Handle the response from the API
      setAppreance(response.data)
      console.log(response.data); // Logging the response data for testing

    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

 

  return (
    <center>
  

      <div >
    
    
      
      {capturedImage ? (
        <div>
            <div className="button-container">
        <h2>Face Detection App</h2>
   
        <button className="cool-button2" onClick={Tryagain}>
         Try again
        </button>
      </div>
      {Appreance==0? "": <h3>{Appreance}</h3> }
          <img src={capturedImage} alt="Captured" />
         
         
        </div>
      ):( <div>    <div className="button-container">
      <h2>Face Detection App</h2>
      <button className="cool-button" onClick={() => handleImageUpload()}>Capture</button>
    </div>
<div className="input-container ">
<label className="first-time-user">If you are a first time user, please add your name.</label>

        
        <input
          id="name-input"
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder="Enter your name"
        />
   
</div>
<div className="App">
<Webcam audio={false} ref={webcamRef} />
</div></div>)}

      </div>
     
     
    </center>
  );
}

export default App;
