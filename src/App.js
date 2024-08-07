import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import VideoPoints from "./progolfvideo/VideoPoints";
import SwingMatch from "./swingtracking/SwingMatch";
import FindFramesHelper from "./displaykeypoints/FindFramesHelper";
import zIndex from "@mui/material/styles/zIndex.js";

import { TIGERFRAMES } from "./progolfvideo/CONSTANTS";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const [keypointsData, setKeypointsData] = useState([]); // Initialize as an empty array
  const [handKeypoints, setHandKeypoints] = useState([]);

  // Add a ref to keep track of the last update time
  const lastUpdateRef = useRef(0);

  useEffect(() => {
    const runDetector = async () => {
      await tf.ready();
      await tf.setBackend("webgl");

      const detectorConfig = {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER, // More accurate model
      };
      const detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        detectorConfig
      );

      const detectPose = async () => {
        if (webcamRef.current && webcamRef.current.video.readyState === 4) {
          const video = webcamRef.current.video;
          const videoWidth = video.videoWidth;
          const videoHeight = video.videoHeight;

          canvasRef.current.width = videoWidth;
          canvasRef.current.height = videoHeight;

          const poses = await detector.estimatePoses(video);

          drawCanvas(poses, video, videoWidth, videoHeight, canvasRef);
          extractHandKeypoints(poses);
        }
        requestAnimationFrame(detectPose);
      };

      detectPose();
    };

    // Set keypointsData from CONSTANTS
    setKeypointsData(TIGERFRAMES);
    console.log(TIGERFRAMES);

    runDetector();
  }, []);

  const extractHandKeypoints = (poses) => {
    poses.forEach(({ keypoints }) => {
      // Indices for left wrist, elbow, and shoulder
      const leftHandIndices = [9, 5, 6, 11, 12]; // Adjust indices according to keypoint mapping
      const leftHandKeypoints = leftHandIndices.map(
        (index) => keypoints[index]
      );

      // Update the hand keypoints state
      setHandKeypoints(leftHandKeypoints);
    });
  };

  const drawCanvas = (poses, video, videoWidth, videoHeight, canvas) => {
    const ctx = canvas.current.getContext("2d");
    ctx.clearRect(0, 0, videoWidth, videoHeight);
    ctx.drawImage(video, 0, 0, videoWidth, videoHeight);

    const keypointConnections = {
      0: [1, 2], // Nose to left eye and right eye
      1: [3], // Left eye to left ear
      2: [4], // Right eye to right ear
      5: [6, 7, 11], // Left shoulder to right shoulder, left elbow, left hip
      6: [8, 12], // Right shoulder to right elbow, right hip
      7: [9], // Left elbow to left wrist
      8: [10], // Right elbow to right wrist
      11: [12, 13], // Left hip to right hip, left knee
      12: [14], // Right hip to right knee
      13: [15], // Left knee to left ankle
      14: [16], // Right knee to right ankle
    };

    poses.forEach(({ keypoints }) => {
      for (let i = 0; i < keypoints.length; i++) {
        const kp = keypoints[i];
        if (kp.score > 0.3) {
          ctx.beginPath();
          ctx.arc(kp.x, kp.y, 5, 0, 2 * Math.PI);
          ctx.fillStyle = "blue";
          ctx.fill();

          if (keypointConnections[i]) {
            keypointConnections[i].forEach((j) => {
              const kp2 = keypoints[j];
              if (kp2.score > 0.3) {
                ctx.beginPath();
                ctx.moveTo(kp.x, kp.y);
                ctx.lineTo(kp2.x, kp2.y);
                ctx.strokeStyle = "white";
                ctx.lineWidth = 2;
                ctx.stroke();
              }
            });
          }
        }
      }
    });
  };

  return (
    <div>
      <header style={{ textAlign: "center" }}>
        {keypointsData.length > 0 && (
          // <SwingMatch
          //   handKeypoints={handKeypoints}
          //   prerecordedKeypoints={keypointsData}
          // />
          <FindFramesHelper keypointsData={keypointsData} />
        )}
        <Webcam
          ref={webcamRef}
          audio={false}
          style={{
            transform: "scaleX(-1)", // Flip the webcam feed horizontally
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 5,
            width: 1280,
            height: 720,
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            transform: "scaleX(-1)", // Flip the feed horizontally
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 5,
            width: 1280,
            height: 720,
          }}
        />
      </header>
    </div>
  );
}

export default App;
