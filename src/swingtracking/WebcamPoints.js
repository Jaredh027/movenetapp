import React, { useRef, useEffect, useState } from "react";
import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import Webcam from "react-webcam";

function WebcamPoints({ onCaptureComplete }) {
  const webcamRef = useRef(null);
  const [detector, setDetector] = useState(null);

  useEffect(() => {
    const loadDetector = async () => {
      await tf.ready();
      await tf.setBackend("webgl");

      const detectorConfig = {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
      };
      const moveNetDetector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        detectorConfig
      );
      setDetector(moveNetDetector);
      console.log("Detector loaded successfully");
    };

    loadDetector();
  }, []);

  const detectPose = async () => {
    if (
      detector &&
      webcamRef.current &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const poses = await detector.estimatePoses(video);

      if (poses.length > 0) {
        const leftHandKeypoints = extractLeftHandKeypoints(poses[0].keypoints);
        onCaptureComplete(leftHandKeypoints);
      }

      requestAnimationFrame(detectPose);
    }
  };

  const extractLeftHandKeypoints = (keypoints) => {
    // Indices for left wrist, elbow, and shoulder
    const indices = [9, 7, 5]; // Adjust based on the model's keypoint mapping
    return indices.map((index) => keypoints[index]);
  };

  useEffect(() => {
    detectPose();
  }, [detector]);

  return (
    <div>
      <Webcam
        ref={webcamRef}
        style={{ width: 640, height: 480 }}
        onUserMedia={() => detectPose()} // Start detection when the webcam feed is ready
      />
    </div>
  );
}

export default WebcamPoints;
