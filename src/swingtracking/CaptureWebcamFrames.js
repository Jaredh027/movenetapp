import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import SwingMatch from "../swingtracking/SwingMatch";
import { drawCanvasFromLiveVideo } from "../swingtracking/Utils";
import { TIGERFRAMES } from "../progolfvideo/CONSTANTS";

function CaptureWebcamFrames() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const [keypointsData, setKeypointsData] = useState([]); // Initialize as an empty array
  const [webKeypoints, setWebKeypoints] = useState([]);

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
          extractKeypoints(poses);
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

  const extractKeypoints = (poses) => {
    poses.forEach(({ keypoints }) => {
      console.log("keypoints", keypoints);
    });
  };

  return (
    <div>
      <header style={{ textAlign: "center" }}>
        {/* {keypointsData.length > 0 && (
          // <FindFramesHelper keypointsData={keypointsData} />
        )} */}

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

export default CaptureWebcamFrames;
