# Face_detect App



## Overview
The Face Mash App is a single-page application that utilizes the Face API Library to extract features from webcam. It provides a React frontend interface for capturing face keypoints and Node.js backend for comparing them to the keypoints stored in a MongoDB database.

## Prerequisites
To run the Face Mash App, ensure that you have the following prerequisites installed on your system:

- Node.js
- MongoDB 

## Installation

### Backend Setup
1. Clone the repository from GitHub:

```bash
git clone https://github.com/shahzeen031/Face_detect.git
```


2. Open two terminal in the root folder:



3. Install the required dependencies for backend:

```bash
npm install
```

4. Add your MONGO_URI in config/default.json

```
MONGO_URI=<your_mongodb_uri>
```

Replace `<your_mongodb_uri>` with the connection URI for your MongoDB database.

5. Start the backend server:

```bash
npm start
```

The backend server should now be running on `http://localhost:5000`.

### Frontend Setup
1. Navigate to the frontend directory:

```bash
cd my-app
```

2. Install the required dependencies:

```bash
yarn install
```

3. Start the frontend development server:

```bash
yarn start
```

The frontend server should now be running on `http://localhost:300`, and the application can be accessed through your web browser.

## Usage
1. Open the Face Mash App in your web browser by visiting `http://localhost:3000`.

2. Grant access to your webcam when prompted.

3. The application will display a live video feed from your webcam.

4. If you are a first time user enter your name and then press detect

5. The application will use amazon rekogination to detect face.

6. If the similarity between the face is found, the face frequency count will be increased for that specific face in the database. Otherwise, new face  will be added to the database.

Note:

1. Keep the camera on a still place while recording to ensure accurate keypoint extraction.
2. Record the front face to get the best results.
3. Avoid unnecessary movements during the recording process for better accuracy.

`

## Contributing
Contributions to the Face Mash App are welcome! If you encounter any issues or would like to add new features, please submit a pull request on GitHub.

## License
This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

## Acknowledgements
The Face Mash App is built upon the following technologies and libraries:


- React: [https://reactjs.org/](https://reactjs.org/)
- Node.js: [https://nodejs.org/](https://nodejs.org/)
