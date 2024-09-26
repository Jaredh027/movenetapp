import React, { useRef, useEffect, useState } from "react";
import { Grid } from "@mui/material";
import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs";
import { drawCanvasFromLiveVideo } from "../swingtracking/Utils";
import NavigationPanel from "../Components/NavigationPanel";
import CustomButton from "../Components/CustomButton";
import { ReactComponent as Video } from "../icons/video.svg";
import { sendSwingData } from "../backendCalls/BackendCalls";
import CameraSwitcher from "./CameraSwitcher";

// Custom RecordButton component
const RecordButton = (props) => (
  <CustomButton
    startIcon={<Video />}
    {...props}
    sx={{
      textAlign: "center",
      borderRadius: 2,
      backgroundColor: "#34302D",
      color: "#DC7B19",
      display: "block",
      marginLeft: "auto",
      marginRight: "auto",
      padding: 2,
      fontWeight: "bold",
    }}
  >
    {props.children}
  </CustomButton>
);

// Custom Container component
const Container = (props) => (
  <Grid
    {...props}
    sx={{
      textAlign: "center",
      display: "flex",
      justifyContent: "center",
      color: "#34302D",
      alignItems: "center",
      flexDirection: "column",
      marginRight: "20px",
      marginTop: "20px",
      backgroundColor: "#6699cc",
      padding: "20px",
      borderRadius: 2,
    }}
  >
    {props.children}
  </Grid>
);

// Timer display for countdown
const TimerText = (props) => (
  <p
    {...props}
    style={{
      color: "white",
      textAlign: "center",
      position: "absolute",
      zIndex: 12,
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      fontSize: "120px",
      margin: 0,
    }}
  >
    {props.children}
  </p>
);

const CollectSwingVideo = () => {
  const webcamRef = useRef(null); // Video reference
  const canvasRef = useRef(null); // Canvas reference for drawing poses
  const [countdown, setCountdown] = useState(10); // Countdown timer
  const [countdownStarted, setCountdownStarted] = useState(false); // Track if countdown started
  const isRecordingRef = useRef(false); // To track recording state
  const recordedFramesRef = useRef([]); // To store recorded pose frames
  const [videoConstraints, setVideoConstraints] = useState({
    width: 1280,
    height: 720,
  });
  let swingData = [];

  // Pose detection and video processing logic
  useEffect(() => {
    const runDetector = async () => {
      await tf.ready(); // Ensure TensorFlow.js is ready
      await tf.setBackend("webgl"); // Set the backend to WebGL for performance

      const detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
        }
      );

      const detectPose = async () => {
        if (webcamRef.current && webcamRef.current.readyState === 4) {
          const video = webcamRef.current;

          // Ensure canvas and video maintain the correct aspect ratio (1280x720) and match
          const videoWidth = video.videoWidth;
          const videoHeight = video.videoHeight;

          // Get canvas reference
          const canvas = canvasRef.current;

          // Set canvas dimensions to match the video dimensions
          canvas.width = videoWidth; // Use the actual video dimensions
          canvas.height = videoHeight;

          // Estimate poses and draw them on the canvas
          const poses = await detector.estimatePoses(video);
          drawCanvasFromLiveVideo(
            poses,
            video,
            canvas.width,
            canvas.height,
            canvasRef
          );

          // If recording, save pose keypoints
          if (isRecordingRef.current) {
            recordedFramesRef.current.push([poses[0].keypoints]);
          }
        }
        requestAnimationFrame(detectPose); // Continue detection on each animation frame
      };

      detectPose();
    };

    runDetector();
  }, []);

  // Countdown logic for recording
  useEffect(() => {
    if (countdownStarted && countdown > 0) {
      const intervalId = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            clearInterval(intervalId);
            isRecordingRef.current = true; // Start recording poses
            setCountdown("Start");

            setTimeout(() => {
              isRecordingRef.current = false; // Stop recording
              setCountdown("Stop");

              // Prepare the swing data and send it to the backend
              swingData = {
                swing_name: "Test Swing",
                frames: recordedFramesRef.current,
              };
              sendSwingData(swingData); // Sending the recorded pose data to the backend
            }, 2000); // Record for an additional 2 seconds after countdown ends
          }
          return prevCountdown - 1;
        });
      }, 1000); // Decrease countdown every second
      return () => clearInterval(intervalId); // Clean up the interval
    }
  }, [countdownStarted, countdown]);

  // Function to start countdown
  const swingCountdown = () => {
    console.log("started");
    setCountdownStarted(true);
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={3}>
        <NavigationPanel />
      </Grid>
      <Grid item xs={9}>
        <Container>
          <RecordButton onClick={swingCountdown}>Start Recording</RecordButton>
          <Grid
            container
            style={{
              position: "relative",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              maxWidth: "1280px", // Ensuring video and canvas stay within 1280px max
              aspectRatio: "16 / 9", // Maintain 16:9 ratio
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%", // Explicit height to fill the parent
                overflow: "hidden",
              }}
            >
              {/* Pass ref to CameraSwitcher for video stream */}
              <CameraSwitcher
                ref={webcamRef}
                style={{
                  transform: "scaleX(-1)", // Mirror video
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover", // Ensure video covers the div
                }}
              />
              {/* Canvas for drawing poses */}
              <canvas
                ref={canvasRef}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  zIndex: 10,
                  backgroundColor: "transparent", // Transparent background
                }}
              />
            </div>
            {/* Display the countdown timer during recording */}
            {countdownStarted && <TimerText>{countdown}</TimerText>}
          </Grid>
        </Container>
      </Grid>
    </Grid>
  );
};

export default CollectSwingVideo;
