import React, { useRef,useState } from "react";
import Webcam from 'react-webcam';
import axios from "axios";


function App() {
  const imageUrl = 'http://localhost:5001/out/faceDetection.jpg';
  const [Appreance, setAppreance] = useState('');
  const [capturedImage, setCapturedImage] = useState(null);
  const [loading, setloading] = useState(false);
  const [name, setName] = useState('');
  const webcamRef = useRef(null);


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
    console.log('hello')
    window.location.reload(true)

  }

  const handleImageUpload = async () => {
    const imageSrc = await webcamRef.current.getScreenshot();
   setloading(true)
   setCapturedImage(imageSrc);
   
    try {
// Preprocess the image using the HTML Canvas API
const resizedImage = await resizeImage(imageSrc, 800, 600);

const formData = new FormData();
formData.append('personName', name);

formData.append('image', resizedImage, { filename: 'image.jpg' });


      const response = await axios.post('http://localhost:5001/api/facedetectAPI', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Handle the response from the API
      setAppreance(response.data)
      console.log(response.data); // Logging the response data for testing
      setloading(false)
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
         {loading?"":( <div className="button-container">
        
   
        <button className="cool-button2"onClick={() => Tryagain()}>
         Try again
        </button>
      </div>)}
        
      </div>
      {loading?<h2>loading....</h2>: (<div> <img src={imageUrl} width={600} size={400} alt="Captured" ></img>
      
           
      </div>)}
   
         
        </div>
      ):( <div>    <div className="button-container">
      <h2>Face Detection App</h2>
      <button className="cool-button" onClick={() => handleImageUpload()}>Capture</button>
   
    </div>

<div className="App">
<Webcam audio={false} ref={webcamRef} />
</div></div>)}

      </div>
     
     
    </center>
  );
}

export default App;
