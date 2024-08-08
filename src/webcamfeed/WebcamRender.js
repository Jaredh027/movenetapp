import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import SwingMatch from "../swingtracking/SwingMatch";
import { drawCanvasFromLiveVideo } from "../swingtracking/Utils";
import { TIGERFRAMES } from "../progolfvideo/CONSTANTS";

function WebcamRender() {
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

          //drawCanvas(poses, video, videoWidth, videoHeight, canvasRef);
          // console.log(poses[0].keypoints);
          drawCanvasFromLiveVideo(
            poses,
            video,
            videoWidth,
            videoHeight,
            canvasRef
          );
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

  return (
    <div>
      <header style={{ textAlign: "center" }}>
        {keypointsData.length > 0 && (
          <SwingMatch
            handKeypoints={handKeypoints}
            prerecordedKeypoints={keypointsData}
          />
          // <FindFramesHelper keypointsData={keypointsData} />
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

export default WebcamRender;
