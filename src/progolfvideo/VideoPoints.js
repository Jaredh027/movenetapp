import React, { useRef, useEffect, useState } from "react";
import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import videoSrc from "./tigerslomogolfswing.mp4";

function VideoPoints({ onCaptureComplete }) {
  const videoRef = useRef(null);
  const [keypointsData, setKeypointsData] = useState([]);
  const [detector, setDetector] = useState(null);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const loadDetector = async () => {
      try {
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

        // Attempt to start the video if it is ready
        if (videoReady && videoRef.current) {
          console.log("Playing video after detector is ready.");
          try {
            await videoRef.current.play();
            console.log("Video is playing.");
            detectPose();
          } catch (error) {
            console.error("Failed to play video:", error);
          }
        }
      } catch (error) {
        console.error("Failed to load detector:", error);
      }
    };

    loadDetector();
  }, []);

  useEffect(() => {
    if (detector && videoReady && videoRef.current) {
      console.log("Detector and video are ready. Attempting to play video.");
      videoRef.current
        .play()
        .then(() => {
          console.log("Video is playing.");
          detectPose();
        })
        .catch((error) => {
          console.error("Failed to play video:", error);
        });
    }
  }, [detector, videoReady]);

  const detectPose = async () => {
    if (detector && videoRef.current && videoRef.current.readyState === 4) {
      const video = videoRef.current;
      try {
        console.log("Running pose detection on current frame.");
        const poses = await detector.estimatePoses(video, {
          flipHorizontal: false, // Adjust if needed for your video orientation
        });

        if (poses.length > 0) {
          saveKeypoints(poses, video.videoWidth);
        } else {
          console.warn("No poses detected.");
        }
      } catch (error) {
        console.error("Error detecting poses:", error);
      }

      if (video.currentTime < video.duration) {
        requestAnimationFrame(detectPose);
      }
    }
  };

  const saveKeypoints = (poses, videoWidth) => {
    const keypointsArray = poses.map((pose) =>
      pose.keypoints.map((keypoint) => ({
        // Flip the x-coordinate
        x: videoWidth - keypoint.x,
        y: keypoint.y,
        score: keypoint.score,
      }))
    );
    if (
      keypointsArray.length > 0 &&
      keypointsArray.some((arr) => arr.length > 0)
    ) {
      setKeypointsData((prevData) => [...prevData, keypointsArray]);
      // console.log("Saved keypoints data:", keypointsArray); // Debugging: Log saved keypoints
    } else {
      console.warn("No keypoints detected for this frame."); // Debugging: Warn when no keypoints detected
    }
  };

  useEffect(() => {
    if (videoRef.current && videoRef.current.ended) {
      console.log("Final keypoints data:", keypointsData); // Log final data
      onCaptureComplete(keypointsData); // Call callback with keypoints data when capture is complete
    }
  }, [videoRef.current?.ended, keypointsData, onCaptureComplete]);

  return (
    <div style={{ position: "absolute" }}>
      <header>
        <video
          ref={videoRef}
          src={videoSrc}
          style={{ display: "none" }}
          onLoadedData={() => {
            console.log("Video is loaded.");
            setVideoReady(true); // Indicate video is ready
          }}
          onEnded={() => {
            console.log("Video ended.");
            onCaptureComplete(keypointsData);
          }}
          controls // Add controls to test manually
          muted
        />
      </header>
    </div>
  );
}

export default VideoPoints;
