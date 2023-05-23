import { FaceMesh } from "@mediapipe/face_mesh";
import React, { useRef, useEffect,useState } from "react";
import * as Facemesh from "@mediapipe/face_mesh";
import * as cam from "@mediapipe/camera_utils";

import axios from "axios";

function App() {
  const [keypoints, setKeypoints] = useState([]);
  const [Appreance, setAppreance] = useState(0);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const connect = window.drawConnectors;
  const videoRef = useRef(null);
  const cameraRef = useRef(null);

  const startRecording = async () => {
    
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
    videoRef.current.play();

    const faceMesh = new FaceMesh({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
      },
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults(onResults);

    cameraRef.current = new cam.Camera(videoRef.current, {
      onFrame: async () => {
        await faceMesh.send({ image: videoRef.current });
      },
      width: 640,
      height: 480,
    });

    cameraRef.current.start();
  };
const Tryagain = async ()=>{
  window.location.reload(true)
}
  const stopRecording = () => {
    sendKeypoints()
    if (cameraRef.current) {
      cameraRef.current.stop();
      cameraRef.current = null;
    }
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => {
        track.stop();
      });
      videoRef.current.srcObject = null;
    }
  };

  function onResults(results) {
    const videoWidth = videoRef.current.videoWidth;
    const videoHeight = videoRef.current.videoHeight;

    // Set canvas width
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext("2d");
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(
      results.image,
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );
 

    if (results.multiFaceLandmarks) {
      for (const landmarks of results.multiFaceLandmarks) {
        connect(canvasCtx, landmarks, Facemesh.FACEMESH_TESSELATION, {
          color: "#C0C0C070",
          lineWidth: 1,
        });
        connect(canvasCtx, landmarks, Facemesh.FACEMESH_RIGHT_EYE, {
          color: "#FF3030",
        });
        connect(canvasCtx, landmarks, Facemesh.FACEMESH_RIGHT_EYEBROW, {
          color: "#FF3030",
        });
        connect(canvasCtx, landmarks, Facemesh.FACEMESH_LEFT_EYE, {
          color: "#30FF30",
        });
        connect(canvasCtx, landmarks, Facemesh.FACEMESH_LEFT_EYEBROW, {
          color: "#30FF30",
        });
        connect(canvasCtx, landmarks, Facemesh.FACEMESH_FACE_OVAL, {
          color: "#E0E0E0",
        });
        connect(canvasCtx, landmarks, Facemesh.FACEMESH_LIPS, {
          color: "#E0E0E0",
        });
      }

      // Send keypoints to Node.js API
      const keypointss = results.multiFaceLandmarks[0];
     setKeypoints(keypointss)
    }

    canvasCtx.restore();
  }

  const sendKeypoints = async () => {
    try {
      let face = [];

if (keypoints) {
  face = keypoints.map(res => [res.x, res.y, res.z]).flat();
   //face= JSON.stringify(face)

} else {
  face = new Array(1404).fill(0);
}

      const response = await axios.post(" http://localhost:5001/api/face", {
        keypoints: face,
      });
   
       setAppreance(response.data)
      // Handle the response and draw the keypoints or display the result
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <center>
      <div className="button-container">
        <h2>Face Detection App</h2>
      <button className="cool-button" onClick={startRecording}>
          Start Recording
        </button>
        <button className="cool-button2" onClick={stopRecording}>
         Detect Face
        </button>
        <button className="cool-button2" onClick={Tryagain}>
         Try again
        </button>
      </div>
      <div className="App">
    
        <video
          ref={videoRef}
          style={{ display: "none" }}
          width={640}
          height={480}
        />
      

        <canvas ref={canvasRef} className="output_canvas"></canvas>
      </div>
      {Appreance==0? "": <h3>How many times this face appear: {Appreance}</h3> }
     
    </center>
  );
}

export default App;
