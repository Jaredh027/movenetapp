import React, { useRef, useEffect, useState } from "react";
import { Button, Grid } from "@mui/material";
import Webcam from "react-webcam";
import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs";
import { drawCanvasFromLiveVideo } from "../swingtracking/Utils";
import NavigationPanel from "../Components/NavigationPanel";
import CustomButton from "../Components/CustomButton";
import { ReactComponent as Video } from "../icons/video.svg";
import axios from "axios";

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
  const [countdown, setCountdown] = useState(10);
  const [countdownStarted, setCountdownStarted] = useState(false);
  const isRecordingRef = useRef(false);
  const recordedFramesRef = useRef([]);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [videoConstraints, setVideoConstraints] = useState({
    width: 1280,
    height: 720,
  });

  let swingData = [];

  useEffect(() => {
    const runDetector = async () => {
      await tf.ready();
      await tf.setBackend("webgl");

      const detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
        }
      );

      const detectPose = async () => {
        if (webcamRef.current && webcamRef.current.video.readyState === 4) {
          const video = webcamRef.current.video;

          // Set canvas size to match video dimensions
          if (canvasRef.current) {
            canvasRef.current.width = video.videoWidth;
            canvasRef.current.height = video.videoHeight;
          }

          // Estimate poses and draw them
          const poses = await detector.estimatePoses(video);
          drawCanvasFromLiveVideo(
            poses,
            video,
            video.videoWidth,
            video.videoHeight,
            canvasRef
          );

          if (isRecordingRef.current) {
            recordedFramesRef.current.push([poses[0].keypoints]);
          }
        }
        requestAnimationFrame(detectPose);
      };

      detectPose();
    };

    runDetector();
  }, []);

  useEffect(() => {
    if (countdownStarted && countdown > 0) {
      const intervalId = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            clearInterval(intervalId);
            isRecordingRef.current = true;
            setCountdown("Start");

            setTimeout(() => {
              isRecordingRef.current = false;
              setCountdown("Stop");
              console.log("Recorded Frames:", recordedFramesRef.current);

              // Here is where I will be posting the data to the db
              swingData = {
                swing_name: "Test Swing",
                frames: recordedFramesRef.current,
              };
              sendSwingData();
            }, 2000);
          }
          return prevCountdown - 1;
        });
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [countdownStarted, countdown]);

  const swingCountdown = () => {
    console.log("started");
    setCountdownStarted(true);
  };

  const sendSwingData = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:5001/api/swing-data",
        swingData
      );
      console.log("Response from server:", response.data);
    } catch (error) {
      console.error("Error sending swing data:", error);
    }
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
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                paddingTop: "56.25%", // 16:9 Aspect Ratio
                overflow: "hidden",
              }}
            >
              <Webcam
                ref={webcamRef}
                audio={false}
                style={{
                  transform: "scaleX(-1)",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover", // Ensures video covers the div
                }}
                videoConstraints={videoConstraints}
              />
              <canvas
                ref={canvasRef}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  zIndex: 10,
                  backgroundColor: "transparent", // Ensures background is transparent
                }}
              />
            </div>
            {countdownStarted && <TimerText>{countdown}</TimerText>}
          </Grid>
        </Container>
      </Grid>
    </Grid>
  );
};

export default CollectSwingVideo;
