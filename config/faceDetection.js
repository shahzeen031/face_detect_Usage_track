const faceapi = require('face-api.js');
const { SsdMobilenetv1Options, TinyFaceDetectorOptions } = faceapi;

const faceDetectionNet = faceapi.nets.ssdMobilenetv1;
// const faceDetectionNet = faceapi.nets.tinyFaceDetector;
const minConfidence = 0.5;
const inputSize = 408;
const scoreThreshold = 0.5;

function getFaceDetectorOptions(net) {
  return net === faceapi.nets.ssdMobilenetv1
    ? new SsdMobilenetv1Options({ minConfidence })
    : new TinyFaceDetectorOptions({ inputSize, scoreThreshold });
}

const faceDetectionOptions = getFaceDetectorOptions(faceDetectionNet);

module.exports = {
  faceDetectionNet,
  faceDetectionOptions,
};
